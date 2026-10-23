// XIII 死神 — episode plan. Shot focus points are scan px of RWS_Tarot_13_Death.jpg (1111x1919).
const crown = require("./crown.json");

const KING_FALL = 0.5; // king hits the ground; the crown is flung off at the same instant
const crownSettled = KING_FALL + crown.impacts[2] + Math.log(crown.wobble.amp / crown.wobble.audibleDeg) / crown.wobble.decay;

const KING = [205, 1555];
const CROWN = [312, 1630];
const SKULL = [210, 350];
const FLAG = [680, 290];
const ROSE = [688, 308];
const SUN = [935, 745];
const BISHOP = [800, 1330];
const RIVER = [400, 1230];

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: crownSettled + 0.1, shot: { f: [215, 1585], z: 6.2, z1: 6.45 } },
  { kind: "line", style: "hook", zh: "名为死神的牌，", en: "A card named Death", pad: 0.2, shot: { pull: true } },
  { kind: "line", style: "hook", zh: "并不直指死亡。", en: "does not point to death itself.", pad: 0.2, shot: { full: true } },
  { kind: "names", zh: "它的含义，藏在国王、玫瑰与太阳之中。", names: ["国王", "玫瑰", "太阳"], en: "Its meaning lies in the king, the rose, and the sun.", pad: 0.3, shot: { full: true } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "国王", meaning: "结束", en: "THE KING · ENDING" },
  { kind: "line", zh: "倒下的，是一位国王。", en: "The one who has fallen is a king.", shot: { f: KING, z: 5.8, z1: 6.2, fx: ["dust"] } },
  { kind: "line", zh: "权力、身份、曾经拥有的一切——", en: "Power, status, everything he once held —", shot: { f: CROWN, z: 7.4, z1: 7.9, fx: ["glint"] } },
  { kind: "line", zh: "都会走到尽头。", en: "all of it comes to an end.", shot: { f: SKULL, z: 6.0, z1: 6.4 } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "玫瑰", meaning: "转变", en: "THE ROSE · TRANSFORMATION" },
  { kind: "line", zh: "骷髅举着的黑旗上，开着一朵白玫瑰。", en: "On the black banner blooms a white rose.", shot: { f: FLAG, z: 4.6, z1: 4.85, fx: ["flutter"] } },
  { kind: "line", zh: "它象征纯净，也象征新生。", en: "A symbol of purity — and of rebirth.", shot: { f: ROSE, z: 6.4, z1: 6.9, fx: ["roseDraw"] } },
  { kind: "line", zh: "旧的死去，是为了给新的腾出位置。", en: "The old dies to make room for the new.", shot: { f: [300, 380], f1: [640, 300], z: 5.4, z1: 5.5, fx: ["roseLit"] } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "太阳", meaning: "新生", en: "THE SUN · RENEWAL" },
  { kind: "line", zh: "而在画面尽头，太阳正在升起。", en: "And at the far edge, the sun is rising.", shot: { f: SUN, z: 6.2, z1: 6.7, fx: ["radiant"] } },
  { kind: "line", zh: "毕业、离职、告别一段关系……", en: "Graduating. Quitting. Saying goodbye.", shot: { f: BISHOP, z: 5.0, z1: 5.3, fx: ["sweep"] } },
  { kind: "line", zh: "每一次结束，背后都连着开始。", en: "Every ending is tied to a beginning.", shot: { f: RIVER, f1: [700, 1230], z: 4.7, z1: 4.9, fx: ["sweep", "radiant"] } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true } },
  { kind: "chapter", dur: 2.6, label: "逆 位", symbol: "倒转的牌", meaning: "抗拒改变 · 停滞", en: "REVERSED · RESISTANCE · STAGNATION", rev: true },
  { kind: "line", zh: "该结束的，没有结束。", en: "What should end, doesn't.", shot: { full: true, z: 1, z1: 1.05, rev: true, fx: ["frostGrow"] } },
  { kind: "line", zh: "人死死攥着旧的东西，", en: "We cling to what is already gone,", shot: { f: KING, z: 5.8, z1: 6.2, rev: true } },
  { kind: "line", zh: "不肯放手。", en: "and refuse to let go.", shot: { f: CROWN, z: 7.4, z1: 7.9, rev: true } },
  { kind: "line", zh: "太阳，一直都在。", en: "The sun is still there.", shot: { f: SUN, z: 6.2, z1: 6.7, flash: true, fx: ["radiant"] } },
  { kind: "line", zh: "只是不放下过去，", en: "But without letting go of the past,", shot: { full: true, z: 1, z1: 1.06, rev: true } },
  { kind: "line", zh: "就走不到它升起的地方。", en: "you never reach the place where it rises.", shot: { f: SUN, z: 1.4, z1: 5.6, rev: true, push: true } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 6.0 },
  {
    kind: "atlas",
    lines: [
      ["冷知识：在古老的马赛塔罗里，", "Trivia: in the old Marseille deck,"],
      ["这张牌，连名字都没有印。", "this card was never even given a name."],
    ],
  },
  { kind: "teaser", dur: 4.4 },
];

// impacts[0] drives the screen shake
module.exports = { PLAN, impacts: [KING_FALL], KING_FALL };
