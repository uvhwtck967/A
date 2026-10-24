// IX 隐者 — episode plan. Shot focus points are scan px of scans/RWS_Tarot_09_Hermit.jpg (1123x1920).
// Series episode 18, released after VIII 力量 (episode 17). Atlas shows "已收录 18 / 22".
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §9 "The Hermit":
//   "the lamp is not enveloped partially in the mantle of its bearer, but blends the idea of the Ancient of Days
//    with the Light of the World. It is a star which shines in the lantern."
//   "I have said that this is a card of attainment, and to extend this conception the figure is seen holding up
//    his beacon on an eminence."
//   "His beacon intimates that 'where I am, you also may be.'"
//   divinatory (Part III): "Prudence, circumspection; also and especially treason, dissimulation, roguery,
//    corruption. Reversed: Concealment, disguise, policy, fear, unreasonable caution."
// Upright follows the modern RWS reading (inner light / introspection; solitude; guidance);
// reversed (isolation, withdrawal) is the modern consensus, plus Waite's own "fear, unreasonable caution".
// The staff as "experience and support" is a modern reading — the caption says "常被解读为".
// Trivia: in the 15th-c. Visconti-Sforza deck the old man holds an hourglass, not a lantern
// (the card was linked with Time; later Marseille-pattern decks give him the lantern).
//
// Coordinates are first estimates from a marked-up scan; re-check them before the asset pass (SOP 3.2).

const OPEN_DUR = 2.0; // the lantern sparks alight, swings once on its ring and steadies (see layers.tsx)

