import React from "react";
import type { LayerProps } from "../../engine/types";
import FX from "./fx.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OPEN_DUR } = require("./plan.js");

/*
 * XVI 高塔 — card-specific animation. Everything is kept small: the effect should be noticed, never shouted.
 *   "strike"     the bolt brightens with a soft glow and the picture lifts for an instant (two flickers)
 *   "crownFall"  opening: the crown sits on the tower top, the bolt knocks it off and it tumbles up-left into its
 *                painted place, rocking to rest; in later shots it drifts and turns a little in the air
 *   "flames"     the flames at the top and in the windows flicker one by one (stretched up from their base, never
 *                shrunk); reversed, they dim but keep moving
 *   yods         always drifting down a few px and fading at the end of each slow cycle, like embers; "yods" shots
 *                add a faint warm glow; "yodCount" lights them one by one (left side, then right side)
 *   "dust"       grit falls along the trunk, a few chips from the struck top, a faint haze over the rock
 * The crown and the yods are cut out of art.png / art_night.png (cards/16-tower/assets.py), so these sprites are
 * the only copy. Each overlay has a night twin, crossfaded with the reversed tint.
 * Coordinates are scan px of scans/RWS_Tarot_16_Tower.jpg.
 */
type Box = [number, number, number, number];
const fxj = FX as { crown: Box; crownC: [number, number]; bolt: Box; yods: number[][]; yodsBox: Box; flames: Box[]; flamesBox: Box };

// opening timeline (seconds from the first frame); sound.mjs reads the same constants
export const STRIKE_AT = 0.04; // the bolt flashes
export const KNOCK = 0.12; // the crown leaves the tower top
export const SETTLE = 1.3; // the crown reaches its painted place, then rocks to rest
export const STRIKE_DELAY = 0.25; // in later "strike" shots the flash comes this long after the cut
const SEAT: [number, number] = [515, 205]; // crown centre while it still sits on the tower top
const SEAT_ROT = 45; // degrees: upright on the tower, the painted crown is tipped 45° the other way

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { const u = clamp(x); return u * u * (3 - 2 * u); };
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const frac = (x: number) => x - Math.floor(x);
const rnd = (i: number) => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);

/** flash envelope for a strike that happened `dt` seconds ago: a sharp flash and a weaker second flicker */
export const flashEnv = (dt: number) => (dt < 0 ? 0 : Math.exp(-dt * 7) + (dt > 0.17 ? 0.45 * Math.exp(-(dt - 0.17) * 10) : 0));

