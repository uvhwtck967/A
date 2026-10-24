// IX 隐者 — episode plan (series episode 18). Shot focus points are scan px of scans/RWS_Tarot_09_Hermit.jpg (1123x1920).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910):
//   Part II §9: "It is a star which shines in the lantern. I have said that this is a card of attainment, and to
//    extend this conception the figure is seen holding up his beacon on an eminence. ... His beacon intimates that
//    'where I am, you also may be.'"
//   Part I §2: "the isolation of the Hermit, pursuing a solitary path by the light of his own lamp, gives, to those
//    who can receive it, a certain high counsel in respect of the via prudentiæ."
//   divinatory: "Prudence, circumspection; also and especially treason, dissimulation, roguery, corruption.
//    Reversed: Concealment, disguise, policy, fear, unreasoned caution."
// Upright follows the mainstream modern RWS reading (inner light / introspection; solitude; guidance);
// reversed (isolation, withdrawal, excessive caution) is the modern consensus plus Waite's "fear, unreasoned caution".
// The staff as experience / support is a common modern reading, not Waite's own — the caption says "常被认作".
// Focus line quotes Waite's "where I am, you also may be" (Part II §9).

const OPEN_DUR = 2.0; // the star in the lantern flares, the rays light up, the lantern sways (see layers.tsx)

