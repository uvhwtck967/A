// XVIII 月亮 — episode plan (series episode 7). Shot focus points are scan px of scans/RWS_Tarot_18_Moon.jpg (1111x1919),
// measured on out/18-moon/check/full_grid.jpg.
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
// Upright follows the mainstream modern RWS reading (illusion; fear; the subconscious); reversed (confusion clearing,
// easing fear, suppressed emotion) is the modern consensus. Dog = domesticated / wolf = wild is a common modern reading.
// Trivia: Waite's "the dew of thought falls".
//
// Follows the user's final storyboard (out/18-moon/分镜.md, "中英文字幕与画面修订版", 2026-10-24): every segment has the
// storyboard's own duration (total 1:21.2, teaser at 1:16.7 for 4.5 s). The reversed part stays reversed throughout
// (no upright flashback).

const OPEN_DUR = 2.0; // the crayfish lifts its claws out of the pool, ripples spread, a distant howl (see layers.tsx)

const CENTER = [551, 860]; // card centre (full shot)
const FACE = [610, 405]; // the profile face inside the moon
const DEW = [560, 770]; // the falling drops ("dew of thought") below the moon
const FIELD = [600, 1080]; // the field and the path under the moonlight
const PAIR = [600, 1120]; // dog and wolf together (both whole)
const CRAYFISH = [490, 1510]; // the crayfish crawling out of the pool
const DEEP = [820, 1590]; // the deep water of the pool, right of the crayfish
const SURFACE = [520, 1540]; // the crayfish and the water surface together

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: CRAYFISH, z: 5.8, z1: 6.0, fx: ["emerge"], desc: "池塘特写；第 1 帧鳌虾从水里探出双钳，涟漪荡开；水声 + 远处一声嚎叫" } },
  { kind: "line", style: "hook", zh: "月光很亮，", en: "The moonlight is bright,", dur: 2.2, shot: { pull: true, fx: ["dew"], desc: "从池塘拉远到整张牌，露珠缓缓飘落" } },
  { kind: "line", style: "hook", zh: "却不是它自己的光。", en: "yet the light is not its own.", dur: 2.5, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant", "dew"], desc: "整张牌，静止停留；月亮光芒缓缓呼吸" } },
  { kind: "names", zh: "它的含义，藏在月亮、狗与狼、鳌虾之中。", names: ["月亮", "狗与狼", "鳌虾"], en: "Its meaning lies in the moon, the dog and the wolf, and the crayfish.", dur: 3.9, shot: { full: true, z: 1.02, z1: 1.05, link: true, fx: ["dew"], desc: "同一镜头，不切；月亮、狗与狼、鳌虾依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "月亮", meaning: "幻象", en: "THE MOON · ILLUSION" },
  { kind: "line", zh: "月亮反射着太阳的光。", en: "The moon reflects the light of the sun.", dur: 2.8, shot: { f: FACE, z: 5.4, z1: 5.7, fx: ["radiant"], desc: "月中侧脸特写，缓慢推近；光芒呼吸" } },
  { kind: "line", zh: "光线朦胧，难以看清眼前的景象。", en: "In the dim light, the scene is hard to make out.", dur: 2.7, shot: { f: FIELD, z: 4.55, z1: 4.75, fx: ["haze"], desc: "切至月光下的原野与小路，景物轮廓朦胧，缓慢推近" } },
  { kind: "line", zh: "模糊之处，真实与幻象交织。", en: "Where things grow indistinct, reality and illusion intertwine.", dur: 2.8, shot: { f: FIELD, z: 4.75, z1: 4.95, link: true, fx: ["haze", "mist"], desc: "延续上一镜，不切；原野与小路保持朦胧，薄雾缓缓掠过" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "狗与狼", meaning: "恐惧", en: "THE DOG AND THE WOLF · FEAR" },
  { kind: "line", zh: "狗与狼，都对着月亮嚎叫。", en: "Both the dog and the wolf howl at the moon.", dur: 2.9, shot: { f: PAIR, z: 4.55, z1: 4.65, fx: ["howl"], desc: "狗与狼同框，两颗头微微上扬；嚎叫声" } },
  { kind: "line", zh: "一个经过驯化，一个保留野性。", en: "One is domesticated; the other remains wild.", dur: 2.8, shot: { f: PAIR, z: 4.65, z1: 4.75, link: true, fx: ["tameWild"], desc: "狗与狼持续同框，不切；说到「经过驯化」时狗轻微加亮，说到「保留野性」时狼轻微加亮，随后恢复" } },
  { kind: "line", zh: "面对未知，都流露出本能的恐惧。", en: "Both express an instinctive fear of the unknown.", dur: 2.9, shot: { f: PAIR, z: 4.75, z1: 4.85, link: true, fx: ["howl"], desc: "狗与狼持续同框，不切；两者仰头嚎叫，配合嚎叫声" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "鳌虾", meaning: "潜意识", en: "THE CRAYFISH · THE SUBCONSCIOUS" },
  { kind: "line", zh: "一只鳌虾，从池水中缓缓爬出。", en: "A crayfish slowly crawls out of the pool.", dur: 3.0, shot: { f: CRAYFISH, z: 5.6, z1: 5.85, fx: ["emerge"], desc: "鳌虾特写，双钳缓缓抬起，水面涟漪" } },
  { kind: "line", zh: "池水象征内心深处，藏着尚未察觉的情绪。", en: "The pool represents the depths of the mind, holding emotions not yet recognised.", dur: 2.8, shot: { f: DEEP, z: 6.0, z1: 6.4, fx: ["deep"], desc: "切至池水深处特写，水色渐深，水下轮廓隐约可见，镜头缓慢推近" } },
  { kind: "line", zh: "鳌虾浮出水面，如同潜意识逐渐显现。", en: "As the crayfish surfaces, so does the subconscious.", dur: 2.6, shot: { f: SURFACE, z: 4.6, z1: 4.8, fx: ["emerge", "sweep"], desc: "鳌虾与水面同框，鳌虾缓缓浮现，涟漪一圈圈扩散" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "迷雾渐散与内在不安", en: "REVERSED · CLEARING CONFUSION AND INNER UNEASE", rev: true },
  { kind: "line", zh: "迷雾渐渐消散，真相浮出水面。", en: "The mist clears, and the truth comes to light.", dur: 2.6, shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["mistClear"], desc: "倒置全牌，薄雾直接缓缓散开，原有景物逐渐清晰" } },
  { kind: "line", zh: "恐惧随之减弱，不安逐渐缓解。", en: "Fear subsides, and unease begins to ease.", dur: 2.7, shot: { f: PAIR, z: 4.6, z1: 4.7, rev: true, fx: ["relax"], desc: "切至倒置狗与狼同框，两者头部与身体轻微舒缓，逐渐放松；仅保留轻微动作，不作嚎叫动作，不配嚎叫声" } },
  { kind: "line", zh: "也可能只是压抑了情绪。", en: "Or emotions may simply be suppressed.", dur: 2.6, shot: { f: CRAYFISH, z: 5.6, z1: 5.75, rev: true, fx: ["sink"], desc: "切至倒置鳌虾与池水特写，鳌虾缓缓隐入水下；保持倒置朝向" } },
  { kind: "line", zh: "表面平静，内心却仍在动荡。", en: "The surface is calm, yet turmoil remains within.", dur: 2.6, shot: { f: DEEP, z: 6.0, z1: 6.15, rev: true, fx: ["calm"], desc: "切至倒置池水特写，水面趋于平静，仍有细微涟漪缓缓扩散" } },
  { kind: "line", zh: "此时，需要勇于直面内心。", en: "Now, it takes courage to face what lies within.", dur: 3.3, shot: { full: true, z: 1.0, z1: 1.06, rev: true, desc: "倒置全牌，缓慢推近，静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.7 },
  { kind: "focus", zh: "月亮下飘落的光点，被韦特称为“思想的露珠”。", en: "Waite calls the falling drops beneath the moon “the dew of thought.”", dur: 3.4, shot: { f: DEW, z: 4.8, z1: 5.0, fx: ["dew", "dewLit"], desc: "切回正位月亮下方飘落光点的特写，光点一颗颗缓缓落下" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XVIII lights, "已收录 7 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR, CENTER };
