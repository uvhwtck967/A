// XIII 死神 — opening sound: the king's body hits the ground, the crown clanks, bounces and rocks to rest.
// Impact times come from crown.json, the same data that drives the animation in layers.tsx.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const CJ = require("./crown.json");
const { KING_FALL } = require("./plan.js");

export default function sound({ boom, noiseFx, clank, bell, clamp }) {
  const K = KING_FALL;
  noiseFx(0.0, K + 0.05, (t) => ({ cut: 250 + 900 * clamp(t / K), q: 1.1, mode: "bp", amp: 0.12 * Math.pow(clamp(t / K), 1.6), send: 0.4 }));
  boom(K, 1.15, 58, 26, 2.6);
  noiseFx(K, K + 0.4, (t) => ({ cut: 500 + 600 * Math.exp(-(t - K) * 10), amp: 0.45 * Math.exp(-(t - K) * 14), send: 0.3 }));
  noiseFx(K + 0.05, K + 2.2, (t) => ({ cut: 3000, q: 3, mode: "bp", amp: 0.025 * Math.exp(-(t - K) * 1.4), send: 0.8 }));

  const D = K;
  const [I1, I2, I3] = CJ.impacts.map((x) => x + D);
  noiseFx(D, D + CJ.slideEnd + 0.05, (t) => ({ cut: 2600, q: 4, mode: "bp", amp: 0.06 * Math.sin(Math.PI * clamp((t - D) / (CJ.slideEnd + 0.05))), send: 0.5 }));
  clank(I1, 1.0); bell(I1 + 0.01, 62, 0.6, 0, 4);
  clank(I2, 0.45, 96);
  clank(I3, 0.28, 95);
  const w = CJ.wobble;
  for (let n = 1; n < 40; n++) {
    const u = (-w.f0 + Math.sqrt(w.f0 * w.f0 + 2 * w.chirp * n)) / (2 * w.chirp);
    const a = w.amp * Math.exp(-w.decay * u);
    if (a < w.audibleDeg) break;
    clank(I3 + u, 0.2 * (a / w.amp) + 0.04, 97 - (n % 2));
  }
  bell(I3 + Math.log(w.amp / w.audibleDeg) / w.decay, 86, 0.35, 0, 2.5);

  // card-specific fx sounds: dust hanging in the air, a glint on the crown
  return {
    dust: (s) => noiseFx(s.start, s.end, () => ({ cut: 3200, q: 3, mode: "bp", amp: 0.018, send: 0.9 })),
  };
}
