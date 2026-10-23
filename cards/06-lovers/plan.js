// VI 恋人 — episode plan. Shot focus points are px of scans/Lovers_clothed.png (959x1640), the user's clothed-figure version chosen 2026-10-18.
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §6:
//   "The sun shines in the zenith, and beneath is a great winged figure with arms extended, pouring down influences."
//   "Behind the man is the Tree of Life, bearing twelve fruits, and the Tree of the Knowledge of Good and Evil
//    is behind the woman; the serpent is twisting round it."
//   "The man looks at the woman, the woman looks at the angel."
//   divinatory: "Attraction, love, beauty, trials overcome. Reversed: Failure, foolish designs."
// Upright follows the mainstream modern RWS reading (union blessed from above; choice and temptation;
// the twelve flames as passion / the zodiac); reversed (disharmony, imbalance, misaligned choice) is the modern consensus.
// Trivia: the Tarot de Marseille "L'Amoureux" shows a young man between two women, Cupid aiming above.

const OPEN_DUR = 2.0; // the angel's wings open outward a few degrees and settle (see layers.tsx)

const ANGEL = [478, 300]; // angel's face, wings and the lower rim of the sun
const TREE_K = [140, 650]; // tree of knowledge, crown with fruit
const SERPENT = [95, 760]; // serpent: head and coils in the crown, body down the trunk
const EVE_SNAKE = [130, 790]; // woman and serpent together
const MAN = [770, 840]; // man, half length, flames behind
const TREE_F = [845, 690]; // tree of life, flames

