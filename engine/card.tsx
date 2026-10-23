import React from "react";
import { staticFile } from "remotion";
import { HAN, TITLE } from "./fonts";
import { Cam, W, H, clamp } from "./util";
import { Glint, Radiant, RadiantDark, RippleRegion, Sweep, Water } from "./fx";
import type { CardModule, FxApi, Geometry, Meta } from "./types";

/*
 * The card: a 600 x 1000 card space with a gilded frame, the restyled scan in the picture area,
 * the shared ambient effects, the card's own layers, the label and the hook halos.
 */

export const cardUrl = (id: string) => (file: string) => staticFile(`cards/${id}/${file}`);

export const geometry = (meta: Meta): Geometry => {
  const [X0, Y0, X1, Y1] = meta.frame;
  const PIC = { x: 40, y: 60, w: 520, h: (520 * (Y1 - Y0)) / (X1 - X0) };
  const S = PIC.w / (X1 - X0);
  const sc = (x: number, y: number) => [PIC.x + (x - X0) * S, PIC.y + (y - Y0) * S] as const;
  const box = (b: number[]) => {
    const [x0, y0] = sc(b[0], b[1]);
    const [x1, y1] = sc(b[2], b[3]);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  };
  return { PIC, sc, box, labelY: PIC.y + PIC.h + 55 };
};

export type ArtProps = {
  t: number;
  uid?: string;
  cold?: number;
  openT?: number;
  hl?: [number, number, number];
  dark?: number; // radiant light sinks into shadow (reversed)
  reveal?: number; // gold reveal progress inside ripples
  fx?: FxApi;
};

const NOFX: FxApi = { level: () => 0, prog: () => null };
const C = { gold: "#d4a84b", goldDim: "#7a5e28", bg: "#0a0814" };

export const CardArt: React.FC<ArtProps & { card: CardModule }> = (a) => {
  const { card, t, uid = "c", cold = 0, openT = 99, hl = [0, 0, 0], dark = 0, reveal = 0, fx = NOFX } = a;
  const { meta, gen, Layers } = card;
  const g = geometry(meta);
  const { PIC } = g;
  const url = cardUrl(meta.id);
  const art = url("art.png");
  const amb = meta.ambient;
  const sweepP = fx.prog("sweep");
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-cardBg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151124" />
          <stop offset="1" stopColor="#08070f" />
        </linearGradient>
        <radialGradient id={`${uid}-radiant`}>
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#e8962e" stopOpacity="0.18" />
          <stop offset="1" stopColor="#e8962e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-radiantDark`}>
          <stop offset="0" stopColor="#03040a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#03040a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-picVig`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id={`${uid}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffe2a0" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffe2a0" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-pic`}>
          <rect x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} rx={4} />
        </clipPath>
        <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`${uid}-goldGlow`} x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* card body + gilded frame */}
      <rect x={0} y={0} width={600} height={1000} rx={24} fill={`url(#${uid}-cardBg)`} />
      <rect x={1.5} y={1.5} width={597} height={997} rx={23} fill="none" stroke={C.gold} strokeWidth={3} />
      <rect x={14} y={14} width={572} height={972} rx={14} fill="none" stroke={C.goldDim} strokeWidth={1.2} />
      {([[28, 28], [572, 28], [28, 972], [572, 972]] as [number, number][]).map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d="M -8 0 L 0 -8 L 8 0 L 0 8 Z" fill={C.gold} />
          <path d="M -4 0 L 0 -4 L 4 0 L 0 4 Z" fill={C.bg} />
        </g>
      ))}

      {/* picture */}
      <g clipPath={`url(#${uid}-pic)`}>
        <image href={art} x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} preserveAspectRatio="none" />
        {/* card.json reverseArt: the reversed card crossfades to a second edition (e.g. the night edition) */}
        {meta.reverseArt && cold > 0.005 && <image href={url(meta.reverseArt)} x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} preserveAspectRatio="none" opacity={Math.min(1, cold)} />}
        {(amb.ripples ?? []).map((rp, i) => (
          <RippleRegion key={i} idx={i} g={g} rp={rp} sky={gen.sky[rp.name]} art={art} revealImg={rp.reveal ? url(rp.reveal.image) : undefined} t={t} fx={fx} reveal={reveal} cold={cold} uid={uid} />
        ))}
        {Layers && <Layers t={t} openT={openT} uid={uid} g={g} fx={fx} cold={cold} url={url} />}
        {/* water after the card layers, so a layer that holds part of the picture still never covers the glints */}
        {amb.water && <Water g={g} box={amb.water.box} n={amb.water.n} t={t} on={0.6 + 0.4 * fx.level("sweep")} />}
        {amb.glint && <Glint g={g} at={amb.glint.at} t={t} on={fx.level("glint")} />}
        {amb.radiant && <Radiant g={g} {...amb.radiant} t={t} boost={fx.level("radiant", 0.6, 0.3)} dark={dark} cold={cold} uid={uid} />}
        <Sweep g={g} p={sweepP ?? 0} uid={uid} />
        {amb.radiant && <RadiantDark g={g} at={amb.radiant.at} r={amb.radiant.r} dark={dark} uid={uid} />}
        <rect x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} fill={`url(#${uid}-picVig)`} />
      </g>
      <rect x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} rx={4} fill="none" stroke={C.gold} strokeWidth={2} />
      <rect x={PIC.x - 7} y={PIC.y - 7} width={PIC.w + 14} height={PIC.h + 14} rx={8} fill="none" stroke={C.goldDim} strokeWidth={0.9} />

      <text x={300} y={g.labelY} textAnchor="middle" fontFamily={TITLE} fontSize={meta.nameEn.length > 10 ? 30 : 38} fill={C.gold} letterSpacing={meta.nameEn.length > 10 ? 8 : 12} filter={`url(#${uid}-goldGlow)`}>
        {meta.nameEn}
      </text>

      {/* hook halos, lit in sync with the caption */}
      {meta.halos.flatMap(({ at, r, also = [] }, i) => [at, ...also].map((pt, j) => ({ pt, r, i, j }))).map(({ pt, r, i, j }) => {
        const p = hl[i];
        if (!p || p <= 0) return null;
        const [x, y] = g.sc(pt[0], pt[1]);
        const R = r * (1.25 - 0.25 * p);
        return (
          <g key={`${i}-${j}`} opacity={Math.min(1, p * 1.4)}>
            <circle cx={x} cy={y} r={R} fill="#ffd98a" opacity={0.1} filter={`url(#${uid}-soft)`} />
            <circle cx={x} cy={y} r={R} fill="none" stroke="#ffe4a6" strokeWidth={6} opacity={0.3} filter={`url(#${uid}-soft)`} />
            <circle cx={x} cy={y} r={R} fill="none" stroke="#ffe4a6" strokeWidth={1.6} opacity={0.85} />
          </g>
        );
      })}
    </g>
  );
};

