import React from "react";
import { random } from "remotion";
import type { Generated, LayerProps } from "../../engine/types";
import CJ from "./crown.json";
import GEN from "./generated.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { KING_FALL } = require("./plan.js");

/* XIII 死神 — the king falls the second half of the way; the crown is flung off, bounces, rocks and settles. */

const gen = GEN as Generated;
const KING_A0 = 46; // degrees above the ground when the shot opens
const KPIV_SCAN = [355, 1595];

export const kingAngle = (t: number) => {
  if (t < KING_FALL) return KING_A0 * (1 - Math.pow(t / KING_FALL, 2)); // accelerating under gravity
  const u = t - KING_FALL;
  return 2.2 * Math.exp(-u * 12) * Math.sin(u * 40); // small recoil on impact
};
const rotAbout = ([x, y]: readonly [number, number], deg: number, [px, py]: readonly [number, number]) => {
  const a = (deg * Math.PI) / 180;
  const dx = x - px, dy = y - py;
  return [px + dx * Math.cos(a) - dy * Math.sin(a), py + dx * Math.sin(a) + dy * Math.cos(a)] as const;
};
const segLerp = (t: number, ts: number[], vs: number[]) => {
  if (t <= ts[0]) return vs[0];
  for (let i = 0; i < ts.length - 1; i++) if (t <= ts[i + 1]) return vs[i] + (vs[i + 1] - vs[i]) * ((t - ts[i]) / (ts[i + 1] - ts[i]));
  return vs[vs.length - 1];
};
const wobbleAt = (u: number) => {
  const w = CJ.wobble;
  return w.amp * Math.exp(-w.decay * u) * Math.cos(2 * Math.PI * (w.f0 * u + w.chirp * u * u));
};
const [I1, I2, I3] = CJ.impacts;

const DUST = new Array(46).fill(0).map((_, i) => ({ u: random(`du${i}`), vx: (random(`dvx${i}`) - 0.5) * 70, vy: -40 - random(`dvy${i}`) * 90, r: 3 + random(`dr${i}`) * 6, life: 1.2 + random(`dl${i}`) * 1.8 }));
const MOTES = new Array(26).fill(0).map((_, i) => ({ x: random(`mx${i}`), y: random(`my${i}`), ph: random(`mp${i}`) * 6.28, r: 0.8 + random(`mr${i}`) * 1.6 }));