const LANTERN = [170, 425]; // the lantern and its rays
const STAR = [168, 425]; // the six-pointed star inside the lantern
const HAND_UP = [205, 215]; // his raised hand holding the lantern ring
const FACE = [500, 360]; // his lowered face and white beard
const HOOD = [530, 220]; // the hood, top of the figure
const PEAK_L = [400, 1590]; // the snowy peak under the staff, lower left
const FEET = [640, 1600]; // his feet on the summit snow
const STAFF_HAND = [430, 410]; // his left hand gripping the staff
const STAFF_MID = [455, 900]; // the yellow staff along the robe
const STAFF_FOOT = [500, 1590]; // where the staff meets the snow

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: LANTERN, z: 5.4, z1: 5.6, fx: ["ignite", "swing"], desc: "灯笼特写；第 1 帧灯芯一闪点亮，光芒向外散开，灯笼在提环上轻轻一晃后停稳；擦火声 + 一声轻铃" } },
  { kind: "line", style: "hook", zh: "力量在原野上驯服狮子，", en: "Strength tames a lion in the meadow;", pad: 0.2, shot: { pull: true, fx: ["glow", "snow"], desc: "从灯笼拉远到整张牌，灯光呼吸，细雪飘过" } },
  { kind: "line", style: "hook", zh: "隐者却独自站在雪山顶。", en: "the Hermit stands alone on a snowy peak.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["glow", "snow"], desc: "整张牌，静止停留；灯光呼吸，细雪从左向右飘" } },
  { kind: "names", zh: "含义藏在灯笼、雪山与拐杖里。", names: ["灯笼", "雪山", "拐杖"], en: "Its meaning lies in the lantern, the snowy peak, and the staff.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["glow"], desc: "同一镜头，不切；灯笼、雪山、拐杖依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "灯笼", meaning: "内在之光", en: "THE LANTERN · THE INNER LIGHT" },
  { kind: "line", zh: "他高举灯笼，低头看着脚下。", en: "He holds the lantern high and looks down at his path.", shot: { f: HAND_UP, f1: LANTERN, z: 5.0, z1: 5.2, fx: ["glow", "swing"], desc: "从举灯的手沿提环缓缓下摇到灯笼，灯笼微微晃动" } },
  { kind: "line", zh: "韦特写道，灯里亮着的是一颗星。", en: "Waite writes that it is a star which shines in the lantern.", shot: { f: STAR, z: 7.0, z1: 7.3, fx: ["glow", "radiant"], desc: "直切灯内六芒星特写，星光一明一暗地闪烁，光芒缓缓转动" } },
  { kind: "line", zh: "象征向内寻找的智慧之光。", en: "It stands for a light of wisdom found by looking inward.", shot: { f: FACE, z: 5.6, z1: 5.8, fx: ["glow", "beard"], desc: "直切他低垂的脸与白胡子，暖光从左侧映在脸上，胡须微动" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "雪山", meaning: "独处", en: "THE SNOWY PEAK · SOLITUDE" },
  { kind: "line", zh: "他站在雪山之巅，四下无人。", en: "He stands on a snowy summit, with no one around.", shot: { f: FEET, f1: PEAK_L, z: 4.7, z1: 4.85, fx: ["snow", "drift"], desc: "雪地与双脚，缓缓横摇到左侧雪峰，雪粉被风卷起" } },
  { kind: "line", zh: "韦特称它为“抵达”之牌。", en: "Waite calls it a card of attainment.", shot: { f: HOOD, z: 5.4, z1: 5.6, fx: ["snow", "cloak"], desc: "直切兜帽与头部轮廓，背后天空空旷，斗篷边缘轻轻飘动" } },
  { kind: "line", zh: "登上高处，也意味着远离人群。", en: "To reach the heights is also to step away from the crowd.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["snow", "cloak"], desc: "直切整张牌，人物在大片空白天空下显得很小，细雪飘落" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "拐杖", meaning: "指引", en: "THE STAFF · GUIDANCE" },
  { kind: "line", zh: "另一只手，握着一根长杖。", en: "His other hand grips a long staff.", shot: { f: STAFF_HAND, f1: STAFF_MID, z: 5.0, z1: 5.2, fx: ["glint"], desc: "从握杖的手沿杖身缓缓下摇，金色杖身一道微光滑过" } },
  { kind: "line", zh: "常被解读为经验与支撑。", en: "It is often read as experience and support.", shot: { f: STAFF_FOOT, z: 5.2, z1: 5.4, fx: ["tap", "drift"], desc: "直切杖尖落在雪地上，轻轻一点，溅起细雪" } },
  { kind: "line", zh: "他举着灯，像在说：你也能来。", en: "His raised lamp seems to say: where I am, you also may be.", shot: { full: true, z: 1.0, z1: 1.05, fx: ["glow", "radiant"], desc: "直切整张牌，灯光缓缓变亮，光芒朝画面外扩散" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "孤立与封闭", en: "REVERSED · ISOLATION, WITHDRAWAL", rev: true },
  { kind: "line", zh: "灯还亮着，却沉到了最底下。", en: "The lamp still burns, but it has sunk to the very bottom.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "dim"], desc: "倒置全牌，寒霜从边缘蔓延；灯光变暗、缩小" } },
  { kind: "line", zh: "独处一旦变成躲避，", en: "When solitude turns into hiding,", shot: { f: FACE, z: 5.6, z1: 5.75, rev: true, fx: ["dim", "cloak"], desc: "直切倒置的脸与兜帽特写，暖光退去，阴影盖住半张脸" } },
  { kind: "line", zh: "就成了孤立与封闭。", en: "it becomes isolation and withdrawal.", shot: { f: PEAK_L, z: 4.7, z1: 4.85, rev: true, fx: ["snow", "drift"], desc: "直切倒置的雪峰，风雪变密" } },
  { kind: "line", zh: "灯光，只照着自己。", en: "The light shines only on himself.", shot: { f: HAND_UP, f1: LANTERN, z: 5.0, z1: 5.1, rev: true, fx: ["dim", "swing"], desc: "直切倒置的手与灯笼，灯笼轻晃，光圈收窄到只罩住他自己" } },
  { kind: "line", zh: "正位时，他把灯举向别人。", en: "Upright, he holds his lamp up for others.", shot: { f: LANTERN, z: 5.4, z1: 5.6, flash: true, fx: ["glow", "radiant"], desc: "闪回正位灯笼特写（原彩），光芒重新亮起" } },
  { kind: "line", zh: "韦特也列出恐惧，与过度谨慎。", en: "Waite also lists fear and unreasonable caution.", shot: { f: STAR, z: 7.0, z1: 7.15, rev: true, fx: ["dim", "flicker"], desc: "直切倒置的灯内星光，光断断续续，忽明忽暗" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.17 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "早期意大利牌上，他提的是沙漏。", en: "On early Italian cards, he carries an hourglass instead.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["glow", "numeral"], desc: "正位整张牌定格，顶部 IX 描金亮起，灯光呼吸" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, IX lights, "已收录 18 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
