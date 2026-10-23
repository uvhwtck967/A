// IV 皇帝 — episode plan (series episode 14). Shot focus points are scan px of scans/RWS_Tarot_04_Emperor.jpg (1117x1919).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §4 and Part III §3:
//   "He has a form of the Crux ansata for his scepter and a globe in his left hand. He is crowned monarch—commanding,
//    stately, seated on a throne, the arms of which are fronted by rams' heads. He is executive and realization,
//    the power of this world, here clothed with the highest of its natural attributes."
//   divinatory: "Stability, power, protection, realization; a great person; aid, reason, conviction; also authority
//    and will. Reversed: Benevolence, compassion, credit; also confusion to enemies, obstruction, immaturity."
// Upright follows Waite + the mainstream modern RWS reading (authority; order/structure; stability).
// Reversed (tyranny, rigidity, excessive control / lack of self-discipline) is the modern consensus, not Waite's list.
// The ram as the sign of Aries (Golden Dawn attribution) and the barren mountains as firm/austere ground are common
// modern readings, not Waite's own — captions say "常被认作" / "被解读为".
// Trivia: the throne carries four rams' heads (two on the top corners, two on the arm-fronts), the same as the
// card's number IV — a plain count of the picture, stated as a coincidence, not as Waite's intent. A fifth ram
// emblem sits on his cloak at the right shoulder (~[740, 580]); the caption says "石座上" so it stays exact.

const OPEN_DUR = 2.0; // the scepter lifts a hair and comes down on the throne arm: thud, dust off the ram head (layers.tsx)

