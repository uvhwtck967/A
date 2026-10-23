// Sound design only (no music) for one episode — writes public/cards/<id>/sfx.wav (48k stereo).
//   node scripts/sfx.mjs <id>
// Every cue is timed from engine/schedule.js + cards/<id>/plan.js, the same timeline the picture uses.
// The card's own opening sound (and any card-specific fx sounds) come from cards/<id>/sound.mjs.
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { pathToFileURL, fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
if (!id) throw new Error("usage: node scripts/sfx.mjs <card id>, e.g. 13-death");
const { build } = require("../engine/schedule.js");
const plan = require(`../cards/${id}/plan.js`);
const meta = JSON.parse(fs.readFileSync(path.join(root, "cards", id, "card.json"), "utf8"));
const { cues, duration } = build(plan);

const SR = 48000;
const DUR = duration;
const N = Math.floor(SR * DUR);
const dryL = new Float32Array(N), dryR = new Float32Array(N);
const sendL = new Float32Array(N), sendR = new Float32Array(N);

let seed = 4242;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

class SVF {
  constructor() { this.lp = 0; this.bp = 0; }
  run(x, fc, q = 0.7) {
    const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR);
    const hp = x - this.lp - this.bp / q;
    this.bp += f * hp;
    this.lp += f * this.bp;
    return this;
  }
}
const add = (i, l, r, send = 0.4) => {
  if (i < 0 || i >= N) return;
  dryL[i] += l; dryR[i] += r;
  sendL[i] += l * send; sendR[i] += r * send;
};

/* ---------------- instruments (also handed to cards/<id>/sound.mjs) ---------------- */
const bell = (t0, m, vel = 1, pan = 0, decay = 3) => {
  const f = mtof(m), i0 = Math.floor(t0 * SR), len = Math.floor(decay * 1.6 * SR);
  for (let j = 0; j < len && i0 + j < N; j++) {
    const t = j / SR;
    const env = Math.exp(-t / (decay * 0.35)) * clamp(t / 0.002);
    const mod = Math.sin(2 * Math.PI * f * 3.5 * t) * 2.2 * Math.exp(-t * 3.5);
    const s = (Math.sin(2 * Math.PI * f * t + mod) * 0.7 + Math.sin(2 * Math.PI * f * 2.01 * t) * 0.15 * Math.exp(-t * 4)) * env * 0.11 * vel;
    add(i0 + j, s * (0.5 - pan * 0.5), s * (0.5 + pan * 0.5), 0.75);
  }
};
const noiseFx = (a, b, fn) => {
  const fl = new SVF(), fr = new SVF();
  for (let i = Math.max(0, Math.floor(a * SR)); i < Math.min(N, Math.floor(b * SR)); i++) {
    const t = i / SR;
    let { cut, q = 0.7, amp, mode = "lp", send = 0.5, pan = 0 } = fn(t);
    // Soften noise at its source, including card effects, cuts and transitions.
    if (meta.audio?.softNoise) {
      cut = Math.min(cut, 1200); q = 0.7; mode = "lp"; amp *= 0.25;
    }
    fl.run(rnd() * 2 - 1, cut, q); fr.run(rnd() * 2 - 1, cut, q);
    const l = mode === "lp" ? fl.lp : fl.bp, r = mode === "lp" ? fr.lp : fr.bp;
    add(i, l * amp * (1 - pan * 0.6), r * amp * (1 + pan * 0.6), send);
  }
};
const boom = (t0, g = 1, f0 = 62, f1 = 32, d = 2.2) => {
  let ph = 0;
  for (let j = 0; j < d * SR && Math.floor(t0 * SR) + j < N; j++) {
    const t = j / SR;
    ph += (f1 + (f0 - f1) * Math.exp(-t * 4)) / SR;
    const s = Math.sin(2 * Math.PI * ph) * Math.exp(-t / (d * 0.35)) * clamp(t / 0.004) * 0.4 * g;
    add(Math.floor(t0 * SR) + j, s, s, 0.15);
  }
};
const whoosh = (c, w = 0.6, g = 0.14, pan = 0) =>
  noiseFx(c - w, c + 0.3, (t) => {
    const u = clamp((t - (c - w)) / (w + 0.3));
    return { cut: 300 + 3600 * Math.sin(Math.PI * u), q: 1.5, mode: "bp", amp: g * Math.pow(Math.sin(Math.PI * u), 2), send: 0.55, pan: pan * (2 * u - 1) };
  });
