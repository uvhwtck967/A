# 交接文档：渲染《塔罗图鉴》成片（本次：XVII 星星）

> 给接手的人或模型看的。目标：**在本机把 `tarot-atlas` 工程渲染成最终的 MP4**。
> 文案、分镜、素材都已经定稿，**不要修改 `cards/` 和 `engine/` 里的内容**。只按下面的步骤安装、生成音效、渲染、检查。

---

## 0. 本次要交付的成片

| 期 | 牌的 id | 输出文件 | 预期时长 | 预期帧数 |
|---|---|---|---|---|
| XVII 星星（系列第 6 期） | `17-star` | `out/17-star/星星_音效版.mp4` | 约 1:21.2 | 2436 |

工程里还有女祭司（`02-high-priestess`）、恋人（`06-lovers`）、倒吊人（`12-hanged-man`）、死神（`13-death`）和高塔（`16-tower`），流程完全一样。只有在被要求时才渲染它们。下文命令里的 `<id>` 本次一律是 `17-star`。

---

## 1. 环境要求

| 软件 | 版本 | 用途 | 是否必须 |
|---|---|---|---|
| Node.js | 18 或更高（开发时用的是 24） | 渲染、生成音效 | 必须 |
| npm | 跟 Node 一起安装 | 安装依赖 | 必须 |
| Chrome 或 Edge | 任意新版本 | 无头浏览器逐帧截图 | 可选，没有时 Remotion 会自动下载一个（需要联网一次） |
| Python 3 + numpy、opencv-python、Pillow | — | 只在重新处理牌面素材时用 | **本次不需要** |
| ffmpeg | — | 只在检查音量时用（Remotion 自带编码器，渲染不需要） | 可选 |

磁盘：工程约 50 MB，`node_modules` 约 300 MB，每部成片约 150 MB。
时间：渲染一部约 8–15 分钟，取决于 CPU。

---

## 2. 步骤

在工程根目录 `tarot-atlas/` 下执行（命令在 Windows PowerShell、macOS、Linux 上都通用）：

```bash
# 1. 安装依赖（用 lock 文件，保证版本一致）
npm ci

# 2. 生成这一期的音效（写入 public/cards/17-star/sfx.wav，约 15 MB）
node scripts/sfx.mjs 17-star

# 3. 渲染成片
node scripts/render.mjs 17-star
```

正常输出：
- 第 2 步：`17-star: sfx.wav 81.20 s, peak 0.645`
- 第 3 步：`rendering 2436 frames → …星星_音效版.mp4`，接着是 `0% 10% … 100%`，最后是 `done — 1xx.x MB`

### 指定浏览器（可选）
默认会自动寻找本机的 Chrome 或 Edge。要指定时，设置环境变量 `REMOTION_BROWSER`：

