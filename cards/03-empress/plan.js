// III 皇后 — 系列第 13 期. Shot focus points are scan px of scans/RWS_Tarot_03_Empress.jpg (1123x1920).
// Series order (SOP §8): … 世界(10) → 愚者(11) → 魔术师(12) → 皇后(13) → 皇帝(14).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §3:
//   "A stately figure, seated, having rich vestments and royal aspect, as of a daughter of heaven and earth."
//   "Her diadem is of twelve stars, gathered in a cluster. The symbol of Venus is on the shield which rests near her."
//   "A field of corn is ripening in front of her, and beyond there is a fall of water."
//   "The sceptre which she bears is surmounted by the globe of this world."
//   She is "the inferior Garden of Eden, the Earthly Paradise".
// Upright follows the mainstream modern RWS reading (abundance; love, beauty and pleasure; nurturing);
// reversed (stagnation, over-dependence / smothering, neglecting oneself) is the modern consensus.
// Trivia: the twelve-star crown is Waite's own description (above); count is to be checked when cutting sprites.

const OPEN_DUR = 2.0; // a gust passes through the wheat field, stalks bend and spring back (see layers.tsx)

const CENTER = [561, 880]; // card centre (full shot)
const WHEAT = [600, 1560]; // the ripening wheat in the foreground
const WHEAT_L = [190, 1500]; // wheat to the left, under the shield
const SHIELD = [260, 1230]; // heart-shaped shield resting by the throne
const VENUS = [272, 1250]; // the Venus symbol on the shield
const GOWN = [700, 1100]; // gown patterned with pomegranates
const FACE = [516, 450]; // her face under the crown
const CROWN = [516, 320]; // diadem of twelve stars
const FALLS = [1010, 900]; // the waterfall coming out of the trees, right edge
const POOL = [990, 1210]; // where the falling water runs out at the bottom right
const TREES = [880, 430]; // the cypress wood behind her

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: WHEAT, z: 5.0, z1: 5.2, fx: ["wind"], desc: "麦田特写；第 1 帧一阵风从左到右吹过，麦穗依次弯下又弹回；风声 + 麦叶沙沙声" } },
  { kind: "line", style: "hook", zh: "麦田正在成熟，", en: "The wheat is ripening,", pad: 0.2, shot: { pull: true, fx: ["wind"], desc: "从麦田拉远到整张牌，麦浪继续起伏" } },
  { kind: "line", style: "hook", zh: "远处的瀑布从未停歇。", en: "and beyond it, the falls never stop.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["falls", "wind"], desc: "整张牌，静止停留；右侧瀑布流动，麦浪轻轻起伏" } },
  { kind: "names", zh: "它的含义，藏在麦田、金星盾牌与瀑布之中。", names: ["麦田", "金星盾牌", "瀑布"], en: "Its meaning lies in the wheat, the shield of Venus, and the waterfall.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["falls"], desc: "同一镜头，不切；麦田、盾牌、瀑布依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "麦田", meaning: "丰饶", en: "THE WHEAT · ABUNDANCE" },
  { kind: "line", zh: "皇后面前，是一片麦田。", en: "Before the Empress lies a field of wheat.", shot: { f: WHEAT, z: 5.0, z1: 5.25, fx: ["wind"], desc: "麦田特写，缓慢推近；麦穗随风摆动" } },
  { kind: "line", zh: "麦子正在慢慢成熟，", en: "The grain is slowly ripening,", shot: { f: WHEAT_L, z: 6.4, z1: 6.6, fx: ["wind", "sweep"], desc: "直切左侧麦穗细节特写，一道暖光从麦穗上扫过" } },
  { kind: "line", zh: "象征丰饶，与付出之后的收获。", en: "a sign of abundance, and of what grows from care.", shot: { f: WHEAT, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["wind"], desc: "从麦田缓缓拉回整张牌，皇后与整片麦田同框" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "金星盾牌", meaning: "爱与美", en: "THE SHIELD OF VENUS · LOVE AND BEAUTY" },
  { kind: "line", zh: "她身旁，靠着一面心形盾牌。", en: "Beside her rests a heart-shaped shield.", shot: { f: SHIELD, z: 5.0, z1: 5.2, fx: ["glint"], desc: "盾牌特写，固定；盾面一道金属闪光" } },
  { kind: "line", zh: "盾上是金星的符号。", en: "On it is the symbol of Venus.", shot: { f: VENUS, z: 7.0, z1: 7.2, fx: ["venusLit"], desc: "直切金星符号特写：圆环与十字描金亮起" } },
  { kind: "line", zh: "象征爱与美，也象征对生活的享受。", en: "It stands for love and beauty, and for enjoying life.", shot: { f: GOWN, z: 5.0, z1: 5.2, fx: ["sweep"], desc: "直切长袍特写：袍上的石榴纹样，柔光扫过" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "瀑布", meaning: "滋养", en: "THE WATERFALL · NURTURE" },
  { kind: "line", zh: "麦田之外，有一道瀑布。", en: "Beyond the wheat there is a waterfall.", shot: { f: FALLS, z: 5.4, z1: 5.6, fx: ["falls"], desc: "右侧瀑布特写：水从树林间落下，水流持续流动" } },
  { kind: "line", zh: "水从树林间流下，没有停歇。", en: "Water runs down through the trees without pause.", shot: { f: POOL, z: 6.0, z1: 6.2, fx: ["falls", "sweep"], desc: "直切瀑布下方水面特写，水面波光" } },
  { kind: "line", zh: "象征滋养，让万物得以生长。", en: "It stands for nurture, letting all things grow.", shot: { f: TREES, z: 5.0, z1: 5.2, fx: ["wind"], desc: "直切身后树林特写，树梢随风轻摆" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "停滞与过度依赖", en: "REVERSED · STAGNATION, OVER-DEPENDENCE", rev: true },
  { kind: "line", zh: "麦田还在，风却停了。", en: "The wheat is still there, but the wind has stopped.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；麦浪停住" } },
  { kind: "line", zh: "瀑布的水，流得越来越慢。", en: "The falling water slows.", shot: { f: FALLS, z: 5.4, z1: 5.55, rev: true, fx: ["falls"], desc: "直切倒置的瀑布特写，水流逐渐变慢" } },
  { kind: "line", zh: "正位时，她的照料让万物生长。", en: "Upright, her care lets everything grow.", shot: { f: WHEAT, z: 5.0, z1: 5.25, flash: true, fx: ["wind"], desc: "闪回正位麦田特写（原彩），麦浪重新起伏" } },
  { kind: "line", zh: "照料过了头，就成了依赖。", en: "Care taken too far turns into dependence.", shot: { f: SHIELD, z: 5.0, z1: 5.15, rev: true, fx: ["glint"], desc: "直切倒置的盾牌特写，金属光泽变暗" } },
  { kind: "line", zh: "也可能只顾照料别人，忘了自己。", en: "Or it can mean caring for others and forgetting oneself.", shot: { f: FACE, z: 6.0, z1: 6.15, rev: true, fx: ["radiant"], desc: "直切倒置的皇后脸部与星冠特写，星光微弱" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.5 }, // summary + focus dur land the teaser on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "韦特写道：她的王冠由十二颗星组成。", en: "Waite wrote that her crown is made of twelve stars.", dur: 4.96, shot: { full: true, z: 1.0, z1: 1.04, fx: ["starCount"], desc: "正位整张牌，王冠上的星逐颗亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, III lights, "已收录 13 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
