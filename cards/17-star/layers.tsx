import React from "react";
import type { LayerProps } from "../../engine/types";
import FX from "./fx.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OPEN_DUR } = require("./plan.js");

/*
 * XVII 星星 — card-specific animation. Small, steady movement; nothing is redrawn by hand except light on water.
 *   water (always)  soft glints drift down both streams and along the rivulets on the land, masked by water.png
 *                   (assets.py) so they only sit on painted water; "pour" brightens the left stream into the pool, "streams" the right stream and the land
 *                   water. Reversed: the water keeps flowing, its sheen weaker.
 *   "pool"          rings spread from where the left stream meets the pool (opening: the first ring on frame 1)
 *   "landings"      the two landing points glow one after the other: pool first, then land
 *   "twinkle"       the seven lesser stars twinkle one by one (a faint twinkle stays on at rest)
 *   "starDim"       reversed full shot: the great star sinks a little further into shadow
 *   "ibis"          the bird's raised wings beat gently, the tree crown sways (wings.png / crown.png, cut by assets.py,
 *                   each with a night twin crossfaded by the reversed tint)
 *   "birdHalo"      a soft light breathes around the bird (weaker reversed)
 *   "faceGlow"      a soft light near her face slowly returns
 * Coordinates are scan px of scans/Star_clothed.png.
 */
type Box = [number, number, number, number];
type P = [number, number];
const fxj = FX as { wings: Box; crown: Box; wingPivot: P; crownPivot: P };

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { const u = clamp(x); return u * u * (3 - 2 * u); };
const frac = (x: number) => x - Math.floor(x);

// measured on out/17-star/check/left_ewer.jpg, right.jpg, rivulets.jpg
const LEFT_LANES = [241, 252, 263, 273].map((x, i): P[] => [[x - 3 + i, 1022], [x, 1236]]);
const POOL_HIT: P = [258, 1232];
const LAND_HIT: P = [792, 1258];
const RIGHT_FALL: P[][] = [[[788, 852], [788, 1246]], [[795, 852], [795, 1246]]];
const RIVULETS: P[][] = [
  [[785, 1250], [760, 1272], [725, 1287], [690, 1297], [650, 1303], [610, 1312], [575, 1325]],
  [[705, 1300], [680, 1318], [650, 1332], [625, 1352], [608, 1378], [600, 1405]],
  [[810, 1275], [790, 1300], [775, 1325], [778, 1348], [805, 1360], [835, 1352]],
  [[890, 1195], [860, 1192], [835, 1205], [840, 1225], [875, 1228]],
];
const SMALL_STARS: P[] = [[160, 142], [160, 330], [255, 520], [155, 690], [795, 155], [792, 345], [690, 530]];
const IBIS: P = [800, 478];
const FACE: P = [338, 655];
const BIG_STAR: P = [490, 290];

