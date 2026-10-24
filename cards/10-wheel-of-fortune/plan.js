// X 命运之轮 — episode plan (series episode 19). Shot focus points are scan px of
// scans/RWS_Tarot_10_Wheel_of_Fortune.jpg (1104x1920, Wikimedia Commons, 1909 scan, public domain).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §10:
//   "the symbolic picture stands for the perpetual motion of a fluidic universe and for the flux of human life.
//    The Sphinx is the equilibrium therein."
//   "The transliteration of Taro as Rota is included on the wheel" (the letters T-A-R-O on the rim; read from
//    the R they give ROTA, Latin "wheel").
//   Typhon in his serpent form descends on the left; Hermanubis (jackal-headed) rises on the right.
//   The four Living Creatures (angel, eagle, bull, lion) sit in the corners, each with a book.
//   divinatory: "Destiny, fortune, success, elevation, luck, felicity. Reversed: Increase, abundance, superfluity."
// Upright follows the mainstream modern RWS reading (cycles and change; rise and fall; balance within change);
// reversed (setbacks, loss of control, resisting change) is the modern consensus — Waite's own reversed reading
// differs, so the captions keep to "被解读为" where needed.

const OPEN_DUR = 2.0; // the wheel is already spinning on frame 1 and slows back to its printed position (see layers.tsx)

