// XII 倒吊人 — episode plan. Shot focus points are scan px of RWS_Tarot_12_Hanged_Man.jpg (1092x1920).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §12:
//   "the tree of sacrifice is living wood, with leaves thereon"
//   "the face expresses deep entrancement, not suffering"
//   "There is a nimbus about the head"
//   "the figure, as a whole, suggests life in suspension, but life and not death"
//   divinatory: "Wisdom, circumspection, discernment, trials, sacrifice, intuition…  Reversed: Selfishness, the crowd, body politic."
// Upright meanings follow the mainstream modern RWS reading (surrender / pause / a new perspective);
// the reversed reading (stalling, sacrifice for nothing, refusing to let go) is the modern consensus.

const SWING_SETTLE = 1.9; // the figure swings in from an angle and settles; see layers.tsx

const ROPE = [592, 228];
const FOOT = [600, 300];
const LEGS = [470, 700]; // the crossed legs
const FACE = [525, 1355];
const HALO = [525, 1395];
const HANDS = [525, 1220];
const TRUNK = [520, 1640];

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: SWING_SETTLE + 0.2, shot: { f: FACE, z: 4.7, z1: 4.9, desc: "特写：倒吊人从一侧摆进画面，像钟摆一样慢慢停住；绳子吱呀作响" } },
  { kind: "line", style: "hook", zh: "倒吊人，受罚却从容。", en: "The Hanged Man is punished, yet composed.", pad: 0.2, shot: { pull: true } },
  { kind: "line", style: "hook", zh: "他头顶的光环又意味着什么？", en: "What does the halo above his head mean?", pad: 0.2, shot: { full: true } },
  { kind: "names", zh: "它的深意，藏在绳索、姿态与光环之中。", names: ["绳索", "姿态", "光环"], en: "The deeper meaning lies in the rope, his posture, and the halo.", pad: 0.3, shot: { full: true } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "绳索", meaning: "暂停", en: "THE ROPE · PAUSE" },
  { kind: "line", zh: "绳索系住一只脚。", en: "The rope binds just one foot.", shot: { f: ROPE, z: 6.0, z1: 6.4, desc: "绳结和被系住的那只脚", fx: ["creak"] } },
  { kind: "line", zh: "他悬在半空，无法前行。", en: "He hangs in midair, unable to move forward.", shot: { full: true, z: 1.1, z1: 1.05, link: true, desc: "从绳结拉远到整张牌，看见人物悬在半空" } },
  { kind: "line", zh: "暂停让他重新审视眼前的处境。", en: "The pause gives him time to reconsider his situation.", shot: { f: HANDS, f1: [525, 1050], z: 4.7, z1: 4.8, link: true, desc: "从整张牌缓缓推进到人物上身，人物轻轻摆动", fx: ["sway"] } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "姿态", meaning: "牺牲", en: "THE POSTURE · SACRIFICE" },
  { kind: "line", zh: "另一条腿从容地交叉着。", en: "His other leg rests calmly across it.", shot: { f: LEGS, z: 4.8, z1: 5.1, desc: "特写交叉的双腿，人物轻轻摆动", fx: ["sway"] } },
  { kind: "line", zh: "他甘愿承受倒悬。", en: "He willingly accepts being suspended.", shot: { f: FACE, z: 6.4, z1: 6.8, link: true, desc: "镜头从交叉的腿移到平静的脸" } },
  { kind: "line", zh: "牺牲自己的行动和掌控权。", en: "He gives up his freedom to act and his sense of control.", shot: { f: HANDS, z: 4.8, z1: 5.1, link: true, desc: "镜头下移到背在身后的双手，人物轻轻摆动", fx: ["sway"] } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "光环", meaning: "智慧", en: "THE HALO · WISDOM" },
  { kind: "line", zh: "光环在头顶亮起。", en: "The halo above his head begins to glow.", shot: { f: HALO, z: 4.8, z1: 5.3, desc: "光环特写，光芒渐亮", fx: ["radiant"] } },
  { kind: "line", zh: "倒转角度，启迪智慧。", en: "An inverted view sparks wisdom.", shot: { f: HALO, f1: FACE, z: 5.3, z1: 6.1, link: true, desc: "画框保持稳定，镜头从光环移到倒悬的脸", fx: ["radiant"] } },
  { kind: "line", zh: "他看见了熟悉世界的另一面。", en: "He sees another side of the familiar world.", shot: { full: true, z: 1.08, z1: 1, link: true, desc: "从脸拉远到整张牌，画框始终不旋转" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转180度，画面逐渐转冷、变暗" } },
  { kind: "chapter", dur: 2.6, label: "逆 位", symbol: "倒转的牌", meaning: "停滞 · 徒劳", en: "REVERSED · STAGNATION · IN VAIN", rev: true },
  { kind: "line", zh: "他看似站正了。", en: "He seems to be standing upright.", shot: { full: true, z: 1, z1: 1.05, rev: true, desc: "倒置的整张牌：倒吊人看起来像单脚站着", fx: ["frostGrow"] } },
  { kind: "line", zh: "脚上的绳索却没有松开。", en: "Yet the rope around his foot remains.", shot: { f: ROPE, z: 6.0, z1: 6.4, rev: true, desc: "倒置后的绳结特写，绳子还绑着", fx: ["creak"] } },
  { kind: "line", zh: "他回到了原来的视角。", en: "He returns to his old perspective.", shot: { f: FACE, z: 6.6, z1: 7.0, rev: true, link: true, desc: "倒置后的人脸正过来，光环暗着" } },
  { kind: "line", zh: "等待没能带来新的启示。", en: "The wait has brought no new insight.", shot: { f: HALO, z: 4.8, z1: 5.3, rev: true, desc: "倒置后的光环保持暗淡，没有闪回" } },
  { kind: "line", zh: "他依旧承受着束缚。", en: "He is still bound.", shot: { f: HANDS, z: 4.8, z1: 5.1, rev: true, desc: "倒置后背在身后的双手特写，姿态凝住" } },
  { kind: "line", zh: "可这份牺牲，已经失去了意义。", en: "But his sacrifice has lost its meaning.", shot: { f: HALO, z: 1.4, z1: 5.0, rev: true, push: true, desc: "从倒置的整张牌一路推进到暗下去的光环" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 6.0 },
  {
    kind: "atlas",
    lines: [
      ["冷知识：韦特写道，这张牌的意义", "Trivia: Waite wrote that the card's meaning"],
      ["「深刻，却全被遮住了」。", "is “profound, but all veiled.”"],
    ],
  },
  { kind: "teaser", dur: 4.4 },
];

module.exports = { PLAN, impacts: [], SWING_SETTLE, TRUNK };
