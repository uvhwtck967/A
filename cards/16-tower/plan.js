// XVI 高塔 — episode plan. Shot focus points are scan px of scans/RWS_Tarot_16_Tower.jpg (1109x1920).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §16:
//   "Occult explanations attached to this card are meagre and mostly disconcerting. It is idle to indicate that
//    it depicts min in all its aspects, because it bears this evidence on the surface."
//   "I agree rather with Grand Orient that it is the ruin of the House of Life, when evil has prevailed therein,
//    and above all that it is the rending of a House of Doctrine."
//   divinatory: "Misery, distress, indigence, adversity, calamity, disgrace, deception, ruin. It is a card in
//    particular of unforeseen catastrophe. Reversed: According to one account, the same in a lesser degree;
//    also oppression, imprisonment, tyranny."
// Upright follows the mainstream modern RWS reading (upheaval; collapse of false structures; forced liberation);
// reversed (resisting change, inner turmoil, self-deception) is the modern consensus.
// Trivia (user's storyboard): the 22 falling yods are read as the 22 Major Arcana / Hebrew letters — a common
// modern reading, not Waite's own; the count is checked in assets.py.

const OPEN_DUR = 2.0; // lightning strikes the top, the crown is knocked off and tumbles (see layers.tsx)

const CENTER = [533, 897]; // card centre (full shot)
const CROWN = [295, 104]; // the crown knocked off the top, upper left
const BOLT = [790, 190]; // the zigzag bolt, upper right
const TOP = [430, 250]; // tower top with the bolt tip, flames and the crown in the air
const STRUCK = [505, 430]; // where the bolt hits, the top of the trunk
const WINDOWS = [485, 640]; // three burning windows
const JUNCTION = [515, 1290]; // where the trunk meets the rock
const BASE = [508, 1470]; // the rock the tower stands on
const LEFT_FIG = [214, 994]; // falling figure, red cloak
const RIGHT_FIG = [830, 1080]; // falling figure, crowned
const MID = [520, 960]; // both figures and the tower trunk

