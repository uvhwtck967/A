// I 魔术师 — episode plan (series episode 12). Shot focus points are scan px of scans/RWS_Tarot_01_Magician.jpg
// (1108x1920, Wikimedia Commons, 1909 scan, public domain).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §1 and Part III §3:
//   "Above his head is the mysterious sign of the Holy Spirit, the sign of life, like an endless cord, forming the
//    figure 8 in a horizontal position."
//   "About his waist is a serpent-cincture, the serpent appearing to devour its own tail. ... here it indicates
//    more especially the eternity of attainment in the spirit."
//   "In the Magician's right hand is a wand raised towards heaven, while the left hand is pointing to the earth.
//    ... it shews the descent of grace, virtue and light, drawn from things above and derived to things below."
//   "On the table in front of the Magician are the symbols of the four Tarot suits, signifying the elements of
//    natural life, which lie like counters before the adept, and he adapts them as he wills."
//   divinatory: "Skill, diplomacy, address, subtlety; ... self-confidence, will; the Querent, if male.
//    Reversed: Physician, Magus, mental disease, disgrace, disquiet."
// Upright follows the mainstream modern RWS reading (will turned into action; resources at hand; potential);
// reversed (wasted talent, manipulation) is the modern consensus, not Waite's own list.
// Trivia: older decks (Tarot de Marseille "Le Bateleur") show a street conjuror at a table; Waite names the card
// "The Magician, Magus, or Juggler".

const OPEN_DUR = 2.0; // light flares at the wand tip and runs down his arm to the pointing hand (see layers.tsx)

