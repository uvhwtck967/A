// II 女祭司 — opening sound and card-specific fx sounds. Times come from the same timeline as layers.tsx.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { OPEN_DUR } = require("./plan.js");

export default function sound({ boom, bell, noiseFx, whoosh, clamp }) {
  // first frame: a low tone, and the wind already moving the veil
  boom(0.0, 0.55, 55, 30, 2.4);
  const breath = (a, b, amp) =>
    noiseFx(a, b, (t) => {
      const env = clamp((t - a) / 0.35) * clamp((b - t) / 0.6);
      const gust = 0.55 + 0.45 * Math.sin(2 * Math.PI * 0.42 * (t - a) - 1.2);
      return { cut: 650 + 900 * gust, q: 0.9, mode: "bp", amp: amp * gust * env, send: 0.6 };
    });
  breath(0.0, OPEN_DUR + 0.6, 0.11);
  // soft cloth movement on top of the wind
  noiseFx(0.15, OPEN_DUR + 0.2, (t) => ({ cut: 2600 + 900 * Math.sin(t * 3.1), q: 1.8, mode: "bp", amp: 0.025 * Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * 0.9 * t), 2), send: 0.5 }));
  bell(OPEN_DUR - 0.2, 62, 0.45, 0, 4.5);

  return {
    // the veil breathes a little more under shots that look at it
    ripple: (s) => { if (s.start > 0.1) breath(s.start - 0.1, s.end + 0.2, 0.05); },
    // B lights with a low tone, J with a higher one
    pillars: (s) => { bell(s.start + s.dur * 0.18, 57, 0.4, -0.5, 3.5); bell(s.start + s.dur * 0.62, 64, 0.4, 0.5, 3.5); },
    // TORA turning gold, letter by letter
    reveal: (s) => {
      noiseFx(s.start, s.end, (t) => { const u = clamp((t - s.start) / s.dur); return { cut: 2500 + 6000 * u, q: 6, mode: "bp", amp: 0.04 * Math.sin(Math.PI * u), send: 0.9 }; });
      [76, 81, 83, 88].forEach((m, k) => bell(s.start + 0.25 + k * s.dur * 0.2, m, 0.24, (k / 3 - 0.5) * 1.0, 2.2));
    },
    numeral: (s) => { whoosh(s.start + 0.1, 0.35, 0.05); bell(s.start + 0.45, 86, 0.3, 0, 3.5); },
  };
}
