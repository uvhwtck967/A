# tarot-atlas — 塔罗图鉴系列视频工程

所有期共用一套引擎，每张牌只写自己的数据和专属动效。制作流程见上一级目录的《塔罗图鉴_SOP.md》。

## 目录

```
engine/            所有期共用（一般不用改）
  Episode.tsx        整期视频：镜头、字幕、章节卡、一句话记住、图鉴、预告、氛围
  card.tsx           牌面：牌框、画面、通用动效、光晕、牌背、镜头限位
  fx.tsx             可复用动效：光芒、扫光、水面波光、闪光、飘动区域（旗帜/藤蔓）+ 描金
  schedule.js        时间表：字幕按字数定时，所有镜头/音效都从这里取时间
  types.ts           每张牌要提供的数据格式
cards/<NN-slug>/   每期一个文件夹
  card.json          牌名、画框、3 个光晕位置、一句话总结、图鉴、预告、通用动效配置
  plan.js            文案和镜头（PLAN）
  restyle.json       抠图和调色配置（交给 scripts/restyle.py）
  generated.json     restyle.py 自动生成，不要手改
  layers.tsx         这张牌的专属动画（死神：国王倒地+皇冠；倒吊人：摆动）
  sound.mjs          这张牌的开场音效和专属音效
  index.ts           把上面几样组装起来
public/cards/<id>/ 素材：art.png、精灵图、sfx.wav（脚本生成）
scripts/           restyle.py · sfx.mjs · docs.mjs · still.mjs · render.mjs · new-card.mjs · sheet.py
out/<id>/          成片、配乐卡点表、分镜、单帧
src/cards.ts       注册表：新牌加一行
```

## 常用命令

```bash
node scripts/new-card.mjs 02 high-priestess 女祭司 "THE HIGH PRIESTESS"   # 新建一期
python -I scripts/restyle.py <扫描图.jpg> cards/<id>                     # 调色 + 抠图
node scripts/sfx.mjs <id>                                                 # 音效
node scripts/docs.mjs <id>                                                # 配乐卡点表 + 分镜
node scripts/still.mjs <id> 1 5 20.5                                      # 单帧（秒）
python -I scripts/sheet.py out/<id>/sheet.jpg 4 out/<id>/stills/*.png     # 拼图检查
node scripts/render.mjs <id>                                              # 成片
```

## 镜头写法（plan.js 里的 shot）

| 字段 | 含义 |
|---|---|
| `f: [x, y]` | 焦点，扫描图像素；`f1` 为终点（横摇） |
| `z → z1` | 缩放，缓慢推近。特写最小 4.55，否则会露出牌框外背景（时间表会直接报错） |
| `full: true` | 整张牌；可加 `spin: 角度` 让牌缓慢转动 |
| `pull / reverse / flash / push` | 拉远到全牌 / 倒转 / 逆位中闪回正位 / 加速推进 |
| `rev: true` | 在倒置的牌上取景（坐标仍写正位的扫描图坐标） |
| `fx: [...]` | 这个镜头挂的动效，见下 |

通用 fx：`radiant`（光芒变亮）、`sweep`（扫光 + 水面波光）、`glint`（金属闪光）、`frostGrow`（寒霜，逆位用），以及 card.json 里飘动区域自己定义的名字（如死神的 `flutter`、`roseDraw`、`roseLit`，倒吊人的 `rustle`）。牌自己的 fx（如 `dust`、`sway`、`creak`）在 layers.tsx 用 `fx.level(名字)` 读取，在 sound.mjs 里配声音。
