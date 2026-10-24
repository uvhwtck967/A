// XIV 节制 — episode plan (series episode 21). Shot focus points are scan px of scans/RWS_Tarot_14_Temperance.jpg (1106x1920).
// Coordinates are first-pass estimates for the storyboard; re-measure on a marked-up scan (SOP 3.2) before assets.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §14:
//   "A winged angel, with the sign of the sun upon his forehead and on his breast the square and triangle of the
//    septenary. I speak of him in the masculine sense, but the figure is neither male nor female. It is held to be
//    pouring the essences of life from chalice to chalice. It has one foot upon the earth and one upon waters, thus
//    illustrating the nature of the essences. A direct path goes up to certain heights on the verge of the horizon,
//    and above there is a great light, through which a crown is seen vaguely."
//   "It is called Temperance, fantastically, because, when the rule of it obtains in our consciousness, it tempers,
//    combines and harmonizes the psychic and material natures."
//   divinatory (Part III): "Economy, moderation, frugality, management, accommodation. Reversed: … disunion,
//    unfortunate combinations, competing interests."
// Upright follows the mainstream modern RWS reading (blending, balance, moderation / the middle way);
// reversed (imbalance, excess, haste) is the modern consensus, close to Waite's "disunion … competing interests".
// Trivia: the square and triangle on the breast — Waite's "septenary" (4 + 3 = 7).

const OPEN_DUR = 2.0; // water flows from the raised cup into the lower one, light droplets (see layers.tsx)

