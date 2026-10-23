import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { Episode, episodeDuration } from "../engine/Episode";
import type { CardModule } from "../engine/types";
import { cardUrl } from "../engine/card";
import "../engine/fonts";
import { CARDS } from "./cards";

// preload every card's images before the first frame renders
if (typeof window !== "undefined") {
  for (const c of CARDS)
    for (const f of c.images) {
      const h = delayRender(`image ${c.meta.id}/${f}`);
      const im = new Image();
      im.onload = () => continueRender(h);
      im.onerror = () => continueRender(h);
      im.src = cardUrl(c.meta.id)(f);
    }
}

// props must be JSON-serialisable (Remotion strips functions), so pass the id and look the module up here
const ById: React.FC<{ id: string }> = ({ id }) => <Episode card={CARDS.find((c) => c.meta.id === id) as CardModule} />;

export const Root: React.FC = () => (
  <>
    {CARDS.map((c) => (
      <Composition key={c.meta.id} id={`card-${c.meta.id}`} component={ById} defaultProps={{ id: c.meta.id }} durationInFrames={Math.ceil(episodeDuration(c) * 30)} fps={30} width={1920} height={1080} />
    ))}
  </>
);
