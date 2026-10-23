import React from "react";
import type { LayerProps } from "../../engine/types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require("../../engine/schedule.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plan = require("./plan.js");

/*
 * II 女祭司 — the veil billows (generic ripple in card.json); this layer keeps everything else still and adds:
 *   hold.png    the picture outside the veil + the priestess in front of it, redrawn over the rippling veil
 *   "reveal"    the TORA letters turn gold left to right, and stay lit until the card is reversed
 *   "pillars"   the black pillar, then the white one, light up in turn
 *   "numeral"   the title holds the card still and lights the II at the top
 * Masks come from cards/02-high-priestess/assets.py; coordinates are scan px.
 */
const { cues } = build(plan);
const TORA_BOX = [422, 996, 614, 1065]; // printed by assets.py
const PILLAR_B = [48, 240, 242, 1585];
const PILLAR_J = [832, 268, 1045, 1565];
const NUMERAL = [525, 85];

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => { const u = clamp(x); return u * u * (3 - 2 * u); };
const bump = (p: number, a: number, b: number) => Math.sin(Math.PI * clamp((p - a) / (b - a)));

export const Layers: React.FC<LayerProps> = ({ t, uid, g, fx, url }) => {
  const { PIC } = g;

  // TORA: drawn over its shot, held, then gone with the reversal
  const draw = cues.fx("reveal")[0];
  const drawP = !draw || t < draw.start ? 0 : smooth((t - draw.start) / (draw.dur * 0.85));
  const fade = 1 - smooth((t - cues.reversal.start) / 1.2);
  const lit = fx.level("reveal", 0.3, 0.6);
  const T = g.box(TORA_BOX);
  const torA = drawP * fade;

  const pp = fx.prog("pillars");
  const bOn = pp == null ? 0 : bump(pp, 0.0, 0.6), jOn = pp == null ? 0 : bump(pp, 0.4, 1.0);
  const PB = g.box(PILLAR_B), PJ = g.box(PILLAR_J);

  const nOn = fx.level("numeral", 0.35, 0.3);
  const [nx, ny] = g.sc(NUMERAL[0], NUMERAL[1]);

  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-pl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffe2a0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe2a0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-tora`} x1="0" y1="0" x2="1" y2="0">
          <stop offset={Math.max(0, drawP - 0.08)} stopColor="#fff" />
          <stop offset={drawP} stopColor="#000" />
        </linearGradient>
        <mask id={`${uid}-toraMask`} maskUnits="userSpaceOnUse" x={T.x} y={T.y} width={T.w} height={T.h}>
          <rect x={T.x} y={T.y} width={T.w} height={T.h} fill={`url(#${uid}-tora)`} />
        </mask>
      </defs>
      <image href={url("hold.png")} x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} preserveAspectRatio="none" />

      {torA > 0.001 && (
        <g mask={`url(#${uid}-toraMask)`} opacity={torA}>
          <image href={url("tora_gold.png")} x={T.x} y={T.y} width={T.w} height={T.h} preserveAspectRatio="none" filter={`url(#${uid}-glow)`} opacity={0.2 + 0.3 * lit} style={{ mixBlendMode: "screen" }} />
          <image href={url("tora_gold.png")} x={T.x} y={T.y} width={T.w} height={T.h} preserveAspectRatio="none" opacity={0.6 + 0.4 * lit} />
        </g>
      )}

      {bOn > 0 && <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill={`url(#${uid}-pl)`} opacity={0.32 * bOn} style={{ mixBlendMode: "screen" }} />}
      {jOn > 0 && <rect x={PJ.x} y={PJ.y} width={PJ.w} height={PJ.h} fill={`url(#${uid}-pl)`} opacity={0.22 * jOn} style={{ mixBlendMode: "screen" }} />}

      {nOn > 0 && (
        <g opacity={nOn} style={{ mixBlendMode: "screen" }}>
          <circle cx={nx} cy={ny} r={26} fill="#ffd98a" opacity={0.22} filter={`url(#${uid}-soft)`} />
          <circle cx={nx} cy={ny} r={17} fill="none" stroke="#ffe4a6" strokeWidth={1.2} opacity={0.8} />
        </g>
      )}
    </g>
  );
};