const CENTER = [552, 900]; // card centre (full shot)
const WHEEL = [540, 935]; // the wheel, centre of the disc (outer radius about 350)
const HUB = [544, 935]; // hub and the eight spokes
const RIM_T = [544, 650]; // the T at the top of the rim, sphinx's feet above it
const SNAKE = [110, 960]; // the yellow serpent sliding down the left side
const ANUBIS = [880, 1080]; // jackal-headed Hermanubis rising on the right (head at [980, 930])
const SPHINX = [485, 380]; // the blue sphinx on top of the wheel, sword in hand
const FACE = [478, 262]; // sphinx head and the sword hilt

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: HUB, z: 5.0, z1: 5.2, fx: ["spin"], desc: "轮心特写；第 1 帧轮盘已在转动，辐条掠过画面，逐渐减速、停回原位；木轮咔嗒声由密到疏" } },
  { kind: "line", style: "hook", zh: "轮盘转动的时候，", en: "As the wheel turns,", pad: 0.2, shot: { pull: true, fx: ["turn", "clouds"], desc: "从轮心拉远到整张牌，轮盘余势轻转，云朵缓缓飘移" } },
  { kind: "line", style: "hook", zh: "有的上升，有的下落。", en: "some things rise, and some fall.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["slither", "rise"], desc: "整张牌，静止停留；左侧蛇身微微游动，右侧阿努比斯缓缓上移" } },
  { kind: "names", zh: "它的含义，藏在轮盘、蛇与阿努比斯、斯芬克斯之中。", names: ["轮盘", "蛇与阿努比斯", "斯芬克斯"], en: "Its meaning lies in the wheel, the serpent and Anubis, and the sphinx.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["clouds"], desc: "同一镜头，不切；轮盘、蛇与阿努比斯、斯芬克斯依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "轮盘", meaning: "循环", en: "THE WHEEL · CYCLES" },
  { kind: "line", zh: "云层中央，悬着一只轮盘。", en: "Amid the clouds hangs a wheel.", shot: { f: WHEEL, z: 4.6, z1: 4.75, fx: ["turn", "clouds"], desc: "轮盘整体特写，缓慢推近；轮盘极慢地转动，四周云朵飘移" } },
  { kind: "line", zh: "八根辐条，从轮心向外伸展。", en: "Eight spokes reach out from the hub.", shot: { f: HUB, z: 6.0, z1: 6.2, fx: ["turn"], desc: "直切轮心与辐条特写，辐条缓缓转过画面" } },
  { kind: "line", zh: "象征世界的运转与人生起伏。", en: "It stands for the turning world and the ups and downs of life.", shot: { f: RIM_T, z: 5.2, z1: 5.4, fx: ["turn", "glint"], desc: "直切轮缘顶端的 T 字特写，轮缘一道金光扫过" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "蛇与阿努比斯", meaning: "起落", en: "THE SERPENT AND ANUBIS · RISE AND FALL" },
  { kind: "line", zh: "左边，一条蛇顺着轮盘滑落。", en: "On the left, a serpent slides down the wheel.", shot: { f: SNAKE, z: 5.0, z1: 5.2, fx: ["slither"], desc: "左侧黄蛇特写，蛇身波浪般游动，缓缓下移" } },
  { kind: "line", zh: "右边，胡狼头的阿努比斯在升起。", en: "On the right, jackal-headed Anubis is rising.", shot: { f: ANUBIS, z: 5.0, z1: 5.2, fx: ["rise"], desc: "直切右侧阿努比斯特写，身体随轮盘缓缓上移，红色身躯轻轻起伏" } },
  { kind: "line", zh: "一降一升，处境总在变化。", en: "One falls, one rises; circumstances keep changing.", shot: { f: WHEEL, z: 4.6, z1: 4.75, fx: ["slither", "rise", "turn"], desc: "直切轮盘与两侧同框，蛇向下、阿努比斯向上，轮盘轻转" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "斯芬克斯", meaning: "变化中的平衡", en: "THE SPHINX · BALANCE WITHIN CHANGE" },
  { kind: "line", zh: "轮顶坐着持剑的斯芬克斯。", en: "At the top sits the sphinx, holding a sword.", shot: { f: SPHINX, z: 5.0, z1: 5.2, fx: ["glint"], desc: "斯芬克斯全身特写，剑身一道金属闪光" } },
  { kind: "line", zh: "轮子在转，它却安坐不动。", en: "The wheel turns, yet it sits still.", shot: { f: FACE, z: 7.0, z1: 7.2, fx: ["turn"], desc: "直切斯芬克斯头部与剑柄特写，画面下缘轮盘缓缓转过" } },
  { kind: "line", zh: "韦特称它为变化中的平衡。", en: "Waite calls it the balance within change.", shot: { f: SPHINX, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["pages", "clouds"], desc: "从斯芬克斯缓缓拉回整张牌，四角生物手中的书页轻轻翻动" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "逆境与抗拒变化", en: "REVERSED · SETBACKS, RESISTING CHANGE", rev: true },
  { kind: "line", zh: "轮盘倒悬，转得越来越慢。", en: "The wheel hangs upside down, turning ever slower.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "turnSlow"], desc: "倒置全牌，寒霜从边缘蔓延；轮盘转动逐渐变慢，几乎停住" } },
  { kind: "line", zh: "曾经上升的，正在下沉。", en: "What once rose is now sinking.", shot: { f: ANUBIS, z: 5.0, z1: 5.15, rev: true, fx: ["clouds"], desc: "直切倒置的阿努比斯特写，头朝下，身体不再上移；身后云朵缓慢飘过" } },
  { kind: "line", zh: "正位时，起落本是循环。", en: "Upright, rise and fall are part of the cycle.", shot: { f: WHEEL, z: 4.6, z1: 4.8, flash: true, fx: ["turn"], desc: "闪回正位轮盘特写（原彩），轮盘重新转动" } },
  { kind: "line", zh: "逆位时，人容易紧抓不放，", en: "Reversed, it is easy to cling on;", shot: { f: SPHINX, z: 5.0, z1: 5.15, rev: true, fx: ["clouds"], desc: "直切倒置的斯芬克斯特写，剑尖朝下；四周云朵缓慢飘过" } },
  { kind: "line", zh: "越抗拒变化，困境拖得越久。", en: "the more we resist change, the longer hard times last.", shot: { f: HUB, z: 6.0, z1: 6.1, rev: true, fx: ["turnSlow"], desc: "直切倒置的轮心特写，辐条艰难地挪动一下，又停住" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.39 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "TARO 换个起点，就成了拉丁语的“轮”ROTA。", en: "Start TARO from the R and it reads ROTA, Latin for \"wheel\".", shot: { full: true, z: 1.0, z1: 1.04, fx: ["letters"], desc: "正位整张牌，轮缘 T、A、R、O 四个字母依次亮起，再按 R、O、T、A 的顺序描金" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, X lights, "已收录 19 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