const CENTER = [558, 872]; // card centre (full shot)
const LANTERN = [170, 430]; // the lantern and its rays, upper left
const STAR = [168, 440]; // the star inside the lantern
const ARM = [250, 300]; // raised hand and arm holding the lantern up
const FACE = [530, 350]; // bowed head, closed eyes, white beard
const PEAK = [560, 1620]; // snowy summit under his feet
const FEET = [600, 1590]; // feet and hem on the snow
const STAFF_HAND = [440, 450]; // hand gripping the golden staff
const STAFF = [470, 1000]; // the staff, mid-length
const STAFF_FOOT = [500, 1590]; // the staff planted in the snow

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: LANTERN, z: 5.6, z1: 5.8, fx: ["lanternLit", "sway"], desc: "灯笼特写；第 1 帧灯里的星亮起，光芒向外一闪，灯笼轻轻晃动；铃音 + 火苗声" } },
  { kind: "line", style: "hook", zh: "雪山顶上，老人提灯而立。", en: "On a snowy peak, an old man stands holding a lantern.", pad: 0.2, shot: { pull: true, fx: ["lantern", "sway"], desc: "从灯笼拉远到整张牌，灯光微微呼吸" } },
  { kind: "line", style: "hook", zh: "四下无人，灯却一直亮着。", en: "No one is around, yet the lamp stays lit.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["lantern", "snow"], desc: "整张牌，静止停留；灯光呼吸，山顶细雪飘过" } },
  { kind: "names", zh: "它的含义，藏在灯笼、雪山与长杖之中。", names: ["灯笼", "雪山", "长杖"], en: "Its meaning lies in the lantern, the snowy peak, and the staff.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["lantern"], desc: "同一镜头，不切；灯笼、雪山、长杖依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "灯笼", meaning: "内在之光", en: "THE LANTERN · INNER LIGHT" },
  { kind: "line", zh: "他把一盏灯笼高高举起。", en: "He holds a lantern high.", shot: { f: ARM, z: 5.0, z1: 5.25, fx: ["lantern", "sway"], desc: "举灯的手臂与灯笼同框，灯笼轻晃" } },
  { kind: "line", zh: "灯里亮着的不是火，而是一颗星。", en: "What shines inside is not a flame, but a star.", shot: { f: STAR, z: 8.0, z1: 8.3, fx: ["radiant", "lantern"], desc: "直切灯内星星特写，光芒缓缓旋转、呼吸" } },
  { kind: "line", zh: "象征向内寻得的智慧之光。", en: "It stands for the light of wisdom found within.", shot: { f: FACE, z: 6.0, z1: 6.2, fx: ["lanternGlow"], desc: "直切低头闭目的脸部特写，脸侧映着灯笼的暖光" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "雪山", meaning: "独处", en: "THE SNOWY PEAK · SOLITUDE" },
  { kind: "line", zh: "他站在雪山之巅，身边没有旁人。", en: "He stands on a snowy summit, with no one beside him.", shot: { f: FEET, z: 5.0, z1: 5.25, fx: ["snow"], desc: "脚下雪峰特写，细雪从山脊飘过" } },
  { kind: "line", zh: "这份独处，被解读为向内的省思。", en: "This solitude is read as turning inward to reflect.", shot: { f: PEAK, f1: CENTER, z: 2.4, z1: 1.0, pullBack: true, fx: ["snow", "lantern"], desc: "从雪峰缓缓拉回整张牌，四周空旷" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "长杖", meaning: "指引", en: "THE STAFF · GUIDANCE" },
  { kind: "line", zh: "他拄着一根金色的长杖，", en: "He leans on a golden staff,", shot: { f: STAFF_HAND, z: 6.0, z1: 6.2, fx: ["glint"], desc: "握杖的手特写，金色长杖上一道闪光滑过" } },
  { kind: "line", zh: "一步步走到了这里。", en: "and has climbed here step by step.", shot: { f: STAFF_FOOT, z: 5.6, z1: 5.8, fx: ["snow", "glint"], desc: "直切杖尖插进积雪的特写，细雪飘过" } },
  { kind: "line", zh: "长杖常被认作经验与支撑，", en: "The staff is often read as experience and support,", shot: { f: STAFF, z: 4.6, z1: 4.75, fx: ["glint"], desc: "直切长杖中段与长袍同框，闪光沿杖身向下" } },
  { kind: "line", zh: "他走过的路，成了后来者的指引。", en: "the road he walked becomes a guide for those who follow.", shot: { f: LANTERN, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["lantern", "radiant"], desc: "从灯笼缓缓拉回整张牌，灯光变亮，照向山下" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "孤立与封闭", en: "REVERSED · ISOLATION, WITHDRAWAL", rev: true },
  { kind: "line", zh: "灯光暗了下去，却没有熄灭。", en: "The lamp dims, but does not go out.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "lantern"], desc: "倒置全牌，寒霜从边缘蔓延；灯光变弱但仍在呼吸" } },
  { kind: "line", zh: "独处，慢慢变成了孤立。", en: "Solitude slowly turns into isolation.", shot: { f: FACE, z: 6.0, z1: 6.15, rev: true, fx: ["lanternGlow"], desc: "直切倒置的脸部特写，脸侧暖光慢慢褪去" } },
  { kind: "line", zh: "正位时，他举灯照亮来路。", en: "Upright, he raises the lamp to light the way.", shot: { f: LANTERN, z: 5.6, z1: 5.85, flash: true, fx: ["lantern", "radiant"], desc: "闪回正位灯笼特写（原彩），光芒重新亮起" } },
  { kind: "line", zh: "逆位里，光只留给了自己。", en: "Reversed, the light is kept only for himself.", shot: { f: LANTERN, z: 5.6, z1: 5.75, rev: true, fx: ["lantern"], desc: "直切倒置的灯笼特写，光芒收拢、几乎不动" } },
  { kind: "line", zh: "逆位象征孤立、封闭与过度戒备。", en: "Reversed, it stands for isolation, withdrawal and excessive caution.", shot: { full: true, z: 1.0, z1: 1.04, rev: true, fx: ["lantern"], desc: "倒置全牌，缓慢推近；灯光微弱地明灭" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.22 }, // tune so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "韦特写道：“我所在之处，你也能抵达。”", en: "Waite wrote: \"Where I am, you also may be.\"", shot: { full: true, z: 1.0, z1: 1.04, fx: ["lanternLit"], desc: "正位整张牌，灯笼再次亮起，光芒铺向山下" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, IX lights, "已收录 18 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
