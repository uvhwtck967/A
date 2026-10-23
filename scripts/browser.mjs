// Headless browser used for rendering.
//   1. REMOTION_BROWSER=<path to chrome / msedge / chromium>  (environment variable) wins
//   2. otherwise the first installed Chrome / Edge found below
//   3. otherwise null → Remotion downloads its own "Chrome Headless Shell" on first run (needs internet once)
// Chrome is preferred over Edge: Edge auto-updates in the background and then fails to launch mid-session.
import fs from "fs";
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
export const BROWSER = process.env.REMOTION_BROWSER || CANDIDATES.find((p) => fs.existsSync(p)) || null;
