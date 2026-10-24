import React from "react";
import type { LayerProps } from "../../engine/types";
import FX from "./fx.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OPEN_DUR } = require("./plan.js");

/*
 * XVIII 月亮 — card-specific animation. Small, steady movement; light, mist and water are the only things drawn.
 *   sprites (always) dog.png / wolf.png / crayfish.png (cut by assets.py, each with a night twin crossfaded by the
 *                   reversed tint) are the only copies: the holes in art.png are inpainted
 *   water (always)  soft glints on the pool, masked by water.png; weaker reversed
 *   "emerge"        the crayfish rises a little out of the pool, rings spread around it (opening: from frame 1)
 *   "dew"           light drops fall slowly from the painted yods below the moon; "dewLit" lights them one by one
 *   "haze"          the scene goes soft: a blurred copy of the picture and a pale veil over it
 *   "mist"          bands of mist drift across the field
 *   "mistClear"     reversed full shot: mist and haze start thick and clear away
 *   "howl"          dog and wolf raise their heads (tilted about the neck)
 *   "tameWild"      the dog brightens first ("经过驯化"), then the wolf ("保留野性")
 *   "relax"         reversed: both heads sink a little, no howl
 *   "deep"          the pool water darkens, dim shapes drift beneath it
 *   "sink"          reversed: the crayfish lets itself down and the water closes over it
 *   "calm"          reversed: the pool goes still, a few faint slow rings remain
 * Coordinates are scan px of scans/RWS_Tarot_18_Moon.jpg.
 */
