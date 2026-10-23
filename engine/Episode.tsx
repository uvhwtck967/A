import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Img, random, staticFile, useCurrentFrame } from "remotion";
import { CardView, clampCam, geometry } from "./card";
import { HAN, ITAL, TITLE } from "./fonts";
import { BG, Cam, FPS, GOLD, GOLD_DIM, GOLD_TEXT, H, W, clamp, ease, easeIn, easeInOut, lerp, prog, win } from "./util";
import type { CardModule, FxApi } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require("./schedule.js");

type Seg = any;

/* ------------------------------------------------------------------ */
/* Screen-level atmosphere (shared by every episode)                   */
/* ------------------------------------------------------------------ */

const Background: React.FC<{ t: number; cold: number; warm: number }> = ({ t, cold, warm }) => {
  const motes = useMemo(
    () => new Array(90).fill(0).map((_, i) => ({ x: random(`mx${i}`) * W, y: random(`my${i}`) * H, r: 0.8 + random(`mr${i}`) * 2.2, sp: 6 + random(`ms${i}`) * 18, ph: random(`mp${i}`) * 6.28, o: 0.15 + random(`mo${i}`) * 0.45 })),
    []
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #1a1834 0%, ${BG} 55%, #04040c 100%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10203e 0%, #050812 70%)", opacity: cold * 0.8 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(255,170,90,0.35) 0%, rgba(80,30,10,0) 60%)", opacity: warm }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {motes.map((m, i) => {
          const y = (((m.y - t * m.sp) % H) + H) % H;
          return <circle key={i} cx={m.x + Math.sin(t * 0.3 + m.ph) * 20} cy={y} r={m.r} fill={cold > 0.5 ? "#9fb6e8" : "#f0cf8e"} opacity={m.o * (0.6 + 0.4 * Math.sin(t * 1.7 + m.ph))} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const ASH = new Array(42).fill(0).map((_, i) => ({ x: random(`ax${i}`), y: random(`ay${i}`), sp: 18 + random(`as${i}`) * 40, sw: 20 + random(`aw${i}`) * 50, ph: random(`ap${i}`) * 6.28, r: 1 + random(`ar${i}`) * 2.6, d: random(`ad${i}`) }));
const Atmosphere: React.FC<{ t: number; cold: number; on: number }> = ({ t, cold, on }) => (
  <AbsoluteFill style={{ opacity: on }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 60% 30% at ${30 + 20 * Math.sin(t * 0.07)}% ${78 + 4 * Math.sin(t * 0.11)}%, rgba(200,190,230,0.10), rgba(0,0,0,0) 70%), radial-gradient(ellipse 50% 25% at ${75 - 15 * Math.sin(t * 0.05 + 1)}% ${30 + 6 * Math.sin(t * 0.09)}%, rgba(200,190,230,0.06), rgba(0,0,0,0) 70%)`,
        mixBlendMode: "screen",
      }}
    />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {ASH.map((a, i) => {
        const y = (((a.y * H + t * a.sp) % (H + 60)) + H + 60) % (H + 60) - 30;
        const x = a.x * W + Math.sin(t * 0.5 + a.ph) * a.sw;
        const blur = a.d > 0.75;
        return (
          <ellipse key={i} cx={x} cy={y} rx={a.r * (blur ? 2.2 : 1)} ry={a.r * 0.6 * (blur ? 2.2 : 1)} transform={`rotate(${(t * 40 + a.ph * 60) % 360} ${x} ${y})`} fill={cold > 0.5 ? "#cfe0ff" : "#f2d9a6"} opacity={(blur ? 0.18 : 0.42) * (0.6 + 0.4 * Math.sin(t * 1.1 + a.ph))} />
        );
      })}
    </svg>
  </AbsoluteFill>
);

const CRYSTALS = new Array(70).fill(0).map((_, i) => {
  const side = i % 4;
  const u = random(`fu${i}`);
  const [x, y] = side === 0 ? [u * W, 0] : side === 1 ? [W, u * H] : side === 2 ? [u * W, H] : [0, u * H];
  const inward = side === 0 ? Math.PI / 2 : side === 1 ? Math.PI : side === 2 ? -Math.PI / 2 : 0;
  return { x, y, a: inward + (random(`fa${i}`) - 0.5) * 1.2, len: 60 + random(`fl${i}`) * 220, d: random(`fd${i}`) * 0.5 };
});
const Frost: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(170,200,255,0.20) 100%)", opacity: p }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="frostBlur">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>
        {CRYSTALS.map((c, i) => {
          const g = clamp((p - c.d) / (1 - c.d));
          if (g <= 0) return null;
          const L = c.len * g;
          const ex = c.x + Math.cos(c.a) * L, ey = c.y + Math.sin(c.a) * L;
          const b = (f: number, da: number) => {
            const bx = c.x + Math.cos(c.a) * L * f, by = c.y + Math.sin(c.a) * L * f;
            return <line x1={bx} y1={by} x2={bx + Math.cos(c.a + da) * L * 0.3} y2={by + Math.sin(c.a + da) * L * 0.3} stroke="#dfeaff" strokeWidth={0.6} opacity={0.2} />;
          };
          return (
            <g key={i}>
              <line x1={c.x} y1={c.y} x2={ex} y2={ey} stroke="#e6efff" strokeWidth={0.9} opacity={0.28} filter="url(#frostBlur)" />
              {b(0.4, 0.7)}
              {b(0.6, -0.7)}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

const capStyle = (p: number): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * 12}px)`, filter: p < 0.99 ? `blur(${(1 - p) * 5}px)` : undefined });

/** split the names line into [text, haloIndex|null] parts, in order */
const nameParts = (zh: string, names: string[]): [string, number | null][] => {
  const parts: [string, number | null][] = [];
  let rest = zh;
  names.forEach((n, i) => {
    const k = rest.indexOf(n);
    if (k < 0) throw new Error(`names line does not contain "${n}"`);
    if (k > 0) parts.push([rest.slice(0, k), null]);
    parts.push([n, i]);
    rest = rest.slice(k + n.length);
  });
  if (rest) parts.push([rest, null]);
  return parts;
};

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const CELL = { w: 120, h: 190, gap: 22, x0: 190, y0: 210, rowGap: 34 };
const cellCenter = (i: number) => {
  const row = i < 11 ? 0 : 1;
  return [CELL.x0 + (i % 11) * (CELL.w + CELL.gap) + CELL.w / 2, CELL.y0 + row * (CELL.h + CELL.rowGap) + CELL.h / 2];
};

const FULL: Cam = { fx: 300, fy: 500, z: 1, sx: 960, sy: 470 };
const LEFT: Cam = { ...FULL, sx: 620 };
const toDisp = ([x, y]: readonly [number, number], rev: boolean) => (rev ? ([600 - x, 1000 - y] as const) : ([x, y] as const));

/* ------------------------------------------------------------------ */
/* Episode                                                             */
/* ------------------------------------------------------------------ */

export const episodeDuration = (card: CardModule): number => build(card.plan).duration;

export const Episode: React.FC<{ card: CardModule }> = ({ card }) => {
  const { meta } = card;
  const { segs, cues, duration } = useMemo(() => build(card.plan), [card]);
  const g = useMemo(() => geometry(meta), [meta]);
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const segAt = (tt: number): Seg => segs.find((s: Seg) => tt >= s.start && tt < s.end) ?? segs[segs.length - 1];
  const s = segAt(t);

  /* ---------------- camera ---------------- */
  const rev = t >= cues.reversal.end;
  const shot = s.shot ?? {};
  // a card-space point as displayed after rotating the card by `deg` about its centre
  const turn = ([x, y]: readonly [number, number], deg: number) => {
    const a = (deg * Math.PI) / 180, dx = x - 300, dy = y - 500;
    return [300 + dx * Math.cos(a) - dy * Math.sin(a), 500 + dx * Math.sin(a) + dy * Math.cos(a)] as const;
  };
  const upright = (deg: number) => Math.abs(((deg % 180) + 180) % 180) < 0.5 || Math.abs((((deg % 180) + 180) % 180) - 180) < 0.5;
  type Pose = { cam: Cam; rot: number; flip: number };
  /** where the camera sits at time tt inside segment sg (no hand-held drift, no linking) */
  const shotPose = (sg: Seg, tt: number): Pose => {
    const sh = sg.shot ?? {};
    const segRev = sg.start >= cues.reversal.end;
    let cam: Cam = FULL, rot = segRev && sg.kind !== "focus" ? 180 : 0, flip = 1;
    if (sg.kind === "open" || (sh.f && !sh.pull)) {
      const p = prog(tt, sg.start, sg.end, (x: number) => x);
      const pe = sh.push ? prog(tt, sg.start, sg.end, easeIn) : ease(p);
      rot = sh.flash ? 0 : (sh.rev || segRev) && sg.kind !== "open" ? 180 : 0;
      if (sh.spin) rot += sh.spin * prog(tt, sg.start, sg.end, easeInOut);
      const f0 = turn(g.sc(sh.f[0], sh.f[1]), rot);
      const f1 = sh.f1 ? turn(g.sc(sh.f1[0], sh.f1[1]), rot) : f0;
      const z = sh.push || sh.pullBack ? Math.exp(lerp(Math.log(sh.z), Math.log(sh.z1), pe)) : lerp(sh.z, sh.z1 ?? sh.z, p);
      cam = { fx: lerp(f0[0], f1[0], pe), fy: lerp(f0[1], f1[1], pe), z, sx: 960, sy: 520 };
    } else if (sh.pull) {
      const open = segs[0];
      const from = clampCam(g, shotPose(open, open.end - 1e-3).cam, 0);
      const p = prog(tt, sg.start, sg.start + 1.8, easeInOut);
      cam = { fx: lerp(from.fx, FULL.fx, p), fy: lerp(from.fy, FULL.fy, p), z: Math.exp(lerp(Math.log(from.z), 0, p)), sx: 960, sy: lerp(520, 470, p) };
    } else if (sh.reverse) rot = sh.instant ? 180 : 180 * prog(tt, sg.start + 0.15, cues.revRotateEnd, easeInOut);
    else if (sg.kind === "title" && !sg.noFlip) {
      if (tt < sg.start + 0.25) flip = 1 - prog(tt, sg.start, sg.start + 0.25, easeIn);
      else if (tt < sg.end - 0.25) flip = 0;
      else flip = prog(tt, sg.end - 0.25, sg.end);
    } else if (sg.kind === "chapter") {
      const p = prog(tt, sg.start, sg.start + 0.5);
      cam = { ...LEFT, sx: lerp(700, 620, p), z: lerp(0.96, 1, p) };
    } else if (sh.full || sg.kind === "title") {
      cam = { ...FULL, z: lerp(sh.z ?? 1, sh.z1 ?? 1.02, prog(tt, sg.start, sg.end, (x: number) => x)) };
      if (sh.spin) rot += sh.spin * prog(tt, sg.start, sg.end, easeInOut);
    }
    if (cam.z > 1.3 && upright(rot)) cam = clampCam(g, cam, rot);
    return { cam, rot, flip };
  };
  let { cam, rot, flip } = shotPose(s, t);
  // shot.link: instead of a hard cut, the camera glides from where the previous shot ended
  const si = segs.indexOf(s);
  if (shot.link && si > 0) {
    const L = Math.min(0.8, s.dur * 0.35);
    const p = prog(t, s.start, s.start + L, easeInOut);
    if (p < 1) {
      const from = shotPose(segs[si - 1], segs[si - 1].end - 1e-3);
      cam = { fx: lerp(from.cam.fx, cam.fx, p), fy: lerp(from.cam.fy, cam.fy, p), z: Math.exp(lerp(Math.log(from.cam.z), Math.log(cam.z), p)), sx: lerp(from.cam.sx, cam.sx, p), sy: lerp(from.cam.sy, cam.sy, p) };
      rot = lerp(from.rot, rot, p);
    }
  }
  cam = { ...cam, sx: cam.sx + Math.sin(t * 0.61) * 5 + Math.sin(t * 1.37) * 2, sy: cam.sy + Math.sin(t * 0.47 + 1) * 4 };
  if (cam.z > 1.3 && upright(rot)) cam = clampCam(g, cam, rot);
  // card.json reverseTint: false keeps the reversed card in its upright colours (ripples keep moving too)
  const cold = meta.reverseTint === false ? 0 : shot.reverse ? rot / 180 : rev && !shot.flash && s.kind !== "focus" ? 1 : 0;

  /* ---------------- effect levels ---------------- */
  const fx: FxApi = {
    level: (name, fi = 0.4, fo = 0.3) => Math.max(0, ...cues.fx(name).map((sg: Seg) => win(t, sg.start, sg.end, fi, fo))),
    prog: (name) => {
      const sg = cues.fx(name).find((x: Seg) => t >= x.start && t < x.end);
      return sg ? (t - sg.start) / sg.dur : null;
    },
    since: (name) => {
      const sg = cues.fx(name).find((x: Seg) => t >= x.start && t < x.end);
      return sg ? t - sg.start : null;
    },
  };
  const revealCfg = (meta.ambient.ripples ?? []).find((r) => r.reveal)?.reveal;
  const drawSeg = revealCfg ? cues.fx(revealCfg.fxDraw)[0] : null;
  const reveal = !drawSeg ? 0 : t < drawSeg.start ? 0 : t < drawSeg.end ? easeInOut(clamp((t - drawSeg.start) / (drawSeg.dur * 0.9))) : 1 - prog(t, cues.reversal.start, cues.reversal.start + 1.5);

  const isFlash = !!shot.flash;
  const warm = isFlash ? win(t, s.start, s.end, 0.25, 0.2) : 0;
  const revOn = t >= cues.reversal.start && t < cues.summary.start;
  const frostSeg = cues.fx("frostGrow")[0];
  const frost = revOn && !isFlash && frostSeg ? prog(t, frostSeg.start - 0.4, frostSeg.start + 2.4) * (1 - prog(t, cues.summary.start - 0.3, cues.summary.start)) : 0;

  const T = cues.title;
  let backFlip = 0;
  if (T.noFlip) backFlip = 0;
  else if (t >= T.start + 0.25 && t < T.start + 0.5) backFlip = prog(t, T.start + 0.25, T.start + 0.5);
  else if (t >= T.start + 0.5 && t < T.end - 0.5) backFlip = 1;
  else if (t >= T.end - 0.5 && t < T.end - 0.25) backFlip = 1 - prog(t, T.end - 0.5, T.end - 0.25, easeIn);

  const N = cues.names;
  const hl = [0, 1, 2].map((i) => prog(t, N.rings[i], N.rings[i] + 0.5) * (1 - prog(t, N.end - 0.3, N.end))) as [number, number, number];
  const reverseDark = meta.ambient.radiant?.reverseDark ?? 0.85;
  const art = { t, uid: "m", cold, openT: t, hl, dark: isFlash ? 0 : cold * reverseDark, reveal, fx };

  // optional focus shot: the upright card returns between the summary and the atlas
  const F = cues.focus;
  const sumEnd = F ? F.start : cues.atlas.start;
  const inFocus = !!F && t >= F.start && t < F.end;
  const inSummary = t >= cues.summary.start && t < sumEnd + 0.6;
  const mainOn = t < cues.summary.start || inFocus;
  const I0 = cues.impacts[0];
  const shake = I0 != null && t > I0 ? Math.exp(-(t - I0) * 14) : 0;
  const shX = shake * 7 * Math.sin(t * 90), shY = shake * 6 * Math.cos(t * 77);
  const fadeIn = 1 - prog(t, 0, 0.12);
  const fadeOut = prog(t, duration - 0.8, duration, easeInOut);
  const reverseCut = cues.reversal.shot.instant ? Math.max(0, 1 - Math.abs(t - cues.reversal.start) / 0.16) : 0;
  const grainX = random(`gx${frame}`) * 300;
  const grainY = random(`gy${frame}`) * 300;
  const sumP = prog(t, cues.summary.start, cues.summary.start + 0.7, easeInOut);
  const sumO = win(t, cues.summary.start, sumEnd + (F ? 0.1 : 0.5), 0.35, 0.5);

  /* ---------------- text layers ---------------- */
  const subs = [
    ...segs.filter((x: Seg) => x.kind === "line" || x.kind === "focus").map((x: Seg) => ({ zh: x.zh, en: x.en, start: x.start, end: x.end, hook: x.style === "hook" })),
    ...cues.atlas.subs.map((x: Seg) => ({ ...x, hook: false })),
  ];
  const A = cues.atlas;
  const [Cx, Cy] = cellCenter(meta.index);
  const atlasP = prog(t, A.start + 0.1, A.start + 1.1, easeInOut);
  const atlasCam: Cam = { fx: 300, fy: 500, z: Math.exp(lerp(Math.log(0.62), Math.log(0.235), atlasP)), sx: lerp(960, Cx, atlasP), sy: lerp(470, Cy, atlasP) };
  const TZ = cues.teaser;
  const tz = meta.teaser;

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <Audio src={staticFile(`cards/${meta.id}/sfx.wav`)} />
      <Background t={t} cold={revOn && !isFlash ? cold : 0} warm={warm} />

      <AbsoluteFill style={{ transform: `translate(${shX}px,${shY}px)` }}>
        {mainOn && <CardView card={card} cam={cam} rot={rot} flip={flip} opacity={flip > 0 ? (inFocus ? prog(t, F.start, F.start + 0.45) : 1) : 0} art={art} />}
        {backFlip > 0 && <CardView card={card} cam={FULL} flip={backFlip} back art={{ t, uid: "b" }} />}
        {inSummary && (
          <>
            <CardView card={card} cam={{ fx: 300, fy: 500, z: lerp(0.9, 0.76, sumP), sx: lerp(960, 600, sumP), sy: 440 }} opacity={sumO} art={{ t, uid: "su" }} />
            <CardView card={card} cam={{ fx: 300, fy: 500, z: lerp(0.9, 0.76, sumP), sx: lerp(960, 1320, sumP), sy: 440 }} rot={180} opacity={sumO} art={{ t, uid: "sr", cold: meta.reverseTint === false ? 0 : 1, dark: meta.reverseTint === false ? 0 : reverseDark }} />
          </>
        )}

        {/* atlas */}
        {win(t, A.start, A.end, 0.5, 0.4) > 0 && (
          <AbsoluteFill style={{ opacity: win(t, A.start, A.end, 0.5, 0.4) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center" }}>
              <span style={{ fontFamily: HAN, fontWeight: 600, fontSize: 40, letterSpacing: 16, ...GOLD_TEXT }}>塔罗图鉴</span>
              <span style={{ fontFamily: TITLE, fontSize: 22, letterSpacing: 8, color: GOLD_DIM, marginLeft: 24 }}>MAJOR ARCANA</span>
            </div>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              {ROMAN.map((r, i) => {
                const [cx, cy] = cellCenter(i);
                const appear = prog(t, A.start + 0.1 + i * 0.025, A.start + 0.6 + i * 0.025);
                const me = i === meta.index;
                const lit = me ? prog(t, A.start + 1.1, A.start + 1.6) : 0;
                const had = meta.collected.includes(i);
                return (
                  <g key={i} opacity={appear}>
                    <rect x={cx - CELL.w / 2} y={cy - CELL.h / 2} width={CELL.w} height={CELL.h} rx={8} fill={had ? "#1a1626" : "#0d0c18"} stroke={me ? GOLD : had ? GOLD_DIM : "#3a3350"} strokeWidth={me ? 2 * lit + 1 : 1.2} />
                    {!me && (
                      <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={TITLE} fontSize={22} fill={had ? GOLD : "#4a4262"} letterSpacing={2}>
                        {r}
                      </text>
                    )}
                    {me && <rect x={cx - CELL.w / 2 - 10} y={cy - CELL.h / 2 - 10} width={CELL.w + 20} height={CELL.h + 20} rx={14} fill="none" stroke="#ffe4a6" strokeWidth={2} opacity={lit * (0.5 + 0.3 * Math.sin(t * 3))} />}
                  </g>
                );
              })}
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 712, textAlign: "center", opacity: prog(t, A.start + 1.2, A.start + 1.8) }}>
              <span style={{ fontFamily: TITLE, fontSize: 30, letterSpacing: 8, color: GOLD }}>{meta.numeral}</span>
              <span style={{ fontFamily: HAN, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: "#f1e2bc", margin: "0 22px" }}>{meta.nameZh}</span>
              <span style={{ fontFamily: HAN, fontSize: 28, color: GOLD_DIM, margin: "0 18px" }}>｜</span>
              <span style={{ fontFamily: HAN, fontWeight: 500, fontSize: 30, letterSpacing: 4, color: "#d9c7a0" }}>已收录 </span>
              <span style={{ fontFamily: TITLE, fontSize: 32, color: "#ffe4a6" }}>{meta.collected.length + 1} / 22</span>
            </div>
          </AbsoluteFill>
        )}
        {t >= A.start && t < A.end && <CardView card={card} cam={atlasCam} opacity={win(t, A.start, A.end, 0.3, 0.4)} art={{ t, uid: "at" }} glow={2} />}

        {/* teaser */}
        {win(t, TZ.start, TZ.end, 0.5, 0.01) > 0 && (
          <AbsoluteFill style={{ opacity: win(t, TZ.start, TZ.end, 0.5, 0.01) }}>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              <defs>
                <radialGradient id="tzHalo">
                  <stop offset="0" stopColor="#ffe2a0" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#ffe2a0" stopOpacity="0" />
                </radialGradient>
                <clipPath id="tzClip">
                  <rect x={40} y={60} width={520} height={859} rx={6} />
                </clipPath>
              </defs>
              <g transform={`translate(${700 - 300 * 0.62},${540 - 500 * 0.62}) scale(0.62)`}>
                <rect x={0} y={0} width={600} height={1000} rx={22} fill="#0c0a12" stroke={GOLD_DIM} strokeWidth={3} />
                {tz.art ? (
                  <g clipPath="url(#tzClip)">
                    <image href={staticFile(tz.art)} x={40} y={60} width={520} height={859} preserveAspectRatio="xMidYMid slice" style={{ filter: "brightness(0.22) saturate(0.4)" }} />
                    <circle cx={300} cy={500} r={360} fill="url(#tzHalo)" opacity={0.6 * prog(t, TZ.start + 0.6, TZ.start + 1.8) * (0.85 + 0.15 * Math.sin(t * 2))} style={{ mixBlendMode: "screen" }} />
                  </g>
                ) : (
                  <>
                    {[100, 160, 270].map((r) => (
                      <circle key={r} cx={300} cy={500} r={r} fill="none" stroke="#3a3048" strokeWidth={1.4} />
                    ))}
                    <circle cx={300} cy={500} r={150} fill="url(#tzHalo)" opacity={prog(t, TZ.start + 0.6, TZ.start + 1.8)} />
                  </>
                )}
                <text x={300} y={46} textAnchor="middle" fontFamily={TITLE} fontSize={30} fill={GOLD_DIM} letterSpacing={6}>
                  {tz.numeral}
                </text>
                <text x={300} y={978} textAnchor="middle" fontFamily={HAN} fontSize={56} fill={GOLD_DIM}>
                  ?
                </text>
              </g>
            </svg>
            <div style={{ position: "absolute", left: 1080, top: 380, ...capStyle(prog(t, TZ.start + 0.4, TZ.start + 1.2)) }}>
              <div style={{ fontFamily: HAN, fontWeight: 500, fontSize: 30, letterSpacing: 12, color: GOLD_DIM }}>下一张</div>
              <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: 96, letterSpacing: 18, marginTop: 10, ...GOLD_TEXT }}>{tz.nameZh}</div>
              <div style={{ fontFamily: TITLE, fontSize: 28, letterSpacing: 10, color: "#a99572", marginTop: 6 }}>{tz.nameEn}</div>
            </div>
            <div style={{ position: "absolute", left: 1080, top: 640, ...capStyle(prog(t, TZ.start + 1.3, TZ.start + 2.0)) }}>
              <div style={{ fontFamily: HAN, fontWeight: 500, fontSize: 40, letterSpacing: 4, color: "#f4ecdc" }}>{tz.question}</div>
              <div style={{ fontFamily: ITAL, fontSize: 25, color: "#a99572", marginTop: 8 }}>{tz.questionEn}</div>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      <Frost p={frost} />
      <Atmosphere t={t} cold={revOn && !isFlash ? 1 : 0} on={t < A.start ? 1 : 1 - prog(t, A.start, A.start + 0.6)} />

      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(3,3,10,0.75) 100%)", opacity: prog(t, segs[1].start - 0.3, segs[1].start + 0.2) }} />

      {/* section tags */}
      {(
        [
          [cues.chapters[0].start, cues.reversal.start, "正位", "UPRIGHT"],
          [cues.reversal.end, cues.summary.start, "逆位", "REVERSED"],
        ] as [number, number, string, string][]
      ).map(([a, b, zh, en], i) => {
        const o = win(t, a, b, 0.4, 0.4);
        if (o <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 72, top: 58, opacity: o, display: "flex", alignItems: "baseline", gap: 16, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            <div style={{ width: 10, height: 10, transform: "rotate(45deg) translateY(-4px)", background: GOLD }} />
            <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: 34, color: "#efdcae", letterSpacing: 8 }}>{zh}</div>
            <div style={{ fontFamily: TITLE, fontSize: 20, color: GOLD_DIM, letterSpacing: 6 }}>{en}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 72, top: 60, opacity: win(t, cues.chapters[0].start, A.start, 0.6, 0.4) * 0.85, fontFamily: TITLE, fontSize: 20, letterSpacing: 6, color: GOLD_DIM, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
        TAROT ATLAS · {meta.numeral}
      </div>

      {/* chapter cards */}
      {cues.chapters.map((c: Seg, i: number) => {
        const a = c.start;
        const o = win(t, a, c.end, 0.3, 0.25);
        if (o <= 0) return null;
        const lineW = 260 * prog(t, a + 0.05, a + 0.6);
        const pSym = prog(t, a + 0.1, a + 0.6);
        const pMean = prog(t, a + 0.6, a + 1.4);
        const n = c.meaning.replace(/\s/g, "").length;
        const long = n > 3;
        const size = n <= 2 ? 150 : n <= 4 ? 120 : n <= 7 ? 92 : 76;
        return (
          <div key={i} style={{ position: "absolute", left: 1000, width: 820, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: o }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: lineW / 2, height: 1, background: GOLD_DIM }} />
              <div style={{ fontFamily: HAN, fontWeight: 500, fontSize: 28, letterSpacing: 10, color: c.rev ? "#9fb3dc" : GOLD }}>{c.label}</div>
              <div style={{ width: lineW / 2, height: 1, background: GOLD_DIM }} />
            </div>
            <div style={{ fontFamily: HAN, fontWeight: 500, fontSize: 52, letterSpacing: 14, color: "#e9dcc0", marginTop: 30, ...capStyle(pSym) }}>{c.symbol || null}</div>
            <div style={{ width: 1, height: 46 * pMean, background: `linear-gradient(180deg, ${GOLD_DIM}, rgba(0,0,0,0))`, marginTop: 16 }} />
            <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: size, whiteSpace: "nowrap", letterSpacing: lerp(long ? 30 : 56, long ? 10 : 24, pMean), marginTop: 10, opacity: pMean, ...GOLD_TEXT, filter: `blur(${(1 - pMean) * 10}px) drop-shadow(0 6px 30px rgba(0,0,0,0.8))` }}>{c.meaning}</div>
            <div style={{ fontFamily: TITLE, fontSize: 26, letterSpacing: lerp(14, 7, pMean), color: "#c8b083", marginTop: 18, opacity: prog(t, a + 1.0, a + 1.7) }}>{c.en}</div>
          </div>
        );
      })}

      {/* title */}
      {win(t, T.start + 0.35, T.end, 0.3, 0.25) > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, textAlign: "center", opacity: win(t, T.start + 0.35, T.end, 0.3, 0.25) }}>
          <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: 70, letterSpacing: lerp(40, 20, prog(t, T.start + 0.35, T.start + 1.1)), ...GOLD_TEXT }}>{meta.nameZh}</div>
          <div style={{ fontFamily: TITLE, fontSize: 30, letterSpacing: lerp(22, 12, prog(t, T.start + 0.35, T.start + 1.1)), color: "#c8b083", marginTop: 4 }}>{meta.nameEn}</div>
        </div>
      )}

      {/* summary */}
      {(() => {
        const S = cues.summary;
        const items: [number, string, [string, string]][] = [
          [600, "正位", meta.summary.upright],
          [1320, "逆位", meta.summary.reversed],
        ];
        return (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 48, textAlign: "center", opacity: win(t, S.start + 0.2, S.end, 0.5, 0.4), fontFamily: HAN, fontWeight: 500, fontSize: 30, letterSpacing: 14, color: GOLD }}>一句话记住</div>
            {items.map(([x, tag, [zh, en]], i) => {
              const o = win(t, S.start + 0.6 + i * 1.0, S.end, 0.5, 0.4);
              if (o <= 0) return null;
              return (
                <div key={i} style={{ position: "absolute", left: x - 400, width: 800, top: 790, textAlign: "center", ...capStyle(o) }}>
                  <div style={{ fontFamily: HAN, fontWeight: 500, fontSize: 28, letterSpacing: 10, color: i ? "#9fb3dc" : GOLD }}>{tag}</div>
                  <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: 48, letterSpacing: 4, color: "#f4ecdc", marginTop: 10 }}>{zh}</div>
                  <div style={{ fontFamily: ITAL, fontSize: 24, color: "#a99572", marginTop: 8 }}>{en}</div>
                </div>
              );
            })}
          </>
        );
      })()}

      {/* captions */}
      {subs.map((x, i) => {
        const p = win(t, x.start, x.end, 0.2, 0.15);
        if (p <= 0) return null;
        return x.hook ? (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", opacity: p, transform: `scale(${lerp(1.05, 1, prog(t, x.start, x.start + 0.4))})` }}>
            <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: 64, letterSpacing: 6, ...GOLD_TEXT, filter: "drop-shadow(0 3px 16px rgba(0,0,0,0.95))" }}>{x.zh}</div>
            <div style={{ fontFamily: ITAL, fontSize: 28, color: "#c9b48a", marginTop: 6, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{x.en}</div>
          </div>
        ) : (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 58, textAlign: "center", ...capStyle(p) }}>
            <div style={{ fontFamily: HAN, fontWeight: 500, fontSize: 48, color: "#f4ecdc", letterSpacing: 3, textShadow: "0 2px 18px rgba(0,0,0,0.95)" }}>{x.zh}</div>
            <div style={{ fontFamily: ITAL, fontSize: 26, color: "#c4b088", marginTop: 8, letterSpacing: 1, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{x.en}</div>
          </div>
        );
      })}

      {/* hook line 3: each noun turns gold as its halo lights */}
      {win(t, N.start, N.end, 0.25, 0.2) > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center", opacity: win(t, N.start, N.end, 0.25, 0.2) }}>
          <div style={{ fontFamily: HAN, fontWeight: 600, fontSize: 60, letterSpacing: 5, filter: "drop-shadow(0 3px 16px rgba(0,0,0,0.95))" }}>
            {nameParts(N.zh, N.names).map(([str, ring], i) => {
              const lit = ring === null ? 0 : prog(t, N.rings[ring], N.rings[ring] + 0.35);
              return (
                <span key={i} style={ring === null ? { color: "#e9dcc0" } : { color: `rgb(${lerp(233, 255, lit)},${lerp(220, 214, lit)},${lerp(192, 130, lit)})`, textShadow: `0 0 ${18 * lit}px rgba(255,200,110,${0.7 * lit})` }}>
                  {str}
                </span>
              );
            })}
          </div>
          <div style={{ fontFamily: ITAL, fontSize: 28, color: "#c9b48a", marginTop: 6, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{N.en}</div>
        </div>
      )}

      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "screen" }}>
        <Img src={staticFile("noise.png")} style={{ position: "absolute", left: -grainX, top: -grainY, width: W + 600, height: H + 600, objectFit: "fill" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fadeIn, fadeOut, reverseCut) }} />
    </AbsoluteFill>
  );
};
