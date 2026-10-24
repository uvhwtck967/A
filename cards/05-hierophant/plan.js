// V 教皇 — episode plan (series episode 15). Shot focus points are scan px of scans/RWS_Tarot_05_Hierophant.jpg (1114x1919).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §5 and Part III §3:
//   "He wears the triple crown and is seated between two pillars, but they are not those of the Temple which is
//    guarded by the High Priestess. In his left hand he holds a scepter terminating in the triple cross, and with his
//    right hand he gives the well-known ecclesiastical sign ... At his feet are the crossed keys, and two priestly
//    ministers in albs kneel before him. ... He is the ruling power of external religion, as the High Priestess is the
//    prevailing genius of the esoteric, withdrawn power. ... Grand Orient says truly that the Hierophant is the power
//    of the keys, exoteric orthodox doctrine ... He is rather the summa totius theologiæ, when it has passed into the
//    utmost rigidity of expression ... the channel of grace belonging to the world of institution ... He is the order
//    and the head of the recognized hierarchy"
//   divinatory: "Marriage, alliance, captivity, servitude; by another account, mercy and goodness; inspiration; the man
//    to whom the Querent has recourse. Reversed: Society, good understanding, concord, over-kindness, weakness."
// Upright follows Waite (recognized hierarchy, power of the keys, outer doctrine) + the mainstream modern RWS reading
// (spiritual authority; tradition / institutions; teaching, mentorship).
// Reversed (dogma, blind conformity — or breaking with convention) is the modern consensus, not Waite's list; the
// "rigidity" side leans on Waite's own "utmost rigidity of expression".
// The keys as the keys of St Peter (Matthew 16:19) is the traditional papal emblem; Waite does not say it, so
// the caption says "传统上被认作". The blessing gesture: Waite calls it "the well-known ecclesiastical sign".
// Hook: the High Priestess contrast is Waite's own (pillars "not those of the Temple"; outer vs. withdrawn power).
// Focus trivia is a plain count of the picture: crown in three tiers, triple-cross scepter, three crosses on the stole.

const OPEN_DUR = 2.0; // a bell; the two ministers bow their heads a little further (layers.tsx)

