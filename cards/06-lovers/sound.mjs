// VI 恋人 — opening sound and card-specific fx sounds. Wing beats use the same constants as layers.tsx.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { OPEN_DUR } = require("./plan.js");

const WING_BEATS = 3; // = layers.tsx WING_BEATS: the wings peak at (n - 0.5) / WING_HZ
const WING_HZ = WING_BEATS / OPEN_DUR;
const FRUIT_N = require("./fx.json").fruit.length;

export default function sound({ boom, bell, noiseFx, whoosh, clamp, cues }) {
  const rev = (s) => s.start >= cues.reversal.start;
  // first frame: a low tone, the wings already moving
  boom(0.0, 0.55, 57, 30, 2.4);
  // one soft feathered whoosh per wing beat, each a little quieter
  for (let n = 1; n <= WING_BEATS; n++) {
    const peak = (n - 0.5) / WING_HZ;
    const a = peak - 0.22, b = peak + 0.3, amp = 0.12 * (1 - 0.25 * (n - 1));
    noiseFx(a, b, (t) => { const u = clamp((t - a) / (b - a)); return { cut: 500 + 1300 * Math.sin(Math.PI * u), q: 1.1, mode: "bp", amp: amp * Math.pow(Math.sin(Math.PI * u), 1.5), send: 0.5 }; });
  }
  bell(OPEN_DUR - 0.25, 64, 0.45, 0, 4.5);

  const crackle = (s, amp) => {
    // fire: a low breathy bed plus short random crackles
    noiseFx(s.start, s.end, (t) => ({ cut: 900, q: 0.8, mode: "bp", amp: amp * clamp((t - s.start) / 0.4) * clamp((s.end - t) / 0.4), send: 0.4 }));
    for (let t = s.start + 0.2; t < s.end - 0.2; t += 0.18 + 0.27 * Math.abs(Math.sin(t * 13.7))) {
      noiseFx(t, t + 0.035, () => ({ cut: 3200, q: 2, mode: "bp", amp: amp * 1.6, send: 0.2 }));
    }
  };

  return {
    // the wings breathe a little more under shots that show them
    wings: (s) => { if (s.start > 0.1) whoosh(s.start + 0.3, 0.6, 0.05); },
    // one soft high bell as each fruit lights (same timing as layers.tsx fruitOn)
    fruit: (s) => { for (let i = 0; i < FRUIT_N; i++) bell(s.start + s.dur * (0.2 + (i * 0.5) / FRUIT_N), 84 + [0, 3, 5, 7][i % 4], 0.22, -0.5 + 0.3 * i, 3.0); },
    flames: (s) => crackle(s, rev(s) ? 0.025 : 0.045), // quieter once the card is reversed
    // the glint running down the serpent
    serpent: (s) => {
      const a = s.start + 0.1, d = s.dur * 0.8;
      noiseFx(a, a + d, (t) => { const u = clamp((t - a) / d); return { cut: 5200 - 2600 * u, q: 5, mode: "bp", amp: 0.035 * Math.sin(Math.PI * u), send: 0.9 }; });
      bell(a + d * 0.15, rev(s) ? 69 : 81, 0.25, -0.6, 2.5);
    },
  };
}
