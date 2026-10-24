// XVII 星星 — episode plan (series episode 6). Shot focus points are px of scans/Star_clothed.png (955x1647), the
// user's clothed-figure version supplied 2026-10-21 (the 1909 scan shows the figure nude; RWS_Tarot_17_Star.jpg is
// kept only for reference). Measured on out/17-star/check/full_grid.jpg.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §17:
//   "A great, radiant star of eight rays, surrounded by seven lesser stars—also of eight rays."
//   "Her left knee is on the land and her right foot upon the water. She pours Water of Life from two great ewers,
//    irrigating sea and land. Behind her is rising ground and on the right a shrub or tree, whereon a bird alights."
//   "It has been said truly that the mottoes of this card are 'Waters of Life freely' and 'Gifts of the Spirit.'"
//   divinatory: "Loss, theft, privation, abandonment; another reading says—hope and bright prospects.
//    Reversed: Arrogance, haughtiness, impotence."
// Upright follows the mainstream modern RWS reading (hope; healing; inspiration); reversed (disappointment,
// uncertainty, self-doubt) is the modern consensus. Pool = inner world / land = outer world is a common modern reading.
//
// Follows the user's final storyboard (out/17-star/分镜.md, "字幕定稿与画面修订版", 2026-10-24): every segment has the
// storyboard's own duration, so the captions do not use the reading-time rule, and the teaser starts at 1:17.6 for
// 3.6 s (the user's choice, instead of the SOP's 1:16.7 / 4.5 s).

const OPEN_DUR = 1.8; // water pours from the left ewer into the pool, ripples spread (see layers.tsx)