const clank = (t0, g, ring = 98) => {
  for (let j = 0; j < 0.14 * SR; j++) {
    const t = j / SR;
    const s = (rnd() * 2 - 1) * Math.exp(-t * 55) * clamp(t / 0.0008) * 0.55 * g;
    add(Math.floor(t0 * SR) + j, s * 0.75, s * 0.9, 0.7);
  }
  bell(t0, ring, 1.3 * g, 0.15, 0.7);
  bell(t0, ring - 5, 0.7 * g, -0.15, 0.5);
};
/** wooden creak: a slowly gliding resonant band */
const creak = (t0, d = 0.8, g = 1, f0 = 380, f1 = 520) =>
  noiseFx(t0, t0 + d, (t) => {
    const u = clamp((t - t0) / d);
    const grit = 0.6 + 0.4 * Math.sin(2 * Math.PI * 38 * t) * Math.sin(2 * Math.PI * 7 * t);
    return { cut: f0 + (f1 - f0) * u, q: 9, mode: "bp", amp: 0.5 * g * Math.sin(Math.PI * u) * grit, send: 0.4 };
  });
/** soft "cut" accent — gives every shot change a beat */
const cutTick = (t0, g = 1) => {
  noiseFx(t0 - 0.02, t0 + 0.12, (t) => ({ cut: 1800 + 2500 * Math.exp(-(t - t0) * 30), q: 0.9, mode: "bp", amp: 0.16 * g * Math.exp(-Math.max(0, t - t0) * 28), send: 0.35 }));
  boom(t0, 0.18 * g, 70, 45, 0.35);
};
const kit = { bell, noiseFx, boom, whoosh, clank, creak, cutTick, clamp, rnd, SR, add };

/* ================= card opening (card-specific) ================= */
const soundMod = await import(pathToFileURL(path.join(root, "cards", id, "sound.mjs")).href);
const cardFx = soundMod.default({ ...kit, cues }) || {};

/* ================= HOOK ================= */
cues.hook.forEach((t0, i) => { boom(t0, 0.75 - 0.15 * i, 64, 32, 2); bell(t0 + 0.02, [62, 69][i] ?? 62, 0.7, 0, 4.5); });
whoosh(cues.hook[0] + 0.5, 0.9, 0.12);
cues.names.rings.forEach((t0, i) => bell(t0, [64, 66, 69][i], 0.8, (i - 1) * 0.4, 2.4));

/* ================= TITLE FLIP ================= */
{
  const T = cues.title;
  if (T.noFlip) { [74, 69, 62].forEach((m, i) => bell(T.start + 0.3 + i * 0.02, m, 0.7, (i - 1) * 0.3, 4.5)); boom(T.start + 0.3, 0.6); }
  else {
  whoosh(T.start + 0.25, 0.4, 0.2);
  noiseFx(T.start + 0.25, T.start + 0.5, (t) => ({ cut: 2400 + 2000 * Math.exp(-(t - T.start - 0.25) * 20), q: 1, mode: "bp", amp: 0.26 * Math.exp(-(t - T.start - 0.25) * 25), send: 0.5 }));
  whoosh(T.end - 0.25, 0.3, 0.14);
  [74, 69, 62].forEach((m, i) => bell(T.end - 0.25 + i * 0.02, m, 0.8, (i - 1) * 0.3, 4.5));
  boom(T.end - 0.25, 0.8);
  }
}

/* ================= CHAPTERS ================= */
cues.chapters.forEach((c, i) => {
  const rev = !!c.rev;
  whoosh(c.start + 0.05, 0.35, 0.1);
  bell(c.start + 0.12, rev ? 50 : [62, 65, 66][i], 0.45, -0.3, 3);
  bell(c.start + 0.62, rev ? 57 : [69, 70, 74][i], 0.85, 0.1, 4.5);
  boom(c.start + 0.62, rev ? 0.85 : 0.6, rev ? 50 : 62, rev ? 26 : 32, rev ? 2.8 : 2.2);
});

/* ================= SHOT CUTS ================= */
const special = new Set([...cues.hook, cues.reversal.start, cues.flash?.start, cues.push?.start]);
cues.cuts.forEach((t0) => { if (!special.has(t0)) cutTick(t0, 0.9); });
// linked shots glide instead of cutting: a soft air move
cues.links.forEach((t0) => whoosh(t0 + 0.35, 0.45, 0.06));

