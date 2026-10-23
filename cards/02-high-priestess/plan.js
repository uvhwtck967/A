// II 女祭司 — episode plan. Shot focus points are scan px of RWS_Tarot_02_High_Priestess.jpg (1117x1919).
// Copy and timings follow the user's signed-off storyboard (out/02-high-priestess/分镜.md, 2026-10-17):
// every segment carries an explicit dur so the cut lands on the table's times.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §2:
//   "She is seated between the white and black pillars—J. and B.—of the mystic Temple,
//    and the veil of the Temple is behind her: it is embroidered with palms and pomegranates."
//   "The scroll in her hands is inscribed with the word Tora … It is partly covered by her mantle,
//    to shew that some things are implied and some spoken."
//   divinatory: "Secrets, mystery, the future as yet unrevealed … silence, tenacity; mystery, wisdom, science.
//                Reversed: Passion, moral or physical ardour, conceit, surface knowledge."
// Upright follows the mainstream modern RWS reading (balance between opposites, mystery, inner wisdom);
// reversed (inner turmoil, ignoring one's own feelings, avoidance) is the modern consensus.
// Trivia: B/J = Boaz and Jachin, the bronze pillars at the porch of Solomon's temple (1 Kings 7:21).

const OPEN_DUR = 2.2; // the veil billows from the first frame; no cut-out action (see layers.tsx)

