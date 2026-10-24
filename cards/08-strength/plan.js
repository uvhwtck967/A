// VIII 力量 — episode plan. Shot focus points are scan px of scans/RWS_Tarot_08_Strength.jpg (1114x1919).
// Series episode 17, released after VII 战车 (episode 16). Atlas shows "已收录 17 / 22".
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §8 "Strength, or Fortitude":
//   "A woman, over whose head there broods the same symbol of life which we have seen in the card of the
//    Hierophant [sic — the lemniscate is over the Magician], is closing the jaws of a lion."
//   "her beneficent fortitude has already subdued the lion, which is being led by a chain of flowers."
//   "For reasons which satisfy myself, this card has been interchanged with that of Justice, which is usually
//    numbered eight."
//   "the chain of flowers, which signifies, among many other things, the sweet yoke and the light burden"
//   "There is one aspect in which the lion signifies the passions, and she who is called Strength is the higher
//    nature in its liberation."
//   divinatory (Part III): "Power, energy, action, courage, magnanimity; also complete success and honors.
//    Reversed: Despotism, abuse of power, weakness, discord, sometimes even disgrace."
// Upright follows the modern RWS reading (gentle mastery / courage; inner strength; patience, compassion);
// reversed (self-doubt, weakness, loss of self-control) is the modern consensus, close to Waite's "weakness, discord".
// The lemniscate as "endless inner strength" is a modern reading — the caption says "被解读为".
// Trivia: Waite swapped the numbers of Strength and Justice (quoted above).
//
// Coordinates are first estimates from the scan; re-check them on a marked-up image before the asset pass (SOP 3.2).

const OPEN_DUR = 2.0; // the lion lifts its head with a low growl, her hands close its jaws, it settles (see layers.tsx)