export const CardBack: React.FC<{ t: number; numeral: string }> = ({ t, numeral }) => (
  <g>
    <rect x={0} y={0} width={600} height={1000} rx={24} fill="#0e0b18" stroke={C.gold} strokeWidth={3} />
    <rect x={14} y={14} width={572} height={972} rx={14} fill="none" stroke={C.goldDim} strokeWidth={1.2} />
    <g transform={`translate(300,500) rotate(${t * 8})`}>
      {new Array(24).fill(0).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return <line key={i} x1={Math.cos(a) * 120} y1={Math.sin(a) * 120} x2={Math.cos(a) * (i % 2 ? 210 : 260)} y2={Math.sin(a) * (i % 2 ? 210 : 260)} stroke={C.goldDim} strokeWidth={1.6} />;
      })}
    </g>
    {[100, 160, 270].map((r) => (
      <circle key={r} cx={300} cy={500} r={r} fill="none" stroke={C.goldDim} strokeWidth={1.4} />
    ))}
    <circle cx={300} cy={500} r={100} fill="#0a0814" stroke={C.gold} strokeWidth={2.2} />
    <text x={300} y={524} textAnchor="middle" fontFamily={TITLE} fontSize={numeral.length > 4 ? 48 : 62} fill={C.gold} letterSpacing={6}>
      {numeral}
    </text>
  </g>
);

/** keep a close-up inside the picture: clamp the focus so the screen never shows the card frame */
export const clampCam = (g: Geometry, cam: Cam, rot: number): Cam => {
  const { PIC } = g;
  const k = 0.82 * cam.z;
  const reversed = rot > 90;
  const x0 = PIC.x + 3, x1 = PIC.x + PIC.w - 3;
  const y0 = (reversed ? 1000 - (PIC.y + PIC.h) : PIC.y) + 3, y1 = (reversed ? 1000 - PIC.y : PIC.y + PIC.h) - 3;
  const fit = (f: number, s: number, span: number, lo: number, hi: number) => {
    const before = s / k, after = (span - s) / k;
    if (hi - lo < before + after) return (lo + hi) / 2 + (before - after) / 2;
    return clamp(f, lo + before, hi - after);
  };
  return { ...cam, fx: fit(cam.fx, cam.sx, W, x0, x1), fy: fit(cam.fy, cam.sy, H, y0, y1) };
};

export const CardView: React.FC<{
  card: CardModule;
  cam: Cam;
  rot?: number;
  opacity?: number;
  flip?: number;
  back?: boolean;
  art: ArtProps;
  glow?: number;
}> = ({ card, cam, rot = 0, opacity = 1, flip = 1, back = false, art, glow = 1 }) => {
  if (opacity <= 0.001) return null;
  const uid = art.uid ?? "c";
  const k = 0.82 * cam.z;
  const c = art.cold ?? 0;
  const rl = card.meta.reverseLook ?? {};
  const filter = c > 0.005 ? `saturate(${1 - (1 - (rl.saturate ?? 0.55)) * c}) hue-rotate(${(rl.hue ?? -30) * c}deg) brightness(${1 + ((card.meta.reverseBrightness ?? 0.82) - 1) * c})` : undefined;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, filter }}>
      <defs>
        <filter id={`${uid}-cardGlow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <g transform={`translate(${cam.sx},0) scale(${flip},1) translate(${-cam.sx},0)`}>
        <g transform={`translate(${cam.sx},${cam.sy}) scale(${k}) translate(${-cam.fx},${-cam.fy}) rotate(${rot} 300 500)`}>
          <rect x={-12} y={-12} width={624} height={1024} rx={32} fill="#c89545" opacity={0.14 * glow} filter={`url(#${uid}-cardGlow)`} />
          {back ? <CardBack t={art.t} numeral={card.meta.numeral} /> : <CardArt card={card} {...art} uid={uid} />}
        </g>
      </g>
    </svg>
  );
};