type Box = [number, number, number, number];
type P = [number, number];
const fxj = FX as unknown as {
  dog: Box; wolf: Box; crayfish: Box;
  dogPivot: P; wolfPivot: P; crayfishPivot: P;
  dew: [number, number, number][];
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { const u = clamp(x); return u * u * (3 - 2 * u); };
const frac = (x: number) => x - Math.floor(x);
const rnd = (i: number, m: number) => frac(Math.sin(i * 12.9898 + m * 78.233) * 43758.5453);

const SURFACE_HIT: P = [492, 1528]; // where the crayfish breaks the water
const DEEP: P = [820, 1595];
const DOG_BODY: P = [370, 1150];
const WOLF_BODY: P = [790, 1140];
const POOL: Box = [70, 1512, 1035, 1668];
const MIST_ROWS = [960, 1030, 1110, 1190, 1270, 1350, 1430];

export const Layers: React.FC<LayerProps> = ({ t, openT, uid, g, fx, cold, url }) => {
  const S = g.box([0, 0, 100, 100]).w / 100; // card units per scan px
  const prog = (n: string) => fx.prog(n);
  const sprite = (file: string, b: Box) => {
    const B = g.box(b);
    const one = (f: string, o?: number) => <image href={url(f)} x={B.x} y={B.y} width={B.w} height={B.h} preserveAspectRatio="none" opacity={o} />;
    return (
      <>
        {cold < 0.995 && one(`${file}.png`)}
        {cold > 0.005 && one(`${file}_night.png`, Math.min(1, cold))}
      </>
    );
  };
  const { PIC } = g;
  const sheen = 1 - 0.55 * cold;

  /* ---------- crayfish ---------- */
  const opening = openT < OPEN_DUR + 0.6 ? 1 - smooth((openT - OPEN_DUR) / 0.6) : 0;
  const em = Math.max(fx.level("emerge", 0.3, 0.4), opening);
  const emP = prog("emerge") ?? (openT < OPEN_DUR ? openT / OPEN_DUR : 0);
  const sinkP = prog("sink");
  const sk = fx.level("sink", 0.2, 0.3) * smooth(((sinkP ?? 0) - 0.05) / 0.85);
  const rise = em * (-2 - 4 * smooth(emP)) + sk * 12; // scan px, negative = up out of the water
  const [cpx, cpy] = g.sc(...fxj.crayfishPivot);
  const clawTilt = em * 0.8 * Math.sin(2 * Math.PI * 0.35 * t);

  /* ---------- dog and wolf ---------- */
  const howl = fx.level("howl", 0.5, 0.5);
  const hw = howl * (0.55 + 0.45 * Math.sin(2 * Math.PI * 0.28 * t - 1.2));
  const relaxP = prog("relax");
  const rl = fx.level("relax", 0.3, 0.3) * smooth(((relaxP ?? 0) - 0.05) / 0.8);
  const idle = 0.25 * Math.sin(2 * Math.PI * 0.18 * t);
  const dogRot = -3.0 * hw + 2.0 * rl + idle;
  const wolfRot = 2.6 * hw - 1.8 * rl - idle * 0.8;
  const [dpx, dpy] = g.sc(...fxj.dogPivot);
  const [wpx, wpy] = g.sc(...fxj.wolfPivot);
  const twP = prog("tameWild");
  const twL = fx.level("tameWild", 0.2, 0.3);
  const dogLit = twP == null ? 0 : twL * smooth((twP - 0.06) / 0.12) * (1 - smooth((twP - 0.42) / 0.12));
  const wolfLit = twP == null ? 0 : twL * smooth((twP - 0.5) / 0.12) * (1 - smooth((twP - 0.86) / 0.12));

  /* ---------- haze and mist ---------- */
  const clearP = prog("mistClear");
  const clearing = fx.level("mistClear", 0.05, 0.3) * (1 - smooth(((clearP ?? 0) - 0.08) / 0.8));
  const haze = Math.max(fx.level("haze", 0.5, 0.4), clearing);
  const mist = Math.max(fx.level("mist", 0.6, 0.5), 0.9 * clearing);

  /* ---------- dew ---------- */
  const dew = fx.level("dew", 0.4, 0.4);
  const litP = prog("dewLit");
  const lit = fx.level("dewLit", 0.3, 0.4);

  /* ---------- pool ---------- */
  const deepP = prog("deep");
  const deep = fx.level("deep", 0.3, 0.4) * smooth(((deepP ?? 0) - 0.02) / 0.75);
  const calm = fx.level("calm", 0.3, 0.4);
  const [sx, sy] = g.sc(...SURFACE_HIT);
  const [dx, dy] = g.sc(...DEEP);
  const PB = g.box(POOL);

  return (
    <g>
      <defs>
        <mask id={`${uid}-water`} maskUnits="userSpaceOnUse" x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h}>
          <image href={url("water.png")} x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} preserveAspectRatio="none" />
        </mask>
        <mask id={`${uid}-cray`} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          {(() => { const B = g.box(fxj.crayfish); return <image href={url("crayfish.png")} x={B.x} y={B.y} width={B.w} height={B.h} preserveAspectRatio="none" />; })()}
        </mask>
        <linearGradient id={`${uid}-closing`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3d5f7a" stopOpacity="1" />
          <stop offset="0.75" stopColor="#3d5f7a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3d5f7a" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-haze`} x="0" y="0" width="100%" height="100%">
          <feGaussianBlur stdDeviation={1.3} />
        </filter>
        <filter id={`${uid}-mistBlur`} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <filter id={`${uid}-wsoft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={0.6} />
        </filter>
        <radialGradient id={`${uid}-drop`}>
          <stop offset="0" stopColor="#fff8d8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffe9a0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-warm`}>
          <stop offset="0" stopColor="#ffe6b0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe6b0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-dark`}>
          <stop offset="0" stopColor="#061226" stopOpacity="0.9" />
          <stop offset="1" stopColor="#061226" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool: deep water darkens, dim shapes drift under the surface */}
      {deep > 0.005 && (
        <g mask={`url(#${uid}-water)`}>
          <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill="#0b1c38" opacity={0.42 * deep} />
          {[0, 1, 2].map((k) => {
            const [bx, by] = g.sc(DEEP[0] - 120 + k * 110 + 25 * Math.sin(t * 0.4 + k * 2), DEEP[1] + 25 * Math.sin(t * 0.3 + k));
            return <ellipse key={k} cx={bx} cy={by} rx={70 * S} ry={18 * S} fill={`url(#${uid}-dark)`} opacity={0.55 * deep} />;
          })}
        </g>
      )}

      {/* the crayfish: rises a little out of the pool, or lets itself down and the water closes over it */}
      <g transform={`translate(0,${(rise * S).toFixed(3)}) rotate(${clawTilt} ${cpx} ${cpy})`}>{sprite("crayfish", fxj.crayfish)}</g>
      {sk > 0.005 && (() => {
        const B = g.box(fxj.crayfish);
        const h = B.h * (0.25 + 0.6 * sk);
        return (
          <g mask={`url(#${uid}-cray)`}>
            <rect x={B.x} y={B.y + B.h - h} width={B.w} height={h} fill={`url(#${uid}-closing)`} opacity={0.75 * sk} transform={`translate(0,${(rise * S).toFixed(3)})`} />
          </g>
        );
      })()}

      {/* dog and wolf heads */}
      <g transform={`rotate(${dogRot} ${dpx} ${dpy})`}>{sprite("dog", fxj.dog)}</g>
      <g transform={`rotate(${wolfRot} ${wpx} ${wpy})`}>{sprite("wolf", fxj.wolf)}</g>
      {dogLit > 0.005 && (() => { const [x, y] = g.sc(...DOG_BODY); return <ellipse cx={x} cy={y} rx={190 * S} ry={230 * S} fill={`url(#${uid}-warm)`} opacity={0.75 * dogLit} style={{ mixBlendMode: "screen" }} />; })()}
      {wolfLit > 0.005 && (() => { const [x, y] = g.sc(...WOLF_BODY); return <ellipse cx={x} cy={y} rx={230 * S} ry={220 * S} fill={`url(#${uid}-warm)`} opacity={0.75 * wolfLit} style={{ mixBlendMode: "screen" }} />; })()}

      {/* water: idle glints, rings where the crayfish breaks the surface, faint slow rings when it goes calm */}
      <g style={{ mixBlendMode: "screen" }}>
        <g mask={`url(#${uid}-water)`} filter={`url(#${uid}-wsoft)`}>
          {new Array(36).fill(0).map((_, k) => {
            const x = POOL[0] + rnd(k, 1) * (POOL[2] - POOL[0]) + 8 * Math.sin(t * 0.5 + k);
            const y = POOL[1] + 8 + rnd(k, 2) * (POOL[3] - POOL[1] - 12);
            const o = Math.pow(Math.max(0, Math.sin(t * (1.2 + 1.6 * rnd(k, 3)) + 6.28 * rnd(k, 4))), 6) * (0.55 - 0.35 * calm - 0.3 * deep) * sheen;
            if (o <= 0.01) return null;
            const [cx, cy] = g.sc(x, y);
            return <ellipse key={k} cx={cx} cy={cy} rx={(5 + 5 * rnd(k, 5)) * S} ry={1.4 * S} fill="#f2fbff" opacity={o} />;
          })}
        </g>
        {em > 0.005 && [0, 1, 2].map((k) => {
          const u = frac(Math.max(0, openT < OPEN_DUR ? openT + 0.5 : t) / 2.2 + k / 3);
          const rx = (30 + 170 * u) * S;
          return <ellipse key={`e${k}`} cx={sx} cy={sy} rx={rx} ry={rx * 0.22} fill="none" stroke="#eefaff" strokeWidth={1.5 * S} opacity={0.5 * em * sheen * Math.sin(Math.PI * u) * (1 - u)} filter={`url(#${uid}-wsoft)`} />;
        })}
        {sk > 0.005 && [0, 1].map((k) => {
          const u = frac(t / 2.6 + k / 2);
          const rx = (25 + 130 * u) * S;
          return <ellipse key={`s${k}`} cx={sx} cy={sy} rx={rx} ry={rx * 0.22} fill="none" stroke="#dcecff" strokeWidth={1.2 * S} opacity={0.4 * sk * Math.sin(Math.PI * u) * (1 - u)} filter={`url(#${uid}-wsoft)`} />;
        })}
        {calm > 0.005 && [0, 1].map((k) => {
          const u = frac(t / 4.2 + k / 2);
          const rx = (20 + 150 * u) * S;
          return <ellipse key={`c${k}`} cx={dx} cy={dy} rx={rx} ry={rx * 0.2} fill="none" stroke="#dcecff" strokeWidth={1.0 * S} opacity={0.28 * calm * Math.sin(Math.PI * u) * (1 - u)} filter={`url(#${uid}-wsoft)`} />;
        })}
      </g>

      {/* dew: light falls slowly from the painted drops; "dewLit" lights them one by one */}
      <g style={{ mixBlendMode: "screen" }} opacity={1 - 0.6 * cold}>
        {fxj.dew.map(([x, y, r], i) => {
          const [cx, cy] = g.sc(x, y);
          const glowIdle = 0.1 + 0.08 * Math.sin(t * (0.9 + 0.1 * (i % 5)) + i * 1.7);
          const seq = litP == null ? 0 : lit * Math.sin(Math.PI * clamp((litP - (i / fxj.dew.length) * 0.7) / 0.28));
          const k = Math.max(glowIdle * (0.4 + 0.6 * dew), seq);
          const out = [];
          if (k > 0.005) out.push(<circle key={`g${i}`} cx={cx} cy={cy} r={(r * 2.4 + 6) * S} fill={`url(#${uid}-drop)`} opacity={k} />);
          if (dew > 0.005) {
            for (let j = 0; j < 2; j++) {
              const u = frac(t / (4.2 + 1.3 * rnd(i, 7)) + rnd(i, 8 + j) + j / 2);
              const fy = y + 10 + u * (70 + 30 * rnd(i, 9));
              const fx2 = x + 6 * Math.sin(t * 0.8 + i + j) * u;
              const [ex, ey] = g.sc(fx2, fy);
              out.push(<circle key={`f${i}-${j}`} cx={ex} cy={ey} r={(2.2 + 1.5 * rnd(i, 10 + j)) * S + 0.3} fill={`url(#${uid}-drop)`} opacity={0.75 * dew * Math.sin(Math.PI * u)} />);
            }
          }
          return out;
        })}
      </g>

      {/* haze: the scene goes soft */}
      {haze > 0.005 && (
        <g opacity={haze}>
          <image href={url(cold > 0.5 ? "art_night.png" : "art.png")} x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} preserveAspectRatio="none" filter={`url(#${uid}-haze)`} opacity={0.7} />
          <rect x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} fill={cold > 0.5 ? "#9fb3d6" : "#dfe4f0"} opacity={0.16} style={{ mixBlendMode: "screen" }} />
        </g>
      )}

      {/* mist bands drifting across the field */}
      {mist > 0.005 && (
        <g style={{ mixBlendMode: "screen" }} filter={`url(#${uid}-mistBlur)`}>
          {MIST_ROWS.map((row, i) => {
            const span = 1100;
            const x = 60 + frac(rnd(i, 1) + (t * (10 + 6 * rnd(i, 2)) * (i % 2 ? 1 : -1)) / span) * span - 50;
            const [cx, cy] = g.sc(x, row + 10 * Math.sin(t * 0.3 + i));
            const [cx2] = g.sc(x - span * 0.5, 0);
            const o = mist * (0.3 + 0.15 * Math.sin(t * 0.5 + i * 1.3));
            return (
              <g key={i} opacity={o}>
                <ellipse cx={cx} cy={cy} rx={(260 + 80 * rnd(i, 3)) * S} ry={(26 + 10 * rnd(i, 4)) * S} fill={cold > 0.5 ? "#b8c8e6" : "#e6ebf5"} />
                <ellipse cx={cx2} cy={cy + 20 * S} rx={(220 + 60 * rnd(i, 5)) * S} ry={22 * S} fill={cold > 0.5 ? "#b8c8e6" : "#e6ebf5"} />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};