const PIL_B = [140, 800]; // black pillar, letter B
const PIL_J = [910, 830]; // white pillar, letter J
const VEIL_TOP = [560, 250]; // top pomegranate on the veil
const VEIL_MID = [560, 420];
const VEIL_SIDE = [720, 700]; // pattern near the veil's right edge
const SEA = [828, 898]; // the strip of water visible past the veil's edge
const FACE = [547, 613];
const TORA = [515, 1025]; // the letters on the scroll
const MANTLE = [612, 1058]; // where her robe covers the scroll
const SCROLL = [560, 1060]; // hand, scroll and robe together
const CENTER = [545, 911]; // card centre (a reversed full card)
const MOON_REV = [560, 1400]; // crescent, near the top once reversed (kept inside the picture)

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: VEIL_MID, z: 4.8, z1: 5.0, desc: "整幅帷幕随风轻轻起伏，石榴与棕榈纹样随布面移动；人物与双柱保持静止，帷幕不掀开；轻风与布料声", fx: ["ripple"] } },
  { kind: "line", style: "hook", zh: "帷幕高挂，奥秘藏于其后。", en: "The veil hangs high, concealing mysteries beyond.", dur: 2.3, shot: { f: VEIL_TOP, z: 5.0, z1: 5.5, link: true, desc: "镜头推近帷幕，完整保留遮挡关系，纹样随布面起伏", fx: ["ripple"] } },
  { kind: "line", style: "hook", zh: "女祭司静坐其前，不发一言。", en: "The High Priestess sits before it in silence.", dur: 3.0, shot: { full: true, z: 1.1, z1: 1.0, link: true, desc: "拉远到整张牌，女祭司静坐于双柱之间，帷幕继续轻轻起伏" } },
  { kind: "names", zh: "她的含义，藏在双柱、帷幕与卷轴之间。", names: ["双柱", "帷幕", "卷轴"], en: "Her meaning lies in the pillars, the veil, and the scroll.", dur: 3.7, shot: { full: true, desc: "整张牌；双柱、帷幕、卷轴依次局部提亮" } },
  { kind: "title", dur: 1.8, noFlip: true, shot: { full: true, z: 1.0, z1: 1.04, fx: ["numeral"], desc: "整张牌定格，突出顶部 II，出现中英文牌名" } },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "双柱", meaning: "平衡", en: "THE PILLARS · BALANCE" },
  { kind: "line", zh: "两根立柱，分列她的左右。", en: "Two pillars stand on either side of her.", dur: 2.6, shot: { f: PIL_B, f1: PIL_J, z: 7.0, z1: 7.2, desc: "从黑柱横移到白柱，呈现两根立柱分列人物左右", fx: ["sweep"] } },
  { kind: "line", zh: "一黑一白，呈现相对的两端。", en: "One black, one white, they represent opposing forces.", dur: 2.8, shot: { full: true, z: 1.12, z1: 1.05, link: true, desc: "拉远，两根柱子与人物同时入画，黑白两侧依次提亮", fx: ["pillars"] } },
  { kind: "line", zh: "她端坐其间，不偏不倚。", en: "She sits upright between them, favoring neither side.", dur: 2.9, shot: { full: true, z: 1.08, z1: 1.45, desc: "双柱与人物保持同框，镜头沿中央轴线轻推，不裁掉两侧柱子" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "帷幕", meaning: "神秘", en: "THE VEIL · MYSTERY" },
  { kind: "line", zh: "一道帷幕，垂在她身后。", en: "A veil hangs behind her.", dur: 2.5, shot: { f: VEIL_TOP, f1: VEIL_MID, z: 5.6, z1: 5.8, desc: "帷幕上端特写，镜头沿布面缓慢下移", fx: ["ripple"] } },
  { kind: "line", zh: "遮住了宽阔的水面。", en: "It conceals the broad expanse of water beyond.", dur: 2.6, shot: { f: VEIL_SIDE, f1: SEA, z: 6.0, z1: 6.4, link: true, desc: "从帷幕纹样移向边缘，呈现原图边侧可见的水面与遮挡关系，不揭幕、不补画幕后景色" } },
  { kind: "line", zh: "如同她的想法，深藏而不言。", en: "Like her thoughts, held deep within and left unspoken.", dur: 2.9, shot: { f: SEA, f1: FACE, z: 6.2, z1: 5.6, link: true, desc: "镜头由帷幕边缘移向她平静的脸，仍保留身后的帷幕" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "卷轴", meaning: "内在智慧", en: "THE SCROLL · INNER WISDOM" },
  { kind: "line", zh: "手握卷轴，心明真理。", en: "A scroll in her hands, truth clear in her heart.", dur: 2.9, shot: { f: TORA, z: 6.5, z1: 6.9, desc: "手与卷轴特写，突出原图可见的文字，不补画被遮住的部分", fx: ["reveal"] } },
  { kind: "line", zh: "部分显露，部分被衣袍遮住。", en: "Part is visible; part is concealed by her robe.", dur: 2.8, shot: { f: TORA, f1: MANTLE, z: 6.9, z1: 7.2, link: true, desc: "镜头从卷轴文字移向衣袍与卷轴的交界，突出遮挡关系" } },
  { kind: "line", zh: "智慧于心，无意向人彰显。", en: "Wisdom rests within, with no wish to display it.", dur: 2.9, shot: { f: SCROLL, z: 6.0, z1: 4.7, desc: "卷轴、手与衣袍保持同框，镜头缓慢拉远，人物姿态保持沉静" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it is reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度，保持原有色彩与亮度" } },
  { kind: "chapter", dur: 2.6, label: "逆 位", symbol: "", meaning: "内在失序", en: "REVERSED · INNER DISORDER", rev: true },
  { kind: "line", zh: "内心的平和，被纷扰打破。", en: "Inner peace is disturbed by turmoil.", dur: 2.6, shot: { f: CENTER, z: 1.0, z1: 1.6, rev: true, push: true, desc: "倒置全牌缓慢推近，停在人物与双柱之间；用镜头节奏表现不安，不改变原画人物表情" } },
  { kind: "line", zh: "忽略内心感受，一味向外寻求答案。", en: "Ignoring inner feelings, seeking answers only outside yourself.", dur: 5.1, shot: { f: MOON_REV, f1: CENTER, z: 5.0, z1: 4.6, rev: true, desc: "从倒置后位于画面上方的新月移向人物，再拉至双柱边缘；新月作为内在感受的辅助意象" } },
  { kind: "line", zh: "帷幕后的沉默，此刻变成了回避。", en: "Silence behind the veil now becomes avoidance.", dur: 2.6, shot: { f: VEIL_MID, z: 5.0, z1: 5.4, rev: true, desc: "倒置帷幕特写，保持遮挡关系，不揭开；镜头缓缓靠近布面", fx: ["ripple"] } },
  { kind: "line", zh: "心中有所察觉，却迟迟不愿面对。", en: "Sensing something within, yet unwilling to face it.", dur: 2.9, shot: { f: MANTLE, f1: CENTER, z: 5.4, z1: 1.0, rev: true, pullBack: true, desc: "从倒置卷轴被衣袍遮住的位置，拉回人物与全牌，停住" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.56 }, // lands the teaser on 1:16.7 (SOP 0.4)
  {
    kind: "atlas",
    lines: [
      ["冷知识：B 与 J，", "Trivia: B and J refer to"],
      ["取自所罗门圣殿的两根铜柱。", "the two bronze pillars of Solomon’s temple."],
    ],
  },
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
