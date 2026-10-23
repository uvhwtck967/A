// XVII 星星 — episode plan. Shot focus points are px of scans/Star_clothed.png (955x1647), the user's clothed-figure
// version supplied 2026-10-21 (the 1909 scan shows the figure nude; RWS_Tarot_17_Star.jpg kept only for reference).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §17:
//   "A great, radiant star of eight rays, surrounded by seven lesser stars—also of eight rays."
//   "She is pouring Water of Life from two ewers, irrigating sea and land. Her left knee is on the land and her
//    right foot upon the water."
//   "Behind her is rising ground and on the right a shrub or tree, whereon a bird alights."
//   divinatory: "Loss, theft, privation, abandonment; another reading says—hope and bright prospects.
//    Reversed: Arrogance, haughtiness, impotence."
// Upright follows the mainstream modern RWS reading (hope after the Tower; healing/renewal; inspiration);
// reversed (disappointment, loss of faith, self-doubt) is the modern consensus.
// The bird as the ibis of Thoth (wisdom, inspiration) is a common modern reading, not Waite's own — the caption
// says "被解读为". Trivia: eight stars, each with eight rays (Waite, above).

const OPEN_DUR = 2.0; // water pours from the left ewer into the pool, ripples spread (see layers.tsx)

const CENTER = [478, 800]; // card centre (full shot)
const STAR = [490, 290]; // the great eight-rayed star
const STARS_R = [745, 330]; // lesser stars, right column
const POUR_L = [235, 1010]; // left ewer and the stream into the pool
const POOL = [260, 1200]; // ripples in the pool
const FIGURE = [430, 820]; // the kneeling woman, both ewers
const FOOT = [420, 1060]; // knee on land, foot on the water
const POUR_R = [790, 960]; // right ewer, water onto the land
const RIVULETS = [740, 1290]; // the water on land splitting into streams
const IBIS = [800, 500]; // bird on the tree, upper right
const TREE = [810, 580]; // the tree and the rising ground
const FACE = [340, 640]; // her face, looking down at the water

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: POUR_L, z: 5.6, z1: 5.8, fx: ["pour"], desc: "左手水壶特写；第 1 帧水流落进池塘，涟漪一圈圈荡开；水声" } },
  { kind: "line", style: "hook", zh: "高塔倒下之后，", en: "After the Tower falls,", pad: 0.2, shot: { pull: true, fx: ["pour", "twinkle"], desc: "从水壶拉远到整张牌，星星微微闪烁" } },
  { kind: "line", style: "hook", zh: "夜空里出现了星光。", en: "starlight appears in the night sky.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant", "twinkle"], desc: "整张牌，静止停留；大星光芒缓缓呼吸" } },
  { kind: "names", zh: "它的含义，藏在大星、倒水的女子与朱鹭之中。", names: ["大星", "倒水的女子", "朱鹭"], en: "Its meaning lies in the great star, the woman pouring water, and the ibis.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["twinkle", "streams"], desc: "同一镜头，不切；大星、女子、朱鹭依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "大星", meaning: "希望", en: "THE GREAT STAR · HOPE" },
  { kind: "line", zh: "夜空中央，是一颗八芒大星。", en: "At the centre of the sky shines a great eight-pointed star.", shot: { f: STAR, z: 5.0, z1: 5.25, fx: ["radiant"], desc: "大星特写，缓慢推近；光芒旋转、呼吸" } },
  { kind: "line", zh: "七颗小星，环绕在它四周。", en: "Seven lesser stars surround it.", shot: { f: STARS_R, z: 6.0, z1: 6.2, fx: ["twinkle"], desc: "直切右侧小星特写（大星一角入画），小星逐颗闪烁" } },
  { kind: "line", zh: "象征黑暗过后的希望。", en: "It stands for hope after the dark.", shot: { f: STAR, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["radiant"], desc: "从大星缓缓拉回整张牌，星光洒向原野" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "倒水的女子", meaning: "疗愈", en: "THE WATER BEARER · HEALING" },
  { kind: "line", zh: "她一膝跪在岸上，一脚踏入水中。", en: "One knee rests on the land, one foot on the water.", shot: { f: FOOT, z: 5.4, z1: 5.6, fx: ["pool"], desc: "膝与脚特写：脚下池面泛起细小波纹" } },
  { kind: "line", zh: "一壶水倒入池塘，一壶浇灌大地。", en: "One ewer pours into the pool, the other onto the land.", shot: { f: FIGURE, z: 4.6, z1: 4.75, fx: ["streams", "pool"], desc: "直切女子与两只水壶同框，两道水流同时流动" } },
  { kind: "line", zh: "象征身心在缓慢地恢复。", en: "It stands for body and mind slowly recovering.", shot: { f: RIVULETS, z: 6.0, z1: 6.2, fx: ["streams", "sweep"], desc: "直切地上的水流特写：水分成几道流向远处，水面波光" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "朱鹭", meaning: "灵感", en: "THE IBIS · INSPIRATION" },
  { kind: "line", zh: "她身后的树上，停着一只鸟。", en: "On the tree behind her, a bird has landed.", shot: { f: TREE, z: 7.0, z1: 7.2, fx: ["ibis"], desc: "右上树与山坡特写，树叶轻轻摆动，鸟微微扇翅" } },
  { kind: "line", zh: "它常被认作朱鹭，托特神的化身。", en: "It is often read as the ibis of Thoth.", shot: { f: IBIS, z: 9.5, z1: 9.7, fx: ["ibis"], desc: "直切朱鹭特写，翅膀轻扇" } },
  { kind: "line", zh: "在这里，被解读为灵感与指引。", en: "Here it is read as inspiration and guidance.", shot: { f: FACE, z: 7.0, z1: 7.2, fx: ["twinkle"], desc: "直切女子低头的脸部特写，头顶小星闪烁" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "失望与失去信心", en: "REVERSED · DISAPPOINTMENT, LOSS OF FAITH", rev: true },
  { kind: "line", zh: "星光变暗，水流停了下来。", en: "The starlight dims, and the water stops flowing.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；水流定住" } },
  { kind: "line", zh: "希望还在，只是暂时看不见。", en: "Hope is still there, just out of sight for now.", shot: { f: STAR, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的大星特写，光芒微弱，几乎不动" } },
  { kind: "line", zh: "正位时，星光照亮了整片原野。", en: "Upright, the starlight falls across the whole land.", shot: { f: STAR, z: 5.0, z1: 5.25, flash: true, fx: ["radiant"], desc: "闪回正位大星特写（原彩），光芒重新旋转" } },
  { kind: "line", zh: "失去信心时，便很难再向前走。", en: "Without faith, it is hard to keep going.", shot: { f: POOL, z: 5.4, z1: 5.55, rev: true, desc: "直切倒置的池塘特写，涟漪停住" } },
  { kind: "line", zh: "逆位象征失望，与对自己的怀疑。", en: "Reversed, it stands for disappointment and self-doubt.", shot: { f: FACE, z: 7.0, z1: 7.15, rev: true, desc: "直切倒置的女子脸部特写，静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.14 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "八颗星，每一颗都有八道光芒。", en: "Eight stars, each with eight rays.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["starCount"], desc: "正位整张牌，八颗星依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XVII lights, "已收录 6 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