const CENTER = [553, 900]; // card centre (full shot)
const CUPS = [545, 720]; // both cups and the stream between them
const STREAM = [560, 680]; // the wavy stream, close
const FACE = [500, 300]; // face, sun disc on the forehead, halo rays
const BREAST = [530, 560]; // square and triangle on the robe
const FEET = [620, 1460]; // one foot on the bank, one in the pool
const WATER_FOOT = [530, 1500]; // the foot in the water
const PATH = [150, 1300]; // the path winding up from the pool
const PATH_TOP = [190, 1120]; // where the path meets the mountains
const LIGHT = [180, 1030]; // the great light with the faint crown
const POOL = [330, 1560]; // the pool

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: STREAM, z: 5.6, z1: 5.8, fx: ["pour"], desc: "两杯之间的水流特写；第 1 帧水从高处的杯子倾出，波纹状水流落进低处的杯子，杯口溅起细小光点；水声" } },
  { kind: "line", style: "hook", zh: "水从一只杯子，", en: "Water flows from one cup", pad: 0.2, shot: { pull: true, fx: ["pour"], desc: "从水流拉远到整张牌，水流不断" } },
  { kind: "line", style: "hook", zh: "缓缓流进另一只。", en: "slowly into the other.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["pour", "pool"], desc: "整张牌，静止停留；水流不断，脚边池水泛起细纹" } },
  { kind: "names", zh: "它的含义，藏在杯子、水岸与小路之中。", names: ["杯子", "水岸", "小路"], en: "Its meaning lies in the cups, the water's edge, and the path.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["pour"], desc: "同一镜头，不切；两只杯子、双脚、远方小路依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "两只杯子", meaning: "调和", en: "THE TWO CUPS · BLENDING" },
  { kind: "line", zh: "天使双手各持一只金杯。", en: "The angel holds a golden cup in each hand.", shot: { f: CUPS, z: 4.8, z1: 5.0, fx: ["pour", "glint"], desc: "两只金杯与水流同框，缓慢推近；金杯边缘闪光" } },
  { kind: "line", zh: "韦特说，杯中倒的是“生命的精华”。", en: "Waite calls it pouring \"the essences of life\".", shot: { f: STREAM, z: 6.5, z1: 6.7, fx: ["pour"], desc: "直切水流特写：波纹状水流从上杯流向下杯，水面细光流动" } },
  { kind: "line", zh: "它调和精神与物质，使两者相融。", en: "It tempers and harmonizes the spirit and the material.", shot: { f: FACE, z: 5.0, z1: 5.2, fx: ["radiant"], desc: "直切天使脸部特写：额头的太阳标记与头顶光芒缓缓呼吸" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "水与岸", meaning: "平衡", en: "EARTH AND WATER · BALANCE" },
  { kind: "line", zh: "天使一脚踏在岸上，一脚踩进水里。", en: "One foot stands on the bank, the other in the water.", shot: { f: FEET, z: 5.0, z1: 5.2, fx: ["pool"], desc: "双脚特写：右脚踏岸，左脚入水，脚边泛起细小涟漪" } },
  { kind: "line", zh: "一边坚实，一边流动。", en: "One side is firm, the other flowing.", shot: { f: WATER_FOOT, z: 7.0, z1: 7.2, fx: ["pool", "sweep"], desc: "直切入水的脚特写：一圈圈涟漪荡开，水面波光" } },
  { kind: "line", zh: "站在两者之间，才能保持平衡。", en: "Standing between the two, it keeps its balance.", shot: { f: FEET, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["pour", "pool"], desc: "从双脚缓缓拉回整张牌：脚下涟漪、手中水流同时在动" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "远方小路", meaning: "中道", en: "THE DISTANT PATH · THE MIDDLE WAY" },
  { kind: "line", zh: "池边一条小路，蜿蜒通向远山。", en: "From the pool, a path winds up toward the mountains.", shot: { f: PATH, f1: PATH_TOP, z: 5.0, z1: 5.2, fx: ["pathLight"], desc: "小路特写，镜头沿小路缓缓向上横摇；一道微光沿路向远山移动" } },
  { kind: "line", zh: "尽头的光里，隐约有一顶王冠。", en: "In the light at its end, a crown is faintly seen.", shot: { f: LIGHT, z: 6.0, z1: 6.2, fx: ["radiant", "crownGlow"], desc: "直切山顶光芒特写：光芒旋转，光中的王冠轮廓淡淡亮起" } },
  { kind: "line", zh: "不走极端，一步一步，也能抵达。", en: "Without going to extremes, step by step, it can be reached.", shot: { f: PATH_TOP, f1: LIGHT, z: 5.0, z1: 5.3, fx: ["pathLight", "radiant"], desc: "直切小路上段，缓慢推向远方的光；微光沿路抵达光芒" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "失衡与过度", en: "REVERSED · IMBALANCE, EXCESS", rev: true },
  { kind: "line", zh: "杯子还在，水流却乱了。", en: "The cups remain, but the stream is unsettled.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "spill"], desc: "倒置全牌，寒霜从边缘蔓延；水流抖动、时断时续" } },
  { kind: "line", zh: "一边倒得太多，一边接不住。", en: "One side pours too much, the other can't hold it.", shot: { f: CUPS, z: 4.8, z1: 5.0, rev: true, fx: ["spill"], desc: "直切倒置的两杯特写：水流变粗，几滴水溅出杯外" } },
  { kind: "line", zh: "正位时，水在两杯间平稳流动。", en: "Upright, the water flows steadily between the cups.", shot: { f: STREAM, z: 6.5, z1: 6.7, flash: true, fx: ["pour"], desc: "闪回正位水流特写（原彩），水流重新平稳" } },
  { kind: "line", zh: "失去分寸，就容易走向极端。", en: "Without measure, it is easy to go to extremes.", shot: { f: FEET, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的双脚特写，池水涟漪停住" } },
  { kind: "line", zh: "逆位象征失衡、过度与急于求成。", en: "Reversed, it stands for imbalance, excess and haste.", shot: { f: PATH, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的小路特写，路上的微光消失，画面静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.31 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "韦特说，胸前的方与三角代表“七”。", en: "Waite says the square and triangle on the breast stand for seven.", shot: { f: BREAST, z: 5.0, z1: 5.2, fx: ["septenary"], desc: "正位胸前特写：方框四条边、三角三条边依次描金亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XIV lights, "已收录 21 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
