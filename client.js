window.__ModuleLoader__.load({
  id: 'dsh-ui-studio',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'uiStudio'
    const ENTRY_ID = 'ui-studio'
    const CONFIG_FIELD = 'customization'
    const TOKEN_SOURCE = 'ui-studio'
    const CONFIG_VERSION = 3
    const DEFAULT_NAME = 'DeepSeek Harness'
    const DEFAULT_ACCENT = '#4E7BFF'
    const DEFAULT_TRANSPARENCY = 40
    const DEFAULT_BLUR = 16
    const MAX_BLUR = 64
    const HEX = /^#[0-9a-fA-F]{6}$/
    const ACCENT_ERROR_ID = 'uis-accent-error'
    const UPLOAD_ROUTE = '/ui-studio/background'
    const UPLOAD_HEADER = 'x-ui-studio-upload'
    const MAX_UPLOAD_BYTES = 30 * 1024 * 1024
    const ALLOWED_UPLOAD = /^(image\/(png|jpeg|webp|gif|avif|apng)|video\/(mp4|webm))$/i

    const TOKEN_VARS = {
      brand: '--dsw-alias-brand-primary',
      base: '--dsw-alias-bg-base',
      layer1: '--dsw-alias-bg-layer-1',
      layer2: '--dsw-alias-bg-layer-2',
      overlay: '--dsw-alias-bg-overlay',
      border1: '--dsw-alias-border-l1',
      border2: '--dsw-alias-border-l2',
      sidebar: '--dsw-specific-sidebar-fill',
    }

    const SURFACE_KEYS = ['base', 'layer1', 'layer2', 'overlay', 'sidebar']
    const BORDER_KEYS = ['border1', 'border2']
    const DEFAULT_SURFACES = {
      light: {
        base: '#FFFFFF', layer1: '#FFFFFF', layer2: '#FFFFFF', overlay: '#E9ECF2',
        border1: 'rgba(0, 0, 0, 0.04)', border2: 'rgba(0, 0, 0, 0.10)', sidebar: '#F9FAFB',
      },
      dark: {
        base: '#151517', layer1: '#232324', layer2: '#2C2C2E', overlay: '#61666B',
        border1: 'rgba(255, 255, 255, 0.06)', border2: 'rgba(255, 255, 255, 0.12)', sidebar: '#1B1B1C',
      },
    }
    const DEFAULT_BRAND = { light: '#0F1115', dark: '#F9FAFB' }
    const EMPTY_TOKENS = Object.freeze({})
    const DEFAULT_GRADIENTS = {
      light: 'radial-gradient(900px 620px at 12% 16%, rgba(126, 166, 255, 0.55), transparent 62%), radial-gradient(820px 620px at 88% 20%, rgba(214, 137, 255, 0.42), transparent 64%), radial-gradient(900px 700px at 52% 108%, rgba(255, 178, 130, 0.42), transparent 62%), linear-gradient(135deg, #EEF4FF 0%, #F8EEFF 52%, #FFF4EC 100%)',
      dark: 'radial-gradient(900px 620px at 12% 16%, rgba(74, 111, 255, 0.35), transparent 62%), radial-gradient(820px 620px at 88% 20%, rgba(158, 92, 255, 0.28), transparent 64%), radial-gradient(900px 700px at 52% 108%, rgba(255, 116, 84, 0.22), transparent 62%), linear-gradient(135deg, #070A14 0%, #11132A 55%, #1B0F1F 100%)',
    }
    const GLASS_CSS = `
html.ui-studio-glass, body.ui-studio-glass { background: transparent !important; }
body.ui-studio-glass #root { background: transparent !important; }
#ui-studio-backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(var(--uis-backdrop-blur, 16px)) saturate(1.18);
  transform: scale(1.04);
}
#ui-studio-backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.10);
}
body[data-ds-dark-theme] #ui-studio-backdrop::after { background: rgba(0, 0, 0, 0.28); }
#ui-studio-backdrop video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* The settings panel is exempt from transparency and blur: it keeps an opaque
   fill (still the selected palette) so its controls stay readable. */
body.ui-studio-glass [data-shortcut-modal="settings"] {
  background-color: var(--uis-panel-fill, var(--dsw-alias-bg-layer-2));
  backdrop-filter: none;
}
/* Workbench panes — code, documents, files, terminal, browser — stay opaque:
   reading surfaces never show the backdrop through their content. */
body.ui-studio-glass [data-dockkit-content] {
  background-color: var(--uis-pane-fill, var(--dsw-alias-bg-base));
}
/* Reading surfaces inside the transcript — changed-file diffs and presented
   documents — keep an opaque palette fill for the same reason. */
body.ui-studio-glass [data-changed-files],
body.ui-studio-glass [data-presented-file],
body.ui-studio-glass [data-presented-files-row],
body.ui-studio-glass [data-changes-hover-preview] {
  --dsw-alias-bg-layer-1: var(--uis-card-fill);
  --dsw-alias-bg-layer-2: var(--uis-panel-fill);
  --dsw-alias-card-fill: var(--uis-card-fill);
  --dsw-alias-card-fill-hover: var(--uis-card-fill-hover);
}
`


    const SURFACES = {
      ocean: {
        light: {
          brand: '#2563EB', base: '#F5F8FC', layer1: '#FFFFFF', layer2: '#EEF3FA',
          overlay: '#FFFFFF', border1: '#DCE6F2', border2: '#C9D8EA', sidebar: '#EDF3FB',
        },
        dark: {
          brand: '#7AA7FF', base: '#0B1220', layer1: '#121B2B', layer2: '#0E1726',
          overlay: '#162135', border1: '#22314A', border2: '#2D3F5C', sidebar: '#0E1829',
        },
      },
      forest: {
        light: {
          brand: '#2F7D5B', base: '#F6FAF5', layer1: '#FFFFFF', layer2: '#EEF5EC',
          overlay: '#FFFFFF', border1: '#DCE8D9', border2: '#C7DCC2', sidebar: '#EDF5EB',
        },
        dark: {
          brand: '#7BC49A', base: '#0C1410', layer1: '#121D17', layer2: '#0E1813',
          overlay: '#16241B', border1: '#22352A', border2: '#2D4637', sidebar: '#0E1A13',
        },
      },
      sunset: {
        light: {
          brand: '#B45309', base: '#FDF8F3', layer1: '#FFFFFF', layer2: '#FBF0E5',
          overlay: '#FFFFFF', border1: '#F0DFCC', border2: '#E6CDB2', sidebar: '#FBF2E8',
        },
        dark: {
          brand: '#F5A94B', base: '#170F08', layer1: '#21160C', layer2: '#1A1109',
          overlay: '#2A1C10', border1: '#3B2817', border2: '#4E3520', sidebar: '#1B1209',
        },
      },
      rose: {
        light: {
          brand: '#C2406D', base: '#FCF6F8', layer1: '#FFFFFF', layer2: '#F8ECF1',
          overlay: '#FFFFFF', border1: '#EFD8E1', border2: '#E3C2D0', sidebar: '#FAEFF4',
        },
        dark: {
          brand: '#F08DB4', base: '#170D12', layer1: '#22121A', layer2: '#1A0F15',
          overlay: '#2B1821', border1: '#3D2330', border2: '#522F40', sidebar: '#1B1016',
        },
      },
      graphite: {
        light: {
          brand: '#3F4A5A', base: '#F6F7F9', layer1: '#FFFFFF', layer2: '#EEF0F4',
          overlay: '#FFFFFF', border1: '#DDE1E8', border2: '#C9CFDA', sidebar: '#EEF1F5',
        },
        dark: {
          brand: '#A8B4C6', base: '#0F1115', layer1: '#16191F', layer2: '#12151A',
          overlay: '#1C2027', border1: '#292E38', border2: '#373E4B', sidebar: '#12151A',
        },
      },
    }

    const SURFACE_IDS = ['default', 'ocean', 'forest', 'sunset', 'rose', 'graphite']
    const PRESET_LABEL = {
      default: 'presetDefault',
      ocean: 'presetOcean',
      forest: 'presetForest',
      sunset: 'presetSunset',
      rose: 'presetRose',
      graphite: 'presetGraphite',
    }

    const FONT_ROLES = ['text', 'code', 'terminal']
    const FONT_SPECS = {
      text: { min: 10, max: 22, defaultValue: 14 },
      code: { min: 10, max: 16, defaultValue: 11 },
      terminal: { min: 10, max: 20, defaultValue: 13 },
    }
    const FONT_LABEL = { text: 'fontText', code: 'fontCode', terminal: 'fontTerminal' }
    const FONT_HINT = { text: 'fontTextHint', code: 'fontCodeHint', terminal: 'fontTerminalHint' }

    const EN = {
      title: 'UI studio',
      description: 'Tune the Web UI’s colors, glass, background, text sizes, and branding. Changes apply immediately.',
      preview: 'Live preview',
      previewUser: 'A sample message',
      previewAction: 'Primary action',
      previewCode: 'code',
      previewTerminal: 'terminal output',
      appearance: 'Appearance',
      surface: 'Surface palette',
      surfaceHint: 'Sets backgrounds, borders, and the sidebar fill for both light and dark modes.',
      accent: 'Accent',
      accentHint: 'Used for primary buttons and your brand mark. Custom colors are adjusted for contrast in each mode.',
      accentFollow: 'Follow palette',
      accentCustom: 'Custom color',
      accentPicker: 'Accent color picker',
      accentHex: 'Accent hex value',
      glass: 'Glass & background',
      glassHint: 'A blurred backdrop shows through translucent surfaces. The settings panel, workbench panes, and transcript reading cards stay opaque, so content remains readable.',
      transparency: 'Transparency',
      transparencyHint: 'How much of the backdrop shows through app surfaces. 0% is opaque.',
      blur: 'Blur',
      blurHint: 'Softening of the backdrop and frosted surfaces. 0 px keeps the backdrop sharp.',
      background: 'Background',
      backgroundHint: 'Upload a photo, animated GIF/WebP, or an MP4/WebM video. It sits behind the glass surfaces.',
      chooseFile: 'Choose file',
      replaceFile: 'Replace file',
      removeBackground: 'Remove',
      uploading: 'Uploading…',
      uploadFailed: 'Upload failed. Try a smaller file or a supported format.',
      unsupportedFile: 'Use an image, GIF/WebP, MP4, or WebM file.',
      fileTooLarge: 'The file is too large (maximum 30 MB).',
      backgroundImage: 'Image',
      backgroundVideo: 'Video',
      backgroundNone: 'Built-in gradient',
      typography: 'Type sizes',
      typographyHint: 'Adjust body, code, and terminal text. These stay in sync with Settings → General → Appearance.',
      fontText: 'Body text',
      fontTextHint: 'Messages, headings, and interface copy.',
      fontCode: 'Code',
      fontCodeHint: 'Code blocks and inline code.',
      fontTerminal: 'Terminal',
      fontTerminalHint: 'The sidebar terminal.',
      increase: 'Increase',
      decrease: 'Decrease',
      branding: 'Branding',
      brandingHint: 'Replace the product name and mark in the sidebar and the blank-session hero.',
      brandEnabled: 'Use custom branding',
      brandName: 'Product name',
      brandMark: 'Mark',
      brandMarkHint: 'One or two characters, or an emoji.',
      reset: 'Reset all',
      resetConfirm: 'Click again to reset',
      statusLoading: 'Loading your saved settings…',
      statusSessionOnly: 'This profile doesn’t expose saved UI settings; changes apply for this session only.',
      statusSaving: 'Saving…',
      statusSaved: 'Saved to this profile',
      statusSaveFailed: 'Couldn’t save; changes apply for this session only.',
      statusAutoSave: 'Changes save automatically to this profile.',
      invalidColor: 'Enter a color as #RRGGBB.',
      presetDefault: 'Default',
      presetOcean: 'Ocean',
      presetForest: 'Forest',
      presetSunset: 'Sunset',
      presetRose: 'Rose',
      presetGraphite: 'Graphite',
      noteCoverage: 'Palettes cover the main surfaces, borders, and sidebar. Some menus keep the base theme’s materials.',
      noteDisable: 'Turn this plugin off in Settings → Plugins to remove its palette, glass, and branding. Type sizes stay in Settings → General → Appearance.',
    }

    const ZH = {
      title: '界面工作室',
      description: '调整 Web 界面的配色、玻璃效果、背景、字号和品牌标识，改动即时生效。',
      preview: '实时预览',
      previewUser: '一条示例消息',
      previewAction: '主要操作',
      previewCode: '代码',
      previewTerminal: '终端输出',
      appearance: '外观',
      surface: '界面配色',
      surfaceHint: '同时设置浅色和深色模式下的背景、边框和侧边栏底色。',
      accent: '强调色',
      accentHint: '用于主要按钮和品牌标记；自定义颜色会按模式微调以保证对比度。',
      accentFollow: '跟随配色',
      accentCustom: '自定义颜色',
      accentPicker: '强调色选择器',
      accentHex: '强调色十六进制值',
      glass: '玻璃与背景',
      glassHint: '模糊的背景会透过半透明界面显示。设置面板、预览面板与聊天区内的阅读卡片保持不透明，便于阅读。',
      transparency: '透明度',
      transparencyHint: '界面透出背景的程度；0% 为不透明。',
      blur: '模糊度',
      blurHint: '背景与毛玻璃表面的柔化程度；0 px 时背景清晰。',
      background: '背景',
      backgroundHint: '上传照片、动态 GIF/WebP，或 MP4/WebM 视频，用作玻璃界面后面的背景。',
      chooseFile: '选择文件',
      replaceFile: '替换文件',
      removeBackground: '移除',
      uploading: '上传中…',
      uploadFailed: '上传失败，请尝试更小的文件或受支持的格式。',
      unsupportedFile: '请使用图片、GIF/WebP、MP4 或 WebM 文件。',
      fileTooLarge: '文件过大（最大 30 MB）。',
      backgroundImage: '图片',
      backgroundVideo: '视频',
      backgroundNone: '内置渐变',
      typography: '字体大小',
      typographyHint: '分别调整正文、代码和终端字号，并与“设置 → 通用 → 外观”保持同步。',
      fontText: '正文',
      fontTextHint: '消息、标题和界面文字。',
      fontCode: '代码',
      fontCodeHint: '代码块和行内代码。',
      fontTerminal: '终端',
      fontTerminalHint: '侧边栏终端。',
      increase: '增大',
      decrease: '减小',
      branding: '品牌标识',
      brandingHint: '替换侧边栏和空白会话页中的产品名称与图标。',
      brandEnabled: '使用自定义品牌',
      brandName: '产品名称',
      brandMark: '标记',
      brandMarkHint: '一到两个字符，或一个 emoji。',
      reset: '全部恢复默认',
      resetConfirm: '再次点击以确认',
      statusLoading: '正在读取已保存的设置…',
      statusSessionOnly: '此配置不提供设置存储；改动仅在本次会话生效。',
      statusSaving: '保存中…',
      statusSaved: '已保存到此配置',
      statusSaveFailed: '无法保存；改动仅在本次会话生效。',
      statusAutoSave: '改动会自动保存到此配置。',
      invalidColor: '请输入 #RRGGBB 格式的颜色。',
      presetDefault: '默认',
      presetOcean: '海洋',
      presetForest: '森林',
      presetSunset: '日落',
      presetRose: '玫瑰',
      presetGraphite: '石墨',
      noteCoverage: '配色覆盖主要界面、边框和侧边栏；部分菜单仍使用基础主题的材质。',
      noteDisable: '在“设置 → 插件”中关闭此插件会移除配色、玻璃效果和品牌标识；字号仍保留在“设置 → 通用 → 外观”中。',
    }

    function defaultPrefs() {
      return {
        version: CONFIG_VERSION,
        surface: 'default',
        accentMode: 'preset',
        accent: DEFAULT_ACCENT,
        transparency: DEFAULT_TRANSPARENCY,
        blur: DEFAULT_BLUR,
        background: null,
        brandEnabled: false,
        brandName: DEFAULT_NAME,
        brandMark: 'D',
      }
    }

    function sanitizeMark(value) {
      return Array.from(String(value))
        .filter((character) => !/[\u0000-\u001F\u007F]/.test(character))
        .slice(0, 2)
        .join('')
    }

    function sanitizeBackground(value) {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) return null
      const kind = value.kind === 'video' ? 'video' : value.kind === 'image' ? 'image' : null
      const url = typeof value.url === 'string'
        && value.url.startsWith(UPLOAD_ROUTE)
        && !value.url.startsWith('//')
        ? value.url
        : null
      const mediaType = typeof value.mediaType === 'string' ? value.mediaType.slice(0, 80) : ''
      return kind !== null && url !== null ? { kind, url, mediaType } : null
    }

    function sanitizePrefs(input) {
      const base = defaultPrefs()
      if (input === null || typeof input !== 'object' || Array.isArray(input)) return base
      const surface = SURFACE_IDS.includes(input.surface) ? input.surface : base.surface
      const accentMode = input.accentMode === 'custom' ? 'custom' : 'preset'
      const accentText = typeof input.accent === 'string' ? input.accent : ''
      const accent = HEX.test(accentText) ? accentText.toUpperCase() : base.accent
      const transparencyNumber = Number(input.transparency)
      const transparency = Number.isFinite(transparencyNumber)
        ? Math.max(0, Math.min(100, Math.round(transparencyNumber)))
        : base.transparency
      const blurNumber = Number(input.blur)
      const blur = Number.isFinite(blurNumber)
        ? Math.max(0, Math.min(MAX_BLUR, Math.round(blurNumber)))
        : base.blur
      const brandName = typeof input.brandName === 'string' ? input.brandName.slice(0, 40) : base.brandName
      const brandMark = sanitizeMark(typeof input.brandMark === 'string' ? input.brandMark : base.brandMark)
      return {
        version: CONFIG_VERSION,
        surface,
        accentMode,
        accent,
        transparency,
        blur,
        background: sanitizeBackground(input.background),
        brandEnabled: input.brandEnabled === true,
        brandName,
        brandMark,
      }
    }

    function parsePrefs(raw) {
      if (typeof raw !== 'string' || raw.trim() === '') return defaultPrefs()
      try {
        return sanitizePrefs(JSON.parse(raw))
      } catch {
        return defaultPrefs()
      }
    }

    function serializePrefs(snapshot) {
      return JSON.stringify({
        version: CONFIG_VERSION,
        surface: snapshot.surface,
        accentMode: snapshot.accentMode,
        accent: snapshot.accent,
        transparency: snapshot.transparency,
        blur: snapshot.blur,
        background: snapshot.background,
        brandEnabled: snapshot.brandEnabled,
        brandName: snapshot.brandName,
        brandMark: snapshot.brandMark,
      })
    }

    function brandName(snapshot) {
      const value = typeof snapshot.brandName === 'string' ? snapshot.brandName.trim() : ''
      return value === '' ? DEFAULT_NAME : value
    }

    function markText(snapshot) {
      const value = typeof snapshot.brandMark === 'string' ? snapshot.brandMark.trim() : ''
      if (value !== '') return Array.from(value).slice(0, 2).join('')
      const first = Array.from(brandName(snapshot))[0] || 'D'
      return first.toUpperCase()
    }

    function markStyle(size, ink, background) {
      const px = Math.max(12, Math.round(size))
      return {
        width: px + 'px',
        height: px + 'px',
        borderRadius: Math.max(4, Math.round(px * 0.28)) + 'px',
        background: background || 'var(--dsw-alias-brand-primary)',
        color: ink || '#FFFFFF',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.max(8, Math.round(px * 0.5)) + 'px',
        fontWeight: 600,
        lineHeight: 1,
        flex: 'none',
        overflow: 'hidden',
      }
    }

    function hexToRgb(hex) {
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ]
    }

    function linearChannel(value) {
      const channel = value / 255
      return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    }

    function relativeLuminance(rgb) {
      return 0.2126 * linearChannel(rgb[0])
        + 0.7152 * linearChannel(rgb[1])
        + 0.0722 * linearChannel(rgb[2])
    }

    function mixHex(from, to, amount) {
      const source = hexToRgb(from)
      const target = hexToRgb(to)
      const ratio = Math.max(0, Math.min(1, amount))
      const channels = source.map((value, index) => Math.round(value + (target[index] - value) * ratio))
      return '#' + channels.map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()
    }

    /**
     * Keep a chosen accent readable against the host's static primary ink:
     * light mode needs a dark enough fill for white text, dark mode a light
     * enough fill for near-black text. Hue is preserved by mixing toward the
     * mode's ink extreme only as far as the luminance target requires.
     */
    function safeAccent(hex, colorScheme) {
      const target = colorScheme === 'dark' ? 0.28 : 0.16
      const toward = colorScheme === 'dark' ? '#FFFFFF' : '#000000'
      let result = hex.toUpperCase()
      for (let step = 0; step <= 20; step += 1) {
        const luminance = relativeLuminance(hexToRgb(result))
        if (colorScheme === 'dark' ? luminance >= target : luminance <= target) return result
        result = mixHex(hex, toward, step / 20)
      }
      return result
    }

    function withAlpha(color, alpha) {
      if (alpha >= 0.999) return color
      if (HEX.test(color)) {
        const [red, green, blue] = hexToRgb(color)
        return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(3)})`
      }
      return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
    }

    function baseThemeTokensOf(theme) {
      const definition = theme.themes.find((candidate) => candidate.id === theme.active.id)
      return definition !== undefined && definition.tokens !== undefined
        ? definition.tokens
        : EMPTY_TOKENS
    }

    function baseBrand(snapshot) {
      const token = snapshot.baseThemeTokens !== undefined
        ? snapshot.baseThemeTokens['--dsw-alias-brand-primary']
        : undefined
      const mode = snapshot.colorScheme === 'dark' ? 'dark' : 'light'
      return token || DEFAULT_BRAND[mode]
    }

    function appliedBrand(snapshot) {
      const mode = snapshot.colorScheme === 'dark' ? 'dark' : 'light'
      if (snapshot.accentMode === 'custom' && HEX.test(snapshot.accent)) {
        return safeAccent(snapshot.accent, mode)
      }
      const preset = SURFACES[snapshot.surface]
      if (preset !== undefined) return preset[mode].brand
      return baseBrand(snapshot)
    }

    function inkFor(color, colorScheme) {
      if (HEX.test(color)) {
        return relativeLuminance(hexToRgb(color)) > 0.5 ? '#0B1220' : '#FFFFFF'
      }
      return colorScheme === 'dark' ? '#0B1220' : '#FFFFFF'
    }

    function onBrand(snapshot) {
      return inkFor(appliedBrand(snapshot), snapshot.colorScheme)
    }

    function presetSwatches(id, colorScheme) {
      if (id === 'default') {
        return [
          'var(--dsw-alias-bg-base)',
          'var(--dsw-alias-brand-primary)',
          'var(--dsw-specific-sidebar-fill)',
        ]
      }
      const preset = SURFACES[id]
      const mode = colorScheme === 'dark' ? 'dark' : 'light'
      return [preset[mode].base, preset[mode].brand, preset[mode].sidebar]
    }

    function buildTokens(snapshot) {
      const preset = SURFACES[snapshot.surface]
      const transparency = Math.max(0, Math.min(100, Number(snapshot.transparency) || 0))
      const alpha = Math.max(0.45, 1 - (transparency / 100) * 0.55)
      const blurNumber = Number(snapshot.blur)
      const blur = Number.isFinite(blurNumber)
        ? Math.max(0, Math.min(MAX_BLUR, Math.round(blurNumber)))
        : DEFAULT_BLUR
      const tokens = {}
      const glass = alpha < 0.999
      if (preset !== undefined || glass) {
        const base = snapshot.baseThemeTokens || EMPTY_TOKENS
        const colorFor = (mode, key) => {
          if (preset !== undefined) return preset[mode][key]
          return base[TOKEN_VARS[key]] || DEFAULT_SURFACES[mode][key]
        }
        for (const key of SURFACE_KEYS) {
          tokens[TOKEN_VARS[key]] = {
            light: withAlpha(colorFor('light', key), alpha),
            dark: withAlpha(colorFor('dark', key), alpha),
          }
        }
        for (const key of BORDER_KEYS) {
          tokens[TOKEN_VARS[key]] = {
            light: colorFor('light', key),
            dark: colorFor('dark', key),
          }
        }
        const layer1Light = colorFor('light', 'layer1')
        const layer1Dark = colorFor('dark', 'layer1')
        const layer2Light = colorFor('light', 'layer2')
        const layer2Dark = colorFor('dark', 'layer2')
        tokens['--dsw-alias-bg-layer-3'] = {
          light: withAlpha(layer2Light, alpha),
          dark: withAlpha(layer2Dark, alpha),
        }
        tokens['--dsw-specific-input-major'] = {
          light: withAlpha(layer1Light, alpha),
          dark: withAlpha(layer1Dark, alpha),
        }
        tokens['--dsw-alias-card-fill'] = {
          light: withAlpha(layer1Light, alpha),
          dark: withAlpha(layer1Dark, alpha),
        }
        tokens['--dsw-alias-card-fill-hover'] = {
          light: withAlpha(layer2Light, alpha),
          dark: withAlpha(layer2Dark, alpha),
        }
        tokens['--dsw-specific-bubble'] = {
          light: withAlpha(layer1Light, alpha),
          dark: withAlpha(layer1Dark, alpha),
        }
        tokens['--dsw-alias-settings-card-fill'] = {
          light: withAlpha(layer2Light, alpha),
          dark: withAlpha(layer2Dark, alpha),
        }
        tokens['--uis-panel-fill'] = {
          light: layer2Light,
          dark: layer2Dark,
        }
        tokens['--uis-pane-fill'] = {
          light: colorFor('light', 'base'),
          dark: colorFor('dark', 'base'),
        }
        tokens['--uis-card-fill'] = {
          light: layer1Light,
          dark: layer1Dark,
        }
        tokens['--uis-card-fill-hover'] = {
          light: layer2Light,
          dark: layer2Dark,
        }
      }
      if (glass) {
        const backdropBlur = `${blur}px`
        tokens['--uis-backdrop-blur'] = { light: backdropBlur, dark: backdropBlur }
      }
      if (preset !== undefined) {
        tokens['--dsw-alias-brand-primary'] = {
          light: preset.light.brand,
          dark: preset.dark.brand,
        }
      }
      if (snapshot.accentMode === 'custom' && HEX.test(snapshot.accent)) {
        tokens['--dsw-alias-brand-primary'] = {
          light: safeAccent(snapshot.accent, 'light'),
          dark: safeAccent(snapshot.accent, 'dark'),
        }
      }
      return Object.keys(tokens).length > 0 ? tokens : null
    }

    function previewTokenStyle(snapshot) {
      const tokens = buildTokens(snapshot)
      const mode = snapshot.colorScheme === 'dark' ? 'dark' : 'light'
      const style = {}
      if (tokens !== null) {
        for (const [token, pair] of Object.entries(tokens)) style[token] = pair[mode]
      }
      return style
    }

    function createStore(initial) {
      let snapshot = Object.freeze(initial)
      const listeners = new Set()
      return {
        getSnapshot() {
          return snapshot
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => { listeners.delete(listener) }
        },
        update(patch) {
          snapshot = Object.freeze({ ...snapshot, ...patch })
          for (const listener of listeners) listener()
        },
      }
    }

    function statusText(snapshot, t) {
      if (snapshot.status === 'loading') return { text: t('statusLoading'), tone: '' }
      if (!snapshot.writable) return { text: t('statusSessionOnly'), tone: 'uis-statusWarn' }
      if (snapshot.save === 'saving') return { text: t('statusSaving'), tone: '' }
      if (snapshot.save === 'saved') return { text: t('statusSaved'), tone: 'uis-statusSaved' }
      if (snapshot.save === 'error') return { text: t('statusSaveFailed'), tone: 'uis-statusWarn' }
      if (snapshot.save === 'session') return { text: t('statusSessionOnly'), tone: 'uis-statusWarn' }
      return { text: t('statusAutoSave'), tone: '' }
    }

    function Card(props) {
      return h('section', { className: 'uis-card' },
        h('div', { className: 'uis-cardHead' },
          h('h3', { className: 'uis-cardTitle' }, props.title),
          props.hint ? h('p', { className: 'uis-cardHint' }, props.hint) : null),
        props.children)
    }

    function Preview(props) {
      const { snapshot, t } = props
      const ink = onBrand(snapshot)
      const gradient = DEFAULT_GRADIENTS[snapshot.colorScheme === 'dark' ? 'dark' : 'light']
      const background = snapshot.background
      const rootStyle = {
        ...previewTokenStyle(snapshot),
        backgroundImage: gradient,
      }
      if (background !== null && background.kind === 'image') {
        rootStyle.backgroundImage = `url("${background.url}"), ${gradient}`
      }
      return h('div', { className: 'uis-preview', style: rootStyle, 'aria-hidden': 'true' },
        background !== null && background.kind === 'video'
          ? h('video', {
            className: 'uis-previewVideo',
            src: background.url,
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
          })
          : null,
        h('div', { className: 'uis-previewGrid' },
          h('div', { className: 'uis-previewSidebar' },
            snapshot.brandEnabled
              ? h('span', { style: markStyle(22, ink, appliedBrand(snapshot)) }, markText(snapshot))
              : h('span', { className: 'uis-previewFallbackMark' }),
            snapshot.brandEnabled
              ? h('span', { className: 'uis-previewBrand' }, brandName(snapshot))
              : null),
          h('div', { className: 'uis-previewMain' },
            snapshot.brandEnabled
              ? h('div', { className: 'uis-previewHero' },
                h('span', { style: markStyle(18, ink, appliedBrand(snapshot)) }, markText(snapshot)),
                h('span', { className: 'uis-previewHeroName' }, brandName(snapshot)))
              : null,
            h('div', { className: 'uis-previewLine uis-previewLineStrong' }),
            h('div', { className: 'uis-previewLine' }),
            h('div', { className: 'uis-previewBubble' }, t('previewUser')),
            h('div', { className: 'uis-previewCode' }, t('previewCode')),
            h('div', { className: 'uis-previewTerminal' },
              h('span', { className: 'uis-previewPrompt' }, '›'),
              t('previewTerminal')),
            h('span', { className: 'uis-previewBtn', style: { color: ink } }, t('previewAction')))))
    }

    function StudioPage(props) {
      const snapshot = props.useStudio((state) => state)
      const actions = props.actions
      const t = props.t
      const loading = snapshot.status === 'loading'
      const [resetArmed, setResetArmed] = React.useState(false)
      const [accentDraft, setAccentDraft] = React.useState(snapshot.accent)
      const [uploadState, setUploadState] = React.useState({ status: 'idle', message: '' })
      const uploadInput = React.useRef(null)
      const uploading = uploadState.status === 'uploading'

      React.useEffect(() => {
        setAccentDraft(snapshot.accent)
      }, [snapshot.accent, snapshot.accentMode])

      React.useEffect(() => {
        if (!resetArmed) return undefined
        const timer = window.setTimeout(() => { setResetArmed(false) }, 3000)
        return () => { window.clearTimeout(timer) }
      }, [resetArmed])

      const status = statusText(snapshot, t)
      const accentInvalid = !HEX.test(accentDraft)
      const colorValue = HEX.test(snapshot.accent) ? snapshot.accent : DEFAULT_ACCENT

      function handleReset() {
        if (!resetArmed) {
          setResetArmed(true)
          return
        }
        setResetArmed(false)
        setAccentDraft(DEFAULT_ACCENT)
        setUploadState({ status: 'idle', message: '' })
        actions.resetAll()
      }

      function handleAccentText(event) {
        const value = event.target.value
        setAccentDraft(value)
        if (HEX.test(value)) actions.setAccent(value)
      }

      function handleAccentBlur() {
        if (!HEX.test(accentDraft)) setAccentDraft(snapshot.accent)
      }

      async function handleUpload(event) {
        const file = event.target.files && event.target.files[0]
        event.target.value = ''
        if (!file) return
        if (!ALLOWED_UPLOAD.test(file.type)) {
          setUploadState({ status: 'error', message: t('unsupportedFile') })
          return
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          setUploadState({ status: 'error', message: t('fileTooLarge') })
          return
        }
        setUploadState({ status: 'uploading', message: '' })
        try {
          const response = await fetch(UPLOAD_ROUTE, {
            method: 'POST',
            headers: {
              [UPLOAD_HEADER]: '1',
              'content-type': file.type || 'application/octet-stream',
            },
            body: file,
          })
          if (response.status === 413) {
            setUploadState({ status: 'error', message: t('fileTooLarge') })
            return
          }
          if (response.status === 415) {
            setUploadState({ status: 'error', message: t('unsupportedFile') })
            return
          }
          const payload = await response.json().catch(() => null)
          if (!response.ok || payload === null || typeof payload.url !== 'string') {
            throw new Error(payload && typeof payload.error === 'string'
              ? payload.error
              : `HTTP ${response.status}`)
          }
          actions.setBackground({
            kind: payload.kind === 'video' ? 'video' : 'image',
            url: payload.url,
            mediaType: typeof payload.mediaType === 'string' ? payload.mediaType : file.type,
          })
          setUploadState({ status: 'idle', message: '' })
        } catch (error) {
          console.error('ui-studio: background upload failed', error)
          setUploadState({ status: 'error', message: t('uploadFailed') })
        }
      }

      async function handleRemoveBackground() {
        setUploadState({ status: 'idle', message: '' })
        actions.setBackground(null)
        try {
          await fetch(UPLOAD_ROUTE, {
            method: 'DELETE',
            headers: { [UPLOAD_HEADER]: '1' },
          })
        } catch (error) {
          console.error('ui-studio: background removal failed', error)
        }
      }

      const surfaceCards = SURFACE_IDS.map((id) => {
        const swatches = presetSwatches(id, snapshot.colorScheme)
        return h('button', {
          key: id,
          type: 'button',
          className: 'uis-preset',
          'aria-pressed': snapshot.surface === id,
          disabled: loading,
          onClick: () => { actions.setSurface(id) },
        },
          h('span', { className: 'uis-swatches' },
            swatches.map((color, index) => h('span', {
              key: index,
              className: 'uis-swatch',
              style: { background: color },
            }))),
          h('span', { className: 'uis-presetLabel' }, t(PRESET_LABEL[id])))
      })

      const fontRows = FONT_ROLES.map((role) => {
        const spec = FONT_SPECS[role]
        const value = snapshot.fontSizes[role]
        return h('div', { className: 'uis-fontRow', key: role },
          h('div', { className: 'uis-rowText' },
            h('div', { className: 'uis-rowLabel' }, t(FONT_LABEL[role])),
            h('div', { className: 'uis-rowHint' }, t(FONT_HINT[role]))),
          h('div', { className: 'uis-stepper' },
            h('button', {
              type: 'button',
              className: 'uis-stepBtn',
              'aria-label': t('decrease') + ' ' + t(FONT_LABEL[role]),
              disabled: loading || value <= spec.min,
              onClick: () => { actions.stepFont(role, -1) },
            }, '\u2212'),
            h('span', { className: 'uis-stepValue', 'aria-live': 'polite' },
              String(value),
              h('span', { className: 'uis-unit' }, 'px')),
            h('button', {
              type: 'button',
              className: 'uis-stepBtn',
              'aria-label': t('increase') + ' ' + t(FONT_LABEL[role]),
              disabled: loading || value >= spec.max,
              onClick: () => { actions.stepFont(role, 1) },
            }, '+')))
      })

      return h('div', { className: 'uis-page' },
        h('style', null, CSS),
        h('div', { className: 'uis-head' },
          h('div', { className: 'uis-headText' },
            h('h2', { className: 'uis-title' }, t('title')),
            h('p', { className: 'uis-intro' }, t('description'))),
          h('button', {
            type: 'button',
            className: resetArmed ? 'uis-reset uis-resetArmed' : 'uis-reset',
            disabled: loading,
            onClick: handleReset,
          }, t(resetArmed ? 'resetConfirm' : 'reset'))),
        h('p', {
          className: 'uis-status ' + status.tone,
          role: 'status',
          'aria-live': 'polite',
        }, status.text),
        h(Card, { title: t('preview') },
          h(Preview, { snapshot, t })),
        h(Card, { title: t('appearance'), hint: t('surfaceHint') },
          h('div', { className: 'uis-presets', role: 'group', 'aria-label': t('surface') }, surfaceCards),
          h('div', { className: 'uis-row' },
            h('div', { className: 'uis-rowText' },
              h('div', { className: 'uis-rowLabel' }, t('accent')),
              h('div', { className: 'uis-rowHint' }, t('accentHint'))),
            h('div', { className: 'uis-segment', role: 'group', 'aria-label': t('accent') },
              h('button', {
                type: 'button',
                className: 'uis-segmentBtn',
                'aria-pressed': snapshot.accentMode === 'preset',
                disabled: loading,
                onClick: () => { actions.setAccentMode('preset') },
              }, t('accentFollow')),
              h('button', {
                type: 'button',
                className: 'uis-segmentBtn',
                'aria-pressed': snapshot.accentMode === 'custom',
                disabled: loading,
                onClick: () => { actions.setAccentMode('custom') },
              }, t('accentCustom')))),
          snapshot.accentMode === 'custom'
            ? h('div', { className: 'uis-accentControls' },
              h('input', {
                type: 'color',
                className: 'uis-colorInput',
                value: colorValue,
                disabled: loading,
                'aria-label': t('accentPicker'),
                onChange: (event) => { actions.setAccent(event.target.value) },
              }),
              h('input', {
                type: 'text',
                className: 'uis-hexInput',
                value: accentDraft,
                disabled: loading,
                spellCheck: false,
                'aria-label': t('accentHex'),
                'aria-invalid': accentInvalid ? 'true' : undefined,
                'aria-describedby': accentInvalid ? ACCENT_ERROR_ID : undefined,
                onChange: handleAccentText,
                onBlur: handleAccentBlur,
              }),
              accentInvalid
                ? h('span', { id: ACCENT_ERROR_ID, role: 'alert', className: 'uis-inlineError' }, t('invalidColor'))
                : null)
            : null),
        h(Card, { title: t('glass'), hint: t('glassHint') },
          h('div', { className: 'uis-row' },
            h('div', { className: 'uis-rowText' },
              h('div', { className: 'uis-rowLabel' }, t('transparency')),
              h('div', { className: 'uis-rowHint' }, t('transparencyHint'))),
            h('div', { className: 'uis-sliderWrap' },
              h('input', {
                type: 'range',
                min: 0,
                max: 100,
                step: 1,
                className: 'uis-slider',
                value: snapshot.transparency,
                disabled: loading,
                'aria-label': t('transparency'),
                'aria-valuetext': `${snapshot.transparency}%`,
                onChange: (event) => { actions.setTransparency(Number(event.target.value)) },
              }),
              h('span', { className: 'uis-sliderValue' }, `${snapshot.transparency}%`))),
          h('div', { className: 'uis-divider' }),
          h('div', { className: 'uis-row' },
            h('div', { className: 'uis-rowText' },
              h('div', { className: 'uis-rowLabel' }, t('blur')),
              h('div', { className: 'uis-rowHint' }, t('blurHint'))),
            h('div', { className: 'uis-sliderWrap' },
              h('input', {
                type: 'range',
                min: 0,
                max: MAX_BLUR,
                step: 1,
                className: 'uis-slider',
                value: snapshot.blur,
                disabled: loading,
                'aria-label': t('blur'),
                'aria-valuetext': `${snapshot.blur}px`,
                onChange: (event) => { actions.setBlur(Number(event.target.value)) },
              }),
              h('span', { className: 'uis-sliderValue' }, `${snapshot.blur}px`))),
          h('div', { className: 'uis-divider' }),
          h('div', { className: 'uis-row' },
            h('div', { className: 'uis-rowText' },
              h('div', { className: 'uis-rowLabel' }, t('background')),
              h('div', { className: 'uis-rowHint' }, t('backgroundHint'))),
            h('div', { className: 'uis-uploadRow' },
              h('input', {
                ref: uploadInput,
                type: 'file',
                accept: 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/apng,video/mp4,video/webm',
                className: 'uis-fileInput',
                onChange: handleUpload,
              }),
              h('button', {
                type: 'button',
                className: 'uis-uploadButton',
                disabled: loading || uploading,
                onClick: () => {
                  if (uploadInput.current !== null) uploadInput.current.click()
                },
              }, uploading
                ? t('uploading')
                : snapshot.background
                  ? t('replaceFile')
                  : t('chooseFile')),
              snapshot.background
                ? h('button', {
                  type: 'button',
                  className: 'uis-removeButton',
                  disabled: loading || uploading,
                  onClick: handleRemoveBackground,
                }, t('removeBackground'))
                : null)),
          uploadState.status === 'error'
            ? h('p', { className: 'uis-inlineError', role: 'alert' }, uploadState.message || t('uploadFailed'))
            : null,
          h('p', { className: 'uis-uploadInfo' },
            snapshot.background
              ? `${snapshot.background.kind === 'video' ? t('backgroundVideo') : t('backgroundImage')} · ${snapshot.background.mediaType}`
              : t('backgroundNone'))),
        h(Card, { title: t('typography'), hint: t('typographyHint') },
          h('div', { className: 'uis-fonts' }, fontRows)),
        h(Card, { title: t('branding'), hint: t('brandingHint') },
          h('div', { className: 'uis-row' },
            h('div', { className: 'uis-rowText' },
              h('div', { className: 'uis-rowLabel' }, t('brandEnabled'))),
            h('button', {
              type: 'button',
              role: 'switch',
              'aria-checked': snapshot.brandEnabled,
              'aria-label': t('brandEnabled'),
              className: snapshot.brandEnabled ? 'uis-switch uis-switchOn' : 'uis-switch',
              disabled: loading,
              onClick: () => { actions.setBrandEnabled(!snapshot.brandEnabled) },
            }, h('span', { className: 'uis-switchThumb' }))),
          snapshot.brandEnabled
            ? h('div', { className: 'uis-brandFields' },
              h('div', { className: 'uis-fieldRow' },
                h('label', { className: 'uis-fieldLabel', htmlFor: 'uis-brand-name' }, t('brandName')),
                h('input', {
                  id: 'uis-brand-name',
                  type: 'text',
                  className: 'uis-textInput',
                  value: snapshot.brandName,
                  maxLength: 40,
                  disabled: loading,
                  onChange: (event) => { actions.setBrandName(event.target.value) },
                })),
              h('div', { className: 'uis-fieldRow' },
                h('label', { className: 'uis-fieldLabel', htmlFor: 'uis-brand-mark' },
                  h('span', null, t('brandMark')),
                  h('span', { className: 'uis-fieldHint' }, t('brandMarkHint'))),
                h('input', {
                  id: 'uis-brand-mark',
                  type: 'text',
                  className: 'uis-textInput',
                  value: snapshot.brandMark,
                  maxLength: 4,
                  disabled: loading,
                  onChange: (event) => { actions.setBrandMark(event.target.value) },
                })),
              h('div', { className: 'uis-brandPreview' },
                h('span', {
                  style: markStyle(24, onBrand(snapshot), appliedBrand(snapshot)),
                  'aria-hidden': true,
                }, markText(snapshot)),
                h('span', { className: 'uis-brandPreviewName' }, brandName(snapshot))))
            : null),
        h('p', { className: 'uis-note' }, t('noteCoverage')),
        h('p', { className: 'uis-note' }, t('noteDisable')))
    }

    function SectionIcon(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 16
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 16 16',
        fill: 'none',
        'aria-hidden': true,
        style: { display: 'block', opacity: props.active ? 1 : 0.9 },
      },
        h('path', {
          d: 'M2 4.5h7.5M4 8h8M2 11.5h6',
          stroke: 'currentColor',
          strokeWidth: 1.3,
          strokeLinecap: 'round',
        }),
        h('circle', { cx: 11.5, cy: 4.5, r: 1.6, fill: 'currentColor' }),
        h('circle', { cx: 2.5, cy: 8, r: 1.6, fill: 'currentColor' }),
        h('circle', { cx: 10, cy: 11.5, r: 1.6, fill: 'currentColor' }))
    }

    function BrandMark(props) {
      const snapshot = props.useStudio((state) => state)
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 20
      return h('span', {
        className: props.className,
        style: { display: 'inline-flex', alignItems: 'center', flex: 'none' },
        'aria-hidden': true,
      },
        h('span', { style: markStyle(size, onBrand(snapshot), appliedBrand(snapshot)) }, markText(snapshot)))
    }

    function BrandName(props) {
      const snapshot = props.useStudio((state) => state)
      const name = brandName(snapshot)
      return h('span', {
        title: name,
        style: {
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }, name)
    }

    const CSS = `
