import React from "react";
import type { LayerProps } from "../../engine/types";
import FX from "./fx.json";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OPEN_DUR } = require("./plan.js");

/*
 * VI 恋人 — card-specific animation:
 *   "fruit"     the fruit on the tree of knowledge light up one by one and glow softly; the tree stays still
 *   "wings"     the wings open outward a little and settle. Each wing is drawn scaled >= 1 about its shoulder,
 *               so it always covers the printed wing and nothing behind it shows; the hands are redrawn on top
 *   "flames"    the twelve flames on the tree of life flicker one by one (stretched upward from their base,
 *               never shrunk); reversed, they dim
 *   serpent     always tinted warm (it would read as grey after restyling)
 *   "serpent"   a glint runs down the serpent's body once per shot; reversed, it is cold and faint
 * Masks and boxes come from cards/06-lovers/assets.py (fx.json); coordinates are scan px of scans/Lovers_clothed.png.
 */
type Box = [number, number, number, number];
const fxj = FX as { hands: Box; wingL: Box; wingR: Box; flamesBox: Box; flames: Box[]; serpent: Box; fruitBox: Box; fruit: [number, number, number][] };

const PIVOT_L = [372, 380]; // left shoulder, where the wing leaves the back
const PIVOT_R = [592, 372];
export const WING_BEATS = 3; // in the opening; sound.mjs puts a wing beat on each
export const WING_HZ = WING_BEATS / OPEN_DUR;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { const u = clamp(x); return u * u * (3 - 2 * u); };

/** wing spread >= 0: beats in the opening, a slow breath afterwards, more under "wings" shots */
const spread = (t: number, openT: number, lvl: number) => {
  const open = openT < OPEN_DUR ? Math.pow(Math.sin(Math.PI * WING_HZ * openT), 2) * (1 - 0.45 * openT / OPEN_DUR) : 0;
  const breath = 0.5 - 0.5 * Math.cos(2 * Math.PI * 0.45 * t);
  return 0.024 * open + (0.003 + 0.012 * lvl) * breath;
};

