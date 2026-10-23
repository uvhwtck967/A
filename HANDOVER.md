# 交接文档：渲染《塔罗图鉴》成片

> 给接手的人或模型看的。目标：**在本机把 `tarot-atlas` 工程渲染成最终的 MP4**。
> 文案、分镜、素材都已经定稿，**不要修改 `cards/` 和 `engine/` 里的内容**。只按下面的步骤安装、生成音效、渲染、检查。

---

## 0. 本次要交付的成片

| 期 | 牌的 id | 输出文件 | 预期时长 | 预期帧数 |
|---|---|---|---|---|
| 第 16 期 高塔（系列第 5 期） | `16-tower` | `out/16-tower/高塔_音效版.mp4` | 约 1:21.2 | 2436 |

工程里还有第 2 期女祭司（`02-high-priestess`）、第 6 期恋人（`06-lovers`）、第 12 期倒吊人（`12-hanged-man`）和第 13 期死神（`13-death`），流程完全一样。只有在被要求时才渲染它们。

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

# 2. 生成这一期的音效（写入 public/cards/16-tower/sfx.wav，约 15 MB）
node scripts/sfx.mjs 16-tower

# 3. 渲染成片
node scripts/render.mjs 16-tower
```

正常输出：
- 第 2 步：`16-tower: sfx.wav 81.20 s, peak 0.645`
- 第 3 步：`rendering 2436 frames → …高塔_音效版.mp4`，接着是 `0% 10% … 100%`，最后是 `done — 1xx.x MB`

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
node scripts/render.mjs 16-tower 10      # 只渲染前 10 秒，输出到同一个文件名
node scripts/still.mjs 16-tower 1 12 39.3 52.9   # 渲染几张单帧到 out/16-tower/stills/
```

---

## 3. 渲染完成后的检查

1. **文件存在且大小合理**：`out/16-tower/高塔_音效版.mp4`，大小约 120–180 MB。
2. **时长约 81.2 秒**，1920×1080，30fps，带 AAC 音轨。
3. （可选，需要 ffmpeg）音量：
   ```bash
   ffmpeg -i "out/16-tower/高塔_音效版.mp4" -af volumedetect -vn -f null -
   ```
   `mean_volume` 约 -22 dB，`max_volume` 不高于 -1 dB 为正常。
   注意：路径里有中文，部分 Windows 版 ffmpeg 打不开，可以先把文件复制到纯英文路径再测。
4. 打开视频快速看几处，对照 `out/16-tower/分镜.md`：
   - 0:00–0:02：第 1 帧闪电一闪（轻微提亮，不刺眼），王冠从塔顶被掀起，翻转着飞到左上方的原画位置，摇晃几下后停住；原位没有黑影或残缺
   - 正位全程是原彩、整体微暗；王冠一直在半空轻微浮动，火滴缓慢下落、偶尔淡出再出现
   - 约 0:15 / 0:30：闪电再亮一次，有雷声；约 0:30–0:34 塔身和塔基有细尘、碎屑落下
   - 约 0:37–0:45：两个坠落的人身边，火滴带着淡淡的暖光飘落
   - 约 0:45：整张牌倒转 180°，画面换成更暗的夜色版；逆位里火焰变暗，但一直在跳动
   - 约 1:09–1:14：正位整牌定格，22 颗火滴逐颗点亮，之后切到图鉴，第 XVI 格点亮，显示"已收录 5 / 22"
   - 1:16.7 起：下期预告星星，持续约 4.5 秒

---

## 4. 常见问题

| 现象 | 处理 |
|---|---|
| `npm ci` 报 esbuild 相关错误，或渲染时提示 esbuild 无法运行 | 执行 `npm rebuild esbuild`。新版 npm 可能拦截安装脚本，`package.json` 的 `allowScripts` 已经放行 esbuild；仍被拦截时执行 `npm approve-scripts esbuild` |
| `Failed to launch the browser process` | 浏览器路径不对，或 Edge 正在后台自动更新。用 `REMOTION_BROWSER` 指定一个 Chrome，或者不设置，让 Remotion 自动下载 |
| 渲染显示 100%，但找不到视频文件 | 不要改 `scripts/render.mjs` 里的 `outputLocation` 参数名。写成 `output` 不会报错，但也不会写出文件 |
| 渲染出来没有声音，或报找不到 `sfx.wav` | 漏了第 2 步 `node scripts/sfx.mjs 16-tower` |
| `close-up … has zoom …; use at least 4.55` | 有人改了 `plan.js` 的镜头缩放。改回原值，不要改分镜 |
| 内存不足、渲染很慢 | 打开 `scripts/render.mjs`，把 `threads: 4` 改小（例如 2） |
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
python -I scripts/restyle.py scans/RWS_Tarot_16_Tower.jpg cards/16-tower
python -I cards/16-tower/assets.py scans/RWS_Tarot_16_Tower.jpg   # 王冠、火滴、火焰、闪电（原彩版 + 夜色版各一份）
```
它会覆盖 `public/cards/16-tower/` 下的图片和 `cards/16-tower/generated.json`。

---

## 6. 交付时请回报

- 成片路径、文件大小、时长
- 用的哪个浏览器（或是否自动下载）
- 第 3 节检查中发现的任何异常（附时间点）
