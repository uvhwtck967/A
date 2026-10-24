// VII 战车 — episode plan (series episode 16). Shot focus points are scan px of scans/RWS_Tarot_07_Chariot.jpg (1111x1919).
//
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II §7:
//   "An erect and princely figure carrying a drawn sword ... On the shoulders of the victorious hero are supposed
//    to be the Urim and Thummim. He has led captivity captive; he is conquest on all planes--in the mind, in
//    science, in progress, in certain trials of initiation. He has thus replied to the sphinx, and it is on this
//    account that I have accepted the variation of Éliphas Lévi; two sphinxes thus draw his chariot. He is above
//    all things triumph in the mind."
//   Part I: "it is really the King in his triumph, typifying, however, the victory which creates kingship as its
//    natural consequence".
//   divinatory: "Succour, providence; also war, triumph, presumption, vengeance, trouble. Reversed: Riot, quarrel,
//    dispute, litigation, defeat."
//   Lévi (Waite's stated source for the sphinxes): "two sphinxes joined at the haunches ... pulling in opposite
//    directions, but are looking the same way. They are respectively black and white. On the square which forms
//    the fore part of the chariot is the Indian lingam surmounted by the flying sphere of the Egyptians."
// Upright follows the mainstream modern RWS reading (willpower, control, victory); reversed (loss of control, lack
// of direction, conflict) is the modern consensus and matches Waite's "riot, quarrel ... defeat".
// No reins: visible on the card; "will, not force" is the common modern reading -> caption says "被解读为".
// Trivia: Waite's text gives the charioteer "a drawn sword", but Pamela Colman Smith drew a wand (visible).

const OPEN_DUR = 2.0; // the chariot jolts forward once, the canopy swings, the wand tip flashes (see layers.tsx)

