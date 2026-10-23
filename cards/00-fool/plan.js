// 0 愚者 — episode plan (series episode 11, right after XXI 世界). Shot focus points are scan px of
// scans/RWS_Tarot_00_Fool.jpg (1144x1919, Wikimedia Commons). The figure is fully clothed, so the 1909 scan is the base.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II, "Zero. The Fool":
//   "a young man in gorgeous vestments pauses at the brink of a precipice among the great heights of the world;
//    he surveys the blue distance before him—its expanse of sky rather than the prospect below."
//   "His act of eager walking is still indicated, though he is stationary at the given moment; his dog is still bounding."
//   "He has a rose in one hand and in the other a costly wand, from which depends over his right shoulder a wallet
//    curiously embroidered."
//   "He is the spirit in search of experience."
//   divinatory: "Folly, mania, extravagance, intoxication, delirium, frenzy, betrayment.
//    Reversed: Negligence, absence, distribution, carelessness, apathy, nullity, vanity."
// Upright follows the mainstream modern RWS reading (new beginnings; innocence; freedom / travelling light);
// reversed (recklessness, carelessness, ignoring risk) is the modern consensus, close to Waite's "negligence, carelessness".
// White rose = purity is a traditional reading ("传统上"); the dog as a warning is a common modern reading ("常被认作").
// Hook picks up the World teaser: "旅程画成了圆，又从哪里开始？"
//
// DRAFT for sign-off — coordinates read off a 100 px grid of the scan; re-measure before cutting sprites.

const OPEN_DUR = 2.0; // the back foot swings forward toward the edge, the white dog leaps (see layers.tsx)

