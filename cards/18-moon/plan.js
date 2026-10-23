// XVIII 月亮 — episode plan (series episode 7). Shot focus points are scan px of scans/RWS_Tarot_18_Moon.jpg (1111x1919).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §18:
//   "It has sixteen chief and sixteen secondary rays. The card represents life of the imagination apart from
//    life of the spirit. The path between the towers is the issue into the unknown. The dog and wolf are the
//    fears of the natural mind in the presence of that place of exit, when there is only reflected light to guide it."
//   "...that which comes up out of the deeps, the nameless and hideous tendency which is lower than the savage
//    beast. It strives to attain manifestation, symbolized by crawling from the abyss of water to the land, but as
//    a rule it sinks back whence it came. The face of the mind directs a calm gaze upon the unrest below; the dew
//    of thought falls"
//   divinatory: "Hidden enemies, danger, calumny, darkness, terror, deception, occult forces, error.
//    Reversed: Instability, inconstancy, silence, lesser degrees of deception and error."
// Upright follows the mainstream modern RWS reading (illusion; fear and anxiety; the subconscious);
// reversed (confusion clearing, repressed fear) is the modern consensus, close to Waite's "lesser degrees of deception".
// Dog = tamed / wolf = wild is a common modern reading, not Waite's own.
// Trivia: 16 chief + 16 secondary rays (Waite, above) — recount on the scan when cutting the ray sprites.

const OPEN_DUR = 2.0; // the crayfish lifts its claws out of the pool, ripples spread, a distant howl (see layers.tsx)

