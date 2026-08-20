const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

function createPNG(size) {
  const r = 249, g = 115, b = 22;
  const rawData = Buffer.alloc(size * size * 4 + size);
  let offset = 0;
  for (let y = 0; y < size; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < size; x++) {
      const cx = x - size / 2, cy = y - size / 2;
      if (cx * cx + cy * cy <= (size / 2) * (size / 2)) {
        const w = size * 0.38;
        const inText = Math.abs(cx) < w / 2 && Math.abs(cy) < w * 0.4;
        if (inText) {
          rawData[offset++] = 255; rawData[offset++] = 255;
          rawData[offset++] = 255; rawData[offset++] = 255;
        } else {
          rawData[offset++] = r; rawData[offset++] = g;
          rawData[offset++] = b; rawData[offset++] = 255;
        }
      } else {
        rawData[offset++] = 0; rawData[offset++] = 0;
        rawData[offset++] = 0; rawData[offset++] = 0;
      }
    }
  }
  const deflated = zlib.deflateSync(rawData);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; ihdrData[9] = 6; ihdrData[10] = 0;
  ihdrData[11] = 0; ihdrData[12] = 0;

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type);
    const crcData = Buffer.concat([typeB, data]);
    let c = 0xFFFFFFFF;
    for (let i = 0; i < crcData.length; i++) {
      c ^= crcData[i];
      for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
    }
    const crc = Buffer.alloc(4); crc.writeUInt32BE((c ^ 0xFFFFFFFF) >>> 0, 0);
    return Buffer.concat([len, typeB, data, crc]);
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdrData),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

sizes.forEach(size => {
  const png = createPNG(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`icon-${size}x${size}.png (${png.length} bytes)`);
});

console.log('Done!');