const CENTER = [553, 900]; // card centre (full shot)
const WAND = [200, 230]; // the raised white wand and his right hand, upper left
const HAND = [835, 1000]; // left hand pointing to the earth
const FACE = [487, 545]; // his face, calm and confident
const INF = [496, 384]; // the horizontal figure 8 above his head
const TABLE = [330, 1120]; // the four suit symbols on the table
const CUP = [233, 930]; // the cup, left of the table
const TOOLS = [470, 1115]; // sword and wand lying on the table
const BELT = [520, 955]; // the serpent biting its tail at his waist

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: WAND, z: 5.4, z1: 5.6, fx: ["charge"], desc: "权杖特写；第 1 帧杖尖亮起一点白光，光沿手臂向下滑走；清亮的金属鸣响" } },
  { kind: "line", style: "hook", zh: "这张牌叫魔术师，", en: "This card is called the Magician,", pad: 0.2, shot: { pull: true, fx: ["charge"], desc: "从权杖拉远到整张牌，光一路落到指地的手上" } },
  { kind: "line", style: "hook", zh: "画面里却没有戏法。", en: "yet there is no trick in the picture.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant", "glint"], desc: "整张牌，静止停留；头顶的 ∞ 微微发光，桌上法器闪过金属光" } },
  { kind: "names", zh: "它的含义，藏在权杖、桌上的法器与无限符号之中。", names: ["权杖", "桌上的法器", "无限符号"], en: "Its meaning lies in the wand, the tools on the table, and the infinity sign.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["radiant"], desc: "同一镜头，不切；权杖、桌面、∞ 依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "权杖", meaning: "行动", en: "THE WAND · ACTION" },
  { kind: "line", zh: "他一手举起权杖，指向天空，", en: "One hand raises a wand toward the sky,", shot: { f: WAND, z: 5.4, z1: 5.65, fx: ["charge"], desc: "高举的权杖特写，缓慢推近；杖尖亮起" } },
  { kind: "line", zh: "一手指向大地。", en: "the other points to the earth.", shot: { f: WAND, f1: HAND, z: 4.6, z1: 4.7, fx: ["charge"], desc: "镜头沿手臂和红袍从权杖滑到指地的手，光随镜头一起落下" } },
  { kind: "line", zh: "象征把意志化为行动。", en: "It stands for turning will into action.", shot: { f: HAND, z: 6.0, z1: 6.2, fx: ["charge"], desc: "直切指地的手特写，指尖亮起微光，脚下花叶轻轻摆动" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "桌上的法器", meaning: "资源齐备", en: "THE TOOLS · RESOURCES AT HAND" },
  { kind: "line", zh: "桌上摆着杖、杯、剑与星币，", en: "On the table lie a wand, a cup, a sword, and a pentacle,", shot: { f: TABLE, z: 4.8, z1: 5.0, fx: ["glint"], desc: "桌面特写，四件法器同框；金属依次闪光" } },
  { kind: "line", zh: "对应塔罗的四个牌组。", en: "the four suits of the Tarot.", shot: { f: CUP, z: 6.0, z1: 6.2, fx: ["glint"], desc: "直切圣杯特写，杯口闪过一道光" } },
  { kind: "line", zh: "他需要的一切，都已摆在面前。", en: "Everything he needs is already before him.", shot: { f: TOOLS, z: 6.0, z1: 6.2, fx: ["glint"], desc: "直切桌上的剑与杖特写，剑刃扫光" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "无限符号", meaning: "潜能", en: "THE INFINITY SIGN · POTENTIAL" },
  { kind: "line", zh: "他头顶悬着一个横放的 8。", en: "A sideways 8 hangs above his head.", shot: { f: INF, z: 6.0, z1: 6.25, fx: ["radiant"], desc: "∞ 特写，光芒渐亮、缓缓呼吸" } },
  { kind: "line", zh: "韦特把它比作无尽的绳。", en: "Waite likens it to an endless cord.", shot: { f: INF, f1: FACE, z: 5.6, z1: 5.7, fx: ["radiant"], desc: "镜头从 ∞ 缓缓下移到平静的脸，光芒持续呼吸" } },
  { kind: "line", zh: "象征取之不尽的潜能。", en: "It stands for potential that never runs out.", shot: { f: INF, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["radiant", "charge"], desc: "从 ∞ 拉回整张牌，权杖与指地的手同时亮一下" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度，换成夜色版" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "浪费与操纵", en: "REVERSED · WASTED TALENT, MANIPULATION", rev: true },
  { kind: "line", zh: "权杖朝下，指地的手朝上。", en: "The wand points down, the pointing hand points up.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；杖尖不再发光" } },
  { kind: "line", zh: "法器还在桌上，却无人拿起。", en: "The tools are still on the table, but no one takes them up.", shot: { f: TABLE, z: 4.8, z1: 4.95, rev: true, desc: "直切倒置的桌面特写，法器静止，没有闪光" } },
  { kind: "line", zh: "正位时，它们任他调用。", en: "Upright, they were his to use as he willed.", shot: { f: TABLE, z: 4.8, z1: 5.0, flash: true, fx: ["glint"], desc: "闪回正位桌面特写（原彩），金属重新闪光" } },
  { kind: "line", zh: "才能被搁置，或用来误导他人。", en: "Talent is left idle, or used to mislead others.", shot: { f: FACE, z: 6.0, z1: 6.15, rev: true, desc: "直切倒置的脸部特写，静止" } },
  { kind: "line", zh: "潜能还在，却没有落到实处。", en: "The potential remains, but it never takes hold.", shot: { f: INF, z: 1.4, z1: 6.0, rev: true, push: true, desc: "从倒置的整张牌一路推进到暗下去的 ∞" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.07 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  // Waite: "a serpent-cincture, the serpent appearing to devour its own tail"
  { kind: "focus", zh: "他腰间的蛇，咬着自己的尾巴。", en: "The serpent at his waist bites its own tail.", shot: { f: BELT, z: 6.4, z1: 6.7, fx: ["coil"], desc: "正位，腰间的蛇形腰带特写；一道光沿腰带绕行一圈" } },
  { kind: "atlas", lines: [["冷知识：早期塔罗里，他是街头变戏法的艺人。", "Trivia: in early Tarot decks, he was a street conjuror."]] }, // "已收录 12 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
