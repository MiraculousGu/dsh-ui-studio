/**
 * Static checks for the UI studio bundle. These do not start DSH; they verify
 * the files a checkout can validate without a running Client.
 */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from '../index.js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const read = (file) => readFileSync(path.join(root, file), 'utf8')
const json = (file) => JSON.parse(read(file))

for (const file of ['client.js', 'index.js']) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' })
}

const pkg = json('package.json')
assert.equal(pkg.name, 'dsh-ui-studio')
assert.equal(pkg.type, 'module')
assert.notEqual(pkg.private, true)
assert.equal(pkg.license, 'MIT')
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
assert.equal(pkg.dsh.client.platform, 'web')
assert.equal(pkg.dsh.client.immediately, true)
assert.equal(pkg.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-settings'), true)
assert.equal(pkg.exports['./client'], './client.js')
assert.equal(pkg.exports['./locale/*.json'], './locale/*.json')
assert.equal(pkg.exports['./icon'], './icon.svg')
assert.equal(typeof pkg.scripts.test, 'string')
assert.equal(pkg.dependencies['@deepseek-ai/schemastery'], '3.19.0')

const patch = read('cordis.patch.yml')
assert.match(patch, /id:\s*ui-studio/)
assert.match(patch, /name:\s*'dsh-ui-studio'/)

for (const locale of ['en', 'zh']) {
  const data = json(`locale/${locale}.json`)
  assert.equal(typeof data.meta.title, 'string')
  assert.equal(typeof data.meta.description, 'string')
  assert.equal(data.meta.detail, `docs/DETAIL${locale === 'zh' ? '.zh' : ''}.md`)
}

for (const [file, max] of [['icon.svg', 256 * 1024], ['docs/preview.svg', 5 * 1024 * 1024]]) {
  const svg = read(file)
  assert.match(svg, /<svg[\s>]/)
  assert.match(svg, /<\/svg>\s*$/)
  assert.equal(svg.includes('<script'), false)
  assert.equal(statSync(path.join(root, file)).size <= max, true, `${file} exceeds ${max} bytes`)
}

for (const detail of ['docs/DETAIL.md', 'docs/DETAIL.zh.md']) {
  const text = read(detail)
  assert.equal(text.trim().split('\n').length, 1, `${detail} must contain exactly one image line`)
  assert.match(text, /\]\(preview\.svg\)/)
}

const client = read('client.js')
assert.match(client, /id:\s*'dsh-ui-studio'/)
assert.match(client, /settings\.section/)
assert.match(client, /\/ui-studio\/background/)
assert.match(client, /--dsw-specific-input-major/)
assert.match(client, /--dsw-alias-settings-card-fill/)

const host = read('index.js')
assert.match(host, /const ROUTE = '\/ui-studio\/background'/)
assert.match(host, /x-ui-studio-upload/)
assert.match(host, /MAX_BYTES = 30 \* 1024 \* 1024/)
assert.equal(typeof Config, 'function')

console.log('UI studio checks passed')