const CENTER = [555, 880]; // card centre (full shot)
const UPPER = [540, 470]; // charioteer, crown to chest, under the starry canopy
const STAR = [537, 252]; // the eight-rayed star on his crown
const FACE = [537, 383]; // his face
const CANOPY = [398, 198]; // the starry canopy, upper left
const ARMOR = [543, 608]; // breastplate with the square
const WAND = [222, 560]; // the wand, upper part and tip
const HAND_R = [788, 923]; // his right hand, resting empty on the chariot rim
const SPHINXES = [549, 1380]; // both sphinxes and the front of the chariot
const B_SPHINX = [218, 1310]; // black sphinx, face
const W_SPHINX = [849, 1287]; // white sphinx, face
const CITY = [930, 780]; // the walled city behind, right

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: UPPER, z: 4.8, z1: 5.0, fx: ["jolt", "canopy", "glint"], desc: "驾车人上半身特写；第 1 帧车身向前一顿，画面一震，星幕帷幔随之摆起，权杖顶端闪过一点金光；低沉撞击声 + 车轮碾地声 + 金属轻响" } },
  { kind: "line", style: "hook", zh: "一辆战车，却没有缰绳。", en: "A chariot, yet there are no reins.", pad: 0.2, shot: { pull: true, fx: ["canopy"], desc: "从驾车人拉远到整张牌，星幕帷幔轻轻摆动" } },
  { kind: "line", style: "hook", zh: "车前的两只兽，身子各朝一边。", en: "The two beasts before it face opposite ways.", pad: 0.2, shot: { full: true, z: 1.0, z1: 1.02, fx: ["sphinx", "canopy"], desc: "整张牌，静止停留；两只斯芬克斯胸口缓缓起伏" } },
  { kind: "names", zh: "它的含义，藏在斯芬克斯、消失的缰绳与星冠之中。", names: ["斯芬克斯", "消失的缰绳", "星冠"], en: "Its meaning lies in the sphinxes, the missing reins, and the starry crown.", pad: 0.3, shot: { full: true, z: 1.02, z1: 1.06, link: true, fx: ["canopy"], desc: "同一镜头，不切；两只斯芬克斯、驾车人空着的双手、头顶星冠依次亮起光晕" } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "斯芬克斯", meaning: "对立的力量", en: "THE SPHINXES · OPPOSING FORCES" },
  { kind: "line", zh: "车前卧着一黑一白两只斯芬克斯。", en: "A black sphinx and a white one lie before the chariot.", shot: { f: SPHINXES, z: 4.6, z1: 4.75, fx: ["sphinx"], desc: "两只斯芬克斯与车身正面同框，缓慢推近；胸口轻轻起伏" } },
  { kind: "line", zh: "身子各朝一边，目光却望向同一处。", en: "Their bodies turn apart, yet their eyes look the same way.", shot: { f: B_SPHINX, z: 7.0, z1: 7.2, fx: ["sphinx"], desc: "直切黑色斯芬克斯脸部特写，头巾条纹上闪过一道细光，胸口起伏" } },
  { kind: "line", zh: "象征相互拉扯的两股力量。", en: "They stand for two forces pulling against each other.", shot: { f: W_SPHINX, z: 7.0, z1: 7.2, fx: ["sphinx"], desc: "直切白色斯芬克斯脸部特写，胸口起伏" } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "消失的缰绳", meaning: "以意志驾驭", en: "THE MISSING REINS · CONTROL BY WILL" },
  { kind: "line", zh: "他手里没有缰绳，", en: "He holds no reins,", shot: { f: HAND_R, z: 6.4, z1: 6.6, fx: ["glint"], desc: "右手特写：空着的手搭在车沿上，护腕闪过一点金属光" } },
  { kind: "line", zh: "只握着一根权杖。", en: "only a wand.", shot: { f: WAND, z: 6.0, z1: 6.2, fx: ["glint"], desc: "直切权杖特写，顶端闪光" } },
  { kind: "line", zh: "被解读为以意志，而不是蛮力驾驭。", en: "It is read as steering by will rather than force.", shot: { f: FACE, z: 6.4, z1: 6.6, fx: ["canopy"], desc: "直切驾车人脸部特写，神情平静；头顶星幕帷幔轻轻摆动" } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "星冠", meaning: "胜利", en: "THE STARRY CROWN · VICTORY" },
  { kind: "line", zh: "他头戴星冠，身披盔甲。", en: "He wears a starry crown and armour.", shot: { f: STAR, z: 6.0, z1: 6.25, fx: ["radiant"], desc: "星冠特写，八芒星光芒缓缓呼吸" } },
  { kind: "line", zh: "身后的城池，已被留在远处。", en: "The walled city lies far behind him.", shot: { f: CITY, z: 6.0, z1: 6.2, fx: ["drift"], desc: "直切右侧城池特写，薄雾从城墙前缓缓飘过" } },
  { kind: "line", zh: "象征凭自律赢来的胜利。", en: "It stands for a victory won through self-discipline.", shot: { f: ARMOR, f1: CENTER, z: 2.6, z1: 1.0, pullBack: true, fx: ["glint"], desc: "从胸甲方块（扫光一闪）缓缓拉回整张牌" } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true, desc: "整张牌缓缓旋转 180 度" } },
  { kind: "chapter", dur: 2.6, label: "逆位", symbol: "倒转的牌", meaning: "失控与方向迷失", en: "REVERSED · LOSS OF CONTROL, NO DIRECTION", rev: true },
  { kind: "line", zh: "两只兽翻到了车的上方。", en: "The two beasts now sit above the chariot.", shot: { full: true, z: 1.0, z1: 1.03, rev: true, fx: ["frostGrow"], desc: "倒置全牌（夜色版），寒霜从边缘蔓延；帷幔停住" } },
  { kind: "line", zh: "没有缰绳，也就拉不住它们。", en: "Without reins, nothing holds them back.", shot: { f: HAND_R, z: 6.4, z1: 6.55, rev: true, desc: "直切倒置的右手特写，静止" } },
  { kind: "line", zh: "正位时，它们安静地卧着。", en: "Upright, they lie quietly.", shot: { f: SPHINXES, z: 4.6, z1: 4.8, flash: true, fx: ["sphinx"], desc: "闪回正位两只斯芬克斯（原彩），胸口平稳起伏" } },
  { kind: "line", zh: "力量各奔一方，车便原地打转。", en: "With each force pulling its own way, the chariot only turns in place.", shot: { full: true, z: 1.0, z1: 1.05, spin: 8, rev: true, desc: "倒置全牌缓缓转动，像原地打转" } },
  { kind: "line", zh: "逆位象征失控，与方向的迷失。", en: "Reversed, it stands for lost control and lost direction.", shot: { f: FACE, z: 1.4, z1: 6.0, rev: true, push: true, desc: "加速推进到倒置的驾车人脸部，星冠在下方" } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 5.05 }, // tuned so the teaser lands on 1:16.7 (SOP 0.4)
  { kind: "focus", zh: "韦特写他持剑，画上却是权杖。", en: "Waite wrote of a drawn sword; the card shows a wand.", shot: { full: true, z: 1.0, z1: 1.04, fx: ["wandGlint"], desc: "正位整张牌定格，一道金光沿权杖从顶端扫到手心" } },
  { kind: "atlas", dur: 2.8, lines: [] }, // grid only: slots fly in, VII lights, "已收录 16 / 22"
  { kind: "teaser", dur: 4.5 },
];

module.exports = { PLAN, impacts: [0.0], OPEN_DUR };