const CENTER = [543, 872]; // card centre (full shot)
const HANDS = [370, 985]; // her hands on the lion's open jaws
const LION = [440, 1060]; // the lion's head and mane
const LION_BODY = [820, 1250]; // the lion's body and tail, lower right
const INF = [185, 375]; // the lemniscate over her head
const CROWN = [290, 460]; // her wreath of leaves and flowers
const FACE = [330, 555]; // her face, eyes lowered to the lion
const SASH = [470, 790]; // the flower chain at her waist
const CHAIN = [640, 930]; // the chain falling along her skirt to the lion

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: HANDS, z: 5.4, z1: 5.6, fx: ["growl", "calm"], desc: "双手与狮口特写；第 1 帧狮子仰头低吼、头部一挣，她双手轻轻按住，狮子慢慢安静；低吼声渐弱" } },
  { kind: "line", style: "hook", zh: "战车靠意志驾驭，", en: "The Chariot is driven by will;", pad: 0.2, shot: { pull: true, fx: ["calm", "garland"], desc: "从狮口拉远到整张牌，花链轻轻摆动" } },
  { kind: "line", style: "hook", zh: "力量却只用一双手。", en: "Strength needs only a pair of hands.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["breath", "garland"], desc: "整张牌，静止停留；狮子缓缓呼吸，花链轻摆" } },
  { kind: "names", zh: "含义藏在狮子、无限符号与花链里。", names: ["狮子", "无限符号", "花链"], en: "Its meaning lies in the lion, the infinity sign, and the chain of flowers.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["breath"], desc: "同一镜头，不切；狮子、无限符号、花链依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "狮子", meaning: "以柔克刚", en: "THE LION · GENTLE MASTERY" },
  { kind: "line", zh: "她双手捧着狮头，合上它的嘴。", en: "Her hands cradle the lion's head and close its jaws.", shot: { f: HANDS, z: 5.4, z1: 5.6, fx: ["calm"], desc: "双手与狮口特写，缓慢推近；狮头随呼吸轻微起伏" } },
  { kind: "line", zh: "传统上，狮子象征激情与本能。", en: "Traditionally, the lion stands for passion and instinct.", shot: { f: LION, z: 5.0, z1: 5.2, fx: ["breath", "mane"], desc: "直切狮头与鬃毛特写，鬃毛微微抖动" } },
  { kind: "line", zh: "她不靠蛮力，而是以柔克刚。", en: "She uses no force; gentleness overcomes it.", shot: { f: LION_BODY, z: 4.6, z1: 4.75, fx: ["breath", "tail"], desc: "直切狮身与尾巴，尾巴缓缓摆动，身体低伏" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "无限符号", meaning: "内在力量", en: "THE INFINITY SIGN · INNER STRENGTH" },
  { kind: "line", zh: "她的头顶，悬着一个无限符号。", en: "Above her head floats the sign of infinity.", shot: { f: INF, z: 6.0, z1: 6.2, fx: ["lemniscate"], desc: "无限符号特写，一道光沿 ∞ 的线条缓缓流过" } },
  { kind: "line", zh: "魔术师的头上，也有同样的符号。", en: "The Magician bears the same sign above his head.", shot: { f: CROWN, z: 6.0, z1: 6.2, fx: ["lemniscate", "leaves"], desc: "直切花冠与无限符号同框，花冠上的叶片轻轻颤动" } },
  { kind: "line", zh: "被解读为不竭的内在力量。", en: "It is read as an inner strength that never runs dry.", shot: { f: FACE, z: 6.4, z1: 6.6, fx: ["leaves", "radiant"], desc: "直切她低垂双眼的脸部特写，头顶微光呼吸" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "花链", meaning: "温柔", en: "THE CHAIN OF FLOWERS · GENTLENESS" },
  { kind: "line", zh: "腰间的花链，垂到狮子身上。", en: "The chain of flowers at her waist falls onto the lion.", shot: { f: SASH, f1: CHAIN, z: 5.0, z1: 5.2, fx: ["garland"], desc: "沿花链从腰间缓缓下摇到狮子鬃毛，花链轻摆" } },
  { kind: "line", zh: "韦特说，狮子正被花链牵着。", en: "Waite says the lion is being led by this chain of flowers.", shot: { f: CHAIN, z: 6.0, z1: 6.2, fx: ["garland", "glint"], desc: "直切花链与玫瑰特写，花朵逐朵微亮" } },
  { kind: "line", zh: "象征温柔而甘愿的约束。", en: "It stands for gentleness, and a bond freely accepted.", shot: { full: true, z: 1.0, z1: 1.05, fx: ["garland", "breath"], desc: "直切整张牌，她与狮子同框，花链与狮子一同轻轻起伏" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "自我怀疑与失控", en: "REVERSED · SELF-DOUBT, LOSS OF CONTROL", rev: true },
  { kind: "line", zh: "花链还在，狮子却抬起了头。", en: "The chain is still there, but the lion raises its head.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "restless"], desc: "倒置全牌，寒霜从边缘蔓延；狮头不安地抬起" } },
  { kind: "line", zh: "内心的冲动，不再听从引导。", en: "Inner impulses no longer follow her lead.", shot: { f: LION, z: 5.0, z1: 5.15, rev: true, fx: ["restless", "mane"], desc: "直切倒置的狮头特写，鬃毛抖动，呼吸变急" } },
  { kind: "line", zh: "正位时，一双手就让它安静。", en: "Upright, her hands alone are enough to calm it.", shot: { f: HANDS, z: 5.4, z1: 5.6, flash: true, fx: ["calm"], desc: "闪回正位双手与狮口特写（原彩），狮子重新安静" } },
  { kind: "line", zh: "失去从容，便开始怀疑自己。", en: "Without that composure, self-doubt creeps in.", shot: { f: INF, z: 6.0, z1: 6.15, rev: true, fx: ["lemniscate"], desc: "直切倒置的无限符号特写，光断断续续，忽明忽暗" } },
  { kind: "line", zh: "逆位象征软弱，与情绪的失控。", en: "Reversed, it stands for weakness and losing control.", shot: { f: CHAIN, z: 6.0, z1: 6.15, rev: true, fx: ["garland", "restless"], desc: "直切倒置的花链特写，花链被扯动、摆幅变大" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.73 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "韦特将它与正义对调，排在第八。", en: "Waite swapped it with Justice, placing it eighth.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["numeral"], desc: "正位整张牌定格，顶部 VIII 描金亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, VIII lights, "已收录 17 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
