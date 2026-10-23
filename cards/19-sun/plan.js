// XIX 太阳 — episode plan (series episode 8). Shot focus points are scan px of scans/RWS_Tarot_19_Sun.jpg (1114x1919).
// The 1909 scan shows the child nude: if the user supplies a clothed version (as for Lovers / Star), use it as the
// base image and re-measure every point below on that image.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910):
//   Part I: "The naked child mounted on a white horse and displaying a red standard has been mentioned already as
//    the better symbolism connected with this card."
//   Part II §19: "...coming out from the walled garden of the sensitive life and passing on the journey home."
//   "The sun is that of consciousness in the spirit - the direct as the antithesis of the reflected light."
//   "...a little child therein--a child in the sense of simplicity and innocence in the sense of wisdom."
//   divinatory: "Material happiness, fortunate marriage, contentment. Reversed: The same in a lesser sense."
// Upright follows the mainstream modern RWS reading (vitality; joy; success); reversed (dimmed joy,
// over-optimism, delayed success) is the modern consensus, close to Waite's "the same in a lesser sense".
// Hook answers the Moon episode ("月光很亮，却不是它自己的光"): direct vs reflected light is Waite's own contrast.
// Sunflowers as reward / ripening under the sun is a common modern reading, not Waite's — the caption says "象征".
// Trivia: the sun's rays alternate straight and wavy (visible on the card; recount when cutting ray sprites).

const OPEN_DUR = 2.0; // the red banner snaps open in the wind, sun rays flare once (see layers.tsx)

const CENTER = [545, 860]; // card centre (full shot)
const SUN = [543, 375]; // the sun disc with its face
const RAYS = [300, 620]; // lower-left rays: straight and wavy alternating
const CHILD = [420, 1150]; // the child on the horse, arms open
const FACE = [435, 1035]; // the child's face and feather crown
const BANNER = [800, 820]; // the red standard billowing behind
const HORSE = [705, 1350]; // the white horse's head
const WALL = [200, 1200]; // the stone wall behind the child
const FLOWERS = [270, 860]; // the sunflowers on top of the wall

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: BANNER, z: 5.6, z1: 5.8, fx: ["banner", "flare"], desc: "红旗特写；第 1 帧一阵风把旗帜扬开，旗面起伏；阳光一亮；风声 + 布料扬起声" } },
  { kind: "line", style: "hook", zh: "月光是借来的光，", en: "Moonlight is borrowed light,", pad: 0.2, shot: { pull: true, fx: ["banner"], desc: "从红旗拉远到整张牌，旗帜继续飘动" } },
  { kind: "line", style: "hook", zh: "太阳的光，是它自己的。", en: "but the sun's light is its own.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant", "banner"], desc: "整张牌，静止停留；太阳光芒缓缓呼吸" } },
  { kind: "names", zh: "它的含义，藏在太阳、骑马的孩子与向日葵之中。", names: ["太阳", "骑马的孩子", "向日葵"], en: "Its meaning lies in the sun, the child on horseback, and the sunflowers.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["banner"], desc: "同一镜头，不切；太阳、孩子、向日葵依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "太阳", meaning: "活力", en: "THE SUN · VITALITY" },
  { kind: "line", zh: "天空正中，是一轮带着人脸的太阳。", en: "At the centre of the sky is a sun with a human face.", shot: { f: SUN, z: 4.6, z1: 4.8, fx: ["radiant"], desc: "太阳正脸特写，缓慢推近；光芒呼吸" } },
  { kind: "line", zh: "光芒一直一曲，洒向大地。", en: "Its rays, straight and wavy, pour down on the land.", shot: { f: RAYS, z: 5.6, z1: 5.8, fx: ["rays"], desc: "直切左下光芒特写：直线与波浪光芒交替闪亮" } },
  { kind: "line", zh: "象征毫无保留的生命力。", en: "It stands for vitality given without reserve.", shot: { f: SUN, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["radiant"], desc: "从太阳缓缓拉回整张牌，阳光洒满画面" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "骑马的孩子", meaning: "喜悦", en: "THE CHILD ON THE WHITE HORSE · JOY" },
  { kind: "line", zh: "一个孩子骑着白马，张开双臂。", en: "A child rides a white horse, arms spread wide.", shot: { f: CHILD, z: 4.6, z1: 4.8, fx: ["ride"], desc: "孩子与白马同框，白马微微点头，孩子轻轻起伏" } },
  { kind: "line", zh: "红色的旗帜，在他身后飘扬。", en: "A red banner streams out behind him.", shot: { f: BANNER, z: 5.0, z1: 5.2, fx: ["banner"], desc: "直切红旗特写，旗面大幅起伏；布料声" } },
  { kind: "line", zh: "象征纯真、坦然的喜悦。", en: "It stands for simple, open-hearted joy.", shot: { f: FACE, z: 7.0, z1: 7.2, fx: ["flare"], desc: "直切孩子的脸与羽毛花冠特写，羽毛轻颤，暖光掠过" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "向日葵", meaning: "成功", en: "THE SUNFLOWERS · SUCCESS" },
  { kind: "line", zh: "孩子身后，是一道石墙。", en: "Behind the child stands a stone wall.", shot: { f: WALL, z: 5.0, z1: 5.2, fx: ["sweep"], desc: "石墙特写，阳光从墙面缓缓扫过" } },
  { kind: "line", zh: "墙头的向日葵，开得正盛。", en: "Along its top, sunflowers are in full bloom.", shot: { f: FLOWERS, z: 5.0, z1: 5.2, fx: ["sway"], desc: "直切墙头向日葵特写，花盘随风轻摆" } },
  { kind: "line", zh: "象征付出之后的收获与成功。", en: "They stand for the harvest and success that follow effort.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["sway", "radiant"], desc: "直切整张牌，缓慢推近；向日葵轻摆，阳光呼吸" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "喜悦减弱与过度乐观", en: "REVERSED · DIMMED JOY, OVER-OPTIMISM", rev: true },
  { kind: "line", zh: "阳光变弱，旗帜垂了下来。", en: "The sunlight weakens, and the banner hangs limp.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["dim"], desc: "倒置全牌，画面整体变暗；旗帜只有微弱起伏" } },
  { kind: "line", zh: "喜悦还在，只是没有那么满。", en: "The joy is still there, just not as full.", shot: { f: SUN, z: 4.6, z1: 4.75, rev: true, desc: "直切倒置的太阳特写，光芒微弱，几乎不动" } },
  { kind: "line", zh: "正位时，阳光毫无保留。", en: "Upright, the sunlight holds nothing back.", shot: { f: SUN, z: 4.6, z1: 4.85, flash: true, fx: ["radiant"], desc: "闪回正位太阳特写（原彩），光芒重新呼吸" } },
  { kind: "line", zh: "太过乐观，也会看不见阴影。", en: "Too much optimism can hide the shadows.", shot: { f: FACE, z: 7.0, z1: 7.15, rev: true, desc: "直切倒置的孩子脸部特写，静止" } },
  { kind: "line", zh: "逆位象征喜悦减弱，成功推迟。", en: "Reversed, it stands for dimmed joy and delayed success.", shot: { f: FLOWERS, z: 5.0, z1: 5.15, rev: true, desc: "直切倒置的向日葵特写，花盘不再摆动" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 6.41 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "太阳的光芒，直线与波浪交替。", en: "The sun's rays alternate, straight and wavy.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["rayCount"], desc: "正位整张牌，直线光芒与波浪光芒交替亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, XIX lights, "已收录 8 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
