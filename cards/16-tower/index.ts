import type { CardModule, Generated, Meta } from "../../engine/types";
import meta from "./card.json";
import gen from "./generated.json";
import { Layers } from "./layers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plan = require("./plan.js");

export const card: CardModule = { meta: meta as Meta, plan, gen: gen as Generated, images: ["art.png", "art_night.png", ...["crown", "yods", "flames", "bolt"].flatMap((n) => [`${n}.png`, `${n}_night.png`])], Layers };
