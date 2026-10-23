import { continueRender, delayRender, staticFile } from "remotion";

const fonts: [string, string, string][] = [
  ["Perpetua Titling", "fonts/PERTILI.TTF", "300"],
  ["GaramondIt", "fonts/GARAIT.TTF", "400"],
  ["HanSerif", "fonts/serif-light.otf", "300"],
  ["HanSerif", "fonts/serif-medium.otf", "500"],
  ["HanSerif", "fonts/serif-semibold.otf", "600"],
];

if (typeof window !== "undefined") {
  const h = delayRender("fonts");
  Promise.all(
    fonts.map(([fam, file, weight]) =>
      new FontFace(fam, `url(${staticFile(file)})`, { weight }).load().then((f) => (document.fonts as any).add(f))
    )
  )
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
}

export const TITLE = "'Perpetua Titling', serif";
export const ITAL = "GaramondIt, serif";
export const HAN = "HanSerif, serif";