const CENTER = [553, 857]; // card centre (full shot)
const MOON = [590, 400]; // the moon disc with its rays
const FACE = [600, 420]; // the profile face inside the moon
const DEW = [560, 790]; // the falling drops ("dew of thought") below the moon
const HOWL = [570, 1010]; // dog and wolf heads, both raised to the moon
const DOG_HEAD = [455, 990]; // the dog, left
const WOLF_HEAD = [690, 1010]; // the wolf, right
const PATH = [560, 1150]; // the path running from the pool between the towers
const CRAYFISH = [490, 1500]; // the crayfish crawling out of the water
const POOL = [500, 1600]; // the pool

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: CRAYFISH, z: 5.6, z1: 5.8, fx: ["emerge"], desc: "池塘特写；第 1 帧小龙虾从水里探出双钳，涟漪荡开；水声 + 远处一声嚎叫" } },
  { kind: "line", style: "hook", zh: "月光很亮，", en: "The moonlight is bright,", pad: 0.2, shot: { pull: true, fx: ["dew"], desc: "从池塘拉远到整张牌，露珠缓缓飘落" } },
  { kind: "line", style: "hook", zh: "却不是它自己的光。", en: "yet the light is not its own.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant", "dew"], desc: "整张牌，静止停留；月亮光芒缓缓呼吸" } },
  { kind: "names", zh: "它的含义，藏在月亮、狗与狼、小龙虾之中。", names: ["月亮", "狗与狼", "小龙虾"], en: "Its meaning lies in the moon, the dog and the wolf, and the crayfish.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["dew"], desc: "同一镜头，不切；月亮、狗与狼、小龙虾依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "月亮", meaning: "幻象", en: "THE MOON · ILLUSION" },
  { kind: "line", zh: "月亮里有一张脸，正向下望。", en: "There is a face in the moon, looking down.", shot: { f: FACE, z: 5.0, z1: 5.25, fx: ["radiant"], desc: "月中侧脸特写，缓慢推近；光芒呼吸" } },
  { kind: "line", zh: "露珠般的光点，从空中落下。", en: "Drops of light fall through the air like dew.", shot: { f: DEW, z: 5.0, z1: 5.2, fx: ["dew"], desc: "直切月亮下方的光点特写，光点一颗颗缓缓飘落" } },
  { kind: "line", zh: "反射的光，让一切真假难辨。", en: "Reflected light makes the real hard to tell from the false.", shot: { f: MOON, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["mist"], desc: "从月亮缓缓拉回整张牌，原野上浮起一层薄雾" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "狗与狼", meaning: "恐惧", en: "THE DOG AND THE WOLF · FEAR" },
  { kind: "line", zh: "一只狗、一头狼，对着月亮嚎叫。", en: "A dog and a wolf howl at the moon.", shot: { f: HOWL, z: 4.6, z1: 4.75, fx: ["howl"], desc: "狗与狼同框，两颗头微微上扬；嚎叫声" } },
  { kind: "line", zh: "一个被驯养，一个仍是野性。", en: "One is tame, the other still wild.", shot: { f: WOLF_HEAD, z: 7.0, z1: 7.2, fx: ["howl"], desc: "直切狼头特写，红眼、张口" } },
  { kind: "line", zh: "象征面对未知时，本能的恐惧。", en: "They stand for instinctive fear of the unknown.", shot: { f: DOG_HEAD, z: 7.0, z1: 7.2, fx: ["mist"], desc: "直切狗头特写，仰头望月；薄雾掠过" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "小龙虾", meaning: "潜意识", en: "THE CRAYFISH · THE SUBCONSCIOUS" },
  { kind: "line", zh: "一只小龙虾，从深水里爬上岸。", en: "A crayfish crawls out of the deep water.", shot: { f: CRAYFISH, z: 6.0, z1: 6.2, fx: ["emerge"], desc: "小龙虾特写，双钳缓缓抬起，水面涟漪" } },
  { kind: "line", zh: "一条小路，从水边伸向远方。", en: "A path leads from the water into the distance.", shot: { f: PATH, z: 4.6, z1: 4.8, fx: ["mist"], desc: "直切小路特写：穿过狗与狼之间，伸向两座塔之间的远山；薄雾流动" } },
  { kind: "line", zh: "象征浮出水面的潜意识。", en: "It stands for the subconscious rising to the surface.", shot: { f: POOL, z: 5.0, z1: 5.2, fx: ["emerge", "sweep"], desc: "直切池水特写，涟漪一圈圈扩散，水面波光" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "迷雾渐散与压抑的恐惧", en: "REVERSED · CONFUSION CLEARING, REPRESSED FEAR", rev: true },
  { kind: "line", zh: "月光变暗，露珠停在半空。", en: "The moonlight dims, and the dew hangs still.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；光点定住" } },
  { kind: "line", zh: "看不清的事，开始慢慢浮现。", en: "What was unclear begins to surface.", shot: { f: FACE, z: 5.0, z1: 5.15, rev: true, fx: ["mistClear"], desc: "直切倒置的月中侧脸特写，薄雾缓缓散开" } },
  { kind: "line", zh: "正位时，恐惧被月光放大。", en: "Upright, the moonlight magnifies fear.", shot: { f: HOWL, z: 4.6, z1: 4.8, flash: true, fx: ["howl"], desc: "闪回正位狗与狼特写（原彩），再次嚎叫" } },
  { kind: "line", zh: "倒过来，恐惧被压回心底。", en: "Reversed, the fear is pushed back down.", shot: { f: CRAYFISH, z: 6.0, z1: 6.15, rev: true, fx: ["sink"], desc: "直切倒置的小龙虾特写，缓缓沉回水中" } },
  { kind: "line", zh: "逆位象征迷惑渐消，与压抑的恐惧。", en: "Reversed, it stands for clearing confusion and repressed fear.", shot: { full: true, z: 1.0, z1: 1.06, rev: true, desc: "倒置全牌，缓慢推近，静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.65 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "月亮有十六道长光芒，十六道短光芒。", en: "The moon has sixteen long rays and sixteen short ones.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["rayCount"], desc: "正位整张牌，月亮的光芒依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XVIII lights, "已收录 7 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