const CENTER = [545, 875]; // card centre (full shot)
const CROWN = [550, 300]; // triple crown
const FACE = [550, 470]; // face under the crown
const HAND = [250, 450]; // raised right hand, blessing
const CROSS = [840, 440]; // top of the triple-cross scepter (left hand)
const KEYS = [530, 1600]; // crossed keys at his feet
const KEY_BITS = [540, 1645]; // key bows (rings), lower part of the keys
const MIN_L = [190, 1335]; // tonsured head, left minister
const OPEN_F = [300, 1450]; // left minister + the keys (opening)

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: OPEN_F, z: 4.7, z1: 4.9, fx: ["bow"], desc: "左侧神职者与钥匙特写；第 1 帧钟声响起，他剃发的头微微低下，钥匙上一道金光" } },
  { kind: "line", style: "hook", zh: "女祭司在双柱间守着秘密，", en: "Between two pillars, the High Priestess keeps a secret;", pad: 0.2, shot: { pull: true, fx: ["glint"], desc: "从神职者拉远到整张牌，三重冠与十字杖闪过金光" } },
  { kind: "line", style: "hook", zh: "教皇却把教义讲给众人。", en: "the Hierophant speaks his teaching to all.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["bless"], desc: "整张牌，静止停留；举起的右手指尖亮起微光" } },
  { kind: "names", zh: "它的含义，藏在三重冠、交叉的钥匙与两位神职者之中。", names: ["三重冠", "交叉的钥匙", "两位神职者"], en: "Its meaning lies in the triple crown, the crossed keys, and the two ministers.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["bless"], desc: "同一镜头，不切；三重冠、交叉的钥匙、两位神职者依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "三重冠", meaning: "精神权威", en: "THE TRIPLE CROWN · SPIRITUAL AUTHORITY" },
  { kind: "line", zh: "他头戴三层的冠冕，", en: "He wears a crown of three tiers,", shot: { f: CROWN, z: 5.4, z1: 5.6, fx: ["radiant"], desc: "三重冠特写，缓慢推近；冠上金光逐层亮起" } },
  { kind: "line", zh: "左手握着三横的十字杖。", en: "and holds a scepter ending in a triple cross.", shot: { f: CROSS, z: 5.6, z1: 5.8, fx: ["glint"], desc: "直切十字杖顶端特写，金光沿三道横杆滑下" } },
  { kind: "line", zh: "象征被认可的精神权威。", en: "They stand for recognised spiritual authority.", shot: { f: FACE, z: 5.2, z1: 5.4, fx: ["radiant"], desc: "直切脸部与冠沿特写，冠冕呼吸光" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "交叉的钥匙", meaning: "传承", en: "THE CROSSED KEYS · TRADITION" },
  { kind: "line", zh: "他的脚下，交叉着两把钥匙。", en: "At his feet lie two crossed keys.", shot: { f: KEYS, z: 5.4, z1: 5.6, fx: ["glint"], desc: "交叉的钥匙特写，金光沿钥匙柄扫过" } },
  { kind: "line", zh: "传统上被认作圣彼得的钥匙。", en: "Tradition reads them as the keys of St Peter.", shot: { f: KEY_BITS, z: 6.2, z1: 6.4, fx: ["glint"], desc: "直切钥匙环特写，两个钥匙环先后一闪" } },
  { kind: "line", zh: "象征代代相传的传统与制度。", en: "They stand for tradition and institutions handed down.", shot: { f: KEYS, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["glint"], desc: "从钥匙缓缓拉回整张牌，钥匙与三重冠同时一闪" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "两位神职者", meaning: "教导", en: "THE TWO MINISTERS · TEACHING" },
  { kind: "line", zh: "他面前，跪着两位神职者。", en: "Before him kneel two ministers.", shot: { f: MIN_L, z: 5.0, z1: 5.2, fx: ["bow"], desc: "左侧神职者特写，头顶剃发处与花纹法衣；他的头又低下一点" } },
  { kind: "line", zh: "他举起右手，作出祝福的手势。", en: "He raises his right hand in blessing.", shot: { f: HAND, z: 5.4, z1: 5.6, fx: ["bless"], desc: "直切举起的右手特写，指尖亮起柔光" } },
  { kind: "line", zh: "象征教导：知识由师长传给众人。", en: "It stands for teaching: knowledge passed from teacher to many.", shot: { full: true, z: 1.0, z1: 1.06, fx: ["bless", "bow"], desc: "整张牌，缓慢推近；右手柔光落向下方，两位神职者微微低头" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "教条与叛离", en: "REVERSED · DOGMA, REBELLION", rev: true },
  { kind: "line", zh: "冠冕与钥匙都还在，", en: "The crown and the keys are still there,", shot: { full: true, z: 1.0, z1: 1.04, rev: true, fx: ["frostGrow"], desc: "倒置全牌，固定；寒霜从边缘蔓延，手上的柔光熄灭" } },
  { kind: "line", zh: "传统却可能只剩下教条。", en: "but tradition may harden into dogma.", shot: { f: KEYS, z: 5.4, z1: 5.55, rev: true, fx: ["glint"], desc: "直切倒置的钥匙特写，金光极慢、暗淡" } },
  { kind: "line", zh: "规矩被照搬，不再被理解。", en: "Rules are followed, no longer understood.", shot: { f: MIN_L, z: 5.0, z1: 5.15, rev: true, fx: ["bow"], desc: "直切倒置的左侧神职者特写，低头的动作停住" } },
  { kind: "line", zh: "正位时，传统用来引导人。", en: "Upright, tradition is there to guide.", shot: { f: HAND, z: 5.4, z1: 5.65, flash: true, fx: ["bless"], desc: "闪回正位举起的右手特写（原彩），指尖柔光一亮" } },
  { kind: "line", zh: "逆位象征教条，或是打破常规。", en: "Reversed, it points to dogma, or to breaking with convention.", shot: { f: FACE, z: 5.2, z1: 5.35, rev: true, fx: ["frostGrow"], desc: "直切倒置的脸部与冠冕特写，霜色加深" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.39 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "冠三层，杖三横，圣带三个十字。", en: "Three tiers on the crown, three bars on the cross, three crosses on the stole.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["threeCount"], desc: "正位整张牌，冠冕三层、十字杖三横、圣带三个十字依次亮起" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, V lights, "已收录 15 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [], OPEN_DUR };
