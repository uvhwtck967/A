// Scaffold a new episode:  node scripts/new-card.mjs <NN> <english-slug> <中文名> "<ENGLISH NAME ON CARD>"
//   e.g. node scripts/new-card.mjs 02 high-priestess 女祭司 "THE HIGH PRIESTESS"
// Creates cards/<NN-slug>/ with every file the engine needs, filled with placeholders to edit.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [nn, slug, nameZh, nameEn] = process.argv.slice(2);
if (!nn || !slug || !nameZh || !nameEn) throw new Error('usage: node scripts/new-card.mjs <NN> <slug> <中文名> "<ENGLISH NAME>"');
const index = Number(nn);
const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const id = `${String(index).padStart(2, "0")}-${slug}`;
const dir = path.join(root, "cards", id);
if (fs.existsSync(dir)) throw new Error(`${dir} already exists`);
fs.mkdirSync(dir, { recursive: true });
const scanName = `RWS_Tarot_${String(index).padStart(2, "0")}_${nameEn.replace(/^THE /, "").split(" ").map((w) => w[0] + w.slice(1).toLowerCase()).join("_")}.jpg`;

const w = (f, s) => fs.writeFileSync(path.join(dir, f), s);

w("card.json", JSON.stringify({
  id, index, numeral: ROMAN[index], nameZh, nameEn,
  frame: [0, 0, 0, 0],
  halos: [{ at: [0, 0], r: 80 }, { at: [0, 0], r: 80 }, { at: [0, 0], r: 80 }],
  summary: { upright: ["TODO 正位一句话", "TODO"], reversed: ["TODO 逆位一句话", "TODO"] },
  collected: [],
  teaser: { index: 0, numeral: "", nameZh: "TODO", nameEn: "TODO", question: "TODO？", questionEn: "TODO?" },
  ambient: {},
}, null, 2) + "\n");

w("restyle.json", JSON.stringify({
  note: `Input for scripts/restyle.py. Coordinates in scan px of ${scanName}.`,
  frame: [0, 0, 0, 0],
  sprites: [],
  sky: [],
  reveals: [],
}, null, 2) + "\n");
w("generated.json", JSON.stringify({ sprites: {}, sky: {} }, null, 1) + "\n");

