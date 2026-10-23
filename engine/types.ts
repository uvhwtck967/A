import type React from "react";

type P = [number, number];
type Box = [number, number, number, number];

/** Everything about one card that is data, not code. Lives in cards/<id>/card.json. Coordinates are scan pixels. */
export type Meta = {
  id: string; // "13-death"
  index: number; // 13 — slot in the atlas
  numeral: string; // "XIII"
  nameZh: string;
  nameEn: string; // printed on the card label
  /** picture interior inside the scan's printed frame */
  frame: Box;
  /** the three symbols named by the hook, in order */
  halos: { at: P; r: number; also?: P[] }[]; // also: more rings lit together (e.g. both pillars)
  summary: { upright: [string, string]; reversed: [string, string] };
  reverseBrightness?: number;
  /** reversed tint: saturation (default 0.55) and hue shift in degrees (default -30) */
  reverseLook?: { saturate?: number; hue?: number };
  /** reversed card crossfades to this image (file in public/cards/<id>/), e.g. "art_night.png" from restyle look "natural" */
  reverseArt?: string;
  /** false: the reversed card keeps its upright colours and brightness */
  reverseTint?: boolean;
  /** atlas slots already published (lit dim gold); this card is lit bright */
  collected: number[];
  teaser: { index: number; numeral: string; nameZh: string; nameEn: string; question: string; questionEn: string; art?: string };
  ambient: {
    radiant?: { at: P; r: number; rays?: number; reverseDark?: number };
    water?: { box: Box; n?: number };
    glint?: { at: P };
    ripples?: Ripple[];
  };
};

export type Ripple = {
  name: string; // key into generated.json "sky"
  box: Box;
  /** "y": vertical waves travelling along x (a banner on a pole at the left); "x": horizontal sway growing downward (hanging vines) */
  axis: "y" | "x";
  amp: number; // idle amplitude (card units)
  boost: number; // added while its fx is active
  fx: string; // shot fx name that boosts it
  sound?: "flap" | "rustle";
  reveal?: { image: string; box: Box; center: P; fxDraw: string; fxLit: string };
};

/** what generated.json (written by scripts/restyle.py) contains */
export type Generated = { sprites: Record<string, Box>; sky: Record<string, [number, number, number]> };

export type Geometry = {
  PIC: { x: number; y: number; w: number; h: number };
  sc: (x: number, y: number) => readonly [number, number];
  box: (b: number[]) => { x: number; y: number; w: number; h: number };
  labelY: number;
};

export type FxApi = {
  /** 0..1 while a shot carrying `name` is on screen */
  level: (name: string, fi?: number, fo?: number) => number;
  /** 0..1 progress through the current shot carrying `name`, or null */
  prog: (name: string) => number | null;
  /** seconds since the current shot carrying `name` began, or null */
  since?: (name: string) => number | null;
};

/** props every card-specific layer receives (drawn inside the picture, in card coordinates) */
export type LayerProps = {
  t: number; // episode time
  openT: number; // seconds since the opening action began (large when the scene is at rest)
  uid: string;
  g: Geometry;
  fx: FxApi;
  cold: number;
  url: (file: string) => string; // public/cards/<id>/<file>
};

export type CardModule = {
  meta: Meta;
  plan: { PLAN: any[]; impacts?: number[] };
  gen: Generated;
  /** extra images to preload (file names inside public/cards/<id>/) */
  images: string[];
  Layers?: React.FC<LayerProps>;
};
