// writes public/noise.png — 512x512 greyscale film grain
import fs from "fs";
import zlib from "zlib";
const N = 512;
const raw = Buffer.alloc((N + 1) * N);
let s = 7;
for (let y = 0; y < N; y++) {
  raw[y * (N + 1)] = 0;
  for (let x = 0; x < N; x++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    raw[y * (N + 1) + 1 + x] = s >>> 24;
  }
}
const crc = (b) => {
  let c, crc = 0xffffffff;
  for (const v of b) { c = (crc ^ v) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; }
  return (crc ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4); ihdr[8] = 8; ihdr[9] = 0;
fs.writeFileSync("public/noise.png", Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
]));
console.log("noise.png written");
