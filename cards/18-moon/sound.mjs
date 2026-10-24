// XVIII 月亮 — opening sound and card-specific fx sounds. Times use the same constants as layers.tsx.
// Water is a soft low bed (card.json audio.softNoise keeps every noise gentle) plus small sine "plips";
// the howls are sine voices gliding up and down with a slow vibrato, far back in the reverb.

export default function sound({ boom, bell, noiseFx, clamp, add, SR, rnd, cues }) {
  const rev = (s) => s.start >= cues.reversal.start;
  /** one water drop: a short sine gliding upward */
  const drop = (t0, g = 1, f0 = 600, pan = 0) => {
    const i0 = Math.floor(t0 * SR), len = Math.floor(0.09 * SR);
    let ph = 0;
    for (let j = 0; j < len; j++) {
      const t = j / SR;
      ph += (f0 * (1 + 1.1 * clamp(t / 0.035))) / SR;
      const s = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 45) * clamp(t / 0.002) * 0.07 * g;
      add(i0 + j, s * (0.5 - pan * 0.5), s * (0.5 + pan * 0.5), 0.6);
    }
  };
  /** water stirring: a breathing low bed and a few drops */
  const water = (a, b, g, pan = -0.1) => {
    noiseFx(a, b, (t) => ({ cut: 700 + 250 * Math.sin(t * 5.1) * Math.sin(t * 2.3), q: 0.8, mode: "lp", amp: 0.45 * g * clamp((t - a) / 0.3) * clamp((b - t) / 0.4), send: 0.4, pan }));
    for (let t = a + 0.1; t < b - 0.15; t += 0.25 + 0.35 * rnd()) drop(t, g * (0.4 + 0.8 * rnd()), 420 + 500 * rnd(), pan + (rnd() - 0.5) * 0.4);
  };
  /** a howl: a sine voice rising, holding with vibrato, falling away */
  const howl = (t0, d = 2.2, g = 1, f0 = 330, pan = 0) => {
    const i0 = Math.floor(t0 * SR), len = Math.floor(d * SR);
    let ph = 0, ph2 = 0;
    for (let j = 0; j < len; j++) {
      const u = j / len, t = j / SR;
      const glide = u < 0.25 ? 0.75 + 0.25 * Math.sin((Math.PI / 2) * (u / 0.25)) : u < 0.7 ? 1 : 1 - 0.22 * ((u - 0.7) / 0.3);
      const f = f0 * 1.6 * glide * (1 + 0.012 * Math.sin(2 * Math.PI * 5.2 * t) * clamp((u - 0.2) / 0.2));
      ph += f / SR; ph2 += (f * 2.005) / SR;
      const env = Math.sin(Math.PI * clamp(u / 1.0)) * clamp(u / 0.12);
      const s = (Math.sin(2 * Math.PI * ph) + 0.25 * Math.sin(2 * Math.PI * ph2)) * env * 0.045 * g;
      add(i0 + j, s * (0.5 - pan * 0.5), s * (0.5 + pan * 0.5), 0.95);
    }
  };

  // first frame: the crayfish's claws break the water, a ring spreads; a distant howl far back
  water(0.0, 2.2, 1.0, -0.2);
  drop(0.02, 1.6, 520, -0.2);
  boom(0.0, 0.4, 55, 30, 2.4);
  howl(0.35, 1.9, 0.55, 300, 0.4);

  return {
    emerge: (s) => { if (s.kind !== "open") { water(s.start, s.end, 0.8); drop(s.start + 0.15, 1.3, 480, -0.2); } },
    // light drops: soft high bells, scattered
    dew: (s) => { for (let t = s.start + 0.3; t < s.end - 0.2; t += 0.55 + 0.4 * rnd()) bell(t, [88, 91, 93, 95, 98][Math.floor(rnd() * 5)], 0.09, rnd() * 1.2 - 0.6, 1.8); },
    dewLit: (s) => { for (let i = 0; i < 6; i++) bell(s.start + s.dur * (0.08 + i * 0.12), [81, 84, 86, 88, 91, 93][i], 0.16, (i / 5 - 0.5) * 1.2, 2.2); },
    haze: (s) => noiseFx(s.start, s.end, (t) => ({ cut: 900, q: 0.7, mode: "lp", amp: 0.12 * Math.sin(Math.PI * clamp((t - s.start) / s.dur)), send: 0.8 })),
    mist: (s) => noiseFx(s.start, s.end, (t) => ({ cut: 1100 + 200 * Math.sin(t * 0.7), q: 0.7, mode: "lp", amp: 0.16 * Math.sin(Math.PI * clamp((t - s.start) / s.dur)), send: 0.9, pan: Math.sin(t * 0.4) * 0.5 })),
    // reversed: the mist clears — an airy rise that thins out, and a clear bell
    mistClear: (s) => {
      noiseFx(s.start, s.end, (t) => { const u = clamp((t - s.start) / s.dur); return { cut: 900 + 300 * u, q: 0.7, mode: "lp", amp: 0.2 * (1 - u) * clamp(u / 0.1), send: 0.9 }; });
      bell(s.start + s.dur * 0.6, 76, 0.3, 0, 3.5);
    },
    // dog first (left), the wolf answers (right), overlapping
    howl: (s) => { howl(s.start + 0.2, Math.min(2.4, s.dur - 0.3), 1.0, 340, -0.45); howl(s.start + 0.65, Math.min(2.2, s.dur - 0.7), 0.9, 290, 0.45); },
    tameWild: (s) => { bell(s.start + s.dur * 0.08, 74, 0.3, -0.5, 2.8); bell(s.start + s.dur * 0.52, 69, 0.3, 0.5, 2.8); },
    // reversed, no howl: a low settling tone
    relax: (s) => { boom(s.start + 0.2, 0.25, 50, 36, 2.6); bell(s.start + 0.6, 62, 0.18, 0, 4); },
    deep: (s) => { boom(s.start + 0.15, 0.45, 44, 28, 3.0); water(s.start, s.end, 0.35, 0.3); },
    // the crayfish sinks: a few low bubbles gliding down
    sink: (s) => {
      water(s.start, s.end, 0.4, -0.2);
      for (let k = 0; k < 4; k++) drop(s.start + 0.4 + k * 0.5, 0.9, 380 - k * 40, -0.2);
      boom(s.start + s.dur * 0.6, 0.25, 48, 30, 2.0);
    },
    calm: (s) => { water(s.start, s.end, 0.22, 0.3); drop(s.start + 0.6, 0.5, 400, 0.3); drop(s.start + 1.9, 0.4, 380, 0.3); },
  };
}