/* ================= SHARED FX SOUNDS ================= */
const FX = {
  glint: (s) => { for (let t = s.start + 0.3; t < s.end; t += Math.PI / 2.6) bell(t, 98, 0.18, 0.3, 0.8); },
  radiant: (s) => {
    noiseFx(s.start, s.end, (t) => ({ cut: 5200 + 1200 * Math.sin(t * 1.3), q: 6, mode: "bp", amp: 0.035 * Math.sin(Math.PI * clamp((t - s.start) / s.dur)), send: 0.9 }));
    bell(s.start + 0.1, 81, 0.35, 0.3, 4); bell(s.start + 0.14, 86, 0.25, -0.3, 4);
  },
  sweep: (s) => whoosh(s.start + s.dur * 0.55, s.dur * 0.5, 0.1, 0.8),
  frostGrow: (s) => {
    for (let t = s.start - 0.3; t < s.end + 1.5; t += 0.03 + rnd() * 0.12) {
      const g = 0.08 + rnd() * 0.12;
      noiseFx(t, t + 0.02, () => ({ cut: 6000 + rnd() * 4000, q: 2, mode: "bp", amp: g, send: 0.6, pan: rnd() * 2 - 1 }));
    }
  },
};
// ripples: banners flap, vines rustle; gold reveals shimmer
for (const rp of meta.ambient.ripples ?? []) {
  FX[rp.fx] = (s) =>
    noiseFx(s.start - 0.1, s.end + 0.2, (t) => {
      const env = clamp((t - s.start + 0.1) / 0.4) * clamp((s.end + 0.2 - t) / 0.4);
      if (rp.sound === "rustle") {
        const k = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.42 * t);
        return { cut: 3500 + 2500 * k, q: 1.6, mode: "bp", amp: (0.025 + 0.04 * k) * env, send: 0.5 };
      }
      const flap = Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * 1.1 * t), 3);
      return { cut: 500 + 1400 * flap, q: 1.3, mode: "bp", amp: (0.05 + 0.1 * flap) * env, send: 0.4 };
    });
  if (rp.reveal) {
    FX[rp.reveal.fxDraw] = (s) => {
      noiseFx(s.start, s.end, (t) => { const u = clamp((t - s.start) / s.dur); return { cut: 2500 + 6000 * u, q: 6, mode: "bp", amp: 0.05 * Math.sin(Math.PI * u), send: 0.9 }; });
      for (let k = 0; k < 7; k++) bell(s.start + (k / 7) * s.dur * 0.9, [74, 78, 81, 83, 86, 90, 93][k], 0.22, (k / 6 - 0.5) * 1.2, 1.8);
    };
    FX[rp.reveal.fxLit] = (s) => bell(s.start + 0.05, 86, 0.4, 0, 3);
  }
}
Object.assign(FX, cardFx);
const used = new Set(plan.PLAN.flatMap((p) => (p.shot && p.shot.fx) || []));
for (const name of used) {
  if (!FX[name]) { console.warn(`  (no sound for fx "${name}")`); continue; }
  for (const s of cues.fx(name)) FX[name](s);
}

/* ================= REVERSAL ================= */
{
  const R = cues.reversal, end = cues.revRotateEnd, a = R.start + 0.15;
  if (R.shot.instant) {
    boom(R.start, 1.0, 48, 26, 3.2);
    bell(R.start + 0.05, 57, 0.5, 0, 4);
  } else {
    let ph = 0;
    for (let i = Math.floor(a * SR); i < Math.floor((end + 0.3) * SR); i++) {
      const t = i / SR, u = clamp((t - a) / (end - a));
      ph += (440 * Math.pow(2, -2 * u)) / SR;
      const s = Math.sin(2 * Math.PI * ph) * 0.05 * Math.sin(Math.PI * clamp(u / 1.08));
      add(i, s, s, 0.8);
    }
    noiseFx(a, end + 0.1, (t) => ({ cut: 3000 - 2600 * clamp((t - a) / (end - a)), q: 2, mode: "bp", amp: 0.12 * Math.sin(Math.PI * clamp((t - a) / (end - a + 0.1))), send: 0.7 }));
    boom(end, 1.0, 48, 26, 3.2);
    bell(R.start + 0.05, 57, 0.5, 0, 4);
  }
}
noiseFx(cues.reversal.end, cues.summary.start, (t) => {
  const inFlash = cues.flash && t >= cues.flash.start - 0.1 && t < cues.flash.end + 0.1;
  return { cut: 380 + 160 * Math.sin(t * 0.7), q: 1.4, mode: "bp", amp: inFlash ? 0 : 0.05 * clamp((t - cues.reversal.end) / 1.5), send: 0.6 };
});

