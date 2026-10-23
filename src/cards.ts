// Registry: every episode the project can render. Add one line per new card.
import type { CardModule } from "../engine/types";
import { card as death } from "../cards/13-death";
import { card as hangedMan } from "../cards/12-hanged-man";
import { card as highPriestess } from "../cards/02-high-priestess";
import { card as lovers } from "../cards/06-lovers";
import { card as tower } from "../cards/16-tower";

export const CARDS: CardModule[] = [death, hangedMan, highPriestess, lovers, tower];
