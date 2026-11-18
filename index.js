/**
 * Host half of UI studio.
 *
 * The browser half owns every visual decision. This half declares one volatile
 * settings field so the profile's settings document can persist the browser's
 * JSON payload, turns off the automatic configuration page, and stores the
 * uploaded glass background beside the DSH home directory so a large image or
 * video never has to ride inside the settings document.
 */
import { createReadStream } from 'node:fs'
import { mkdir, open, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import z from '@deepseek-ai/schemastery'

/** Live UI-studio preferences, serialized by the browser half as JSON. */
export const Config = z.object({
  customization: z.string().default('{}').volatile(),
})

const ROUTE = '/ui-studio/background'
const PREFS_ROUTE = '/ui-studio/preferences'
const UPLOAD_HEADER = 'x-ui-studio-upload'
const MAX_BYTES = 30 * 1024 * 1024
const MAX_PREFS_BYTES = 64 * 1024
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/apng',
  'video/mp4',
  'video/webm',
])

const stateRoot = path.join(
  process.env.DSH_HOME || path.join(os.homedir(), '.dsh'),
  'ui-studio',
)
const currentFile = path.join(stateRoot, 'background.bin')
const metaFile = path.join(stateRoot, 'background.json')
const prefsFile = path.join(stateRoot, 'preferences.json')
const profileName = process.env.DSH_PROFILE || 'default'

/** Answer one JSON response unless the response has already gone out. */
function json(res, status, body) {
  if (res.headersSent || res.writableEnded) return
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': String(Buffer.byteLength(text)),
  })
  res.end(text)
}

/** Classify an accepted media type for the browser half. */
function mediaKind(mediaType) {
  return mediaType.startsWith('video/') ? 'video' : 'image'
}

/** Read the current background metadata, ignoring a missing or malformed file. */
async function readMeta() {
  try {
    const value = JSON.parse(await readFile(metaFile, 'utf8'))
    if (value !== null && typeof value === 'object'
      && typeof value.mediaType === 'string'
      && ALLOWED_TYPES.has(value.mediaType)
      && typeof value.version === 'string') {
      return value
    }
  } catch {
    // A missing or malformed sidecar means there is no current background.
  }
  return null
}

/** Stream the current background, answering one byte range when requested. */
async function serveBackground(req, res) {
  const meta = await readMeta()
  const info = meta === null ? null : await stat(currentFile).catch(() => null)
  if (meta === null || info === null || !info.isFile()) {
    json(res, 404, { error: 'No background is set' })
    return
  }

  const size = info.size
  const headers = {
    'content-type': meta.mediaType,
    'cache-control': 'public, max-age=31536000, immutable',
    'x-content-type-options': 'nosniff',
    'accept-ranges': 'bytes',
  }
  let start = 0
  let end = size - 1
  let status = 200

  if (typeof req.headers.range === 'string') {
    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range.trim())
    if (match === null) {
      res.writeHead(416, { 'content-range': `bytes */${size}` })
      res.end()
      return
    }
    if (match[1] === '' && match[2] !== '') {
      const suffix = Number(match[2])
      start = Math.max(0, size - suffix)
      end = size - 1
    } else {
      start = match[1] === '' ? 0 : Number(match[1])
      end = match[2] === '' ? size - 1 : Number(match[2])
    }
    if (!Number.isFinite(start) || !Number.isFinite(end)
      || start < 0 || start > end || start >= size) {
      res.writeHead(416, { 'content-range': `bytes */${size}` })
      res.end()
      return
    }
    end = Math.min(end, size - 1)
    status = 206
    headers['content-range'] = `bytes ${start}-${end}/${size}`
  }

  headers['content-length'] = String(end - start + 1)
  res.writeHead(status, headers)
  if (req.method === 'HEAD') {
    res.end()
    return
  }

  const stream = createReadStream(currentFile, { start, end })
  stream.on('error', () => { res.destroy() })
  res.on('close', () => { stream.destroy() })
  stream.pipe(res)
}

