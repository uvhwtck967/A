// XX 审判 — episode plan. Shot focus points are px of scans/RWS_Tarot_20_Judgement_着衣版.png (956x1646), the user's
// clothed-figure version (the 1909 scan RWS_Tarot_20_Judgement.jpg shows the rising figures nude; kept for reference).
// Storyboard version chosen by the user 2026-10-24 (the "new" draft: 号角 / 起身的人 / 张开的双臂).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §20 "The Last Judgment":
//   "The great angel is here encompassed by clouds, but he blows his bannered trumpet, and the cross as usual is
//    displayed on the banner. The dead are rising from their tombs—a woman on the right, a man on the left hand,
//    and between them their child, whose back is turned. But in this card there are more than three who are restored"
//   "all the figures are as one in the wonder, adoration and ecstasy expressed by their attitudes."
//   "...in answer to the summons of the Supernal—which summons is heard and answered from within."
//   divinatory (Part III §2): "Change of position, renewal, outcome. ... Reversed: Weakness, pusillanimity,
//    simplicity; also deliberation, decision, sentence."
// Upright follows the mainstream modern RWS reading (awakening; rebirth/renewal; answering an inner call);
// reversed (hesitation, self-doubt, ignoring the call) is the modern consensus, close to Waite's "pusillanimity".
// Trivia: Waite's "more than three who are restored" — six figures rise (3 in front, 3 in the distance).
//
// Zoom → visible window on this frame: about 3949/z × 2221/z scan px (clampCam keeps it inside the picture).

const OPEN_DUR = 2.0; // the trumpet sounds: sound-rays pulse down from the bell, the banner ripples (see layers.tsx)

