// XII 倒吊人 — opening sound: the rope creaks at each end of the swing, fading as it settles.
// Swing timing mirrors layers.tsx (same constants), so every creak lands on a turning point.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { SWING_SETTLE } = require("./plan.js");

const A0 = 14, OMEGA = 2 * Math.PI * 0.62, DECAY = Math.log(A0 / 0.8) / SWING_SETTLE;

export default function sound({ boom, noiseFx, creak, bell, clamp }) {
  // a low tone under the first frame, the swing already in motion
  boom(0.0, 0.55, 56, 30, 2.2);
  // creak at each turning point, softer as the swing dies out
  for (let n = 1; ; n++) {
    const t = (n * Math.PI) / OMEGA;
    const amp = A0 * Math.exp(-DECAY * t);
    if (amp < 1.5) break;
    creak(t - 0.25, 0.5, 0.18 * (amp / A0) + 0.04, 340 + 30 * (n % 2), 470 + 40 * (n % 2));
  }
  // air moving past the swinging body
  noiseFx(0.0, SWING_SETTLE, (t) => ({ cut: 700 + 400 * Math.abs(Math.sin(OMEGA * t)), q: 1.4, mode: "bp", amp: 0.05 * Math.exp(-DECAY * t) * Math.abs(Math.sin(OMEGA * t)), send: 0.5 }));
  bell(SWING_SETTLE - 0.1, 62, 0.5, 0, 4.5);

  return {
    // a slow rope creak under rope shots
    creak: (s) => { for (let t = s.start + 0.3; t < s.end - 0.3; t += 1.6) creak(t, 0.7, 0.12, 330, 430); },
    sway: (s) => noiseFx(s.start, s.end, (t) => ({ cut: 600, q: 1.2, mode: "bp", amp: 0.03 * Math.abs(Math.sin(2 * Math.PI * 0.35 * t)) * clamp((t - s.start) / 0.5) * clamp((s.end - t) / 0.5), send: 0.5 })),
    turnView: (s) => {
      noiseFx(s.start, s.end, (t) => { const u = clamp((t - s.start) / s.dur); return { cut: 400 + 1800 * u, q: 1.3, mode: "bp", amp: 0.08 * Math.sin(Math.PI * u), send: 0.6 }; });
      bell(s.start + s.dur * 0.7, 79, 0.4, 0, 3.5);
    },
  };
}