const CENTER = [562, 880]; // card centre (full shot)
const RAM_TL = [258, 232]; // ram head, top-left corner of the throne
const RAM_ARM = [918, 1050]; // ram head on the right arm-front, under the orb
const FACE = [553, 420]; // crown and face
const SCEPTER = [190, 760]; // ankh scepter shaft and the gripping hand (opening)
const ANKH = [187, 547]; // the ankh loop at the scepter top
const ORB = [887, 900]; // golden orb in his left hand
const MOUNT = [975, 740]; // barren mountains, right of the throne
const ARMOR = [747, 1200]; // armoured greave under the red robe

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: SCEPTER, z: 5.0, z1: 5.2, fx: ["thud"], desc: "权杖与握杖的手特写；第 1 帧权杖微微抬起、顿落在扶手上，画面轻震，公羊头前扬起细尘；石头闷响" } },
  { kind: "line", style: "hook", zh: "皇后坐在麦田与流水旁，", en: "The Empress sits by wheat fields and water;", pad: 0.2, shot: { pull: true, fx: ["glint"], desc: "从权杖拉远到整张牌，王冠与宝球闪过金光" } },
  { kind: "line", style: "hook", zh: "皇帝却守着石座与荒山。", en: "the Emperor keeps to a stone throne and bare mountains.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["dust"], desc: "整张牌，静止停留；荒山前细沙随风飘过" } },
  { kind: "names", zh: "它的含义，藏在公羊头、权杖与宝球、荒山之中。", names: ["公羊头", "权杖与宝球", "荒山"], en: "Its meaning lies in the rams' heads, the scepter and orb, and the mountains.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["dust"], desc: "同一镜头，不切；四个公羊头、权杖与宝球、两侧荒山依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "公羊头", meaning: "权威", en: "THE RAMS' HEADS · AUTHORITY" },
  { kind: "line", zh: "石座的四角，都刻着公羊头。", en: "Rams' heads are carved on all four corners of the throne.", shot: { f: RAM_TL, z: 5.6, z1: 5.8, fx: ["glint"], desc: "左上角公羊头特写，缓慢推近；石面一道冷光扫过" } },
  { kind: "line", zh: "公羊常被认作白羊座的记号。", en: "The ram is often read as the sign of Aries.", shot: { f: RAM_ARM, z: 6.0, z1: 6.2, fx: ["glint"], desc: "直切右侧扶手公羊头特写（宝球一角入画），石面冷光扫过" } },
  { kind: "line", zh: "在这里，象征开拓与统领的权威。", en: "Here it stands for the authority to lead and to build.", shot: { f: FACE, z: 5.2, z1: 5.4, fx: ["glint"], desc: "直切王冠与脸部特写，王冠上的金光一闪" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "权杖与宝球", meaning: "秩序", en: "THE SCEPTER AND ORB · ORDER" },
  { kind: "line", zh: "他右手握着安卡形的权杖，", en: "In his right hand, an ankh-shaped scepter;", shot: { f: ANKH, z: 6.0, z1: 6.2, fx: ["glint"], desc: "权杖顶端的安卡环特写，金光沿杖身滑下" } },
  { kind: "line", zh: "左手托着一颗金色的宝球。", en: "in his left, a golden orb.", shot: { f: ORB, z: 6.0, z1: 6.2, fx: ["glint"], desc: "直切宝球特写，球面高光缓缓移动" } },
  { kind: "line", zh: "象征用规则治理世界的秩序。", en: "Together they stand for order: a world governed by rules.", shot: { f: ORB, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["glint"], desc: "从宝球缓缓拉回整张牌，权杖与宝球同时一闪" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "荒山", meaning: "稳定", en: "THE MOUNTAINS · STABILITY" },
  { kind: "line", zh: "他身后，是寸草不生的荒山。", en: "Behind him rise mountains where nothing grows.", shot: { f: MOUNT, z: 6.0, z1: 6.2, fx: ["dust"], desc: "右侧荒山特写，细沙沿山脊飘过" } },
  { kind: "line", zh: "红袍之下，还穿着一身铠甲。", en: "Under the red robe, he wears a suit of armour.", shot: { f: ARMOR, z: 5.4, z1: 5.6, fx: ["glint"], desc: "直切铠甲护腿特写，金属冷光由上而下扫过" } },
  { kind: "line", zh: "它们被解读为坚定与稳定。", en: "They are read as firmness and stability.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["dust"], desc: "整张牌，缓慢推近；荒山前细沙飘过" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "专制与僵化", en: "REVERSED · TYRANNY, RIGIDITY", rev: true },
  { kind: "line", zh: "权杖和宝球还在，秩序却已僵硬。", en: "The scepter and orb remain, but the order has hardened.", shot: { full: true, z: 1.0, z1: 1.04, rev: true, fx: ["frostGrow"], desc: "倒置全牌，固定；寒霜从边缘蔓延，细沙停住" } },
  { kind: "line", zh: "规则不再守护人，", en: "Rules no longer protect people;", shot: { f: RAM_TL, z: 5.6, z1: 5.75, rev: true, fx: ["glint"], desc: "直切倒置的公羊头特写，石面冷光极慢地扫过" } },
  { kind: "line", zh: "只用来维持控制。", en: "they only keep control in place.", shot: { f: ANKH, z: 6.0, z1: 6.15, rev: true, fx: ["glint"], desc: "直切倒置的权杖安卡环特写，金光暗淡" } },
  { kind: "line", zh: "正位时，这份力量用来守护。", en: "Upright, this power is used to protect.", shot: { f: FACE, z: 5.2, z1: 5.45, flash: true, fx: ["glint"], desc: "闪回正位王冠与脸部特写（原彩），王冠金光一闪" } },
  { kind: "line", zh: "逆位象征专制，或是失去自律。", en: "Reversed, it points to tyranny, or a lack of self-discipline.", shot: { f: FACE, z: 5.2, z1: 5.35, rev: true, fx: ["frostGrow"], desc: "直切倒置的脸部特写，霜色加深" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.05 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "石座四角的公羊头，正合牌号 IV。", en: "Four rams' heads on the throne, the same as the card's number, IV.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["ramCount"], desc: "正位整张牌，四个公羊头依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, IV lights, "已收录 14 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
