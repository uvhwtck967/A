import React from "react";
import { random } from "remotion";
import type { FxApi, Geometry, Ripple } from "./types";

/*
 * Reusable picture effects. All coordinates are card units (the 600 x 1000 card space);
 * config coordinates are scan pixels and converted with g.sc / g.box.
 */

/* ---------------- radiant light: turning rays + breathing glow (sun, halo, lantern, star) ---------------- */
export const Radiant: React.FC<{ g: Geometry; at: [number, number]; r: number; rays?: number; t: number; boost: number; dark: number; cold: number; uid: string }> = ({ g, at, r, rays = 28, t, boost, dark, cold, uid }) => {
  const [cx, cy] = g.sc(at[0], at[1]);
  const R = r * (g.PIC.w / 520);
  const live = (1 - dark) * (1 - 0.6 * cold);
  const pulse = 1 + 0.06 * Math.sin(t * 1.3);
  return (
    <g style={{ mixBlendMode: "screen" }} opacity={live}>
      <circle cx={cx} cy={cy} r={(R * 2.6 + R * boost) * pulse} fill={`url(#${uid}-radiant)`} />
      <g transform={`rotate(${t * 6} ${cx} ${cy})`} opacity={0.35 + 0.5 * boost}>
        {new Array(rays).fill(0).map((_, i) => {
          const a = (i / rays) * Math.PI * 2;
          const len = R * (0.7 + 0.95 * (0.5 + 0.5 * Math.sin(t * 2.1 + i * 1.7)) + 0.7 * boost);
          return <line key={i} x1={cx + Math.cos(a) * R * 0.25} y1={cy + Math.sin(a) * R * 0.25} x2={cx + Math.cos(a) * len} y2={cy + Math.sin(a) * len} stroke="#ffd98a" strokeWidth={i % 2 ? 0.9 : 1.6} opacity={0.5} />;
        })}
      </g>
      <circle cx={cx} cy={cy} r={R * 0.21 + 3 * Math.sin(t * 2.4)} fill="#fff3cf" opacity={0.25 + 0.4 * boost} filter={`url(#${uid}-soft)`} />
    </g>
  );
};
export const RadiantDark: React.FC<{ g: Geometry; at: [number, number]; r: number; dark: number; uid: string }> = ({ g, at, r, dark, uid }) => {
  if (dark <= 0) return null;
  const [cx, cy] = g.sc(at[0], at[1]);
  return <circle cx={cx} cy={cy} r={r * 3} fill={`url(#${uid}-radiantDark)`} opacity={dark} />;
};

/* ---------------- a band of light sweeping across the picture ---------------- */
export const Sweep: React.FC<{ g: Geometry; p: number; uid: string }> = ({ g, p, uid }) => {
  if (p <= 0 || p >= 1) return null;
  const { PIC } = g;
  const x = PIC.x - 200 + (PIC.w + 400) * p;
  return <rect x={x - 120} y={PIC.y} width={240} height={PIC.h} fill={`url(#${uid}-sweep)`} style={{ mixBlendMode: "screen" }} transform="skewX(-18)" opacity={Math.sin(Math.PI * p)} />;
};

/* ---------------- glints on water ---------------- */
export const Water: React.FC<{ g: Geometry; box: [number, number, number, number]; n?: number; t: number; on: number }> = ({ g, box, n = 30, t, on }) => {
  const glints = React.useMemo(
    () => new Array(n).fill(0).map((_, i) => ({ x: box[0] + random(`wx${i}`) * (box[2] - box[0]), y: box[1] + random(`wy${i}`) * (box[3] - box[1]), ph: random(`wp${i}`) * 6.28, sp: 1.5 + random(`ws${i}`) * 2.5 })),
    [box, n]
  );
  return (
    <g style={{ mixBlendMode: "screen" }} opacity={on}>
      {glints.map((w, i) => {
        const [x, y] = g.sc(w.x + Math.sin(t * 0.5 + w.ph) * 6, w.y);
        const o = Math.pow(Math.max(0, Math.sin(t * w.sp + w.ph)), 6);
        return <ellipse key={i} cx={x} cy={y} rx={3 + 3 * o} ry={0.7} fill="#fff1c8" opacity={o} />;
      })}
    </g>
  );
};

/* ---------------- a four-point star glint on metal ---------------- */
export const Glint: React.FC<{ g: Geometry; at: [number, number]; t: number; on: number }> = ({ g, at, t, on }) => {
  if (on <= 0) return null;
  const [x, y] = g.sc(at[0], at[1]);
  const k = Math.pow(Math.max(0, Math.sin(t * 2.6)), 12);
  return (
    <g style={{ mixBlendMode: "screen" }} opacity={on * k} transform={`translate(${x},${y}) rotate(${t * 40})`}>
      <path d="M 0 -9 L 1.2 -1.2 L 9 0 L 1.2 1.2 L 0 9 L -1.2 1.2 L -9 0 L -1.2 -1.2 Z" fill="#fff6dc" />
      <circle r={2.4} fill="#fff" />
    </g>
  );
};

