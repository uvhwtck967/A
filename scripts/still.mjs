// Render stills and tile them into one contact sheet:
//   node scripts/still.mjs <id> <t1> <t2> ...      (times in seconds; also accepts "f123" for a frame number)
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { BROWSER } from "./browser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, ...times] = process.argv.slice(2);
if (!id || !times.length) throw new Error("usage: node scripts/still.mjs <card id> <seconds...>");
const dir = path.join(root, "out", id, "stills");
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
const composition = await selectComposition({ serveUrl, id: `card-${id}`, browserExecutable: BROWSER });
for (const s of times) {
  const frame = s.startsWith("f") ? Number(s.slice(1)) : Math.round(Number(s) * 30);
  const output = path.join(dir, `f${String(frame).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame: Math.min(frame, composition.durationInFrames - 1), output, browserExecutable: BROWSER });
  console.log(output);
}