/** Accept the page's serving origin and its loopback spellings. */
function originAllowed(origin, webServer) {
  try {
    const expected = new URL(webServer.getOrigin())
    const actual = new URL(origin)
    const loopback = ['localhost', '127.0.0.1', '[::1]']
    return actual.origin === expected.origin
      || (actual.protocol === expected.protocol
        && actual.port === expected.port
        && loopback.includes(actual.hostname))
  } catch {
    return false
  }
}

/** Store one uploaded image or video, replacing the current background. */
async function saveBackground(req, res, webServer) {
  if (req.headers[UPLOAD_HEADER] !== '1') {
    json(res, 403, { error: 'Missing upload marker' })
    return
  }

  if (typeof req.headers.origin === 'string' && req.headers.origin !== '') {
    if (!originAllowed(req.headers.origin, webServer)) {
      json(res, 403, { error: 'Unexpected origin' })
      return
    }
  }

  const mediaType = String(req.headers['content-type'] || '')
    .split(';', 1)[0]
    .trim()
    .toLowerCase()
  if (!ALLOWED_TYPES.has(mediaType)) {
    json(res, 415, { error: 'Unsupported media type' })
    return
  }
  const declared = Number(req.headers['content-length'])
  if (Number.isFinite(declared) && declared > MAX_BYTES) {
    json(res, 413, { error: 'Background is too large' })
    return
  }

  await mkdir(stateRoot, { recursive: true })
  const suffix = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const tempFile = path.join(stateRoot, `upload-${suffix}.tmp`)
  const tempMeta = path.join(stateRoot, `meta-${suffix}.tmp`)
  let handle

  try {
    handle = await open(tempFile, 'w')
    let total = 0
    for await (const chunk of req) {
      total += chunk.length
      if (total > MAX_BYTES) {
        const error = new Error('Background is too large')
        error.code = 'TOO_LARGE'
        throw error
      }
      await handle.write(chunk)
    }
    await handle.close()
    handle = undefined
    if (total === 0) {
      const error = new Error('Background is empty')
      error.code = 'EMPTY'
      throw error
    }

    const version = Date.now().toString(36)
    await rename(tempFile, currentFile)
    await writeFile(tempMeta, JSON.stringify({ mediaType, version, size: total }), 'utf8')
    await rename(tempMeta, metaFile)
    json(res, 200, {
      url: `${ROUTE}?v=${version}`,
      kind: mediaKind(mediaType),
      mediaType,
      version,
    })
  } catch (error) {
    if (handle !== undefined) await handle.close().catch(() => {})
    await unlink(tempFile).catch(() => {})
    await unlink(tempMeta).catch(() => {})
    if (error && (error.code === 'TOO_LARGE' || error.code === 'EMPTY')) {
      json(res, error.code === 'TOO_LARGE' ? 413 : 400, { error: error.message })
      return
    }
    throw error
  }
}

/** Remove the current background files. */
async function removeBackground(req, res) {
  if (req.headers[UPLOAD_HEADER] !== '1') {
    json(res, 403, { error: 'Missing upload marker' })
    return
  }
  await unlink(currentFile).catch(() => {})
  await unlink(metaFile).catch(() => {})
  res.writeHead(204, { 'cache-control': 'no-store' })
  res.end()
}

/**
 * Read the preference backup, ignoring a missing, malformed, or foreign
 * profile's file. The backup only ever restores the look of the profile that
 * wrote it.
 */
async function readPrefsBackup() {
  try {
    const value = JSON.parse(await readFile(prefsFile, 'utf8'))
    if (value !== null && typeof value === 'object'
      && value.profile === profileName
      && typeof value.customization === 'string'
      && typeof value.savedAt === 'string') {
      return value
    }
  } catch {
    // A missing or malformed backup means there is nothing to restore.
  }
  return null
}

/** Serve the backup, or 404 when this profile has nothing recorded. */
async function servePrefs(req, res) {
  const backup = await readPrefsBackup()
  if (backup === null) {
    json(res, 404, { error: 'No preference backup is set' })
    return
  }
  json(res, 200, { customization: backup.customization, savedAt: backup.savedAt })
}

