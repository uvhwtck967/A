import { Easing, interpolate } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** 0..1 progress between seconds a..b */
export const prog = (t: number, a: number, b: number, e = ease) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

/** visibility window: fade in over [a, a+fi], fade out over [b-fo, b] */
export const win = (t: number, a: number, b: number, fi = 0.5, fo = 0.5) =>
  Math.min(prog(t, a, a + fi, easeInOut), 1 - prog(t, b - fo, b, easeInOut));

export const GOLD = "#d8b46a";
export const GOLD_DIM = "#8a6f3e";
export const IVORY = "#efe6d2";
export const BG = "#0a0a1e";

export const GOLD_TEXT: React.CSSProperties = {
  background: "linear-gradient(180deg,#fff4d6 0%,#efd08a 40%,#c3913d 75%,#f5dfa4 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Camera keyframe: [time, focusX, focusY, zoom, screenX, screenY] (focus in displayed card coords) */
export type Key = [number, number, number, number, number, number];
export type Cam = { fx: number; fy: number; z: number; sx: number; sy: number };

export const camAt = (keys: Key[], t: number): Cam => {
  if (t <= keys[0][0]) return toCam(keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b[0]) {
      const p = prog(t, a[0], b[0], easeInOut);
      return {
        fx: lerp(a[1], b[1], p),
        fy: lerp(a[2], b[2], p),
        z: Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p)),
        sx: lerp(a[4], b[4], p),
        sy: lerp(a[5], b[5], p),
      };
    }
  }
  return toCam(keys[keys.length - 1]);
};
const toCam = (k: Key): Cam => ({ fx: k[1], fy: k[2], z: k[3], sx: k[4], sy: k[5] });