export const Layers: React.FC<LayerProps> = ({ t, openT, uid, g, fx, cold, url }) => {
  const { PIC } = g;
  const S = g.box([0, 0, 100, 100]).w / 100; // card units per scan px
  const since = (n: string) => (fx.since ? fx.since(n) : null);
  /** an overlay and its night twin, crossfaded by the reversed tint */
  const img = (file: string, b: Box, extra: React.SVGProps<SVGImageElement> = {}) => {
    const B = g.box(b);
    const one = (f: string, o?: number) => <image href={url(f)} x={B.x} y={B.y} width={B.w} height={B.h} preserveAspectRatio="none" {...extra} opacity={o} />;
    return (
      <>
        {cold < 0.995 && one(`${file}.png`)}
        {cold > 0.005 && one(`${file}_night.png`, Math.min(1, cold))}
      </>
    );
  };

  /* ---------- strike ---------- */
  const ss = since("strike");
  const strike = openT < OPEN_DUR ? flashEnv(openT - STRIKE_AT) : ss != null ? flashEnv(ss - STRIKE_DELAY) : 0;

  /* ---------- crown pose ---------- */
  const [ccx, ccy] = fxj.crownC;
  let dx = 0, dy = 0, rot = 0;
  if (openT < OPEN_DUR + 1.5) {
    const u = (openT - KNOCK) / (SETTLE - KNOCK);
    const p = easeOut(u);
    dx = (SEAT[0] - ccx) * (1 - p);
    dy = (SEAT[1] - ccy) * (1 - p) - 38 * Math.sin(Math.PI * clamp(u)); // a little arc upward
    rot = SEAT_ROT * (1 - p) - 10 * Math.sin(Math.PI * clamp(u)); // tumbles past its painted tilt, comes back
    const w = openT - SETTLE;
    if (w > 0) rot += 3.5 * Math.exp(-w * 2.6) * Math.sin(2 * Math.PI * 1.4 * w);
  }
  const cf = openT >= OPEN_DUR ? fx.prog("crownFall") : null; // later shots: a slow drift down-left and a slight turn
  if (cf != null) { const p = smooth(cf); dx -= 5 * p; dy += 7 * p; rot -= 3 * p; }
  dy += 1.2 * Math.sin(2 * Math.PI * 0.33 * t); // hanging in the air
  rot += 0.7 * Math.sin(2 * Math.PI * 0.27 * t + 1);
  const [pcx, pcy] = g.sc(ccx, ccy);

  /* ---------- flames ---------- */
  const fl = fx.level("flames", 0.4, 0.4);
  const dim = cold * 0.45;
  const FB = g.box(fxj.flamesBox);

  /* ---------- yods ---------- */
  const yl = fx.level("yods", 0.5, 0.4);
  const yc = fx.prog("yodCount");
  const yodsB = g.box(fxj.yodsBox);

  /* ---------- dust ---------- */
  const dl = fx.level("dust", 0.35, 0.35);
  const ds = since("dust") ?? 0;

  return (
    <g>
      <defs>
        {fxj.flames.map((b, i) => {
          const B = g.box([b[0] - 6, b[1] - 16, b[2] + 6, b[3] + 2]);
          return (
            <clipPath key={i} id={`${uid}-tf${i}`}>
              <rect x={B.x} y={B.y} width={B.w} height={B.h} />
            </clipPath>
          );
        })}
        {fxj.yods.map((y, i) => {
          const B = g.box([y[0] - 3, y[1] - 5, y[2] + 3, y[3] + 8]); // tight: neighbouring yods must not show twice
          return (
            <clipPath key={i} id={`${uid}-ty${i}`}>
              <rect x={B.x} y={B.y} width={B.w} height={B.h} />
            </clipPath>
          );
        })}
        <radialGradient id={`${uid}-haze`}>
          <stop offset="0" stopColor="#bfb29c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#bfb29c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* flames: each on its own phase */}
      <g style={{ filter: dim > 0.01 ? `brightness(${1 - 0.5 * dim}) saturate(${1 - 0.4 * dim})` : undefined }}>
        {fxj.flames.map((b, i) => {
          const [cx, by] = g.sc((b[0] + b[2]) / 2, b[3]);
          const ph = i * 2.399;
          const f = 0.5 + 0.5 * Math.sin(2 * Math.PI * (1.6 + 0.21 * (i % 4)) * t + ph) * Math.sin(2 * Math.PI * 0.57 * t + ph * 0.5);
          const sy = 1 + (0.025 + 0.06 * fl) * f;
          return (
            <g key={i} clipPath={`url(#${uid}-tf${i})`}>
              <g transform={`translate(${cx},${by}) scale(${1 + 0.2 * (sy - 1)},${sy}) translate(${-cx},${-by})`}>
                {cold < 0.995 && <image href={url("flames.png")} x={FB.x} y={FB.y} width={FB.w} height={FB.h} preserveAspectRatio="none" />}
                {cold > 0.005 && <image href={url("flames_night.png")} x={FB.x} y={FB.y} width={FB.w} height={FB.h} preserveAspectRatio="none" opacity={Math.min(1, cold)} />}
              </g>
            </g>
          );
        })}
      </g>
      {fxj.flames.map((b, i) => {
        const [cx, cy] = g.sc((b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
        const R = Math.max(b[2] - b[0], b[3] - b[1]) * S * 0.45;
        const f = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.3 * t + i * 1.7);
        return <circle key={i} cx={cx} cy={cy} r={R} fill="#ff9a48" opacity={(0.05 + 0.13 * fl) * f * (1 - 0.6 * cold)} filter={`url(#${uid}-soft)`} style={{ mixBlendMode: "screen" }} />;
      })}

      {/* yods */}
      {fxj.yods.map((y, i) => {
        const P = 7 + (i % 3) * 1.3;
        const u = frac(t / P + rnd(i));
        const ox = 1.6 * Math.sin(2 * Math.PI * (u * 1.2 + rnd(i + 40))) * S;
        const oy = (-4 + 11 * u) * S;
        const o = smooth(u / 0.08) * smooth((1 - u) / 0.08);
        const [cx, cy] = g.sc(y[4], y[5]);
        const lit = yc == null ? 0 : smooth((yc - 0.06 - (i * 0.62) / fxj.yods.length) / 0.05) * fx.level("yodCount", 0.2, 0.3);
        const glow = 0.1 * yl + 0.5 * lit;
        return (
          <g key={i}>
            <g clipPath={`url(#${uid}-ty${i})`} opacity={Math.max(o, lit)}>
              <g transform={`translate(${ox},${oy})`}>{img("yods", fxj.yodsBox, lit > 0.01 ? { style: { filter: `brightness(${1 + 0.35 * lit})` } } : {})}</g>
            </g>
            {glow > 0.005 && <circle cx={cx + ox} cy={cy + oy} r={(y[2] - y[0]) * S * 0.9} fill="#ffc870" opacity={glow * (0.85 + 0.15 * Math.sin(3 * t + i))} filter={`url(#${uid}-soft)`} style={{ mixBlendMode: "screen" }} />}
          </g>
        );
      })}

      {/* crown */}
      <g transform={`translate(${dx * S},${dy * S}) rotate(${rot} ${pcx} ${pcy})`}>{img("crown", fxj.crown)}</g>

      {/* dust: grit along the trunk, chips from the struck top, haze over the rock */}
      {dl > 0.005 && (
        <g opacity={dl}>
          {new Array(70).fill(0).map((_, i) => {
            const x = 395 + rnd(i) * 255 + 6 * Math.sin(t * 0.9 + i);
            const v = 35 + rnd(i + 70) * 45;
            const y = 360 + frac(rnd(i + 140) + (t * v) / 1300) * 1300;
            const [px, py] = g.sc(x, y);
            const r = (0.6 + rnd(i + 210) * 1.4) * S;
            return <circle key={i} cx={px} cy={py} r={r} fill={i % 3 ? "#b8ab95" : "#5a5248"} opacity={0.5 + 0.3 * rnd(i + 280)} />;
          })}
          {new Array(9).fill(0).map((_, i) => {
            const u = ds - 0.15 - i * 0.12;
            if (u < 0) return null;
            const x = 470 + rnd(i + 400) * 90 + (rnd(i + 410) - 0.5) * 40 * u;
            const y = 390 + 30 * u + 240 * u * u;
            const [px, py] = g.sc(x, y);
            const sz = (2.5 + 2.5 * rnd(i + 420)) * S;
            return <rect key={`c${i}`} x={px - sz / 2} y={py - sz / 2} width={sz} height={sz * 0.7} fill="#8f8577" transform={`rotate(${u * 220 + i * 40} ${px} ${py})`} opacity={0.75} />;
          })}
          {(() => {
            const [hx, hy] = g.sc(508, 1440 - 14 * Math.sin(t * 0.5));
            return <ellipse cx={hx} cy={hy} rx={150 * S} ry={60 * S} fill={`url(#${uid}-haze)`} opacity={0.22 + 0.06 * Math.sin(t * 0.8)} />;
          })()}
        </g>
      )}

      {/* strike: the bolt glows, the picture lifts for an instant */}
      {strike > 0.005 && (
        <>
          <g opacity={Math.min(1, 0.85 * strike)} style={{ mixBlendMode: "screen" }}>
            {img("bolt", fxj.bolt, { filter: `url(#${uid}-soft)` })}
            {img("bolt", fxj.bolt)}
          </g>
          <rect x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} fill="#fff4d6" opacity={0.28 * Math.min(1, strike)} style={{ mixBlendMode: "screen" }} />
        </>
      )}
    </g>
  );
};
