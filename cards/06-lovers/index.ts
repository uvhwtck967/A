import type { CardModule, Generated, Meta } from "../../engine/types";
import meta from "./card.json";
import gen from "./generated.json";
import { Layers } from "./layers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plan = require("./plan.js");

export const card: CardModule = { meta: meta as Meta, plan, gen: gen as Generated, images: ["art.png", "fruit.png", "wingL.png", "wingR.png", "hands.png", "flames.png", "serpent.png"], Layers };