w("plan.js", `// ${ROMAN[index]} ${nameZh} — episode plan. Shot focus points are scan px of ${scanName}.
// Meanings checked against Waite, The Pictorial Key to the Tarot (1910), Part II — quote the lines you rely on here.

const OPEN_DUR = 2.0; // length of the opening action (see layers.tsx)

const A = [0, 0]; // symbol 1
const B = [0, 0]; // symbol 2
const C = [0, 0]; // symbol 3

const PLAN = [
  // ---------------- hook ----------------
  { kind: "open", dur: OPEN_DUR, shot: { f: A, z: 5.0, z1: 5.2 } },
  { kind: "line", style: "hook", zh: "名为${nameZh}的牌，", en: "A card named ${nameEn.replace(/\b\w/g, (c) => c).toLowerCase()}", pad: 0.2, shot: { pull: true } },
  { kind: "line", style: "hook", zh: "TODO 一句克制的反差。", en: "TODO", pad: 0.2, shot: { full: true } },
  { kind: "names", zh: "它的含义，藏在甲、乙与丙之中。", names: ["甲", "乙", "丙"], en: "Its meaning lies in …", pad: 0.3, shot: { full: true } },
  { kind: "title", dur: 1.8 },

  // ---------------- upright: 3 × (chapter + 3 lines) ----------------
  { kind: "chapter", dur: 2.6, label: "含义一", symbol: "甲", meaning: "TODO", en: "TODO · TODO" },
  { kind: "line", zh: "TODO 描述画面。", en: "TODO", shot: { f: A, z: 5.0, z1: 5.3 } },
  { kind: "line", zh: "TODO 点出象征。", en: "TODO", shot: { f: A, z: 6.0, z1: 6.4 } },
  { kind: "line", zh: "TODO 落到人身上。", en: "TODO", shot: { f: A, z: 5.0, z1: 5.3 } },

  { kind: "chapter", dur: 2.6, label: "含义二", symbol: "乙", meaning: "TODO", en: "TODO · TODO" },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: B, z: 5.0, z1: 5.3 } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: B, z: 6.0, z1: 6.4 } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: B, z: 5.0, z1: 5.3 } },

  { kind: "chapter", dur: 2.6, label: "含义三", symbol: "丙", meaning: "TODO", en: "TODO · TODO" },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: C, z: 5.0, z1: 5.3 } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: C, z: 6.0, z1: 6.4 } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { full: true, z: 1.0, z1: 1.06 } },

  // ---------------- reversed ----------------
  { kind: "line", style: "hook", zh: "如果，它倒过来呢？", en: "And if it's reversed?", dur: 2.9, shot: { reverse: true } },
  { kind: "chapter", dur: 2.6, label: "逆 位", symbol: "倒转的牌", meaning: "TODO", en: "REVERSED · TODO", rev: true },
  { kind: "line", zh: "TODO", en: "TODO", shot: { full: true, z: 1, z1: 1.05, rev: true, fx: ["frostGrow"] } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: A, z: 5.0, z1: 5.3, rev: true } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: B, z: 5.0, z1: 5.3, rev: true } },
  { kind: "line", zh: "TODO 闪回正位", en: "TODO", shot: { f: C, z: 5.0, z1: 5.4, flash: true } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { full: true, z: 1, z1: 1.06, rev: true } },
  { kind: "line", zh: "TODO", en: "TODO", shot: { f: C, z: 1.4, z1: 5.0, rev: true, push: true } },

  // ---------------- ending ----------------
  { kind: "summary", dur: 6.0 },
  { kind: "atlas", lines: [["冷知识：TODO", "Trivia: TODO"], ["TODO", "TODO"]] },
  { kind: "teaser", dur: 4.4 },
];

// impacts: times (s) of opening hits — impacts[0] shakes the screen. Empty for a quiet opening.
module.exports = { PLAN, impacts: [] };
`);

w("layers.tsx", `import React from "react";
import type { Generated, LayerProps } from "../../engine/types";
import GEN from "./generated.json";

/* ${ROMAN[index]} ${nameZh} — card-specific animation, drawn inside the picture in card coordinates.
 * openT = seconds since the opening began. Use g.sc / g.box to place things from scan px,
 * url("<file>.png") for sprites cut by restyle.py, fx.level("<name>") to react to shot fx tags. */
const gen = GEN as Generated;

export const Layers: React.FC<LayerProps> = () => <g />;
`);

w("sound.mjs", `// ${ROMAN[index]} ${nameZh} — opening sound and card-specific fx sounds. Time hits from the same constants as layers.tsx.
export default function sound({ boom, bell, noiseFx, clank, creak, whoosh, clamp, cues }) {
  boom(0.0, 0.6, 58, 30, 2.2);
  return {
    // fxName: (segment) => { ... }
  };
}
`);

w("index.ts", `import type { CardModule, Generated, Meta } from "../../engine/types";
import meta from "./card.json";
import gen from "./generated.json";
import { Layers } from "./layers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plan = require("./plan.js");

export const card: CardModule = { meta: meta as Meta, plan, gen: gen as Generated, images: ["art.png"], Layers };
`);

console.log(`created cards/${id}/
next:
  1. download the scan: https://commons.wikimedia.org/wiki/File:${scanName}
  2. fill frame + sprites in restyle.json, run: python -I scripts/restyle.py <scan.jpg> cards/${id}
  3. write plan.js / card.json, register the card in src/cards.ts
  4. node scripts/sfx.mjs ${id} && node scripts/docs.mjs ${id} && node scripts/still.mjs ${id} 1 5 20
  5. node scripts/render.mjs ${id}`);