export const Layers: React.FC<LayerProps> = ({ t, openT, uid, g, fx, cold, url }) => {
  const S = g.box([0, 0, 100, 100]).w / 100; // card units per scan px
  const pts = (p: P[]) => p.map(([x, y]) => g.sc(x, y).join(",")).join(" ");
  const since = (n: string) => (fx.since ? fx.since(n) : null);
  /** an overlay and its night twin, crossfaded by the reversed tint */
  const img = (file: string, b: Box) => {
    const B = g.box(b);
    const one = (f: string, o?: number) => <image href={url(f)} x={B.x} y={B.y} width={B.w} height={B.h} preserveAspectRatio="none" opacity={o} />;
    return (
      <>
        {cold < 0.995 && one(`${file}.png`)}
        {cold > 0.005 && one(`${file}_night.png`, Math.min(1, cold))}
      </>
    );
  };
  const sheen = 1 - 0.5 * cold; // reversed: the water's sheen is weaker

  /* ---------- water ---------- */
  const opening = openT < OPEN_DUR + 0.6 ? 1 - smooth((openT - OPEN_DUR) / 0.6) : 0;
  const pour = Math.max(fx.level("pour", 0.3, 0.4), opening);
  const streams = fx.level("streams", 0.3, 0.4);
  /** soft glints drifting along a path; water.png masks them, so they only show on the painted water */
  const flow = (p: P[], i: number, speed: number, on: number, n: number, spread: number) => {
    const seg = p.slice(1).map((q, k) => Math.hypot(q[0] - p[k][0], q[1] - p[k][1]));
    const L = seg.reduce((a, b) => a + b, 0);
    const at = (d: number): P => {
      for (let k = 0; k < seg.length; k++) {
        if (d <= seg[k]) { const u = d / seg[k]; return [p[k][0] + (p[k + 1][0] - p[k][0]) * u, p[k][1] + (p[k + 1][1] - p[k][1]) * u]; }
        d -= seg[k];
      }
      return p[p.length - 1];
    };
    return new Array(n).fill(0).map((_, k) => {
      const r = (m: number) => frac(Math.sin((i * 31 + k) * 12.9898 + m * 78.233) * 43758.5453);
      const u = frac(r(1) + (t * speed * (0.8 + 0.4 * r(2))) / L);
      const [x, y] = at(u * L);
      const [cx, cy] = g.sc(x + (r(3) - 0.5) * spread, y + (r(4) - 0.5) * spread);
      const o = on * Math.sin(Math.PI * u) * (0.5 + 0.5 * Math.sin(t * (3 + 2 * r(5)) + k));
      return <ellipse key={`${i}-${k}`} cx={cx} cy={cy} rx={(3 + 3 * r(6)) * S} ry={1.4 * S} fill="#f4feff" opacity={o} />;
    });
  };

  /* ---------- pool rings ---------- */
  const pool = Math.max(fx.level("pool", 0.3, 0.4), opening);
  const RING_P = 2.4;
  const [px, py] = g.sc(...POOL_HIT);

  /* ---------- landings ---------- */
  const lp = fx.prog("landings");
  const lOn = fx.level("landings", 0.2, 0.3);
  const hitGlow = (at: P, a: number) => {
    if (a <= 0.005) return null;
    const [x, y] = g.sc(...at);
    return <ellipse cx={x} cy={y} rx={55 * S} ry={22 * S} fill="#eaffff" opacity={0.45 * a} filter={`url(#${uid}-soft)`} style={{ mixBlendMode: "screen" }} />;
  };
  const poolLit = lp == null ? 0 : lOn * smooth(lp / 0.15) * (1 - 0.6 * smooth((lp - 0.5) / 0.15));
  const landLit = lp == null ? 0 : lOn * smooth((lp - 0.45) / 0.15);

  /* ---------- stars ---------- */
  const tw = fx.level("twinkle", 0.3, 0.3);
  const twP = fx.prog("twinkle");
  const dim = fx.level("starDim", 0.8, 0.3) * smooth((since("starDim") ?? 0) / 1.6);

  /* ---------- bird and tree ---------- */
  const ib = fx.level("ibis", 0.4, 0.4);
  const wingA = (1.2 + 4.5 * ib) * (1 - 0.5 * cold);
  const wingRot = -wingA * (0.5 + 0.5 * Math.sin(2 * Math.PI * (0.45 + 1.1 * ib) * t));
  const crownRot = (0.35 + 0.65 * ib) * Math.sin(2 * Math.PI * 0.32 * t) + 0.15 * Math.sin(2 * Math.PI * 0.83 * t + 1);
  const [wpx, wpy] = g.sc(...fxj.wingPivot);
  const [cpx, cpy] = g.sc(...fxj.crownPivot);
  const halo = fx.level("birdHalo", 0.6, 0.4) * (1 - 0.6 * cold);
  const [bx, by] = g.sc(...IBIS);

  /* ---------- face ---------- */
  const fs = since("faceGlow");
  const face = fx.level("faceGlow", 0.3, 0.3) * (fs == null ? 0 : smooth((fs - 0.4) / 2.2));
  const [fcx, fcy] = g.sc(...FACE);

  return (
    <g>
      <defs>
        <mask id={`${uid}-water`} maskUnits="userSpaceOnUse" x={g.PIC.x} y={g.PIC.y} width={g.PIC.w} height={g.PIC.h}>
          <image href={url("water.png")} x={g.PIC.x} y={g.PIC.y} width={g.PIC.w} height={g.PIC.h} preserveAspectRatio="none" />
        </mask>
        <filter id={`${uid}-wsoft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={0.6} />
        </filter>
        <radialGradient id={`${uid}-starGlow`}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#fff6dc" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-warm`}>
          <stop offset="0" stopColor="#ffe6b0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe6b0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-shade`}>
          <stop offset="0" stopColor="#05060f" stopOpacity="0.85" />
          <stop offset="1" stopColor="#05060f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tree crown and wings: the only copies (the holes in art.png are filled with sky) */}
      <g transform={`rotate(${crownRot} ${cpx} ${cpy})`}>{img("crown", fxj.crown)}</g>
      <g transform={`rotate(${wingRot} ${wpx} ${wpy})`}>{img("wings", fxj.wings)}</g>
      {halo > 0.005 && <circle cx={bx} cy={by} r={(46 + 6 * Math.sin(t * 1.6)) * S} fill={`url(#${uid}-warm)`} opacity={0.75 * halo} style={{ mixBlendMode: "screen" }} />}

      {/* water */}
      <g style={{ mixBlendMode: "screen" }}>
        <g mask={`url(#${uid}-water)`} filter={`url(#${uid}-wsoft)`}>
          {LEFT_LANES.map((p, i) => flow(p, i, 75, (0.3 + 0.6 * pour) * sheen, 7, 6))}
          {RIGHT_FALL.map((p, i) => flow(p, 10 + i, 85, (0.3 + 0.6 * streams) * sheen, 7, 6))}
          {RIVULETS.map((p, i) => flow(p, 20 + i, 30, (0.25 + 0.6 * streams) * sheen, 18, 26))}
        </g>
        {/* rings from the left stream's landing (soft, never a hard outline) */}
        {[0, 1, 2].map((k) => {
          const u = frac((Math.max(0, openT < OPEN_DUR ? openT + 0.15 * RING_P : t)) / RING_P + k / 3);
          const rx = (14 + 150 * u) * S;
          return <ellipse key={k} cx={px} cy={py} rx={rx} ry={rx * 0.3} fill="none" stroke="#effdff" strokeWidth={1.4 * S} opacity={(0.1 + 0.35 * pool) * sheen * Math.sin(Math.PI * u) * (1 - u)} filter={`url(#${uid}-wsoft)`} />;
        })}
        {/* splash where the right stream meets the land */}
        {[0, 1].map((k) => {
          const u = frac(t / 1.6 + k / 2);
          const [lx, ly] = g.sc(...LAND_HIT);
          const rx = (6 + 30 * u) * S;
          return <ellipse key={`l${k}`} cx={lx} cy={ly} rx={rx} ry={rx * 0.35} fill="none" stroke="#effdff" strokeWidth={1.1 * S} opacity={(0.06 + 0.25 * streams) * sheen * (1 - u)} filter={`url(#${uid}-wsoft)`} />;
        })}
        {hitGlow(POOL_HIT, poolLit)}
        {hitGlow(LAND_HIT, landLit)}
      </g>

      {/* lesser stars: idle shimmer, "twinkle" lights them one by one */}
      <g style={{ mixBlendMode: "screen" }} opacity={1 - 0.55 * cold}>
        {SMALL_STARS.map(([x, y], i) => {
          const [cx, cy] = g.sc(x, y);
          const idle = 0.12 * Math.pow(0.5 + 0.5 * Math.sin(t * (1.1 + 0.13 * i) + i * 2.1), 3);
          const seq = twP == null ? 0 : tw * Math.sin(Math.PI * clamp((twP - (i / SMALL_STARS.length) * 0.75) / 0.3));
          const k = Math.max(idle, seq);
          if (k <= 0.005) return null;
          const sp = (14 + 18 * k) * S;
          return (
            <g key={i} opacity={k}>
              <circle cx={cx} cy={cy} r={62 * S} fill={`url(#${uid}-starGlow)`} />
              <g transform={`translate(${cx},${cy}) rotate(${t * 25 + i * 20})`}>
                <path d={`M 0 ${-sp} L ${sp * 0.12} ${-sp * 0.12} L ${sp} 0 L ${sp * 0.12} ${sp * 0.12} L 0 ${sp} L ${-sp * 0.12} ${sp * 0.12} L ${-sp} 0 L ${-sp * 0.12} ${-sp * 0.12} Z`} fill="#ffffff" />
              </g>
            </g>
          );
        })}
      </g>

      {/* reversed: the great star sinks further into shadow */}
      {dim > 0.005 && (() => {
        const [sx, sy] = g.sc(...BIG_STAR);
        return <circle cx={sx} cy={sy} r={175 * S} fill={`url(#${uid}-shade)`} opacity={0.45 * dim} />;
      })()}

      {/* her face: a soft light slowly returns */}
      {face > 0.005 && <circle cx={fcx} cy={fcy} r={(70 + 4 * Math.sin(t * 1.2)) * S} fill={`url(#${uid}-warm)`} opacity={0.55 * face} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};