```bash
# Windows PowerShell
$env:REMOTION_BROWSER = "C:/Program Files/Google/Chrome/Application/chrome.exe"
# macOS / Linux
export REMOTION_BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### 只想先试一小段（可选）
```bash
node scripts/render.mjs 17-star 10      # 只渲染前 10 秒，输出到同一个文件名
node scripts/still.mjs 17-star 0.1 25.5 42.5 53   # 渲染几张单帧到 out/17-star/stills/
```

---

## 3. 渲染完成后的检查

1. **文件存在且大小合理**：`out/17-star/星星_音效版.mp4`，大小约 120–180 MB。
2. **时长约 81.2 秒**，1920×1080，30fps，带 AAC 音轨。
3. （可选，需要 ffmpeg）音量：
   ```bash
   ffmpeg -i "out/17-star/星星_音效版.mp4" -af volumedetect -vn -f null -
   ```
   `mean_volume` 约 -22 dB，`max_volume` 不高于 -1 dB 为正常。路径里有中文，部分 Windows 版 ffmpeg 打不开，可以先复制到纯英文路径再测。
4. 打开视频快速看几处，对照 `out/17-star/分镜.md`（用户定稿版）：
   - 0:00–0:01.8：第 1 帧左手水壶的水已落进池塘，涟漪荡开，有水声
   - 正位全程原彩、整体微暗；两道水流上一直有细小的亮点顺流而下，池面涟漪缓慢扩散
   - 约 0:16.7–0:19：右侧小星逐颗闪烁；约 0:37.6–0:47.5：鸟的翅膀轻扇、树冠轻摆，鸟身边有柔光；翅膀和树冠周围不应有缺口或重影
   - 约 0:47.5：整张牌倒转 180°，换成更暗、偏冷的夜色版；逆位里水流仍在流动，但更暗
   - 1:06.3 起两张牌并排；1:09.9 正位整牌配“精神的馈赠”字幕；1:14.4–1:17.6 图鉴，第 XVII 格点亮，“已收录 6 / 22”约从 1:16.2 起完整显示到 1:17.2 左右
   - 1:17.6 起：下期预告月亮，持续约 3.6 秒（这是用户定稿的时间，不是旧 SOP 的 1:16.7 / 4.5 秒；`docs.mjs` 打出的提示可以忽略）

---

## 4. 常见问题

| 现象 | 处理 |
|---|---|
| `npm ci` 报 esbuild 相关错误，或渲染时提示 esbuild 无法运行 | 执行 `npm rebuild esbuild`。新版 npm 可能拦截安装脚本，`package.json` 的 `allowScripts` 已经放行 esbuild；仍被拦截时执行 `npm approve-scripts esbuild` |
| `Failed to launch the browser process` | 浏览器路径不对，或 Edge 正在后台自动更新。用 `REMOTION_BROWSER` 指定一个 Chrome，或者不设置，让 Remotion 自动下载 |
| 渲染显示 100%，但找不到视频文件 | 不要改 `scripts/render.mjs` 里的 `outputLocation` 参数名。写成 `output` 不会报错，但也不会写出文件 |
| 渲染出来没有声音，或报找不到 `sfx.wav` | 漏了第 2 步 `node scripts/sfx.mjs 17-star` |
| `close-up … has zoom …; use at least 4.55` | 有人改了 `plan.js` 的镜头缩放。改回原值，不要改分镜 |
| 内存不足、渲染很慢 | 不用改代码，设环境变量 `RENDER_THREADS`（默认 4）。内存不足就改小，如 `RENDER_THREADS=2 node scripts/render.mjs 17-star`；机器性能好可以调大（如 8） |
| `sfx.mjs` 报 `non-finite sample` | 音效脚本里的进度值超出了 0–1。本次交付的版本没有这个问题，出现时说明脚本被改过 |

---

## 5. 工程结构速览（只需了解，不用改）

```
tarot-atlas/
  engine/            所有期共用的引擎：镜头、字幕、章节卡、图鉴、预告、通用动效
  cards/<id>/        每期的数据：plan.js（文案与镜头）、card.json、layers.tsx（专属动画）、sound.mjs（专属音效）
  public/cards/<id>/ 牌面素材（已处理好的 art.png、抠出的人物等）
  public/fonts/      字体
  scans/             韦特原版扫描图（1909 年，公有领域），只在重新处理素材时用
  scripts/           sfx.mjs（音效）· render.mjs（成片）· still.mjs（单帧）· docs.mjs（分镜）· restyle.py（素材处理）
  src/               Remotion 入口和注册表
  out/<id>/分镜.md   已确认的分镜，用来对照成片
```

更多说明见 `README.md`。

### 重新处理素材（本次不需要，仅备查）
```bash
python -I scripts/restyle.py scans/Star_clothed2.png cards/17-star
python -I cards/17-star/assets.py scans/Star_clothed2.png   # 夜色版重调、翅膀和树冠精灵图、水流遮罩
```
两条必须按顺序一起跑（assets.py 会在 restyle.py 刚写出的 art.png 上挖洞补天空，单独重跑会出错）。它们会覆盖 `public/cards/17-star/` 下的图片和 `cards/17-star/generated.json`、`fx.json`。

---

## 6. 交付时请回报

- 成片路径、文件大小、时长
- 用的哪个浏览器（或是否自动下载）
- 第 3 节检查中发现的任何异常（附时间点）
