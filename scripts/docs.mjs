// Storyboard generated from the timeline, so it always matches the cut:
//   out/<id>/分镜.md — shot-by-shot storyboard with captions (hand this to the user for sign-off before any rendering)
//   node scripts/docs.mjs <id>
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
if (!id) throw new Error("usage: node scripts/docs.mjs <card id>");
const { build } = require("../engine/schedule.js");
const plan = require(`../cards/${id}/plan.js`);
const meta = JSON.parse(fs.readFileSync(path.join(root, "cards", id, "card.json"), "utf8"));
const { segs, cues, duration } = build(plan);
// SOP 0.4: the teaser starts at 1:16.7 and runs about 4.5 s — tune the summary dur to land it
const TEASER_AT = 76.7, TEASER_DUR = 4.5;
if (Math.abs(cues.teaser.start - TEASER_AT) > 0.05 || Math.abs(cues.teaser.dur - TEASER_DUR) > 0.2)
  console.warn(`⚠ teaser at ${cues.teaser.start.toFixed(2)}s for ${cues.teaser.dur}s; SOP wants ${TEASER_AT}s for ~${TEASER_DUR}s (adjust the summary dur or trim captions)`);
const outDir = path.join(root, "out", id);
fs.mkdirSync(outDir, { recursive: true });

const ts = (x) => {
  const m = Math.floor(x / 60), s = x - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
};
const ts1 = (x) => {
  const m = Math.floor(x / 60);
  return `${m}:${(x - m * 60).toFixed(1).padStart(4, "0")}`;
};

/* ---------------- storyboard ---------------- */
const shotText = (s) => {
  const sh = s.shot || {};
  const fx = (sh.fx || []).join("、");
  const base = s.kind === "open" ? "开场动作（特写）" : sh.pull ? "拉远到整张牌" : sh.reverse ? "牌在中央倒转 180°" : sh.flash ? `闪回：正位特写 [${sh.f}]` : sh.push ? `推进到倒置画面 [${sh.f}]` : sh.full ? `${sh.rev ? "倒置的" : ""}整张牌` : sh.f ? `${sh.rev ? "倒置后 " : ""}特写 [${sh.f}]${sh.f1 ? ` → [${sh.f1}]` : ""}` : "";
  const b2 = sh.desc ? (sh.rev && !sh.desc.includes("倒置") ? `倒置后的${sh.desc}` : sh.desc) : base;
  return fx ? `${b2}；动效：${fx}` : b2;
};
const sb = segs.map((s) => {
  let pic = shotText(s), zh = "—", en = "—";
  if (s.kind === "line" || s.kind === "names" || s.kind === "focus") { zh = s.style === "hook" ? `**${s.zh}**` : s.zh; en = s.en; }
  if (s.kind === "names") pic = s.shot?.desc || `整张牌；${s.names.join("、")}依次亮起光晕`;
  if (s.kind === "title") { pic = s.shot?.desc || (s.noFlip ? "整张牌定格，出现牌名" : `翻到牌背（${meta.numeral}）再翻回`); zh = meta.nameZh; en = meta.nameEn; }
  if (s.kind === "chapter") { pic = s.symbol ? `章节卡：先出「${s.symbol}」，再落下「${s.meaning}」` : `章节卡：先出「${s.label.replace(/s/g, "")}」，再落下「${s.meaning}」`; zh = s.symbol ? `${s.label} · ${s.symbol} → ${s.meaning}` : `${s.label.replace(/s/g, "")} · ${s.meaning}`; en = s.en; }
  if (s.kind === "summary") { pic = "正位、逆位两张牌并排"; zh = `正位：${meta.summary.upright[0]} ／ 逆位：${meta.summary.reversed[0]}`; }
  if (s.kind === "atlas") { pic = `22 格图鉴，牌飞进第 ${meta.numeral} 格`; if (!s.subs.length) { zh = en = "—"; return `| ${ts1(s.start)}–${ts1(s.end)} | ${pic} | — | — |`; } zh = s.subs.map((x) => x.zh).join(" "); en = s.subs.map((x) => x.en).join(" "); }
  if (s.kind === "teaser") { pic = `下期预告：${meta.teaser.nameZh}`; zh = `下一张：${meta.teaser.nameZh} ／ ${meta.teaser.question}`; }
  return `| ${ts1(s.start)}–${ts1(s.end)} | ${pic} | ${zh} | ${en} |`;
});
// never overwrite a storyboard the user edited by hand: write the generated one next to it for comparison
const sbPath = path.join(outDir, "分镜.md");
// hand-edited = differs from what this script last wrote (hash in .分镜.sha1). Users keep the title when they
// edit, so the title alone proves nothing; a storyboard without a recorded hash counts as hand-edited.
const shaPath = path.join(outDir, ".分镜.sha1");
const sha = (txt) => crypto.createHash("sha1").update(txt).digest("hex");
const handEdited = fs.existsSync(sbPath) && (!fs.existsSync(shaPath) || sha(fs.readFileSync(sbPath, "utf8")) !== fs.readFileSync(shaPath, "utf8").trim());
const sbOut = handEdited ? path.join(outDir, "分镜_时间表核对.md") : sbPath;
const sbText = `# ${meta.numeral} ${meta.nameZh} · 分镜（由当前时间表生成）

总时长 ${ts1(duration)}。坐标为扫描图像素。

| 时间 | 画面 | 中文字幕 | 英文字幕 |
|---|---|---|---|
${sb.join("\n")}
`;
fs.writeFileSync(sbOut, sbText);
if (!handEdited) fs.writeFileSync(shaPath, sha(sbText));
console.log(`${id}: ${sb.length} storyboard rows → out/${id}/${path.basename(sbOut)}${handEdited ? " (分镜.md was edited by hand, left untouched)" : ""}`);