export const Layers: React.FC<LayerProps> = ({ t, openT, uid, g, fx, url }) => {
  const KB = g.box(gen.sprites.king);
  const CB = g.box(gen.sprites.crown);
  const KPIV = g.sc(KPIV_SCAN[0], KPIV_SCAN[1]);
  const REST = [CB.x + CB.w / 2, CB.y + CB.h / 2] as const;
  const START = g.sc(CJ.start[0], CJ.start[1]);

  const crownPose = (tt: number) => {
    const dx = REST[0] - START[0];
    const settle = (p: number) => 1 - Math.pow(1 - p, 2);
    const x = tt >= I3 ? START[0] + dx * (CJ.xAt[3] + (1 - CJ.xAt[3]) * settle(Math.min(1, (tt - I3) / (CJ.restAt - I3)))) : START[0] + dx * segLerp(tt, [0, CJ.slideEnd, I1, I2, I3], [0, ...CJ.xAt]);
    let lift: number;
    const top = START[1] - 2;
    if (tt < CJ.slideEnd) lift = REST[1] - (START[1] - 2 * Math.sin((Math.PI / 2) * (tt / CJ.slideEnd)));
    else if (tt < I1) lift = (REST[1] - top) * (1 - Math.pow((tt - CJ.slideEnd) / (I1 - CJ.slideEnd), 2));
    else if (tt < I2) { const u = (tt - I1) / (I2 - I1); lift = CJ.bounce[0] * 4 * u * (1 - u); }
    else if (tt < I3) { const u = (tt - I2) / (I3 - I2); lift = CJ.bounce[1] * 4 * u * (1 - u); }
    else lift = 0;
    let rot: number;
    if (tt < CJ.slideEnd) rot = CJ.startRot - 14 * (tt / CJ.slideEnd);
    else if (tt < I1) rot = segLerp(tt, [CJ.slideEnd, I1], [CJ.startRot - 14, -40]);
    else if (tt < I2) rot = segLerp(tt, [I1, I2], [-40, 12]);
    else if (tt < I3) rot = segLerp(tt, [I2, I3], [12, CJ.wobble.amp]);
    else rot = wobbleAt(tt - I3);
    if (tt >= I3) lift = Math.abs(rot) * 0.15;
    return { x, y: REST[1] - lift, rot, lift };
  };

  const ka = kingAngle(openT);

  const ct = openT - KING_FALL;
  const p = ct < 0 ? (() => { const [x, y] = rotAbout(START, ka, KPIV); return { x, y, rot: CJ.startRot + ka, lift: 99 }; })() : crownPose(ct);
  const CW = CB.w, CH = CB.h;
  const shadowK = Math.max(0, 1 - p.lift / 70);
  const trail = ct > CJ.slideEnd && ct < I1 + 0.04 ? [2, 1].map((n) => ({ q: crownPose(ct - n / 90), o: 0.18 / n })) : [];
  const kingTrail = openT < KING_FALL && openT > 0.15 ? [1, 2].map((n) => ({ a: kingAngle(openT - n / 60), o: 0.16 / n })) : [];
  const CROWN = url("crown.png"), KING = url("king.png");
  const crownSprite = (q: { x: number; y: number; rot: number }, o: number, key: string) => (
    <image key={key} href={CROWN} x={-CW / 2} y={-CH / 2} width={CW} height={CH} opacity={o} transform={`translate(${q.x},${q.y}) rotate(${q.rot})`} />
  );
  const kingSprite = (a: number, o: number, key: string) => <image key={key} href={KING} x={KB.x} y={KB.y} width={KB.w} height={KB.h} opacity={o} transform={`rotate(${a} ${KPIV[0]} ${KPIV[1]})`} />;

  // dust kicked up on impact, then motes hanging in the air
  const u = openT - KING_FALL;
  const x0 = KB.x + 10, x1 = KPIV[0], gy = KB.y + KB.h * 0.85;
  const motes = Math.max(0.35 * (1 - Math.min(1, Math.max(0, (t - 2) / 2))), fx.level("dust"));

  return (
    <g>
      <ellipse cx={KB.x + KB.w * 0.52} cy={KB.y + KB.h * 0.62} rx={KB.w * 0.56} ry={KB.h * 0.42} fill="#07060c" opacity={0.92 * Math.min(1, ka / (KING_A0 * 0.35))} filter={`url(#${uid}-soft)`} />
      <ellipse cx={KB.x + KB.w * 0.5} cy={KB.y + KB.h * 0.92} rx={KB.w * 0.5} ry={KB.h * 0.12} fill="#000" opacity={0.45 * (1 - ka / KING_A0)} filter={`url(#${uid}-soft)`} />
      {kingTrail.map(({ a, o }, i) => kingSprite(a, o, `kt${i}`))}
      {kingSprite(ka, 1, "k")}
      <ellipse cx={p.x + 2} cy={REST[1] + CH * 0.36} rx={CW * 0.42 * (0.6 + 0.4 * shadowK)} ry={CH * 0.1 * (0.6 + 0.4 * shadowK)} fill="#000" opacity={0.55 * shadowK} filter={`url(#${uid}-soft)`} />
      {trail.map(({ q, o }, i) => crownSprite(q, o, `tr${i}`))}
      {crownSprite(p, 1, "c")}
      {u > 0 &&
        u < 3.2 &&
        DUST.map((d, i) => {
          if (u > d.life) return null;
          const k = u / d.life;
          const drag = 1 - Math.exp(-u * 2.2);
          return <circle key={`d${i}`} cx={x0 + (x1 - x0) * d.u + (d.vx * drag) / 2.2} cy={gy + (d.vy * drag) / 2.2 + 4 * u * u} filter={`url(#${uid}-soft)`} r={d.r * (1 + 1.5 * k)} fill="#cdbd98" opacity={0.26 * (1 - k) * Math.min(1, u * 8)} />;
        })}
      {motes > 0 &&
        MOTES.map((m, i) => (
          <circle key={`m${i}`} cx={KB.x - 20 + m.x * (KB.w + 140) + Math.sin(t * 0.4 + m.ph) * 8} cy={KB.y - 60 + m.y * (KB.h + 80) - ((t * 4 + m.ph * 10) % 40)} r={m.r} fill="#efe0bd" opacity={motes * (0.25 + 0.25 * Math.sin(t * 1.3 + m.ph))} />
        ))}
    </g>
  );
};
