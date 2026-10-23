// Generic episode timeline. Every caption, shot and sound cue of an episode is timed from here.
// Used by the composition (engine/Episode.tsx) and by the node scripts (sfx, cuesheet).
//
// A card supplies `plan.js` exporting { PLAN, openDur, impacts }.
// PLAN is a list of segments:
//   { kind: "open",    dur, shot }                         — opening action, no caption
//   { kind: "line",    zh, en, shot, style?: "hook", pad?, dur? }
//   { kind: "names",   zh, en, names: [a, b, c], pad? }    — hook line 3, halos light with the nouns
//   { kind: "title",   dur }                               — card-back flip
//   { kind: "chapter", dur, label, symbol, meaning, en, rev? }
//   { kind: "summary", dur }
//   { kind: "atlas",   lines: [[zh, en], ...] }
//   { kind: "focus",   zh, en, shot, pad? }                 — optional, after summary: the upright card with a caption, before the atlas
//   { kind: "atlas",   lines, dur? }                       — dur given: overrides the length computed from its lines
//   { kind: "teaser",  dur }
// shot: { f: [x, y] (scan px), f1?, z, z1, fx?: [...], full?, pull?, reverse?, flash?, push?, pullBack?, rev? }
//   pullBack: a close-up that eases out to a wide framing (z1 below the close-up limit is allowed)
// title: { kind: "title", dur, noFlip?, shot? } — noFlip holds the card still instead of flipping to the back

/** reading time: 0.9 s + 0.17 s per character (punctuation excluded), at least 2 s */
const readTime = (zh) => Math.max(2.0, 0.9 + 0.17 * zh.replace(/[，。、；：？！…—\s“”"「」·]/g, "").length);

const ATLAS_INTRO = 1.4;

function build(plan) {
  const { PLAN, impacts = [] } = plan;
  let t = 0;
  const segs = [];
  for (const p of PLAN) {
    let dur = p.dur;
    if (dur == null && (p.kind === "line" || p.kind === "names" || p.kind === "focus")) dur = readTime(p.zh) + (p.pad || 0);
    if (p.kind === "atlas" && dur == null) dur = ATLAS_INTRO + p.lines.reduce((s, [zh]) => s + readTime(zh), 0) + 0.4;
    if (dur == null) throw new Error(`segment ${segs.length} (${p.kind}) has no duration`);
    const seg = { ...p, start: t, end: t + dur, dur };
    if (p.kind === "atlas") {
      let a = t + ATLAS_INTRO;
      seg.subs = p.lines.map(([zh, en]) => {
        const s = { zh, en, start: a, end: a + readTime(zh) };
        a = s.end;
        return s;
      });
    }
    if (p.kind === "names") seg.rings = [0.3, 0.5, 0.7].map((f) => t + 0.35 + f * (dur - 0.6));
    segs.push(seg);
    t += dur;
  }
  // a close-up must fill the 16:9 frame from inside the picture, or the card frame shows behind it
  const MIN_Z = 4.55;
  for (const s of segs) {
    const sh = s.shot;
    if (!sh || !sh.f || sh.push || sh.pullBack) continue;
    const z = Math.min(sh.z, sh.z1 ?? sh.z);
    if (z < MIN_Z) throw new Error(`close-up at ${s.start.toFixed(1)}s ("${s.zh || s.kind}") has zoom ${z}; use at least ${MIN_Z} or a full-card shot`);
  }
  const find = (pred) => segs.find(pred);
  const need = (name, s) => {
    if (!s) throw new Error(`plan is missing ${name}`);
    return s;
  };
  const revLine = need("a reverse shot", find((s) => s.shot && s.shot.reverse));
  const cues = {
    impacts,
    cuts: segs.filter((s) => s.kind === "line" && !(s.shot && s.shot.link)).map((s) => s.start),
    links: segs.filter((s) => s.shot && s.shot.link).map((s) => s.start),
    hook: segs.filter((s) => s.style === "hook" && !(s.shot && s.shot.reverse)).map((s) => s.start),
    names: need("names", find((s) => s.kind === "names")),
    title: need("title", find((s) => s.kind === "title")),
    chapters: segs.filter((s) => s.kind === "chapter"),
    reversal: revLine,
    revRotateEnd: revLine.start + revLine.dur - 0.25,
    flash: find((s) => s.shot && s.shot.flash),
    push: find((s) => s.shot && s.shot.push), // optional: an episode may end the reversed part on a plain cut
    summary: need("summary", find((s) => s.kind === "summary")),
    focus: find((s) => s.kind === "focus"), // optional: one captioned upright shot of the card between summary and atlas
    atlas: need("atlas", find((s) => s.kind === "atlas")),
    teaser: need("teaser", find((s) => s.kind === "teaser")),
    fx: (name) => segs.filter((s) => s.shot && s.shot.fx && s.shot.fx.includes(name)),
  };
  return { segs, cues, duration: t };
}

module.exports = { build, readTime, ATLAS_INTRO };