const CENTER = [468, 727]; // card centre (full shot)
const STAR = [490, 290]; // the great eight-rayed star
const STARS_R = [745, 330]; // lesser stars, right column (clamped to the right edge: a corner of the great star shows)
const POUR_L = [240, 1080]; // left ewer and its stream into the pool
const POOL_HIT = [258, 1215]; // where the left stream meets the pool, ripples
const FIGURE = [520, 990]; // both ewers and both streams (z 4.55: ewers to just above the landings)
const LANDINGS = [520, 1110]; // both landing points: pool (left) and land (right)
const RIV_A = [700, 1150]; // the right stream coming down onto the land …
const RIV_B = [600, 1290]; // … and splitting across the grass (both clamped to the picture)
const TREE = [830, 580]; // the tree and the rising ground
const IBIS = [800, 478]; // the bird on the tree
const FACE = [345, 650]; // her face, looking down
const FACE_BIRD = [570, 565]; // her face and the bird in one frame

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: POUR_L, z: 5.6, z1: 5.8, fx: ["pour"], desc: "左手水壶特写；第 1 帧水流落进池塘，涟漪一圈圈荡开；水声" } },
  { kind: "line", style: "hook", zh: "手持两壶水，", en: "With two pitchers in her hands,", dur: 1.8, shot: { f: POUR_L, f1: FIGURE, z: 5.8, z1: 4.55, pullBack: true, fx: ["pour", "streams", "pool"], desc: "从池塘水流拉远至女子与双壶同框，两道水流清晰可见" } },
  { kind: "line", style: "hook", zh: "为何分别倒向池塘与大地？", en: "why does she pour water into the pool and onto the land?", dur: 2.7, shot: { f: FIGURE, f1: LANDINGS, z: 4.55, z1: 4.6, link: true, fx: ["pour", "streams", "pool", "landings"], desc: "女子与池塘、大地同框，依次强调两股水流的落点" } },
  { kind: "names", zh: "它的含义，藏在八芒星、倒水的女子与圣鸟之中。", names: ["八芒星", "倒水的女子", "圣鸟"], en: "Its meaning lies in the eight-pointed star, the woman pouring water, and the sacred bird.", dur: 4.4, shot: { f: LANDINGS, f1: CENTER, z: 4.6, z1: 1.0, pullBack: true, desc: "缓缓拉回整张牌；八芒星、女子、圣鸟依次亮起柔和光晕" } },
  { kind: "title", dur: 1.4 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 1.8, label: "含义一", symbol: "八芒星", meaning: "希望", en: "THE EIGHT-POINTED STAR · HOPE" },
  { kind: "line", zh: "夜空中央，是一颗八芒大星。", en: "At the centre of the night sky shines a great eight-pointed star.", dur: 2.8, shot: { f: STAR, z: 5.0, z1: 5.25, fx: ["radiant"], desc: "大星特写，缓慢推近；光芒旋转、呼吸" } },
  { kind: "line", zh: "七颗小星，环绕在它四周。", en: "Seven smaller stars surround it.", dur: 2.3, shot: { f: STARS_R, z: 6.0, z1: 6.2, fx: ["twinkle"], desc: "直切右侧小星特写（大星一角入画），小星逐颗闪烁" } },
  { kind: "line", zh: "星光驱散黑暗，为人指引方向。", en: "Starlight dispels the darkness and guides the way.", dur: 2.9, shot: { f: STAR, f1: CENTER, z: 5.0, z1: 1.0, pullBack: true, fx: ["radiant"], desc: "从大星缓缓拉回整张牌，星光洒向原野" } },

  { kind: "chapter", dur: 2.0, label: "含义二", symbol: "倒水的女子", meaning: "疗愈", en: "THE WOMAN POURING WATER · HEALING" },
  { kind: "line", zh: "女子手持双壶，分别倒向池塘与大地。", en: "The woman pours from two pitchers, one into the pool, the other onto the land.", dur: 3.7, shot: { f: FIGURE, z: 4.55, z1: 4.7, fx: ["pour", "streams", "pool"], desc: "女子与双壶同框，清晰展示一股水流入池塘，另一股流向大地" } },
  { kind: "line", zh: "池水象征内在，水流滋养着情绪与潜意识。", en: "The pool represents the inner world, its waters nourishing emotions and the subconscious.", dur: 4.1, shot: { f: POOL_HIT, z: 5.6, z1: 6.1, fx: ["pour", "pool"], desc: "直切流入池塘的水流与涟漪特写，缓慢推近水面" } },
  { kind: "line", zh: "大地象征现实，让这份滋养延伸到现实生活。", en: "The land represents the outer world, extending this nourishment into everyday life.", dur: 4.1, shot: { f: RIV_A, f1: RIV_B, z: 7.5, z1: 7.5, fx: ["streams", "sweep"], desc: "直切地面水流特写，镜头沿分流缓慢移动，水向草地延伸" } },

  { kind: "chapter", dur: 1.8, label: "含义三", symbol: "圣鸟", meaning: "灵感", en: "THE SACRED BIRD · INSPIRATION" },
  { kind: "line", zh: "女子身后的树上，停着一只圣鸟。", en: "A sacred bird perches in the tree behind her.", dur: 2.9, shot: { f: TREE, z: 7.0, z1: 7.2, fx: ["ibis"], desc: "右上树与山坡特写，树叶轻轻摆动，鸟微微扇翅" } },
  { kind: "line", zh: "它栖在高处，象征来自更高层面的指引。", en: "From its high perch, it symbolises guidance from a higher realm.", dur: 3.5, shot: { f: IBIS, z: 9.5, z1: 9.7, fx: ["ibis", "birdHalo"], desc: "圣鸟特写，保持其栖于树梢的姿态，周围光晕轻轻呼吸" } },
  { kind: "line", zh: "内心渐渐平静，也更容易察觉新的灵感。", en: "As the mind grows calm, new inspiration becomes easier to recognise.", dur: 3.5, shot: { f: FACE, f1: FACE_BIRD, z: 7.0, z1: 4.6, pullBack: true, fx: ["twinkle", "ibis"], desc: "从女子低头的脸部缓缓拉远，让树梢圣鸟进入画面，两者同框停留" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.3, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.0, label: "逆位", symbol: "倒转的牌", meaning: "失望与迷茫", en: "REVERSED · DISAPPOINTMENT AND UNCERTAINTY", rev: true },
  { kind: "line", zh: "星光变暗，方向变得模糊。", en: "The starlight dims, and the way grows unclear.", dur: 2.5, shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow", "pour", "streams", "starDim"], desc: "倒置全牌，星光逐渐减弱，边缘轻覆寒霜但不遮挡主体；水流继续流动" } },
  { kind: "line", zh: "两壶水倾倒，却难以滋养内心。", en: "Water pours from both pitchers, yet struggles to nourish the inner self.", dur: 2.9, shot: { f: FIGURE, z: 4.55, z1: 4.67, rev: true, fx: ["pour", "streams", "pool"], desc: "直切倒置女子与双壶同框，两股水仍在倾倒，池面与土地色彩转冷，水流光泽减弱" } },
  { kind: "line", zh: "圣鸟仍在高处，指引却难以察觉。", en: "The sacred bird remains above, but its guidance is hard to perceive.", dur: 3.1, shot: { f: IBIS, z: 9.5, z1: 9.65, rev: true, fx: ["ibis", "birdHalo"], desc: "直切倒置牌中的圣鸟特写，保持倒置方向，周围光晕减弱，树枝与鸟的轮廓仍清晰可见" } },
  { kind: "line", zh: "希望尚在，只是信心逐渐动摇。", en: "Hope remains, though faith begins to waver.", dur: 2.9, shot: { f: STAR, z: 5.0, z1: 5.15, rev: true, fx: ["radiant"], desc: "直切倒置八芒大星特写，保留微弱星光，光芒轻轻明灭" } },
  { kind: "line", zh: "此时，需要重新找回内在的信念。", en: "Now is the time to rediscover faith within.", dur: 3.1, shot: { f: FACE, z: 7.0, z1: 7.08, rev: true, fx: ["faceGlow"], desc: "回到倒置女子脸部特写，镜头短暂停稳，面部附近的柔和微光缓缓恢复，不改变牌的朝向" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 3.6 }, // 1.2 s moved to the atlas (user, 2026-10-24): "已收录 6 / 22" now holds ~1 s at full strength
  { kind: "focus", zh: "“精神的馈赠”，是韦特为星星牌写下的主题之一。", en: "“Gifts of the Spirit” is one of the themes Waite associated with The Star.", dur: 4.5, shot: { full: true, z: 1.06, z1: 1.0, fx: ["radiant", "pour", "streams", "ibis"], desc: "切回正位全牌，缓缓拉远；星光、水流与圣鸟保持轻微动态" } },
  { kind: "atlas", dur: 3.2, lines: [] }, // grid only: slots fly in, XVII lights, "已收录 6 / 22"
  { kind: "teaser", dur: 3.6 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
