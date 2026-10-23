import React from "react";
import type { Generated, LayerProps } from "../../engine/types";
import GEN from "./generated.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SWING_SETTLE } = require("./plan.js");

/*
 * XII 倒吊人 — the figure, cut from the scan, hangs from the rope and swings.
 * Opening: it swings in from 14° and settles (a damped pendulum). After that it keeps a slow,
 * barely-there sway; shots tagged "sway" swing it a little more, "turnView" turns the whole picture.
 */
const gen = GEN as Generated;
const PIVOT_SCAN = [592, 228]; // where the rope meets the foot
const A0 = 14; // degrees at frame 0
const OMEGA = 2 * Math.PI * 0.62; // pendulum frequency (≈ 0.62 Hz for a ~0.65 m "card-scale" pendulum)
const DECAY = Math.log(A0 / 0.8) / SWING_SETTLE; // below 0.8° by the time the hook captions start

export const swingAngle = (t: number) => A0 * Math.exp(-DECAY * t) * Math.cos(OMEGA * t);
/** times (s) when the swing passes through its extremes — used by sound.mjs for the rope creaks */
export const creakTimes = () => {
  const out: number[] = [];
  for (let n = 1; ; n++) {
    const t = (n * Math.PI) / OMEGA;
    if (A0 * Math.exp(-DECAY * t) < 1.5) break;
    out.push(t);
  }
  return out;
};

export const Layers: React.FC<LayerProps> = ({ t, openT, uid, g, fx, url }) => {
  const B = g.box(gen.sprites.figure);
  const [px, py] = g.sc(PIVOT_SCAN[0], PIVOT_SCAN[1]);
  const idle = 0.6 * Math.sin(2 * Math.PI * 0.21 * t) + 0.25 * Math.sin(2 * Math.PI * 0.53 * t + 1);
  const swayBoost = 2.2 * fx.level("sway", 0.6, 0.5) * Math.sin(2 * Math.PI * 0.35 * t);
  const a = (openT < SWING_SETTLE + 2 ? swingAngle(openT) : 0) + idle + swayBoost;
  // the shadow on the trunk moves opposite to the swing
  const shadowX = -a * 1.2;
  const src = url("figure.png");
  // a short motion trail while it swings fast at the start
  const trail = openT < 0.9 ? [1, 2].map((n) => ({ a: swingAngle(openT - n / 60) + idle, o: 0.14 / n })) : [];
  return (
    <g>
      <ellipse cx={px + shadowX} cy={B.y + B.h * 0.55} rx={B.w * 0.18} ry={B.h * 0.45} fill="#05040a" opacity={0.35} filter={`url(#${uid}-soft)`} />
      {trail.map((tr, i) => (
        <image key={i} href={src} x={B.x} y={B.y} width={B.w} height={B.h} opacity={tr.o} transform={`rotate(${tr.a} ${px} ${py})`} />
      ))}
      <image href={src} x={B.x} y={B.y} width={B.w} height={B.h} transform={`rotate(${a} ${px} ${py})`} />
    </g>
  );
};