const CENTER = [473, 742]; // card centre (full shot)
const ANGEL = [455, 300]; // the angel's face, finger and mouthpiece
const BANNER = [330, 690]; // white banner with the red cross
const BELL = [560, 820]; // the trumpet's bell
const RAYS = [570, 910]; // the sound-rays fanning down from the bell toward the figures
const FAMILY = [473, 1120]; // man (left), child (back turned), woman (right) — all three in one frame
const DISTANT = [500, 1050]; // the three distant figures rising from coffins on the sea
const COFFIN = [470, 1370]; // the open coffin in the foreground
const WOMAN = [770, 925]; // the woman on the right, face up, arms out
const MAN_HANDS = [260, 1000]; // the man on the left, face up, hands raised

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: BELL, z: 6.5, z1: 6.7, fx: ["blast", "banner"], desc: "号角口特写；第 1 帧号声响起，声纹光线一道道向下扩散，旗面被气流掀动；铜管长鸣" } },
  { kind: "line", style: "hook", zh: "号角声从云端传来，", en: "A trumpet sounds from the clouds,", pad: 0.2, shot: { pull: true, fx: ["blast"], desc: "从号角口拉远到整张牌，声纹光线继续扩散" } },
  { kind: "line", style: "hook", zh: "沉睡的人纷纷醒来。", en: "and the sleepers wake.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["rise"], desc: "整张牌，静止停留；棺中的人随号声微微抬身" } },
  { kind: "names", zh: "它的含义，藏在号角、起身的人与张开的双臂之中。", names: ["号角", "起身的人", "张开的双臂"], en: "Its meaning lies in the trumpet, the rising figures, and their open arms.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["rise"], desc: "同一镜头，不切；号角、起身的人、张开的双臂依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "号角", meaning: "召唤", en: "THE TRUMPET · THE CALL" },
  { kind: "line", zh: "天使从云中探身，吹响号角。", en: "An angel leans from the clouds and sounds the trumpet.", shot: { f: ANGEL, z: 6.0, z1: 6.25, fx: ["clouds"], desc: "天使脸部与号嘴特写，缓慢推近；两侧云团缓缓翻涌" } },
  { kind: "line", zh: "号角上，悬着一面红十字旗。", en: "From the trumpet hangs a banner with a red cross.", shot: { f: BANNER, z: 6.5, z1: 6.7, fx: ["banner"], desc: "直切十字旗特写，旗面轻轻起伏" } },
  { kind: "line", zh: "象征一声来自内心的召唤。", en: "It stands for a call heard from within.", shot: { f: RAYS, z: 5.6, z1: 5.8, fx: ["blast"], desc: "直切号角口与下方声纹光线，光线一道道扩散向人群；号声" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "起身的人", meaning: "重生", en: "THE RISEN · REBIRTH" },
  { kind: "line", zh: "一家三口，从敞开的棺木中起身。", en: "A man, a woman and their child rise from an open coffin.", shot: { f: FAMILY, z: 4.6, z1: 4.75, fx: ["rise"], desc: "男人、背对镜头的孩子、女人同框，三人随号声微微上移" } },
  { kind: "line", zh: "远处的海面上，还有人在醒来。", en: "Out on the sea, others are waking too.", shot: { f: DISTANT, z: 8.0, z1: 8.2, fx: ["rise", "sweep"], desc: "直切远处海面上的三个人特写，棺木随水面轻轻起伏，水面波光" } },
  { kind: "line", zh: "象征告别过去，重新开始。", en: "It stands for leaving the past behind and beginning again.", shot: { f: COFFIN, z: 5.2, z1: 5.4, desc: "直切前景敞开的棺木特写，棺沿上掠过一线微光" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "张开的双臂", meaning: "回应", en: "OPEN ARMS · ANSWERING" },
  { kind: "line", zh: "他们张开双臂，仰望天空。", en: "They open their arms and look up to the sky.", shot: { f: WOMAN, z: 7.0, z1: 7.2, fx: ["radiant"], desc: "右侧女子特写：仰脸张臂，天光从上方洒下" } },
  { kind: "line", zh: "不是恐惧，而是惊奇与喜悦。", en: "Not with fear, but with wonder and joy.", shot: { f: MAN_HANDS, z: 7.0, z1: 7.2, fx: ["radiant"], desc: "直切左侧男子举起的双手特写，天光渐亮" } },
  { kind: "line", zh: "象征听见召唤，并作出回应。", en: "It stands for hearing the call, and answering it.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["blast", "rise"], desc: "直切整张牌：号声光线扩散，所有人一同抬身" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "犹豫与自我怀疑", en: "REVERSED · HESITATION, SELF-DOUBT", rev: true },
  { kind: "line", zh: "号角仍在吹响，", en: "The trumpet still sounds,", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌，寒霜从边缘蔓延；声纹光线变弱" } },
  { kind: "line", zh: "声音却像隔着一层雾。", en: "but it comes as if through fog.", shot: { f: RAYS, z: 5.6, z1: 5.75, rev: true, desc: "直切倒置的号角口特写，光线几乎不动" } },
  { kind: "line", zh: "正位时，所有人都应声而起。", en: "Upright, everyone rises at the sound.", shot: { f: FAMILY, z: 4.6, z1: 4.8, flash: true, fx: ["rise"], desc: "闪回正位一家三口特写（原彩），三人随号声抬身" } },
  { kind: "line", zh: "犹豫太久，便错过了起身的时刻。", en: "Hesitate too long, and the moment to rise passes.", shot: { f: COFFIN, z: 5.2, z1: 5.35, rev: true, desc: "直切倒置的棺木特写，静止" } },
  { kind: "line", zh: "逆位象征自我怀疑，回避召唤。", en: "Reversed, it stands for self-doubt and ignoring the call.", shot: { f: ANGEL, z: 6.0, z1: 6.15, rev: true, desc: "直切倒置的天使脸部特写，云团停住" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.31 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "醒来的不只一家三口，牌上一共六个人。", en: "Not just one family wakes: six figures rise on the card.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["riseCount"], desc: "正位整张牌，六个起身的人依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XX lights, "已收录 9 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
