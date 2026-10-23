import React from "react";
import type { Generated, LayerProps } from "../../engine/types";
import GEN from "./generated.json";

/* I 魔术师 — card-specific animation, drawn inside the picture in card coordinates.
 * openT = seconds since the opening began. Use g.sc / g.box to place things from scan px,
 * url("<file>.png") for sprites cut by restyle.py, fx.level("<name>") to react to shot fx tags. */
const gen = GEN as Generated;

export const Layers: React.FC<LayerProps> = () => <g />;
