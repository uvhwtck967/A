// XVII 星星 — opening sound and card-specific fx sounds. Times use the same constants as layers.tsx.
// Water is a soft low bed (card.json audio.softNoise keeps every noise gentle) plus small sine "plips" for drops.

export default function sound({ boom, bell, noiseFx, whoosh, clamp, add, SR, rnd, cues }) {
  const rev = (s) => s.start >= cues.reversal.start;
  /** one water drop: a short sine gliding upward */
  const drop = (t0, g = 1, f0 = 700, pan = 0) => {
    const i0 = Math.floor(t0 * SR), len = Math.floor(0.09 * SR);
    let ph = 0;
    for (let j = 0; j < len; j++) {
      const t = j / SR;
      ph += (f0 * (1 + 1.1 * clamp(t / 0.035))) / SR;
      const s = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 45) * clamp(t / 0.002) * 0.07 * g;
      add(i0 + j, s * (0.5 - pan * 0.5), s * (0.5 + pan * 0.5), 0.6);
    }
  };
  /** pouring water: a breathing low bed and scattered drops, from a..b */
  const water = (a, b, g, pan) => {
    noiseFx(a, b, (t) => ({ cut: 900 + 300 * Math.sin(t * 9.1) * Math.sin(t * 3.7), q: 0.8, mode: "lp", amp: 0.5 * g * clamp((t - a) / 0.25) * clamp((b - t) / 0.4) * (0.75 + 0.25 * Math.sin(t * 23)), send: 0.35, pan }));
    for (let t = a + 0.05; t < b - 0.1; t += 0.07 + 0.16 * rnd()) drop(t, g * (0.5 + rnd()), 550 + 700 * rnd(), pan + (rnd() - 0.5) * 0.3);
  };

  // first frame: the stream is already pouring into the pool, a ring spreads, a low soft tone
  water(0.0, 2.2, 1.0, -0.4);
  drop(0.02, 1.6, 620, -0.4);
  boom(0.0, 0.45, 57, 30, 2.4);
  bell(0.05, 69, 0.35, -0.2, 4);

  return {
    pour: (s) => { if (s.kind !== "open") water(s.start, s.end, rev(s) ? 0.55 : 0.85, -0.4); },
    streams: (s) => water(s.start, s.end, rev(s) ? 0.4 : 0.6, 0.4),
    // rings in the pool: a soft plop each time a ring starts
    pool: (s) => { for (let t = s.start + 0.2; t < s.end - 0.2; t += 0.8) drop(t, rev(s) ? 0.6 : 1.0, 420, -0.4); },
    landings: (s) => { bell(s.start + 0.1, 76, 0.3, -0.5, 2.5); bell(s.start + s.dur * 0.5, 79, 0.3, 0.5, 2.5); },
    // one soft high bell per lesser star as it lights (same order and timing as layers.tsx)
    twinkle: (s) => { for (let i = 0; i < 7; i++) bell(s.start + s.dur * ((i / 7) * 0.75 + 0.15), [86, 88, 91, 93, 95, 93, 91][i], 0.12, i < 4 ? -0.5 : 0.5, 1.6); },
    // wing beats: light feathered puffs; a faint shimmer for the tree
    ibis: (s) => {
      const g = rev(s) ? 0.5 : 1;
      for (let t = s.start + 0.3; t < s.end - 0.3; t += 0.9) {
        noiseFx(t, t + 0.25, (x) => { const u = clamp((x - t) / 0.25); return { cut: 700 + 900 * Math.sin(Math.PI * u), q: 1, mode: "bp", amp: 0.08 * g * Math.sin(Math.PI * u), send: 0.5, pan: 0.5 }; });
      }
      noiseFx(s.start, s.end, (t) => ({ cut: 1100, q: 0.8, mode: "lp", amp: 0.06 * g * Math.sin(Math.PI * clamp((t - s.start) / s.dur)), send: 0.7, pan: 0.5 }));
    },
    birdHalo: (s) => { bell(s.start + 0.2, rev(s) ? 74 : 81, rev(s) ? 0.15 : 0.25, 0.5, 3.5); },
    starDim: (s) => boom(s.start + 0.3, 0.35, 45, 30, 2.4),
    faceGlow: (s) => { bell(s.start + 0.8, 69, 0.3, -0.3, 4); bell(s.start + 1.6, 74, 0.22, -0.2, 4); },
  };
}