// Follows the user's revised storyboard (out/16-tower/分镜.md, 2026-10-21). Captions keep the reading-time rule;
// the summary dur lands the teaser on 1:16.7.
const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: TOP, z: 5.0, z1: 5.2, fx: ["strike", "crownFall"], desc: "塔顶特写；第 1 帧闪电劈下，白光一闪，王冠被掀起、向左上翻落；雷声 + 金属撞击声" } },
  { kind: "line", style: "hook", zh: "高塔崩塌之前，", en: "Before the Tower falls,", pad: 0.2, shot: { pull: true, fx: ["flames"], desc: "从塔顶拉远到整张牌，塔顶火焰跳动" } },
  { kind: "line", style: "hook", zh: "裂缝早已出现。", en: "the cracks are already there.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["flames", "yods"], desc: "整张牌，静止停留；火焰跳动，空中火滴缓缓飘落" } },
  { kind: "names", zh: "它的含义，藏在闪电、高塔与坠落的人之中。", names: ["闪电", "高塔", "坠落的人"], en: "Its meaning lies in the lightning, the tower, and the falling figures.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["flames"], desc: "同一镜头，不切；闪电、高塔、两个人依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "闪电", meaning: "剧变", en: "THE LIGHTNING · UPHEAVAL" },
  { kind: "line", zh: "一道闪电，劈中了塔顶。", en: "A bolt of lightning strikes the top of the tower.", shot: { f: BOLT, z: 6.0, z1: 6.2, fx: ["strike"], desc: "闪电特写（右上折线一路到塔顶），固定；闪电再亮一次，雷声" } },
  { kind: "line", zh: "王冠被掀落，原有的秩序被打破。", en: "The crown falls, and the old order is broken.", shot: { f: TOP, z: 6.0, z1: 6.2, fx: ["flames", "crownFall"], desc: "直切塔顶特写：闪电落点与坠落的王冠同框，火焰跳动" } },
  { kind: "line", zh: "剧变残酷，却也让人看清隐藏的真相。", en: "Upheaval is harsh, but it reveals hidden truths.", shot: { f: WINDOWS, z: 6.4, z1: 6.6, fx: ["flames"], desc: "直切塔身窗口特写：三扇窗里的火光明暗起伏" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "高塔", meaning: "崩塌", en: "THE TOWER · COLLAPSE" },
  { kind: "line", zh: "高塔看似坚固，根基却早已不稳。", en: "The tower looks solid, but its foundations were already weak.", shot: { f: CENTER, f1: JUNCTION, z: 1.0, z1: 2.2, pullBack: true, fx: ["flames"], desc: "高塔全貌，缓慢推近塔身与岩石的连接处；火焰跳动" } },
  { kind: "line", zh: "闪电击中的这一刻，", en: "The moment lightning strikes,", shot: { f: STRUCK, z: 5.2, z1: 5.4, fx: ["strike", "dust"], desc: "直切塔身特写：闪电击中的位置与塔身同框，碎屑开始落下" } },
  { kind: "line", zh: "虚假的稳定必然走向崩塌。", en: "that false stability gives way to collapse.", shot: { f: BASE, z: 5.2, z1: 5.4, fx: ["dust"], desc: "直切塔基特写：岩石与塔身底部，碎屑与尘土从上方落下" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "坠落的人", meaning: "被迫的解放", en: "THE FALLING FIGURES · FORCED LIBERATION" },
  { kind: "line", zh: "坠落令人恐惧，", en: "Falling is terrifying,", shot: { f: MID, z: 4.6, z1: 4.75, fx: ["yods"], desc: "两人与塔身同框，固定；火滴从两人身边飘落" } },
  { kind: "line", zh: "他们被迫离开原来的位置，", en: "they are forced from their old positions,", shot: { f: RIGHT_FIG, z: 8.0, z1: 8.2, fx: ["yods"], desc: "直切右侧戴王冠的人特写，火滴飘过" } },
  { kind: "line", zh: "实则脱离了本就有问题的结构。", en: "yet they escape a structure that was flawed all along.", shot: { f: LEFT_FIG, z: 8.0, z1: 8.2, fx: ["yods"], desc: "直切左侧红袍人特写，火滴飘过" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "抗拒改变与内在煎熬", en: "REVERSED · RESISTING CHANGE, INNER TURMOIL", rev: true },
  { kind: "line", zh: "火焰变暗，却没有熄灭。", en: "The flames dim, but do not go out.", shot: { full: true, z: 1.0, z1: 1.02, rev: true, fx: ["frostGrow", "flames"], desc: "倒置全牌，固定；寒霜从边缘蔓延，火焰变暗但未熄" } },
  { kind: "line", zh: "明知塔身动摇，仍不肯离开。", en: "They know the tower is unstable, yet refuse to leave.", shot: { full: true, z: 1.02, z1: 1.05, rev: true, link: true, desc: "倒置后的同一镜头，不切；寒霜继续蔓延" } },
  { kind: "line", zh: "表面维持着原样，", en: "On the surface, nothing seems to change,", shot: { full: true, z: 1.05, z1: 1.08, rev: true, fx: ["flames"], desc: "承接上一镜持续推近倒置高塔，直到切塔基特写；塔内火光隐约闪动" } },
  { kind: "line", zh: "内心却怕它随时会倒下。", en: "but inside, they fear it could fall at any moment.", shot: { f: BASE, z: 5.2, z1: 5.35, rev: true, desc: "直切倒置的塔基特写，静止，落尘停住" } },
  { kind: "line", zh: "抗拒改变，让痛苦一再延长。", en: "Resisting change only prolongs the pain.", shot: { f: WINDOWS, z: 6.4, z1: 6.55, rev: true, fx: ["flames"], desc: "直切倒置的窗口特写；窗内火光持续跳动" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.67 }, // lands the teaser on 1:16.7 (SOP 0.4)
  // the atlas opens on the card itself: the yods light up one by one, then cut to the 22-slot grid
  { kind: "focus", zh: "牌面上有 22 点火滴，恰好对应大阿尔卡纳的 22 张牌。", en: "The card has 22 drops of fire, matching the 22 Major Arcana cards.", dur: 4.97, shot: { full: true, z: 1.0, z1: 1.04, fx: ["yodCount"], desc: "正位整张牌，火滴依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XVI lights, "已收录 5 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
