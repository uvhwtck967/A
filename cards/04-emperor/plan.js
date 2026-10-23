// IV 皇帝 — episode plan (series episode 14). Shot focus points are scan px of scans/RWS_Tarot_04_Emperor.jpg (1117x1919).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §4:
//   "He has a form of the Crux ansata for his sceptre and a globe in his left hand. He is a crowned monarch—
//    commanding, stately, seated on a throne, the arms of which are fronted by rams' heads."
//   "He is executive and realization, the power of this world, here clothed with the highest of its natural attributes."
//   divinatory (Part III): "Stability, power, protection, realization; a great person; aid, reason, conviction;
//    also authority and will. Reversed: Benevolence, compassion, credit; also confusion to enemies, obstruction,
//    immaturity."
// Upright follows Waite and the mainstream modern RWS reading (authority; order and rule; steadfastness/protection).
// Reversed uses the modern consensus (domination, excessive control, rigidity), not Waite's own reversed list.
// Rams' heads → Aries: the Golden Dawn attribution, a common modern reading — captions say "常被视为" / "传统上".
// Barren mountains and the thin stream are visible on the card but not described by Waite: captions describe, and
// the meaning is phrased as "象征". Armour under the robe is visible (greaves, sabatons); Waite does not mention it.

const OPEN_DUR = 2.0; // the sceptre is raised a little and set down on the armrest: a stone thud, dust, the ram head glints