/* ---------------- ripple: a region redrawn as thin strips that wave (banners, cloth, hanging vines) ---------------- */
const STRIPS = 96;
const wedge = (cx: number, cy: number, r: number, p: number) => {
  if (p >= 0.999) return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
  const a = -Math.PI / 2 + p * 2 * Math.PI;
  return `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} Z`;
};
export const RippleRegion: React.FC<{
  g: Geometry;
  rp: Ripple;
  sky: [number, number, number];
  art: string;
  revealImg?: string;
  t: number;
  fx: FxApi;
  reveal: number; // 0..1 gold reveal progress
  cold: number;
  uid: string;
  idx: number;
}> = ({ g, rp, sky, art, revealImg, t, fx, reveal, cold, uid, idx }) => {
  const B = g.box(rp.box);
  const { PIC } = g;
  // reversed (cold): everything that moved goes still
  const amp = (rp.amp + rp.boost * fx.level(rp.fx, 0.6, 0.4)) * (1 - 0.92 * cold);
  const along = rp.axis === "y" ? B.w : B.h;
  const sw = along / STRIPS;
  const disp = (u: number) => {
    // u: 0 at the fixed edge (pole / branch), 1 at the free edge
    if (rp.axis === "y") return amp * Math.pow(u, 1.25) * (Math.sin(2 * Math.PI * (u * 1.35 - t * 0.55)) + 0.35 * Math.sin(2 * Math.PI * (u * 2.9 - t * 1.1) + 1.3));
    return amp * Math.pow(u, 1.6) * (Math.sin(2 * Math.PI * (t * 0.42 + u * 0.4)) + 0.3 * Math.sin(2 * Math.PI * (t * 0.97 + u * 1.1) + 0.7));
  };
  const id = `${uid}-rp${idx}`;
  const rv = rp.reveal;
  const RB = rv ? g.box(rv.box) : null;
  const RC = rv ? g.sc(rv.center[0], rv.center[1]) : null;
  return (
    <g>
      <defs>
        <g id={`${id}-src`}>
          <image href={art} x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} preserveAspectRatio="none" />
          {rv && RB && RC && revealImg && reveal > 0 && (
            <g mask={`url(#${id}-mask)`}>
              <image href={revealImg} x={RB.x} y={RB.y} width={RB.w} height={RB.h} filter={`url(#${uid}-glow)`} opacity={0.25 + 0.5 * fx.level(rv.fxLit)} style={{ mixBlendMode: "screen" }} />
              <image href={revealImg} x={RB.x} y={RB.y} width={RB.w} height={RB.h} style={{ mixBlendMode: "multiply" }} />
              <image href={revealImg} x={RB.x} y={RB.y} width={RB.w} height={RB.h} opacity={0.45} style={{ mixBlendMode: "screen" }} />
            </g>
          )}
        </g>
        {rv && RB && RC && (
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={RB.x - 20} y={RB.y - 20} width={RB.w + 40} height={RB.h + 40}>
            <path d={wedge(RC[0], RC[1], RB.w, reveal)} fill="#fff" filter={`url(#${uid}-glow)`} />
          </mask>
        )}
      </defs>
      {/* fill behind the region so the waves never reveal the printed original */}
      <rect x={B.x + (rp.axis === "y" ? 3 : 0)} y={B.y} width={B.w + 8} height={B.h + 8} fill={`rgb(${sky[0]},${sky[1]},${sky[2]})`} />
      {new Array(STRIPS).fill(0).map((_, i) => {
        const u0 = i / STRIPS, u1 = (i + 1) / STRIPS;
        const d = disp((u0 + u1) / 2);
        const slope = disp(u1) - disp(u0);
        const r = rp.axis === "y" ? { x: B.x + i * sw - 0.15, y: B.y, w: sw + 0.3, h: B.h } : { x: B.x, y: B.y + i * sw - 0.15, w: B.w, h: sw + 0.3 };
        return (
          <g key={i} transform={rp.axis === "y" ? `translate(0,${d.toFixed(2)})` : `translate(${d.toFixed(2)},0)`}>
            <clipPath id={`${id}-s${i}`}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} />
            </clipPath>
            <use href={`#${id}-src`} clipPath={`url(#${id}-s${i})`} />
            {rp.axis === "y" && <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={slope > 0 ? "#000" : "#fff"} opacity={Math.min(0.22, Math.abs(slope) * 0.5)} />}
          </g>
        );
      })}
    </g>
  );
};