/** Replace the backup with the browser's current serialized preferences. */
async function savePrefs(req, res, webServer) {
  if (req.headers[UPLOAD_HEADER] !== '1') {
    json(res, 403, { error: 'Missing upload marker' })
    return
  }
  if (typeof req.headers.origin === 'string' && req.headers.origin !== '') {
    if (!originAllowed(req.headers.origin, webServer)) {
      json(res, 403, { error: 'Unexpected origin' })
      return
    }
  }
  const declared = Number(req.headers['content-length'])
  if (Number.isFinite(declared) && declared > MAX_PREFS_BYTES) {
    json(res, 413, { error: 'Preference backup is too large' })
    return
  }
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > MAX_PREFS_BYTES) {
      json(res, 413, { error: 'Preference backup is too large' })
      return
    }
  }
  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    json(res, 400, { error: 'Invalid preference backup' })
    return
  }
  const customization = parsed !== null && typeof parsed === 'object' ? parsed.customization : undefined
  if (typeof customization !== 'string' || customization.length > MAX_PREFS_BYTES) {
    json(res, 400, { error: 'Invalid preference backup' })
    return
  }
  await mkdir(stateRoot, { recursive: true })
  const suffix = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const tempFile = path.join(stateRoot, `prefs-${suffix}.tmp`)
  await writeFile(tempFile, JSON.stringify({
    profile: profileName,
    customization,
    savedAt: new Date().toISOString(),
  }), 'utf8')
  await rename(tempFile, prefsFile)
  res.writeHead(204, { 'cache-control': 'no-store' })
  res.end()
}

/** Forget the backup; Reset all uses this so a reset stays reset. */
async function removePrefs(req, res) {
  if (req.headers[UPLOAD_HEADER] !== '1') {
    json(res, 403, { error: 'Missing upload marker' })
    return
  }
  await unlink(prefsFile).catch(() => {})
  res.writeHead(204, { 'cache-control': 'no-store' })
  res.end()
}

/** Dispatch one preference-backup route request. */
async function handlePrefs(req, res, webServer, ctx) {
  try {
    if (req.method === 'GET' || req.method === 'HEAD') {
      await servePrefs(req, res)
      return
    }
    if (req.method === 'PUT') {
      await savePrefs(req, res, webServer)
      return
    }
    if (req.method === 'DELETE') {
      await removePrefs(req, res)
      return
    }
    res.writeHead(405, { allow: 'GET, HEAD, PUT, DELETE' })
    res.end()
  } catch (error) {
    ctx.logger?.error(error)
    if (res.headersSent) {
      res.destroy()
      return
    }
    json(res, 500, { error: 'Preference backup operation failed' })
  }
}

/** Dispatch one background route request. */
async function handleBackground(req, res, webServer, ctx) {
  try {
    if (req.method === 'GET' || req.method === 'HEAD') {
      await serveBackground(req, res)
      return
    }
    if (req.method === 'POST') {
      await saveBackground(req, res, webServer)
      return
    }
    if (req.method === 'DELETE') {
      await removeBackground(req, res)
      return
    }
    res.writeHead(405, { allow: 'GET, HEAD, POST, DELETE' })
    res.end()
  } catch (error) {
    ctx.logger?.error(error)
    if (res.headersSent) {
      res.destroy()
      return
    }
    json(res, 500, { error: 'Background operation failed' })
  }
}

/**
 * Keep the plugin visible to the settings document without an automatic form,
 * and serve the uploaded background beside the browser page.
 * @param ctx - Host plugin context.
 */
export function apply(ctx) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })

  ctx.inject(['webServer'], (child) => {
    child.effect(() => child.webServer.register({
      kind: 'exact',
      path: ROUTE,
      handler: (req, res) => handleBackground(req, res, child.webServer, ctx),
    }))
    child.effect(() => child.webServer.register({
      kind: 'exact',
      path: PREFS_ROUTE,
      handler: (req, res) => handlePrefs(req, res, child.webServer, ctx),
    }))
  })
}
