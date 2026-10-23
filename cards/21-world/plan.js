// XXI 世界 — episode plan (series episode 10). Shot focus points are scan px of scans/RWS_Tarot_21_World.jpg (1112x1920).
// The 1909 scan shows the dancer nude, wrapped only in a scarf: if the user supplies a clothed version (as for
// Lovers / Star), use it as the base image and re-measure every point below on that image.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §21:
//   "It represents also the perfection and end of the Cosmos, the secret which is within it, the rapture of the
//    universe when it understands itself in God."
//   divinatory: "Assured success, recompense, voyage, route, emigration, flight, change of place.
//    Reversed: Inertia, fixity, stagnation, permanence."
// The four creatures (man, eagle, ox, lion) are the living creatures of Ezekiel 1:10 and Revelation 4:7.
// Upright follows the mainstream modern RWS reading (completion; integration; wholeness); reversed (stagnation,
// things left unfinished, lack of closure) is the modern consensus, close to Waite's "inertia, fixity, stagnation".
// Two wands as opposing forces held in balance is a modern reading, not Waite's — the caption says "象征".
// Trivia: her crossed legs echo the Hanged Man's (series episode 2) — a common modern observation.

const OPEN_DUR = 2.0; // the scarf lifts and swirls as she turns, the wreath leaves shiver (see layers.tsx)

const CENTER = [555, 880]; // card centre (full shot)
const SCARF = [420, 560]; // the purple scarf streaming from her shoulder
const FACE = [540, 500]; // her face, turned to look back
const WAND_L = [270, 870]; // wand in her right hand (viewer's left)
const WAND_R = [825, 870]; // wand in her left hand (viewer's right)
const LEGS = [570, 1250]; // crossed legs, one foot lifted
const WREATH_L = [130, 900]; // the left side of the oval wreath
const RIBBON_T = [550, 210]; // red ribbon binding the wreath, top
const RIBBON_B = [530, 1540]; // red ribbon binding the wreath, bottom
const EAGLE = [950, 170]; // the eagle, top right
const BULL = [130, 1530]; // the ox, bottom left

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: SCARF, z: 5.6, z1: 5.8, fx: ["scarf", "leaves"], desc: "紫色丝巾特写；第 1 帧丝巾随她转身扬起、翻卷；风声 + 一声轻铃" } },
  { kind: "line", style: "hook", zh: "大阿卡纳的旅程，", en: "The journey of the Major Arcana", pad: 0.2, shot: { pull: true, fx: ["scarf"], desc: "从丝巾拉远到整张牌，丝巾继续飘动" } },
  { kind: "line", style: "hook", zh: "在这里画成了一个圆。", en: "closes here into a circle.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["leaves", "radiant"], desc: "整张牌，静止停留；花环叶子轻颤，中央的光缓缓呼吸" } },
  { kind: "names", zh: "它的含义，藏在花环、起舞的人与四个活物之中。", names: ["花环", "起舞的人", "四个活物"], en: "Its meaning lies in the wreath, the dancer, and the four living creatures.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["leaves"], desc: "同一镜头，不切；花环、起舞的人、四个活物依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "花环", meaning: "完成", en: "THE WREATH · COMPLETION" },
  { kind: "line", zh: "一个椭圆形的花环，围住了中央。", en: "An oval wreath encloses the centre.", shot: { f: WREATH_L, z: 5.0, z1: 5.2, fx: ["leaves"], desc: "花环左侧特写，叶片一层层轻颤" } },
  { kind: "line", zh: "上下两端，各系着一条红丝带。", en: "A red ribbon binds it at top and bottom.", shot: { f: RIBBON_T, z: 5.5, z1: 5.7, fx: ["ribbon"], desc: "直切顶端红丝带特写，丝带末端轻轻飘动" } },
  { kind: "line", zh: "象征一段旅程的完成。", en: "It stands for a journey completed.", shot: { f: RIBBON_T, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["radiant"], desc: "从丝带缓缓拉回整张牌，花环整圈亮起一层暖光" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "起舞的人", meaning: "整合", en: "THE DANCER · INTEGRATION" },
  { kind: "line", zh: "花环中央，有人轻盈地起舞。", en: "At its centre, a figure dances lightly.", shot: { f: FACE, z: 5.0, z1: 5.2, fx: ["scarf"], desc: "她回首的脸部与丝巾特写，发丝与丝巾微动" } },
  { kind: "line", zh: "她两手各握着一根短杖。", en: "In each hand she holds a short wand.", shot: { f: WAND_L, z: 5.5, z1: 5.7, fx: ["glint"], desc: "直切左侧短杖特写，杖身闪过一道光" } },
  { kind: "line", zh: "象征对立的力量，合而为一。", en: "It stands for opposing forces made one.", shot: { f: WAND_R, z: 5.5, z1: 5.7, fx: ["glint"], desc: "直切右侧短杖特写，同样闪过一道光" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "四个活物", meaning: "圆满", en: "THE FOUR LIVING CREATURES · WHOLENESS" },
  { kind: "line", zh: "四角是人、鹰、牛与狮子。", en: "In the corners: a man, an eagle, an ox and a lion.", shot: { f: EAGLE, z: 5.0, z1: 5.2, fx: ["clouds"], desc: "右上角鹰头特写，周围云气缓缓流动" } },
  { kind: "line", zh: "它们出自《以西结书》与《启示录》。", en: "They come from Ezekiel and Revelation.", shot: { f: BULL, z: 5.0, z1: 5.2, fx: ["clouds"], desc: "直切左下角牛头特写，云气流动" } },
  { kind: "line", zh: "象征四方齐备，一切完整。", en: "They stand for all four quarters, complete.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["creatures"], desc: "直切整张牌，缓慢推近；四角的活物依次亮起" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "停滞与未竟", en: "REVERSED · STAGNATION, INCOMPLETION", rev: true },
  { kind: "line", zh: "花环不再颤动，丝巾垂落下来。", en: "The wreath is still, and the scarf hangs down.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；叶子与丝巾都停住" } },
  { kind: "line", zh: "最后一步，迟迟没有迈出。", en: "The last step is never taken.", shot: { f: LEGS, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的双腿特写，抬起的脚停在半空" } },
  { kind: "line", zh: "正位时，旅程在这里圆满。", en: "Upright, the journey is fulfilled here.", shot: { f: FACE, z: 5.0, z1: 5.25, flash: true, fx: ["scarf"], desc: "闪回正位她的脸与丝巾特写（原彩），丝巾重新扬起" } },
  { kind: "line", zh: "停在原地，圆便合不起来。", en: "Stand still, and the circle never closes.", shot: { f: RIBBON_B, z: 5.5, z1: 5.65, rev: true, desc: "直切倒置的底端红丝带特写，静止" } },
  { kind: "line", zh: "逆位象征停滞，与未完成的事。", en: "Reversed, it stands for stagnation and unfinished business.", shot: { f: FACE, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的脸部特写，静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.56 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "她交叉的双腿，和倒吊人一样。", en: "Her crossed legs mirror the Hanged Man's.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["legs"], desc: "正位整张牌，交叉的双腿描出一道金线" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XXI lights, "已收录 10 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
