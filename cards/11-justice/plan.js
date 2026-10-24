// XI 正义 — episode plan (series episode 20). Shot focus points are scan px of scans/RWS_Tarot_11_Justice.jpg (1114x1919).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910):
//   Part II §11: "As this card follows the traditional symbolism and carries above all its obvious meanings, there is
//    little to say regarding it ..." "the figure is seated between pillars, like the High Priestess ... the moral
//    principle which deals unto every man according to his works ..."
//   Part III divinatory: "Equity, rightness, probity, executive; triumph of the deserving side in law.
//    Reversed: Law in all its departments, legal complications, bigotry, bias, excessive severity."
//   Part II §8 (Strength): "For reasons which satisfy myself, this card has been interchanged with that of Justice,
//    which is usually numbered eight."  → trivia in the focus line.
// Upright follows the mainstream modern RWS reading (scales → fairness; upright sword → clear judgement and decision;
// white shoe → actions have consequences). The shoe reading is modern, not Waite's — the caption says "常被解读为".
// Reversed (injustice, bias, avoiding responsibility) = Waite's "bias" + the modern consensus.

const OPEN_DUR = 2.0; // the scales swing in her left hand, then settle level (see layers.tsx)

const CENTER = [557, 960]; // card centre (full shot)
const SCALES = [900, 1040]; // the scales, beam and both pans
const HAND_L = [905, 900]; // her left hand holding the scales by the chain (viewer's right)
const PANS = [905, 1120]; // the two pans, level
const HILT = [185, 660]; // her right hand and the cross-guard (viewer's left)
const BLADE = [180, 260]; // the blade and the point, pointing up
const FACE = [530, 540]; // crown and face, looking straight ahead
const SHOE = [480, 1535]; // the white shoe under the hem
const HEM = [520, 1460]; // the hem of the robe and the step

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: SCALES, z: 5.4, z1: 5.6, fx: ["swing"], desc: "天平特写；第 1 帧两只秤盘一高一低地晃动，链条轻响，晃几下后逐渐停稳" } },
  { kind: "line", style: "hook", zh: "天平晃了几下，", en: "The scales swing a few times,", pad: 0.2, shot: { pull: true, fx: ["swing"], desc: "从天平拉远到整张牌，秤盘余晃" } },
  { kind: "line", style: "hook", zh: "慢慢停在了中间。", en: "then slowly come to rest in the middle.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["veil"], desc: "整张牌，静止停留；背后紫色帷幕轻轻起伏" } },
  { kind: "names", zh: "它的含义，藏在天平、剑与白鞋之中。", names: ["天平", "剑", "白鞋"], en: "Its meaning lies in the scales, the sword, and the white shoe.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["veil"], desc: "同一镜头，不切；天平、剑、白鞋依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "天平", meaning: "公平", en: "THE SCALES · FAIRNESS" },
  { kind: "line", zh: "她的左手，垂提着一架天平。", en: "In her left hand she holds a pair of scales.", shot: { f: HAND_L, z: 5.4, z1: 5.6, fx: ["swing"], desc: "握着天平的手与链条特写，天平极轻微地晃动" } },
  { kind: "line", zh: "两只秤盘，停在同一高度。", en: "The two pans hang at the same height.", shot: { f: PANS, z: 7.0, z1: 7.2, fx: ["glint"], desc: "直切两只秤盘特写，金属边缘闪过一道光" } },
  { kind: "line", zh: "象征公平：不偏向任何一方。", en: "It stands for fairness: favouring neither side.", shot: { f: SCALES, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["swing"], desc: "从天平缓缓拉回整张牌，天平在画面一侧保持水平" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "剑", meaning: "决断", en: "THE SWORD · DECISION" },
  { kind: "line", zh: "她的右手，竖举着一把剑。", en: "In her right hand she raises a sword.", shot: { f: HILT, z: 5.6, z1: 5.8, fx: ["glint"], desc: "握剑的手与剑格特写，剑格上闪过金属光" } },
  { kind: "line", zh: "剑身笔直，剑尖指向上方。", en: "The blade is straight, its point turned upward.", shot: { f: BLADE, z: 5.6, z1: 5.8, fx: ["edge"], desc: "直切剑身特写，一道光沿剑刃从下往上扫过" } },
  { kind: "line", zh: "象征清晰的判断，与果断的决定。", en: "It stands for clear judgement and firm decision.", shot: { f: FACE, z: 6.4, z1: 6.6, fx: ["veil"], desc: "直切王冠与脸部特写：她双眼睁开，直视前方；身后帷幕轻动" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "白鞋", meaning: "行动的后果", en: "THE WHITE SHOE · CONSEQUENCES" },
  { kind: "line", zh: "红袍下摆，露出一只白鞋。", en: "A white shoe shows beneath the red robe.", shot: { f: SHOE, z: 7.0, z1: 7.2, fx: ["shoe"], desc: "白鞋特写，鞋面一道柔光" } },
  { kind: "line", zh: "脚尖向前探出，像要迈步。", en: "The foot reaches forward, as if about to step.", shot: { f: HEM, z: 5.0, z1: 5.2, fx: ["shoe"], desc: "直切长袍下摆与台阶，白鞋在画面下方" } },
  { kind: "line", zh: "常被解读为：行动总会带来后果。", en: "It is often read as: every action has consequences.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["veil"], desc: "直切整张牌，缓慢推近" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "不公与逃避责任", en: "REVERSED · INJUSTICE, AVOIDING RESPONSIBILITY", rev: true },
  { kind: "line", zh: "天平和剑都还在，只是倒悬着。", en: "The scales and the sword remain, but hang upside down.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌（夜色版），固定；寒霜从边缘蔓延" } },
  { kind: "line", zh: "秤盘迟迟停不下来，轻重难辨。", en: "The pans will not settle; weight is hard to judge.", shot: { f: PANS, z: 6.4, z1: 6.6, rev: true, fx: ["tilt"], desc: "直切倒置的秤盘特写，秤盘一高一低地缓慢晃动，始终不停" } },
  { kind: "line", zh: "正位时，两只秤盘是平的。", en: "Upright, the two pans hang level.", shot: { f: PANS, z: 6.4, z1: 6.6, flash: true, fx: ["glint"], desc: "闪回正位秤盘特写（原彩），秤盘水平静止" } },
  { kind: "line", zh: "失去平衡，判断便容易带上偏见。", en: "Off balance, judgement easily turns biased.", shot: { f: FACE, z: 6.4, z1: 6.55, rev: true, desc: "直切倒置的脸部特写，静止" } },
  { kind: "line", zh: "也可能是，不愿为结果负责。", en: "Or it may be an unwillingness to own the outcome.", shot: { f: SHOE, z: 7.0, z1: 7.15, rev: true, desc: "直切倒置的白鞋特写，鞋面不再发光" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.65 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "传统牌序里它是 8 号，韦特把它与力量对调。", en: "Traditionally number 8, Waite swapped it with Strength.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["numeral"], desc: "正位整张牌，顶部罗马数字 XI 描金亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XI lights, "已收录 20 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