export const Layers: React.FC<LayerProps> = ({ t, openT, uid, g, fx, cold, url }) => {
  const { PIC } = g;
  const img = (file: string, b: Box, extra: React.SVGProps<SVGImageElement> = {}) => {
    const B = g.box(b);
    return <image href={url(file)} x={B.x} y={B.y} width={B.w} height={B.h} preserveAspectRatio="none" {...extra} />;
  };

  const k = spread(t, openT, fx.level("wings", 0.5, 0.5));
  const wing = (file: string, b: Box, pv: number[]) => {
    const [px, py] = g.sc(pv[0], pv[1]);
    return (
      <g transform={`translate(${px},${py}) scale(${1 + k},${1 + 0.55 * k}) translate(${-px},${-py})`}>{img(file, b)}</g>
    );
  };

  // flames: each one on its own phase; brighter under "flames" shots, dimmed once reversed
  const fl = fx.level("flames", 0.4, 0.4);
  const dim = cold * (0.55 + 0.35 * fl);
  const FB = g.box(fxj.flamesBox);

  // serpent glint: one pass per shot carrying "serpent", top to bottom
  const sp = fx.prog("serpent");
  const glintP = sp == null ? -1 : smooth(sp / 0.8);
  const SB = g.box(fxj.serpent);

  // fruit: each lights in turn over the first 60% of the shot, then all glow gently until it ends
  const frP = fx.prog("fruit");
  const frL = fx.level("fruit", 0.2, 0.5);
  const fruitOn = (i: number) => (frP == null ? 0 : smooth((frP - 0.1 - (i * 0.5) / fxj.fruit.length) / 0.22)) * frL;

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-sg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset={Math.max(0, glintP - 0.16)} stopColor="#000" />
          <stop offset={glintP} stopColor="#fff" />
          <stop offset={Math.min(1, glintP + 0.16)} stopColor="#000" />
        </linearGradient>
        <mask id={`${uid}-sm`} maskUnits="userSpaceOnUse" x={SB.x} y={SB.y} width={SB.w} height={SB.h}>
          <rect x={SB.x} y={SB.y} width={SB.w} height={SB.h} fill={`url(#${uid}-sg)`} />
        </mask>
        {fxj.flames.map((b, i) => {
          const B = g.box([b[0] - 6, b[1] - 14, b[2] + 6, b[3] + 2]);
          return (
            <clipPath key={i} id={`${uid}-fc${i}`}>
              <rect x={B.x} y={B.y} width={B.w} height={B.h} />
            </clipPath>
          );
        })}
      </defs>

      {/* the pale-olive serpent lands on the tone curve's neutral grey; a standing warm tint keeps it readable */}
      {img("serpent.png", fxj.serpent, { opacity: 0.42 * (1 - 0.5 * cold), style: { mixBlendMode: "overlay" } })}
      {img("serpent.png", fxj.serpent, { opacity: 0.16 * (1 - 0.5 * cold) })}

      {frL > 0.001 && (
        <g>
          <g style={{ filter: `brightness(${1 + 0.55 * frL}) saturate(${1 + 0.3 * frL})` }} opacity={frL}>{img("fruit.png", fxj.fruitBox)}</g>
          {fxj.fruit.map(([x, y, r], i) => {
            const [cx, cy] = g.sc(x, y);
            const R = g.box([0, 0, r, r]).w;
            const o = fruitOn(i) * (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.8 * t + i * 1.9));
            return (
              <g key={i} style={{ mixBlendMode: "screen" }} opacity={o}>
                <circle cx={cx} cy={cy} r={R * 2.6} fill="#ff9a50" opacity={0.42} filter={`url(#${uid}-soft)`} />
                <circle cx={cx} cy={cy} r={R * 1.1} fill="#ffd28a" opacity={0.5} filter={`url(#${uid}-soft)`} />
              </g>
            );
          })}
        </g>
      )}
      {wing("wingL.png", fxj.wingL, PIVOT_L)}
      {wing("wingR.png", fxj.wingR, PIVOT_R)}
      {img("hands.png", fxj.hands)}

      <g style={{ filter: dim > 0.01 ? `brightness(${1 - 0.6 * dim}) saturate(${1 - 0.5 * dim})` : undefined }}>
        {fxj.flames.map((b, i) => {
          const [cx, by] = g.sc((b[0] + b[2]) / 2, b[3]);
          const ph = i * 2.399;
          const f = 0.5 + 0.5 * Math.sin(2 * Math.PI * (1.7 + 0.23 * (i % 4)) * t + ph) * Math.sin(2 * Math.PI * 0.61 * t + ph * 0.5);
          const sy = 1 + (0.03 + 0.09 * fl) * f;
          return (
            <g key={i} clipPath={`url(#${uid}-fc${i})`}>
              <g transform={`translate(${cx},${by}) scale(${1 + 0.25 * (sy - 1)},${sy}) translate(${-cx},${-by})`}>
                <image href={url("flames.png")} x={FB.x} y={FB.y} width={FB.w} height={FB.h} preserveAspectRatio="none" />
              </g>
            </g>
          );
        })}
      </g>
      {cold < 0.5 &&
        fxj.flames.map((b, i) => {
          const [cx, cy] = g.sc((b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
          const f = 0.5 + 0.5 * Math.sin(2 * Math.PI * 1.3 * t + i * 1.7);
          return <circle key={i} cx={cx} cy={cy} r={9} fill="#ffb060" opacity={(0.1 + 0.25 * fl) * f * (1 - 2 * cold)} filter={`url(#${uid}-soft)`} style={{ mixBlendMode: "screen" }} />;
        })}

      {glintP >= 0 && glintP < 1 &&
        (cold < 0.5 ? (
          <g mask={`url(#${uid}-sm)`}>
            {img("serpent.png", fxj.serpent, { filter: `url(#${uid}-glow)`, opacity: 0.55, style: { mixBlendMode: "screen" } })}
            {img("serpent.png", fxj.serpent, { opacity: 0.5, style: { mixBlendMode: "screen" } })}
          </g>
        ) : (
          // reversed: a faint, cold glint
          <g mask={`url(#${uid}-sm)`}>{img("serpent.png", fxj.serpent, { opacity: 0.22, style: { mixBlendMode: "screen", filter: "hue-rotate(175deg) saturate(0.6)" } })}</g>
        ))}
    </g>
  );
};
