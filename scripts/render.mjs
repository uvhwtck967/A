// Render one episode:  node scripts/render.mjs <id> [seconds]
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { BROWSER } from "./browser.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
if (!id) throw new Error("usage: node scripts/render.mjs <card id> [seconds]");
const seconds = Number(process.argv[3] ?? 1e9);
const meta = JSON.parse(fs.readFileSync(path.join(root, "cards", id, "card.json"), "utf8"));
const outPath = path.join(root, "out", id, process.argv[4] ?? `${meta.nameZh}_音效版.mp4`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts") });
const composition = await selectComposition({ serveUrl, id: `card-${id}`, browserExecutable: BROWSER });
const cut = { ...composition, durationInFrames: Math.min(composition.durationInFrames, Math.ceil(seconds * 30)) };
console.log(`${id}: rendering ${cut.durationInFrames} frames → ${outPath}`);
let last = -1;
await renderMedia({
  composition: cut,
  serveUrl,
  codec: "h264",
  outputLocation: outPath, // NB: the option is outputLocation; "output" is silently ignored
  audioCodec: "aac",
  browserExecutable: BROWSER,
  crf: 21,
  threads: Number(process.env.RENDER_THREADS ?? 4),
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 10);
    if (p !== last) { last = p; process.stdout.write(`${p * 10}% `); }
  },
});
console.log(`\ndone — ${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB`);