.uis-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 768px;
  margin: 0 -24px;
  padding: 12px 24px 8px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 94%, transparent);
  backdrop-filter: blur(18px) saturate(1.15);
  color: var(--dsw-alias-label-primary);
}
.uis-page * { box-sizing: border-box; }
.uis-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.uis-headText { min-width: 0; }
.uis-title {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
}
.uis-intro {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-secondary);
}
.uis-reset {
  flex: none;
  height: 28px;
  padding: 0 10px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.uis-reset:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.uis-reset:disabled { opacity: 0.5; cursor: default; }
.uis-resetArmed {
  border-color: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-state-error-primary);
}
.uis-status {
  margin: -8px 0 0;
  min-height: 18px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.uis-statusWarn { color: var(--dsw-alias-state-warn-primary); }
.uis-statusSaved { color: var(--dsw-alias-state-success-primary); }
.uis-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 0.5px solid var(--dsw-alias-settings-card-stroke, var(--dsw-alias-border-l1));
  border-radius: var(--dsw-radius-xl);
  background: var(--dsw-alias-settings-card-fill, var(--dsw-alias-bg-layer-1));
}
.uis-cardHead { display: flex; flex-direction: column; gap: 2px; }
.uis-cardTitle {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.uis-cardHint {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.uis-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.uis-rowText { min-width: 0; }
.uis-rowLabel { font-size: 13px; line-height: 20px; font-weight: 500; }
.uis-rowHint { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.uis-presets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
  gap: 8px;
}
.uis-preset {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-lg, 10px);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.uis-preset:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.uis-preset:disabled { opacity: 0.55; cursor: default; }
.uis-preset[aria-pressed="true"] {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: inset 0 0 0 1px var(--dsw-alias-brand-primary);
}
.uis-swatches { display: flex; gap: 4px; }
.uis-swatch {
  flex: 1;
  height: 18px;
  border-radius: 5px;
  border: 0.5px solid var(--dsw-alias-border-l1);
}
.uis-presetLabel { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-primary); }
.uis-segment {
  display: inline-flex;
  flex: none;
  gap: 2px;
  padding: 2px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-2);
}
.uis-segmentBtn {
  height: 24px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.uis-segmentBtn[aria-pressed="true"] {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
}
.uis-segmentBtn:disabled { opacity: 0.55; cursor: default; }
.uis-accentControls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.uis-colorInput {
  width: 34px;
  height: 30px;
  padding: 2px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  cursor: pointer;
}
.uis-hexInput {
  width: 96px;
  height: 30px;
  padding: 0 8px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.uis-hexInput[aria-invalid="true"] { border-color: var(--dsw-alias-state-error-primary); }
.uis-inlineError { font-size: 12px; line-height: 18px; color: var(--dsw-alias-state-error-primary); }
.uis-fonts { display: flex; flex-direction: column; gap: 12px; }
.uis-fontRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.uis-stepper {
  display: inline-flex;
  align-items: center;
  flex: none;
  overflow: hidden;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}
.uis-stepBtn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}
.uis-stepBtn:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.uis-stepBtn:disabled { opacity: 0.4; cursor: default; }
.uis-stepValue {
  min-width: 34px;
  text-align: center;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
}
.uis-unit { margin-left: 1px; color: var(--dsw-alias-label-secondary); }
.uis-switch {
  position: relative;
  width: 36px;
  height: 20px;
  flex: none;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--dsw-alias-border-l2);
  cursor: pointer;
  transition: background-color 120ms ease;
}
.uis-switch:disabled { opacity: 0.55; cursor: default; }
.uis-switchOn { background: var(--dsw-alias-brand-primary); }
.uis-switchThumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--dsw-alias-label-primary);
  transition: transform 120ms ease;
}
.uis-switchOn .uis-switchThumb {
  background: var(--dsw-alias-bg-base);
  transform: translateX(16px);
}
.uis-brandFields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 2px;
}
.uis-fieldRow { display: flex; align-items: center; gap: 12px; }
.uis-fieldLabel {
  width: 112px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.uis-fieldHint { font-size: 11px; line-height: 16px; }
.uis-textInput {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 0 8px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
}
.uis-brandPreview {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding-top: 2px;
}
.uis-brandPreviewName {
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.uis-note {
  margin: -4px 0 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.uis-sliderWrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}
.uis-slider {
  width: 180px;
  accent-color: var(--dsw-alias-brand-primary);
}
.uis-sliderValue {
  min-width: 36px;
  text-align: right;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary);
}
.uis-divider {
  height: 0.5px;
  margin: 2px 0;
  background: var(--dsw-alias-border-l1);
}
.uis-uploadRow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.uis-fileInput { display: none; }
.uis-uploadButton,
.uis-removeButton {
  height: 28px;
  padding: 0 10px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md);
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.uis-uploadButton:hover:not(:disabled),
.uis-removeButton:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
.uis-uploadButton:disabled,
.uis-removeButton:disabled {
  opacity: 0.5;
  cursor: default;
}
.uis-removeButton {
  border-color: var(--dsw-alias-state-error-primary);
  color: var(--dsw-alias-state-error-primary);
}
.uis-uploadInfo {
  margin: -4px 0 0;
  overflow: hidden;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.uis-preview {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 132px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-xl);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.uis-previewVideo {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(6px) saturate(1.15);
  transform: scale(1.04);
}
.uis-previewGrid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  min-height: 132px;
}
.uis-previewSidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 8px;
  background: var(--dsw-specific-sidebar-fill);
  border-right: 0.5px solid var(--dsw-alias-border-l1);
  backdrop-filter: blur(10px) saturate(1.15);
}
.uis-previewFallbackMark {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: var(--dsw-alias-border-l2);
}
.uis-previewHero {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.uis-previewHeroName {
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
}
.uis-previewBrand {
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.uis-previewMain {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--dsw-alias-bg-base);
  backdrop-filter: blur(10px) saturate(1.15);
}
.uis-previewLine {
  height: 6px;
  border-radius: 3px;
  background: var(--dsw-alias-border-l1);
}
.uis-previewLineStrong {
  width: 42%;
  background: var(--dsw-alias-label-secondary);
  opacity: 0.5;
}
.uis-previewBubble {
  align-self: flex-end;
  max-width: 80%;
  padding: 6px 8px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: 1.45;
}
.uis-previewCode {
  align-self: flex-start;
  padding: 4px 6px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-code-font-size, 11px);
  line-height: 1.4;
}
.uis-previewTerminal {
  align-self: flex-start;
  display: inline-flex;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-family: var(--ds-font-family-code, monospace);
  font-size: var(--dsh-terminal-font-size, 13px);
  line-height: 1.3;
}
.uis-previewPrompt { color: var(--dsw-alias-brand-primary); }
.uis-previewBtn {
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--dsw-alias-brand-primary);
  color: #FFFFFF;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}
