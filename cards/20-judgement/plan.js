// XX 审判 — episode plan (series episode 9). Shot focus points are scan px of scans/RWS_Tarot_20_Judgement.jpg (1115x1920).
// The 1909 scan shows the rising figures nude: if the user supplies a clothed version (as for Lovers / Star), use it
// as the base image and re-measure every point below on that image.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §20:
//   "The great angel is here encompassed by clouds, but he blows his bannered trumpet, and the cross as usual is
//    displayed on the banner. The dead are rising from their tombs--a woman on the right, a man on the left hand,
//    and between them their child, whose back is turned. But in this card there are more than three who are restored"
//   "...the great work of transformation in answer to the summons of the Supernal--which summons is heard and
//    answered from within."
//   divinatory: "Change of position, renewal, outcome. Another account specifies total loss through lawsuit.
//    Reversed: Weakness, pusillanimity, simplicity; also deliberation, decision, sentence."
// Upright follows the mainstream modern RWS reading (the inner call; rebirth / awakening; reckoning with the past);
// reversed (hesitation, ignoring the call, harsh self-judgement) is the modern consensus, close to Waite's
// "weakness, pusillanimity ... deliberation".
// The open tombs as a review of the past is a modern reading, not Waite's — the caption says "象征".
// Trivia: six figures rise, not three (Waite, "more than three"; count on the scan: man, woman, child + three behind).

const OPEN_DUR = 2.0; // the trumpet sounds: light rays burst from the bell, the banner snaps (see layers.tsx)

const CENTER = [555, 880]; // card centre (full shot)
const FACE = [520, 300]; // the angel's face
const TRUMPET = [640, 820]; // trumpet and bell, with the rays below it
const BANNER = [440, 810]; // the banner with the red cross
const CHILD = [525, 1360]; // the child in the middle tomb, back turned, arms raised
const RAISED = [600, 1230]; // the figures behind, arms raised toward the sound
const WOMAN = [930, 1250]; // the woman on the right, arms outstretched
const TOMB = [540, 1560]; // the open tombs floating on the water
const TOMBS_R = [760, 1460]; // the tombs and the grey sea to the right

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: TRUMPET, z: 5.6, z1: 5.8, fx: ["blast", "banner"], desc: "号角特写；第 1 帧号角吹响，光线从号口放射，红十字旗一扬；号角声" } },
  { kind: "line", style: "hook", zh: "号角从天上吹响，", en: "The trumpet sounds from the sky,", pad: 0.2, shot: { pull: true, fx: ["blast"], desc: "从号角拉远到整张牌，号口光线一圈圈放射" } },
  { kind: "line", style: "hook", zh: "回应却来自心里。", en: "but the answer comes from within.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant"], desc: "整张牌，静止停留；天使身后的光缓缓呼吸" } },
  { kind: "names", zh: "它的含义，藏在号角、起身的人与漂浮的棺木之中。", names: ["号角", "起身的人", "漂浮的棺木"], en: "Its meaning lies in the trumpet, the rising figures, and the floating tombs.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, desc: "同一镜头，不切；号角、起身的人、棺木依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "号角", meaning: "召唤", en: "THE TRUMPET · THE CALL" },
  { kind: "line", zh: "云中的天使，吹响了号角。", en: "An angel in the clouds blows a trumpet.", shot: { f: TRUMPET, z: 4.6, z1: 4.8, fx: ["blast"], desc: "号角与吹号的手同框，缓慢推近；号口光线放射；号角声" } },
  { kind: "line", zh: "号角上，挂着一面红十字旗。", en: "From it hangs a banner with a red cross.", shot: { f: BANNER, z: 5.0, z1: 5.2, fx: ["banner"], desc: "直切红十字旗特写，旗面轻轻起伏" } },
  { kind: "line", zh: "象征来自内心深处的召唤。", en: "It stands for a call from deep within.", shot: { f: FACE, z: 6.0, z1: 6.2, fx: ["radiant"], desc: "直切天使脸部特写，金发微动，暖光掠过" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "起身的人", meaning: "重生", en: "THE RISING FIGURES · REBIRTH" },
  { kind: "line", zh: "棺木打开，人们从中起身。", en: "The tombs open, and the dead rise.", shot: { f: CHILD, z: 4.6, z1: 4.8, fx: ["rise"], desc: "中间棺木特写：背对画面的孩子缓缓升起" } },
  { kind: "line", zh: "他们张开双臂，迎向号声。", en: "They open their arms to the sound.", shot: { f: RAISED, z: 4.6, z1: 4.8, fx: ["rise"], desc: "直切远处举臂的人群特写，手臂微微上扬" } },
  { kind: "line", zh: "象征觉醒，与一段新的生命。", en: "It stands for awakening and a new life.", shot: { f: WOMAN, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["radiant"], desc: "从右侧张臂的女子缓缓拉回整张牌，光从号角洒下" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "漂浮的棺木", meaning: "清算", en: "THE FLOATING TOMBS · RECKONING" },
  { kind: "line", zh: "棺木漂在灰色的水面上。", en: "The tombs float on grey water.", shot: { f: TOMB, z: 4.6, z1: 4.8, fx: ["water"], desc: "棺木特写，水面轻轻起伏，棺木微微摇晃" } },
  { kind: "line", zh: "每一具，都已经打开。", en: "Every one of them stands open.", shot: { f: TOMBS_R, z: 5.0, z1: 5.2, fx: ["water", "sweep"], desc: "直切右侧棺木与海面特写，水面波光" } },
  { kind: "line", zh: "象征直面过去，作出了结。", en: "It stands for facing the past and settling it.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["water"], desc: "直切整张牌，缓慢推近；水面起伏" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "犹豫与忽视召唤", en: "REVERSED · HESITATION, IGNORING THE CALL", rev: true },
  { kind: "line", zh: "号声变得遥远，几乎听不见了。", en: "The trumpet grows distant, almost unheard.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；号口光线熄灭" } },
  { kind: "line", zh: "也有人留在棺中，迟迟没有起身。", en: "Some stay in their tombs, slow to rise.", shot: { f: CHILD, z: 4.6, z1: 4.75, rev: true, desc: "直切倒置的中间棺木特写，孩子静止不动" } },
  { kind: "line", zh: "正位时，所有人都应声而起。", en: "Upright, everyone rises at the sound.", shot: { f: RAISED, z: 4.6, z1: 4.85, flash: true, fx: ["rise"], desc: "闪回正位远处人群特写（原彩），手臂再次上扬" } },
  { kind: "line", zh: "犹豫太久，便会错过时机。", en: "Wait too long, and the moment passes.", shot: { f: TRUMPET, z: 4.6, z1: 4.75, rev: true, desc: "直切倒置的号角特写，静止无声" } },
  { kind: "line", zh: "逆位象征犹豫，与过度的自责。", en: "Reversed, it stands for hesitation and harsh self-judgement.", shot: { f: FACE, z: 6.0, z1: 6.15, rev: true, desc: "直切倒置的天使脸部特写，静止" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 6.58 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "起身的不止三人，画中共有六人。", en: "Not three but six figures rise.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["figureCount"], desc: "正位整张牌，六个起身的人依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XX lights, "已收录 9 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