const CENTER = [563, 880]; // card centre (full shot)
const SCEPTRE = [190, 640]; // ankh sceptre, ring to hand, upper left
const GRIP = [205, 900]; // his right hand on the sceptre, above the left armrest
const RAM_ARM_L = [240, 1060]; // ram head on the left armrest
const RAM_ARM_R = [930, 1060]; // ram head on the right armrest
const RAM_TOP_R = [905, 245]; // ram head on the top right corner of the throne back
const ORB = [885, 885]; // golden orb in his left hand
const FACE = [545, 400]; // crown and face
const BUST = [560, 700]; // beard, cloak, both hands in frame
const MTN_R = [975, 720]; // barren mountains, right
const STREAM = [110, 1500]; // thin stream at the foot of the mountains, lower left
const ARMOUR = [530, 1420]; // armoured legs under the robe

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: GRIP, z: 5.0, z1: 5.2, fx: ["sceptreSet", "ramGlint"], desc: "握杖的手与左侧扶手公羊头同框特写；第 1 帧权杖微微抬起、落定在石扶手上，扬起细尘，公羊头闪过一道光；石头闷响" } },
  { kind: "line", style: "hook", zh: "红袍之下，", en: "Beneath the red robe,", pad: 0.2, shot: { pull: true, fx: ["glint"], desc: "从扶手拉远到整张牌，王冠闪过一道光" } },
  { kind: "line", style: "hook", zh: "他穿着一身盔甲。", en: "he wears a suit of armour.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["armourGlint"], desc: "整张牌，静止停留；腿上的盔甲由上到下滑过一道金属光" } },
  { kind: "names", zh: "它的含义，藏在公羊头、权杖与宝球、荒山之中。", names: ["公羊头", "权杖与宝球", "荒山"], en: "Its meaning lies in the rams' heads, the sceptre and orb, and the barren mountains.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["ramGlint"], desc: "同一镜头，不切；公羊头、权杖与宝球、荒山依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "公羊头", meaning: "权威", en: "THE RAMS' HEADS · AUTHORITY" },
  { kind: "line", zh: "石砌的王座上，刻着公羊头。", en: "Rams' heads are carved into the stone throne.", shot: { f: RAM_ARM_R, z: 6.0, z1: 6.2, fx: ["ramGlint"], desc: "右侧扶手公羊头特写，固定；石面上一道微光掠过" } },
  { kind: "line", zh: "公羊勇猛，常被视为领袖的象征。", en: "The bold ram is often seen as a sign of leadership.", shot: { f: RAM_TOP_R, z: 6.0, z1: 6.2, fx: ["ramGlint"], desc: "直切靠背右上角的公羊头特写，微光再掠过一次" } },
  { kind: "line", zh: "端坐其上的他，代表世俗的权威。", en: "Seated upon it, he stands for worldly authority.", shot: { f: FACE, z: 5.6, z1: 5.8, fx: ["glint"], desc: "直切王冠与脸部特写；王冠上的宝石闪光" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "权杖与宝球", meaning: "秩序", en: "THE SCEPTRE AND ORB · ORDER" },
  { kind: "line", zh: "他右手握着安卡形的权杖，", en: "In his right hand, an ankh-shaped sceptre;", shot: { f: SCEPTRE, z: 5.6, z1: 5.8, fx: ["glint"], desc: "权杖特写（顶端圆环到握杖的手），金色杖身上滑过一道光" } },
  { kind: "line", zh: "左手托着一颗金色宝球。", en: "in his left, a golden orb.", shot: { f: ORB, z: 7.0, z1: 7.2, fx: ["orbGlow"], desc: "直切宝球特写，宝球缓缓泛起暖光" } },
  { kind: "line", zh: "象征以规则建立并守住秩序。", en: "They stand for order, built and kept by rules.", shot: { f: BUST, z: 4.6, z1: 4.75, fx: ["glint", "orbGlow"], desc: "直切半身：权杖、宝球与胡须同框，两处金光一前一后亮起" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "荒山", meaning: "坚定", en: "THE BARREN MOUNTAINS · STEADFASTNESS" },
  { kind: "line", zh: "他身后，是寸草不生的荒山。", en: "Behind him rise barren mountains.", shot: { f: MTN_R, z: 6.0, z1: 6.2, fx: ["haze"], desc: "右侧荒山特写，山间薄雾缓慢飘移" } },
  { kind: "line", zh: "山脚下，只有一道细细的河。", en: "At their foot runs only a thin stream.", shot: { f: STREAM, z: 6.4, z1: 6.6, fx: ["sweep"], desc: "直切左下角山脚的小河特写，水面波光流动" } },
  { kind: "line", zh: "他披甲端坐，坚定不移。", en: "Clad in armour, he sits firm and unmoved.", shot: { f: ARMOUR, z: 5.0, z1: 5.2, fx: ["armourGlint"], desc: "直切红袍下的盔甲腿部特写，金属光由膝盖滑到脚尖" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "专制与僵化", en: "REVERSED · DOMINATION, RIGIDITY", rev: true },
  { kind: "line", zh: "王座依然坚固，权威却可能变成控制。", en: "The throne still stands firm, but authority may turn into control.", shot: { full: true, z: 1.0, z1: 1.04, rev: true, fx: ["frostGrow"], desc: "倒置全牌，固定；寒霜从边缘蔓延，王冠的光变冷" } },
  { kind: "line", zh: "规则不再守护，只用来压服别人。", en: "Rules no longer protect; they only subdue others.", shot: { f: SCEPTRE, z: 5.6, z1: 5.75, rev: true, fx: ["glint"], desc: "直切倒置的权杖特写，杖身的光变暗、变冷" } },
  { kind: "line", zh: "正位时，秩序是为了守护。", en: "Upright, order was there to protect.", shot: { f: ORB, z: 7.0, z1: 7.2, flash: true, fx: ["orbGlow"], desc: "闪回正位宝球特写（原彩），暖光重新亮起" } },
  { kind: "line", zh: "盔甲太重，人也会变得僵硬。", en: "When the armour grows too heavy, so does the man.", shot: { f: ARMOUR, z: 5.0, z1: 5.15, rev: true, fx: ["armourGlint"], desc: "直切倒置的盔甲腿部特写，金属光缓慢滑过后停住" } },
  { kind: "line", zh: "听不进意见，也不肯变通。", en: "He will not listen, and will not bend.", shot: { f: FACE, z: 5.6, z1: 5.75, rev: true, fx: ["frostGrow"], desc: "直切倒置的脸部特写，静止；边缘的寒霜停住" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.14 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "公羊头，常被认作白羊座的标志。", en: "The rams' heads are often read as the sign of Aries.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["ramCount"], desc: "正位整张牌，王座四角的公羊头依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, IV lights, "已收录 14 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