.uis-page button:focus-visible,
.uis-page input:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
  outline-offset: 2px;
}
@media (max-width: 767px) {
  .uis-page {
    margin: 0 -16px;
    padding: 12px 16px 8px;
  }
}
@media (max-width: 560px) {
  .uis-head { flex-direction: column; }
  .uis-presets { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .uis-row { flex-direction: column; align-items: stretch; }
  .uis-fontRow { flex-direction: column; align-items: flex-start; }
  .uis-fieldRow { flex-direction: column; align-items: stretch; }
  .uis-fieldLabel { width: auto; }
  .uis-sliderWrap { width: 100%; }
  .uis-slider { flex: 1; width: auto; }
  .uis-uploadRow { width: 100%; }
}
`

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { en: EN, zh: ZH }), 'ui-studio: locale')
      const t = ctx.locale.bind(NS)

      const initialTheme = ctx.theme.getTheme()
      const store = createStore({
        ...defaultPrefs(),
        status: 'loading',
        writable: false,
        save: 'idle',
        colorScheme: initialTheme.active.colorScheme,
        baseThemeTokens: baseThemeTokensOf(initialTheme),
        fontSizes: { ...initialTheme.fontSizes },
      })

      const form = ctx.configForms.get(ENTRY_ID)

      let settled = false
      let dirty = false
      let localRev = 0
      let lastRaw
      let formUnsub = () => {}
      let saveTimer = null
      let disposed = false
      let brandActive = false
      let brandDisposers = []
      let tokenDispose = null
      let backdropEl = null
      let backdropVideo = null

      function applyTokens() {
        const tokens = buildTokens(store.getSnapshot())
        if (tokens === null) {
          if (tokenDispose !== null) {
            try { tokenDispose() } catch (error) { console.error('ui-studio: token cleanup failed', error) }
            tokenDispose = null
          }
          return
        }
        try {
          tokenDispose = ctx.theme.overrideTokens(TOKEN_SOURCE, tokens)
        } catch (error) {
          console.error('ui-studio: token override rejected', error)
        }
      }

      function updateBackdrop() {
        if (backdropEl === null) return
        const snapshot = store.getSnapshot()
        const gradient = DEFAULT_GRADIENTS[snapshot.colorScheme === 'dark' ? 'dark' : 'light']
        const background = snapshot.background
        if (background !== null && background.kind === 'video') {
          backdropEl.style.backgroundImage = gradient
          if (backdropVideo === null || backdropVideo.dataset.src !== background.url) {
            if (backdropVideo !== null) backdropVideo.remove()
            const video = document.createElement('video')
            video.src = background.url
            video.autoplay = true
            video.muted = true
            video.loop = true
            video.playsInline = true
            video.setAttribute('aria-hidden', 'true')
            video.dataset.src = background.url
            backdropEl.appendChild(video)
            backdropVideo = video
          }
          return
        }
        if (backdropVideo !== null) {
          backdropVideo.remove()
          backdropVideo = null
        }
        backdropEl.style.backgroundImage = background !== null && background.kind === 'image'
          ? `url("${background.url}"), ${gradient}`
          : gradient
      }

      function disposeBrand() {
        for (const dispose of brandDisposers) {
          try { dispose() } catch (error) { console.error('ui-studio: brand cleanup failed', error) }
        }
        brandDisposers = []
      }

      function registerBrand() {
        const registrations = [
          ['sidebar.brand.mark', BrandMark],
          ['sidebar.brand.name', BrandName],
          ['conversation.hero.brand.mark', BrandMark],
        ]
        brandDisposers = registrations.map(([name, component]) => ctx.slots.inject(name, () => ctx.slots.register({
          name,
          priority: -1,
          inject: () => ({ hooks: { studio: store } }),
        }, component)))
      }

      function syncBrand() {
        const snapshot = store.getSnapshot()
        const should = snapshot.status !== 'loading' && snapshot.brandEnabled
        if (should === brandActive) return
        brandActive = should
        if (should) registerBrand()
        else disposeBrand()
      }

      function applyAll() {
        applyTokens()
        syncBrand()
        updateBackdrop()
      }

      function syncTheme() {
        const theme = ctx.theme.getTheme()
        const next = theme.fontSizes
        const current = store.getSnapshot()
        const patch = {}
        if (next.text !== current.fontSizes.text
          || next.code !== current.fontSizes.code
          || next.terminal !== current.fontSizes.terminal) {
          patch.fontSizes = { text: next.text, code: next.code, terminal: next.terminal }
        }
        if (theme.active.colorScheme !== current.colorScheme) {
          patch.colorScheme = theme.active.colorScheme
        }
        const baseTokens = baseThemeTokensOf(theme)
        if (baseTokens !== current.baseThemeTokens) {
          patch.baseThemeTokens = baseTokens
        }
        if (Object.keys(patch).length > 0) {
          store.update(patch)
          if (patch.baseThemeTokens !== undefined) applyTokens()
          updateBackdrop()
        }
      }

      function scheduleSave() {
        if (saveTimer !== null) window.clearTimeout(saveTimer)
        saveTimer = window.setTimeout(() => {
          saveTimer = null
          saveNow()
        }, 350)
      }

      function saveNow() {
        if (disposed) return
        const snapshot = store.getSnapshot()
        if (snapshot.status !== 'ready' || !snapshot.writable) {
          store.update({ save: snapshot.status === 'unavailable' ? 'session' : 'error' })
          return
        }
        const raw = serializePrefs(snapshot)
        const revision = localRev
        store.update({ save: 'saving' })
        let request
        try {
          request = form.set(CONFIG_FIELD, raw)
        } catch (error) {
          console.error('ui-studio: save failed', error)
          store.update({ save: 'error' })
          return
        }
        request.then((accepted) => {
          if (disposed || revision !== localRev) return
          if (accepted) {
            dirty = false
            lastRaw = raw
            store.update({ save: 'saved' })
          } else {
            store.update({ save: 'error' })
          }
        }).catch((error) => {
          if (disposed || revision !== localRev) return
          console.error('ui-studio: save failed', error)
          store.update({ save: 'error' })
        })
      }

      function flushPendingSave() {
        if (disposed) return
        if (saveTimer !== null) {
          window.clearTimeout(saveTimer)
          saveTimer = null
        }
        if (dirty) saveNow()
      }

      function commit(patch) {
        localRev += 1
        dirty = true
        store.update(patch)
        applyAll()
        scheduleSave()
      }

      function setSurface(id) {
        if (!SURFACE_IDS.includes(id)) return
        commit({ surface: id })
      }

      function setAccentMode(mode) {
        if (mode !== 'preset' && mode !== 'custom') return
        commit({ accentMode: mode })
      }

      function setAccent(hex) {
        if (!HEX.test(hex)) return
        commit({ accent: hex.toUpperCase() })
      }

      function setBrandEnabled(enabled) {
        commit({ brandEnabled: enabled === true })
      }

      function setBrandName(value) {
        commit({ brandName: String(value).slice(0, 40) })
      }

      function setBrandMark(value) {
        commit({ brandMark: sanitizeMark(value) })
      }

      function stepFont(role, delta) {
        const spec = FONT_SPECS[role]
        if (!spec) return
        const current = store.getSnapshot().fontSizes[role]
        const next = Math.max(spec.min, Math.min(spec.max, current + delta))
        if (next === current) return
        try {
          ctx.theme.setFontSize(role, next)
        } catch (error) {
          console.error('ui-studio: font size rejected', error)
        }
      }

      function resetAll() {
        localRev += 1
        dirty = true
        const hadBackground = store.getSnapshot().background !== null
        if (saveTimer !== null) {
          window.clearTimeout(saveTimer)
          saveTimer = null
        }
        store.update({ ...defaultPrefs(), save: 'idle' })
        applyAll()
        if (hadBackground) {
          fetch(UPLOAD_ROUTE, {
            method: 'DELETE',
            headers: { [UPLOAD_HEADER]: '1' },
          }).catch((error) => { console.error('ui-studio: background reset failed', error) })
        }
        for (const role of FONT_ROLES) {
          const spec = FONT_SPECS[role]
          if (store.getSnapshot().fontSizes[role] !== spec.defaultValue) {
            try { ctx.theme.setFontSize(role, spec.defaultValue) } catch (error) { console.error('ui-studio: font reset rejected', error) }
          }
        }
        const snapshot = store.getSnapshot()
        if (snapshot.status !== 'ready' || !snapshot.writable) {
          store.update({ save: snapshot.status === 'unavailable' ? 'session' : 'error' })
          dirty = false
          return
        }
        const raw = serializePrefs(snapshot)
        const revision = localRev
        store.update({ save: 'saving' })
        form.set(CONFIG_FIELD, raw).then((accepted) => {
          if (disposed || revision !== localRev) return
          dirty = false
          if (accepted) {
            lastRaw = raw
            store.update({ save: 'saved' })
          } else {
            store.update({ save: 'error' })
          }
        }).catch((error) => {
          if (disposed || revision !== localRev) return
          console.error('ui-studio: reset save failed', error)
          store.update({ save: 'error' })
        })
      }

      function readForm() {
        if (disposed) return
        const formSnapshot = form.getSnapshot()
        if (formSnapshot.status === 'loading') return
        const value = formSnapshot.status === 'ready' && formSnapshot.value !== undefined
          ? formSnapshot.value[CONFIG_FIELD]
          : undefined
        if (!settled) {
          settled = true
          lastRaw = typeof value === 'string' ? value : undefined
          store.update({
            ...parsePrefs(value),
            status: formSnapshot.status === 'ready' ? 'ready' : 'unavailable',
            writable: formSnapshot.status === 'ready' ? formSnapshot.writable : false,
          })
          applyAll()
          return
        }
        if (formSnapshot.status !== 'ready' || !formSnapshot.writable) {
          const snapshot = store.getSnapshot()
          if (snapshot.status !== 'unavailable' || snapshot.writable) {
            store.update({ status: formSnapshot.status === 'ready' ? 'ready' : 'unavailable', writable: false })
          }
          return
        }
        if (dirty) return
        if (typeof value === 'string' && value !== lastRaw) {
          lastRaw = value
          store.update({ ...parsePrefs(value), status: 'ready', writable: true })
          applyAll()
        } else if (!store.getSnapshot().writable) {
          store.update({ writable: true })
        }
      }

      function setTransparency(value) {
        const number = Number(value)
        if (!Number.isFinite(number)) return
        const next = Math.max(0, Math.min(100, Math.round(number)))
        if (next === store.getSnapshot().transparency) return
        commit({ transparency: next })
      }

      function setBlur(value) {
        const number = Number(value)
        if (!Number.isFinite(number)) return
        const next = Math.max(0, Math.min(MAX_BLUR, Math.round(number)))
        if (next === store.getSnapshot().blur) return
        commit({ blur: next })
      }

      function setBackground(background) {
        commit({ background: sanitizeBackground(background) })
      }

      const actions = {
        setSurface,
        setAccentMode,
        setAccent,
        setTransparency,
        setBlur,
        setBackground,
        setBrandEnabled,
        setBrandName,
        setBrandMark,
        stepFont,
        resetAll,
      }

      ctx.effect(() => ctx.on('theme/change', syncTheme), 'ui-studio: theme changes')

      ctx.effect(() => ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: ENTRY_ID,
        order: 12,
        label: () => t('title'),
        locale: NS,
        inject: () => ({ actions, hooks: { studio: store } }),
      }, StudioPage)), 'ui-studio: settings page')

      ctx.effect(() => ctx.slots.inject('settings.section.icon', () => ctx.slots.register({
        name: 'settings.section.icon',
        id: ENTRY_ID,
        order: 12,
      }, SectionIcon)), 'ui-studio: settings icon')

      ctx.effect(() => {
        if (typeof document === 'undefined' || document.body === null) return undefined
        const style = document.createElement('style')
        style.setAttribute('data-ui-studio', 'glass')
        style.textContent = GLASS_CSS
        document.head.appendChild(style)
        document.documentElement.classList.add('ui-studio-glass')
        document.body.classList.add('ui-studio-glass')
        const backdrop = document.createElement('div')
        backdrop.id = 'ui-studio-backdrop'
        backdrop.setAttribute('aria-hidden', 'true')
        document.body.prepend(backdrop)
        backdropEl = backdrop
        updateBackdrop()
        return () => {
          backdropEl = null
          backdropVideo = null
          backdrop.remove()
          style.remove()
          document.documentElement.classList.remove('ui-studio-glass')
          document.body.classList.remove('ui-studio-glass')
        }
      }, 'ui-studio: glass surface')

      ctx.effect(() => {
        const flush = () => { flushPendingSave() }
        const onVisibility = () => {
          if (document.visibilityState === 'hidden') flush()
        }
        window.addEventListener('pagehide', flush)
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          window.removeEventListener('pagehide', flush)
          document.removeEventListener('visibilitychange', onVisibility)
        }
      }, 'ui-studio: flush pending saves')

      ctx.effect(() => () => {
        if (saveTimer !== null) {
          window.clearTimeout(saveTimer)
          saveTimer = null
        }
        if (dirty) flushPendingSave()
        disposed = true
        formUnsub()
        disposeBrand()
        if (tokenDispose !== null) {
          try { tokenDispose() } catch (error) { console.error('ui-studio: token cleanup failed', error) }
          tokenDispose = null
        }
      }, 'ui-studio: cleanup')

      formUnsub = form.subscribe(readForm)
      readForm()
    }

    return {
      inject: ['slots', 'locale', 'theme', 'configForms'],
      apply,
    }
  },
})