// Follows the user's revised storyboard (out/06-lovers/分镜.md, 2026-10-18): every segment has an explicit dur.
// Two captions on one picture = second shot links from the first with the same focus (no cut).
const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: ANGEL, z: 4.8, z1: 4.9, fx: ["wings", "radiant"], desc: "天使上半身特写，固定；双翼微微振动，太阳光芒随之一亮；翅膀扇动声" } },
  { kind: "line", style: "hook", zh: "名为恋人的牌，", en: "A card named The Lovers", dur: 2.2, shot: { pull: true, desc: "从天使拉远到整张牌" } },
  { kind: "line", style: "hook", zh: "并不只指爱情。", en: "is not only about romance.", dur: 2.3, shot: { full: true, z: 1.0, z1: 1.02, fx: ["flames"], desc: "整张牌，静止停留，火焰轻轻跳动" } },
  { kind: "names", zh: "它的深义，藏在天使、知识树与生命树之中。", names: ["天使", "知识树", "生命树"], en: "Its meaning lies in the angel, the Tree of Knowledge, and the Tree of Life.", dur: 4.1, shot: { full: true, z: 1.02, z1: 1.06, link: true, desc: "同一镜头，不切；天使、知识树、生命树依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "天使", meaning: "祝福", en: "THE ANGEL · BLESSING" },
  { kind: "line", zh: "太阳之下，天使张开双翼。", en: "Beneath the sun, an angel spreads its wings.", dur: 2.6, shot: { f: ANGEL, z: 5.2, z1: 5.4, fx: ["radiant"], desc: "天使特写（脸、双翼与太阳下缘同框），固定；光芒缓慢旋转" } },
  { kind: "line", zh: "双手展开，洒下祝福。", en: "With hands outstretched, the angel bestows a blessing.", dur: 2.4, shot: { full: true, z: 1.0, z1: 1.02, fx: ["radiant"], desc: "直切整张牌：天使的双手与下方两人同框" } },
  { kind: "line", zh: "寄托关系或事业顺利发展的愿望。", en: "It expresses a wish for relationships or endeavours to flourish.", dur: 2.8, shot: { full: true, z: 1.02, z1: 1.05, link: true, fx: ["radiant"], desc: "同一镜头，不切；光芒渐亮" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "知识树", meaning: "选择", en: "THE TREE OF KNOWLEDGE · CHOICE" },
  { kind: "line", zh: "女子身后，是一棵结果的树。", en: "Behind the woman stands a tree bearing fruit.", dur: 2.8, shot: { f: TREE_K, z: 10.0, z1: 10.2, fx: ["fruit"], desc: "知识树树冠特写，固定；树不动，果实依次亮起微光" } },
  { kind: "line", zh: "树上的蛇，象征诱惑。", en: "The serpent in the tree symbolises temptation.", dur: 2.7, shot: { f: SERPENT, z: 9.6, z1: 9.75, fx: ["serpent"], desc: "直切蛇的特写：树干与蛇身一起入画，蛇身上一道微光滑过" } },
  { kind: "line", zh: "面对诱惑，需要做出选择。", en: "Faced with temptation, a choice must be made.", dur: 3.1, shot: { f: SERPENT, z: 9.75, z1: 9.9, link: true, fx: ["serpent"], desc: "同一镜头，不切；微光再滑过一次" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "生命树", meaning: "激情", en: "THE TREE OF LIFE · PASSION" },
  { kind: "line", zh: "男子身后，树上燃着十二团火。", en: "Behind the man, twelve flames burn on a tree.", dur: 3.0, shot: { f: TREE_F, z: 9.6, z1: 9.8, fx: ["flames"], desc: "生命树特写，固定；十二团火焰闪烁" } },
  { kind: "line", zh: "火焰，象征热烈的激情。", en: "The flames stand for ardent passion.", dur: 2.4, shot: { f: TREE_F, z: 9.8, z1: 9.95, link: true, fx: ["flames"], desc: "同一镜头，不切；火苗明暗起伏加强" } },
  { kind: "line", zh: "是探索的热情，也是行动的动力。", en: "It is the enthusiasm to explore, and the drive to act.", dur: 2.4, shot: { f: MAN, z: 6.8, z1: 6.95, fx: ["flames"], desc: "直切男子半身：身后的火焰同框，继续跳动" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "分歧、不对等与选择困境", en: "REVERSED · DISAGREEMENT, IMBALANCE AND DIFFICULT CHOICES", rev: true },
  { kind: "line", zh: "天使，依然张着双翼。", en: "The angel's wings are still open.", dur: 2.5, shot: { full: true, z: 1.0, z1: 1.02, rev: true, fx: ["frostGrow"], desc: "倒置全牌，固定；寒霜从边缘蔓延，天使位于画面下方" } },
  { kind: "line", zh: "祝福的意味，却淡了几分。", en: "Yet the sense of blessing has grown fainter.", dur: 2.8, shot: { full: true, z: 1.02, z1: 1.05, rev: true, link: true, desc: "同一镜头，不切；寒霜继续蔓延，太阳光芒随之转暗" } },
  { kind: "line", zh: "面对诱惑，选择变得艰难。", en: "Faced with temptation, choosing becomes difficult.", dur: 2.8, shot: { f: EVE_SNAKE, z: 8.6, z1: 8.72, rev: true, fx: ["serpent"], desc: "直切倒置的蛇与女子同框特写；蛇身微光变暗、变冷" } },
  { kind: "line", zh: "一时的动摇，可能偏离本心。", en: "A moment of doubt may lead one away from the heart.", dur: 3.0, shot: { f: EVE_SNAKE, z: 8.72, z1: 8.85, rev: true, link: true, fx: ["serpent"], desc: "同一镜头，不切" } },
  { kind: "line", zh: "能量减弱，两方付出可能并不对等。", en: "Energy wanes, and the two sides may give unequally.", dur: 3.3, shot: { f: TREE_F, z: 9.6, z1: 9.8, rev: true, fx: ["flames"], desc: "直切倒置的生命树特写；火焰明显转暗，停住" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 4.38 }, // lands the teaser on 1:16.7 (SOP 0.4); atlas length is computed from its lines (8.0 s)
  {
    kind: "atlas",
    lines: [
      ["画面中的两人，呼应亚当与夏娃。", "The two figures echo Adam and Eve."],
      ["蛇与果树，也来自伊甸园的故事。", "The serpent and fruit tree also come from the story of Eden."],
    ],
  },
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
