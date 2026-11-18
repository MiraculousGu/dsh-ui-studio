<a name="english"></a>

**Language / 语言:** [English](#english) · [中文](#中文)

# dsh-ui-studio

**UI studio** is a DeepSeek Harness (DSH) Web plugin that turns the interface into a customizable glass surface. It adds **Settings → UI studio**, where you can choose a surface palette, set an accent, adjust transparency over a blurred backdrop, upload a photo/GIF/video background, change body/code/terminal type sizes, and optionally replace the product name and mark.

![Illustrative preview of UI studio](docs/preview.svg)

> The image above is an illustration, not a screenshot. The rendered result depends on the active theme, display, and uploaded background.

## Plugin information

| Field | Value |
| --- | --- |
| Name | `dsh-ui-studio` (UI studio) |
| Version | `1.0.0` |
| Author | Tianrun Gu ([@MiraculousGu](https://github.com/MiraculousGu)) |
| Environment | DeepSeek Harness `0.2.2-rc.3` or newer, tested with the **Desktop** profile (`0.2.2-rc.3`) and a **Web** profile on Linux (`0.2.2-rc.4`); both use the same Web client composition |
| Features | ① **Glass UI**: translucent app surfaces over a blurred backdrop with a macOS-style default gradient. ② **Transparency** (0–100) and **blur** (0–64 px) as separate sliders. ③ **Background upload**: PNG/JPEG/WebP/GIF/AVIF/APNG, MP4, or WebM. ④ **Six surface palettes** with light/dark values. ⑤ **Palette or custom accent**, contrast-adjusted per mode. ⑥ **Body, code, and terminal type sizes** shared with Settings → General → Appearance. ⑦ **Optional branding**: product name and 1–2 character/emoji mark. ⑧ **Profile-backed persistence** and a two-step reset. |
| Repository | https://github.com/MiraculousGu/dsh-ui-studio |
| License | MIT |

## Where it appears

Open **Settings → UI studio**. The section is inserted after **Models** and before **Plugins** in the settings navigation. Its icon is the sliders glyph in the same navigation rail.

The settings panel itself is exempt from **Transparency** and **Blur**: it keeps an opaque fill in the applied palette so its controls stay readable. Workbench panes (code and document previews, files, terminal, browser) are also opaque, so reading surfaces never show the backdrop through their content. Only the app behind them receives the glass treatment.

## Features

### Glass and transparency

- App surfaces (main background, layers, sidebar, cards, composer, user bubble, settings cards) are emitted as translucent colors over a fixed, blurred backdrop.
- The default backdrop is a built-in macOS-style gradient. Uploading a background replaces it.
- **Transparency** controls how much of the backdrop shows through. `0%` is opaque; `100%` keeps surfaces at **45% opacity** for readability, not fully transparent.
- **Blur** is a separate slider (`0–64 px`) for the backdrop and the frosted surfaces. `0 px` keeps the backdrop sharp. The settings panel is excluded.
- A scrim behind the app reduces extreme contrast.
- Menus are exempt from **Transparency** and **Blur**: they keep DSH's own translucent surface and backdrop blur.
- Code and document preview panes keep an opaque fill; preview content never reads through the backdrop.

### Background

- Upload a **photo**, **animated GIF/WebP/APNG**, or **MP4/WebM video**; video loops silently behind the app.
- The background is shown in the **live preview** and behind the real UI.
- Maximum size: **30 MB**. SVG and HTML are rejected; the route serves only the allowlisted raster image and MP4/WebM types.
- **Replace** or **Remove** from the same card. Removing falls back to the built-in gradient.
- The file is stored on the Host, not inside the settings document. See [Storage and privacy](#storage-and-privacy).

### Surface palettes and accent

- **Default**, **Ocean**, **Forest**, **Sunset**, **Rose**, and **Graphite** palettes, each with matching light and dark backgrounds, borders, sidebar fill, and brand color.
- **Accent** follows the palette by default, or accepts a custom color.
- Custom accents are adjusted per color scheme so primary-button ink and the brand mark stay readable; the exact rendered tone can differ slightly from the picked hex.
- Palette cards show the palette's own light/dark colors and do **not** change when another palette is applied.

### Type sizes

- Body text: **10–22 px**.
- Code: **10–16 px**.
- Sidebar terminal: **10–20 px**.
- These values are written through DSH's theme service and stay in sync with **Settings → General → Appearance**.

### Branding

- Off by default.
- Optional product name and a 1–2 character/emoji mark.
- When enabled, replaces the sidebar brand name and mark and supplies the blank-session hero mark.
- Ink color is chosen from the applied brand luminance, so light and dark palettes stay readable.

### Persistence and reset

- Preferences are stored in the profile's settings document under the `ui-studio` namespace; a single volatile `customization` JSON field carries the visual preferences.
- Background media is stored under `$DSH_HOME/ui-studio/` and referenced by URL and media type.
- **Reset all** (two clicks) restores the default palette, default transparency, the built-in gradient, default type sizes, and disables branding.
- The page reports **Loading / Saved / Saving / Couldn't save / session only** so a read-only profile is visible.

## Installation

### Requirements

- DeepSeek Harness with the Web client composition (`Desktop` or `Web` profile).
- Node.js and pnpm for the local checkout. The plugin has no build step, but its Host half depends on `@deepseek-ai/schemastery`.

### From a local clone (recommended)

```sh
git clone https://github.com/MiraculousGu/dsh-ui-studio.git
cd dsh-ui-studio
pnpm install
```

Then install the directory:

1. Open **Settings → Plugins**.
2. Choose **Add plugin** and select the cloned `dsh-ui-studio` directory.
3. Enable **UI studio** if it is not enabled automatically.
4. Refresh the GUI once (`Cmd+R` / `Ctrl+R`) so the Client bundle, glass stylesheet, and backdrop layer load.

`pnpm install` is required because a linked local bundle resolves the Host schema dependency from its own `node_modules`.

### CLI

If your DSH build exposes the `dsh plugin` command, the local-directory form is:

```sh
dsh plugin --profile desktop add /absolute/path/to/dsh-ui-studio
```

Use `--profile web` for a Web profile. Remove with:

```sh
dsh plugin --profile desktop remove @local/dsh-ui-studio
```

A Git spec is available when your DSH build supports it:

```sh
dsh plugin --profile desktop add github:MiraculousGu/dsh-ui-studio
```

Prefer the local clone when you need to inspect or modify the source; the Git spec depends on the package manager installing the Host dependency.

## Usage

1. Open **Settings → UI studio**.
2. Pick a **Surface palette**; the live preview and the app update immediately.
3. Choose **Follow palette** or **Custom color** for the accent.
4. Move **Transparency** to taste (`0%` opaque, `100%` strongest glass), then set **Blur** separately (`0–64 px`).
5. Under **Background**, choose a file, then **Replace** or **Remove**. The preview shows images and videos.
6. Adjust **Type sizes** and optionally enable **Branding**.
7. Reload the app or restart it to confirm the settings persist.
8. Use **Reset all** twice to return to defaults.

The same settings apply to every browser using the profile. The page falls back to **session only** when the profile does not expose saved settings.

## Storage and privacy

| Data | Location |
| --- | --- |
| Palettes, accent, transparency, blur, branding | Profile settings document, namespace `ui-studio`, field `customization` |
| Type sizes | `ui-theme` settings namespace, shared with General → Appearance |
| Uploaded background | `$DSH_HOME/ui-studio/background.bin` plus `background.json` (default `~/.dsh/ui-studio/`) |
| Background route | `POST/GET/DELETE /ui-studio/background` on the DSH web server |

- The plugin makes **no outbound network requests** and collects no telemetry.
- It does not read sessions, messages, credentials, or model data.
- The background route checks a custom upload marker and, for upload/delete, the page's serving origin (or a loopback spelling). It serves the current background over the DSH web server's binding.
- If DSH is bound to a LAN address, anyone who can reach that server can fetch the current background image; uploads and deletes still require the marker and same-origin request.
- The background file is shared by profiles that use the plugin; the most recent upload wins. Remove it from the page or reset the plugin to delete it.
- Disabling the plugin removes the palette, glass layer, backdrop, and branding, but leaves the background file and type sizes. Type sizes remain in General → Appearance by design.

## Compatibility and limitations

- Tested with DeepSeek Harness **`0.2.2-rc.3`** (Desktop profile) and **`0.2.2-rc.4`** (Web profile on Linux). It uses the public Client services `slots`, `locale`, `theme`, and `configForms`, and the Host `settings` and `webServer` services. Future DSH changes to those seams may require an update.
- The theme is intentionally **partial**: main surfaces, layers, sidebar, cards, composer, bubble, and settings cards are glass; menus keep DSH's own glass material; hover cards and toasts remain opaque; some host surfaces may keep the base material.
- Custom accents are contrast-adjusted; the rendered tone may differ from the picked hex.
- The settings panel is opaque and keeps the applied palette; it does not follow Transparency or Blur.
- Workbench panes (code and document previews, files, terminal, browser) keep an opaque fill; they do not follow Transparency or Blur.
- Background media is shared across profiles using the plugin; there is no per-profile media directory.
- MP4/WebM playback depends on the Chromium build and codec; unsupported codecs fall back to the gradient.
- The included preview is an illustration, not a screenshot.
- The plugin does not replace the app root or append a second app; it uses DSH slots, theme tokens, and one fixed backdrop element.

## Development

No build step. The Client half is a hand-written lazy-CJS module; the Host half is Node ESM.

```text
dsh-ui-studio/
├── client.js            # settings page, stores, glass backdrop, theme application
├── index.js             # Host config + /ui-studio/background route
├── cordis.patch.yml     # inserts the ui-studio row
├── package.json
├── locale/              # Plugin Manager metadata (en, zh)
├── icon.svg
├── docs/                # detail image and localized detail documents
├── test/check.mjs       # syntax, manifest, locale, SVG, and Config checks
└── pnpm-lock.yaml
```

```sh
pnpm install
pnpm test
```

`pnpm test` runs `node --check` on both halves, validates the manifest and locale JSON, checks the SVGs, verifies the patch row, and imports the Host half to confirm the exported `Config` schema.

Manual checks that need a running DSH:

- The `settings.section` and `settings.section.icon` entries for `ui-studio` are active in Client Inspect.
- The page loads in **Settings → UI studio**; palette, transparency, blur, upload, and reset work.
- `/ui-studio/background` returns 404 when no background is set, serves the uploaded bytes after POST, supports a byte range, and returns 204 after DELETE.

Issues and pull requests are welcome at https://github.com/MiraculousGu/dsh-ui-studio/issues.

## License

MIT. See [LICENSE](LICENSE).

---

<a name="中文"></a>

**Language / 语言:** [English](#english) · [中文](#中文)

# dsh-ui-studio（中文）

**UI studio** 是一个 DeepSeek Harness（DSH）Web 插件。它在 **设置 → 界面工作室** 中提供玻璃化界面定制：配色方案、强调色、透明度、照片/GIF/视频背景、正文字号、代码字号、终端字号，以及可选的品牌名称与标记。

![界面工作室示意图](docs/preview.svg)

> 上图为示意图，不是实际截图。最终效果取决于当前主题、显示设备和上传的背景。

## 插件信息

| 字段 | 值 |
| --- | --- |
| 名称 | `dsh-ui-studio`（UI studio / 界面工作室） |
| 版本 | `1.0.0` |
| 作者 | Tianrun Gu（[@MiraculousGu](https://github.com/MiraculousGu)） |
| 环境 | DeepSeek Harness `0.2.2-rc.3` 及以上，已在 **Desktop** 配置（`0.2.2-rc.3`）和 Linux 上的 **Web** 配置（`0.2.2-rc.4`）中测试；两者使用同一套 Web 客户端 |
| 功能 | ① **玻璃界面**：半透明界面叠加模糊背景，内置 macOS 风格渐变。② **透明度**（0–100）与**模糊度**（0–64 px）两个独立滑杆。③ **背景上传**：PNG/JPEG/WebP/GIF/AVIF/APNG、MP4、WebM。④ **六套配色**，含浅色/深色值。⑤ **跟随配色或自定义强调色**，按模式调整对比度。⑥ **正文/代码/终端字号**，与“设置 → 通用 → 外观”同步。⑦ **可选品牌**：产品名称和 1–2 个字符/emoji 标记。⑧ **保存在配置中**，支持两步重置。 |
| 仓库 | https://github.com/MiraculousGu/dsh-ui-studio |
| 许可证 | MIT |

## 功能位置

打开 **设置 → 界面工作室**。该页面位于设置导航中 **模型** 之后、**插件** 之前，使用滑杆样式的导航图标。

设置面板本身不受**透明度**与**模糊度**影响：它保持不透明，并沿用所选配色，保证控件可读。工作台面板（代码与文档预览、文件、终端、浏览器）同样保持不透明，阅读界面不会透出背景。只有它们后方的应用界面会应用玻璃效果。

## 功能

### 玻璃与透明度

- 主背景、层级、侧边栏、卡片、输入框、用户气泡和设置卡片都使用半透明表面，叠加在固定、模糊的背景上。
- 默认背景是内置的 macOS 风格渐变；上传背景后替换它。
- **透明度** 控制背景透出的程度。`0%` 为不透明；`100%` 时表面仍保留 **45% 不透明度**，以保证可读性。
- **模糊度** 是独立滑杆（`0–64 px`），作用于背景与毛玻璃表面；`0 px` 时背景清晰。设置面板不受影响。
- 背景带有遮罩以降低极端对比。
- 菜单不受**透明度**与**模糊度**影响：沿用 DSH 自带的半透明材质和背景模糊。
- 代码与文档预览面板保持不透明，预览内容不会透出背景。

### 背景

- 支持**照片**、**动态 GIF/WebP/APNG**、**MP4/WebM 视频**；视频静音循环播放。
- 背景会显示在**实时预览**和真实界面后方。
- 最大 **30 MB**；拒绝 SVG/HTML，只提供允许列表中的栅格图片和 MP4/WebM。
- 在同一张卡片中**替换**或**移除**；移除后恢复内置渐变。
- 文件保存在 Host 端，不写入设置文档。详见“存储与隐私”。

### 配色与强调色

- **默认、海洋、森林、日落、玫瑰、石墨** 六套配色，配套浅色/深色背景、边框、侧边栏和品牌色。
- **强调色**默认跟随配色，也可自定义。
- 自定义强调色会按浅色/深色模式调整对比度；实际渲染色可能与你选择的十六进制值略有差异。
- 配色卡片始终显示各方案自身的颜色，切换方案时不会改变卡片本身。

### 字号

- 正文：**10–22 px**。
- 代码：**10–16 px**。
- 侧边栏终端：**10–20 px**。
- 通过 DSH 主题服务写入，并与 **设置 → 通用 → 外观** 保持同步。

### 品牌

- 默认关闭。
- 可设置产品名称和 1–2 个字符/emoji 标记。
- 开启后替换侧边栏品牌名称/标记，并用于空白会话页的品牌图标。
- 文字颜色按品牌色亮度自动选择，浅色/深色配色下均可读。

### 保存与重置

- 视觉偏好保存在配置的 `ui-studio` 设置命名空间中，由单个易变的 `customization` JSON 字段承载。
- 背景保存在 `$DSH_HOME/ui-studio/`，设置中只记录 URL 和媒体类型。
- **全部恢复默认**（点击两次）会恢复默认配色、默认透明度、内置渐变、默认字号，并关闭品牌。
- 页面会显示 **加载中 / 已保存 / 保存中 / 无法保存 / 仅本次会话**，只读配置也能明确看到。

## 安装

### 要求

- 带 Web 客户端的 DeepSeek Harness（`Desktop` 或 `Web` 配置）。
- 本地克隆需要 Node.js 和 pnpm。插件没有构建步骤，但 Host 半边依赖 `@deepseek-ai/schemastery`。

### 从本地克隆安装（推荐）

```sh
git clone https://github.com/MiraculousGu/dsh-ui-studio.git
cd dsh-ui-studio
pnpm install
```

然后：

1. 打开 **设置 → 插件**。
2. 选择 **添加插件**，选中克隆下来的 `dsh-ui-studio` 目录。
3. 如未自动启用，启用 **界面工作室**。
4. 刷新一次界面（`Cmd+R` / `Ctrl+R`），让客户端包、玻璃样式和背景层生效。

本地链接安装的插件会从自己的 `node_modules` 解析 Host 依赖，因此必须先执行 `pnpm install`。

### 命令行

如果当前 DSH 版本提供 `dsh plugin` 命令：

```sh
dsh plugin --profile desktop add /absolute/path/to/dsh-ui-studio
```

Web 配置使用 `--profile web`。卸载：

```sh
dsh plugin --profile desktop remove @local/dsh-ui-studio
```

如果支持 Git 规格：

```sh
dsh plugin --profile desktop add github:MiraculousGu/dsh-ui-studio
```

需要检查或修改源码时建议使用本地克隆；Git 规格依赖包管理器安装 Host 依赖。

## 使用

1. 打开 **设置 → 界面工作室**。
2. 选择**配色方案**；实时预览和应用界面立即更新。
3. 强调色选择**跟随配色**或**自定义颜色**。
4. 拖动**透明度**（`0%` 不透明，`100%` 玻璃感最强），再用**模糊度**单独调节（`0–64 px`）。
5. 在**背景**中选择文件，然后**替换**或**移除**；预览会显示图片或视频。
6. 调整**字号**，可选择性开启**品牌**。
7. 刷新或重启应用，确认设置持久化。
8. 点击两次**全部恢复默认**回到初始状态。

设置会应用到使用该配置的所有浏览器。配置不支持保存设置时，页面会显示“仅本次会话”。

## 存储与隐私

| 数据 | 位置 |
| --- | --- |
| 配色、强调色、透明度、模糊度、品牌 | 配置设置文档，命名空间 `ui-studio`，字段 `customization` |
| 字号 | `ui-theme` 设置命名空间，与“通用 → 外观”共享 |
| 上传的背景 | `$DSH_HOME/ui-studio/background.bin` 与 `background.json`（默认 `~/.dsh/ui-studio/`） |
| 背景路由 | DSH Web 服务器上的 `POST/GET/DELETE /ui-studio/background` |

- 插件**不发起外部网络请求**，不收集遥测。
- 不读取会话、消息、凭据或模型数据。
- 背景路由校验上传标记；上传/删除还校验页面来源或 loopback 写法。背景通过 DSH Web 服务器的绑定地址提供。
- 如果 DSH 绑定到局域网地址，能访问该服务器的人可以获取当前背景图片；上传和删除仍需要上传标记和同源请求。
- 背景文件由使用该插件的配置共享，最后一次上传生效。可在页面中移除或在插件重置时删除。
- 禁用插件会移除配色、玻璃层、背景层和品牌，但保留背景文件和字号。字号属于“通用 → 外观”，这是有意设计。

## 兼容性与限制

- 已在 DeepSeek Harness **`0.2.2-rc.3`**（Desktop 配置）和 **`0.2.2-rc.4`**（Linux 上的 Web 配置）中测试。使用公开的 Client 服务 `slots`、`locale`、`theme`、`configForms`，以及 Host 的 `settings`、`webServer` 服务；未来 DSH 若调整这些接口，可能需要更新。
- 主题是**部分覆盖**：主界面、层级、侧边栏、卡片、输入框、用户气泡和设置卡片为玻璃；菜单沿用 DSH 自带材质；悬浮卡片和通知保持不透明；部分宿主界面可能保留基础材质。
- 自定义强调色会做对比度调整，实际颜色可能不同于所选十六进制值。
- 设置面板保持不透明并沿用当前配色，不受透明度和模糊度影响。
- 工作台面板（代码与文档预览、文件、终端、浏览器）保持不透明，不受透明度和模糊度影响。
- 背景文件由使用该插件的配置共享，目前没有按配置分离的媒体目录。
- MP4/WebM 播放取决于 Chromium 构建和编解码器；不支持时回退到渐变背景。
- 仓库中的预览图是示意图，不是实际截图。
- 插件不替换应用根节点，也不追加第二套应用；使用 DSH 插槽、主题令牌和一个固定背景层。

## 开发

没有构建步骤。Client 半边是手写的 lazy-CJS 模块，Host 半边是 Node ESM。

```text
dsh-ui-studio/
├── client.js            # 设置页、store、玻璃背景层、主题应用
├── index.js             # Host 配置 + /ui-studio/background 路由
├── cordis.patch.yml     # 插入 ui-studio 行
├── package.json
├── locale/              # 插件管理器元数据（en、zh）
├── icon.svg
├── docs/                # 详情图片和本地化详情文档
├── test/check.mjs       # 语法、清单、语言包、SVG 与 Config 检查
└── pnpm-lock.yaml
```

```sh
pnpm install
pnpm test
```

`pnpm test` 会检查两半的语法、清单和语言包 JSON、SVG、补丁行，并导入 Host 半边确认导出的 `Config` schema。

需要运行中 DSH 的手工检查：

- Client Inspect 中 `ui-studio` 的 `settings.section` 和 `settings.section.icon` 已激活。
- **设置 → 界面工作室**页面可打开；配色、透明度、模糊度、上传和重置可用。
- 没有背景时 `/ui-studio/background` 返回 404；上传后返回原始字节，支持字节范围；DELETE 后返回 204。

问题和 PR 欢迎提交到 https://github.com/MiraculousGu/dsh-ui-studio/issues。

## 许可证

MIT，详见 [LICENSE](LICENSE)。