const CENTER = [572, 880]; // card centre (full shot)
const STEP = [720, 1170]; // the back leg, mid-stride
const FOOT = [520, 1320]; // the standing boot on the rock
const EDGE = [240, 1390]; // the brink of the precipice, lower left
const FACE = [578, 405]; // his face, turned up to the sky
const SUN = [975, 150]; // the sun, upper right
const ROSE = [975, 518]; // the white rose in his left hand
const RHAND = [945, 600]; // his open left hand under the rose
const BAG = [795, 360]; // the embroidered wallet
const WAND = [400, 520]; // the wand across his shoulder
const DOG = [900, 1290]; // the white dog, bounding
const ZERO = [555, 135]; // the numeral 0 at the top

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: STEP, z: 5.0, z1: 5.2, fx: ["step", "dog"], desc: "脚步与白狗特写；第 1 帧后脚向前迈出，白狗随之跃起；脚步踏石声 + 一声短促的犬吠" } },
  { kind: "line", style: "hook", zh: "旅程画成一个圆之后，", en: "Once the journey has closed into a circle,", pad: 0.2, shot: { pull: true, fx: ["dog"], desc: "从脚步拉远到整张牌，白狗还在跳动" } },
  { kind: "line", style: "hook", zh: "又回到了起点。", en: "it returns to the start.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant", "feather"], desc: "整张牌，静止停留；太阳光芒缓缓呼吸，帽上的红羽轻摆" } },
  { kind: "names", zh: "它的含义，藏在悬崖、白玫瑰与小包袱之中。", names: ["悬崖", "白玫瑰", "小包袱"], en: "Its meaning lies in the cliff, the white rose, and the small bundle.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["feather"], desc: "同一镜头，不切；悬崖、白玫瑰、小包袱依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "悬崖", meaning: "未知的冒险", en: "THE CLIFF · THE UNKNOWN ADVENTURE" },
  { kind: "line", zh: "他一脚迈出，前方就是悬崖。", en: "He steps forward, toward the edge of a cliff.", shot: { f: FOOT, z: 5.0, z1: 5.2, fx: ["step"], desc: "站立的靴子与岩石特写，后脚轻轻前移，几粒碎石滚落" } },
  { kind: "line", zh: "他却抬头望天，没有看脚下。", en: "Yet he looks up at the sky, not at his feet.", shot: { f: FACE, z: 6.0, z1: 6.2, fx: ["feather"], desc: "直切仰起的脸部特写，帽上红羽随风摆动" } },
  { kind: "line", zh: "象征踏入未知，开始一段冒险。", en: "It stands for stepping into the unknown, an adventure begun.", shot: { f: EDGE, z: 5.0, z1: 5.2, fx: ["mist"], desc: "直切左下崖边特写：岩石尽头与远处雪山，崖下薄雾缓缓上升" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "白玫瑰", meaning: "纯真", en: "THE WHITE ROSE · INNOCENCE" },
  { kind: "line", zh: "他的左手，轻捏着一朵白玫瑰。", en: "In his left hand he lightly holds a white rose.", shot: { f: RHAND, z: 5.5, z1: 5.7, fx: ["rose"], desc: "左手与白玫瑰同框特写，花瓣微微颤动" } },
  { kind: "line", zh: "白玫瑰，传统上象征纯洁。", en: "The white rose traditionally stands for purity.", shot: { f: ROSE, z: 8.0, z1: 8.2, fx: ["rose"], desc: "直切白玫瑰特写，花瓣边缘亮起一层微光" } },
  { kind: "line", zh: "以没有成见的眼光，看待世界。", en: "Seeing the world without preconceptions.", shot: { f: SUN, z: 5.0, z1: 5.2, fx: ["radiant"], desc: "直切右上太阳特写，光芒缓缓旋转" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "小包袱", meaning: "轻装上路", en: "THE BUNDLE · TRAVELLING LIGHT" },
  { kind: "line", zh: "肩上的木杖，挑着一只小包袱。", en: "The wand on his shoulder carries a small bundle.", shot: { f: WAND, f1: BAG, z: 5.0, z1: 5.2, fx: ["bag"], desc: "沿木杖缓缓横摇到包袱，包袱随步子轻晃" } },
  { kind: "line", zh: "他带上路的，只有这么一点。", en: "This is all he takes on the road.", shot: { f: BAG, z: 7.0, z1: 7.2, fx: ["bag"], desc: "直切绣花包袱特写，轻轻摆动" } },
  { kind: "line", zh: "象征放下负担，轻装上路。", en: "It stands for setting down burdens and travelling light.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["bag", "dog"], desc: "直切整张牌：包袱、白狗、悬崖同框，白狗再跳一下" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "鲁莽与轻率", en: "REVERSED · RECKLESSNESS, CARELESSNESS", rev: true },
  { kind: "line", zh: "悬崖还在，脚步却没有停。", en: "The cliff is still there, but the step does not stop.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "step"], desc: "倒置全牌，寒霜从边缘蔓延；后脚仍在向前挪" } },
  { kind: "line", zh: "不看脚下，冒险便成了鲁莽。", en: "Without looking down, adventure turns reckless.", shot: { f: EDGE, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的崖边特写，薄雾停住" } },
  { kind: "line", zh: "正位时，他带着期待出发。", en: "Upright, he sets out full of hope.", shot: { f: FACE, z: 6.0, z1: 6.2, flash: true, fx: ["feather"], desc: "闪回正位仰起的脸部特写（原彩），红羽重新摆动" } },
  { kind: "line", zh: "身边的白狗，常被认作一种提醒。", en: "The white dog is often read as a warning.", shot: { f: DOG, z: 6.0, z1: 6.15, rev: true, desc: "直切倒置的白狗特写，前爪悬在半空，静止" } },
  { kind: "line", zh: "逆位象征轻率，与对风险的忽视。", en: "Reversed, it stands for carelessness and ignoring risk.", shot: { f: FOOT, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的靴子与岩石特写，静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.31 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "编号是 0，可在最前，也可在最后。", en: "Numbered 0, it can stand first or last.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["zeroLit"], desc: "正位整张牌，牌顶的「0」描出一道金线" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, 0 lights, "已收录 11 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
