// XVI 高塔 — opening sound and card-specific fx sounds. Times use the same constants as layers.tsx.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const N_YODS = require("./fx.json").yods.length;
// = layers.tsx STRIKE_AT, KNOCK, SETTLE, STRIKE_DELAY (layers.tsx is TypeScript, so they are repeated here)
const STRIKE_AT = 0.04, KNOCK = 0.12, SETTLE = 1.3, STRIKE_DELAY = 0.25;

export default function sound({ boom, bell, noiseFx, whoosh, clank, clamp, cues }) {
  const rev = (s) => s.start >= cues.reversal.start;
  // thunder: a sharp crack, a low boom and a rolling rumble; `g` scales it down for the later shots
  const thunder = (t0, g) => {
    noiseFx(t0, t0 + 0.25, (t) => ({ cut: 3800 - 2400 * clamp((t - t0) / 0.25), q: 0.9, mode: "bp", amp: 0.32 * g * Math.exp(-(t - t0) * 16), send: 0.5 }));
    noiseFx(t0 + 0.17, t0 + 0.3, (t) => ({ cut: 2600, q: 1, mode: "bp", amp: 0.12 * g * Math.exp(-(t - t0 - 0.17) * 20), send: 0.5 }));
    boom(t0 + 0.01, 0.9 * g, 52, 26, 3.0);
    noiseFx(t0 + 0.1, t0 + 2.4, (t) => { const u = clamp((t - t0 - 0.1) / 2.3); return { cut: 260 + 120 * Math.sin(t * 7), q: 0.8, mode: "lp", amp: 0.16 * g * Math.sin(Math.PI * Math.min(1, u * 4)) * (1 - u), send: 0.6 }; });
  };
  const crackle = (s, amp) => {
    noiseFx(s.start, s.end, (t) => ({ cut: 900, q: 0.8, mode: "bp", amp: amp * clamp((t - s.start) / 0.4) * clamp((s.end - t) / 0.4), send: 0.4 }));
    for (let t = s.start + 0.2; t < s.end - 0.2; t += 0.18 + 0.27 * Math.abs(Math.sin(t * 13.7))) {
      noiseFx(t, t + 0.035, () => ({ cut: 3200, q: 2, mode: "bp", amp: amp * 1.6, send: 0.2 }));
    }
  };
  return {
    strike: (s) => (s.kind === "open" ? thunder(s.start + STRIKE_AT, 1.0) : thunder(s.start + STRIKE_DELAY, rev(s) ? 0.4 : 0.6)),
    crownFall: (s) => {
      if (s.kind === "open") {
        // knocked off: a metallic hit, a short tumble through the air, a soft ring as it settles
        clank(KNOCK, 0.55, 96);
        bell(KNOCK + 0.01, 74, 0.3, -0.4, 3);
        whoosh(KNOCK + 0.55, 0.6, 0.09, -0.5);
        bell(SETTLE, 81, 0.18, -0.5, 2.5);
      } else bell(s.start + 0.4, 79, 0.16, -0.5, 2.5); // later: only a faint shimmer as it drifts
    },
    flames: (s) => crackle(s, rev(s) ? 0.022 : 0.04),
    // drops of fire in the air: a thin, high hiss
    yods: (s) => noiseFx(s.start, s.end, (t) => ({ cut: 5800, q: 4, mode: "bp", amp: 0.014 * Math.sin(Math.PI * clamp((t - s.start) / s.dur)), send: 0.9 })),
    // one soft bell per yod as it lights (same timing as layers.tsx)
    yodCount: (s) => { for (let i = 0; i < N_YODS; i++) bell(s.start + s.dur * (0.06 + (i * 0.62) / N_YODS), [79, 81, 84, 86, 88][i % 5], 0.09, -0.6 + (1.2 * i) / N_YODS, 1.4); },
    // grit and small chips falling
    dust: (s) => {
      noiseFx(s.start, s.end, (t) => ({ cut: 3000, q: 2.5, mode: "bp", amp: 0.016 * clamp((t - s.start) / 0.3) * clamp((s.end - t) / 0.3), send: 0.8 }));
      for (let i = 0; i < 6; i++) clank(s.start + 0.5 + i * 0.27, 0.06, 90 + (i % 3));
    },
  };
}