/* ================= FLASHBACK & PUSH ================= */
{
  const F = cues.flash;
  if (F) {
    whoosh(F.start, 0.5, 0.14);
    [74, 78, 81].forEach((m, i) => bell(F.start + 0.05 + i * 0.02, m, 0.7 - 0.15 * i, (i - 1) * 0.3, 4.5));
    boom(F.end, 0.7, 50, 28, 2.4);
  }
  const P = cues.push;
  if (P) noiseFx(P.start, P.end, (t) => { const u = clamp((t - P.start) / P.dur); return { cut: 300 + 5000 * Math.pow(u, 2), q: 1.2, mode: "bp", amp: 0.14 * Math.pow(u, 1.8), send: 0.6 }; });
  if (P) boom(P.end, 0.9, 60, 30, 2.4);
}

/* ================= ENDING ================= */
{
  const S = cues.summary, A = cues.atlas, T = cues.teaser;
  whoosh(S.start + 0.3, 0.6, 0.12);
  bell(S.start + 0.62, 69, 0.7, -0.4, 4.5); bell(S.start + 1.62, 57, 0.7, 0.4, 4.5);
  whoosh(A.start + 0.3, 0.6, 0.12);
  for (let i = 0; i < 22; i++) bell(A.start + 0.1 + i * 0.025, 86 + (i % 5) * 2, 0.06, (i / 21 - 0.5) * 1.4, 0.8);
  [74, 78, 81, 86].forEach((m, i) => bell(A.start + 1.1 + i * 0.04, m, 0.7, (i - 1.5) * 0.3, 4.5));
  boom(A.start + 1.1, 0.6);
  A.subs.forEach((s) => bell(s.start, 81, 0.18, 0, 2));
  boom(T.start, 0.9, 52, 28, 3);
  bell(T.start + 0.45, 50, 0.6, 0, 4.5);
  bell(T.start + 1.3, 57, 0.5, 0.2, 4);
}

/* ---------------- reverb + master ---------------- */
const reverb = (inp, spread) => {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map((n) => Math.floor((n + spread) * (SR / 44100) * 1.5));
  const aps = [556, 441, 341, 225].map((n) => Math.floor((n + spread) * SR / 44100));
  const out = new Float32Array(N);
  for (const len of combs) {
    const buf = new Float32Array(len); let idx = 0, store = 0;
    for (let i = 0; i < N; i++) {
      const y = buf[idx];
      store = y * 0.6 + store * 0.4;
      buf[idx] = inp[i] * 0.015 + store * 0.86;
      out[i] += y;
      idx = (idx + 1) % len;
    }
  }
  for (const len of aps) {
    const buf = new Float32Array(len); let idx = 0;
    for (let i = 0; i < N; i++) {
      const b = buf[idx], y = -out[i] + b;
      buf[idx] = out[i] + b * 0.5;
      out[i] = y;
      idx = (idx + 1) % len;
    }
  }
  return out;
};
for (let i = 0; i < N; i++) if (!Number.isFinite(dryL[i] + dryR[i] + sendL[i] + sendR[i])) throw new Error(`non-finite sample at ${(i / SR).toFixed(3)} s — clamp a progress value`);
const wl = reverb(sendL, 0), wr = reverb(sendR, 23);

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = clamp((DUR - t) / 0.8) * clamp(t / 0.02);
  const l = Math.tanh((dryL[i] + wl[i] * 0.8) * 1.4) * fade;
  const r = Math.tanh((dryR[i] + wr[i] * 0.8) * 1.4) * fade;
  peak = Math.max(peak, Math.abs(l), Math.abs(r));
  buf.writeInt16LE(Math.round(clamp(l, -1, 1) * 32000), 44 + i * 4);
  buf.writeInt16LE(Math.round(clamp(r, -1, 1) * 32000), 46 + i * 4);
}
fs.mkdirSync(path.join(root, "public", "cards", id), { recursive: true });
fs.writeFileSync(path.join(root, "public", "cards", id, "sfx.wav"), buf);
console.log(`${id}: sfx.wav ${DUR.toFixed(2)} s, peak ${peak.toFixed(3)}`);
