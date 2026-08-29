import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';

function decodeRgba(file) {
  const bytes = fs.readFileSync(file); let offset = 8; let width = 0; let height = 0; let colorType = -1; const idat = [];
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset); const type = bytes.toString('ascii', offset + 4, offset + 8); const data = bytes.subarray(offset + 8, offset + 8 + length); offset += length + 12;
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); assert.equal(data[8], 8); colorType = data[9]; }
    if (type === 'IDAT') idat.push(data);
    if (type === 'IEND') break;
  }
  assert.equal(colorType, 6, `${file} must be RGBA`);
  const stride = width * 4; const raw = zlib.inflateSync(Buffer.concat(idat)); const pixels = Buffer.alloc(stride * height); let cursor = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[cursor++]; const row = pixels.subarray(y * stride, (y + 1) * stride); const previous = y ? pixels.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x += 1) {
      const left = x >= 4 ? row[x - 4] : 0; const up = previous[x] || 0; const upLeft = x >= 4 ? previous[x - 4] || 0 : 0; const value = raw[cursor++];
      const estimate = left + up - upLeft; const paeth = Math.abs(estimate - left) <= Math.abs(estimate - up) && Math.abs(estimate - left) <= Math.abs(estimate - upLeft) ? left : Math.abs(estimate - up) <= Math.abs(estimate - upLeft) ? up : upLeft;
      row[x] = filter === 0 ? value : filter === 1 ? (value + left) & 255 : filter === 2 ? (value + up) & 255 : filter === 3 ? (value + Math.floor((left + up) / 2)) & 255 : (value + paeth) & 255;
    }
  }
  return { width, height, pixels };
}

function visibleAverage(image) {
  let red = 0; let green = 0; let blue = 0; let count = 0;
  for (let i = 0; i < image.pixels.length; i += 4) {
    if (image.pixels[i + 3] < 16) continue;
    red += image.pixels[i]; green += image.pixels[i + 1]; blue += image.pixels[i + 2]; count += 1;
  }
  return { red: red / count, green: green / count, blue: blue / count, count };
}

const water = decodeRgba('assets/block-icons/water.png');
const lava = decodeRgba('assets/block-icons/lava.png');
const redstone = decodeRgba('assets/block-icons/redstone_wire.png');
for (const image of [water, lava, redstone]) assert.deepEqual([image.width, image.height], [16, 16]);
const waterColor = visibleAverage(water); const lavaColor = visibleAverage(lava); const redstoneColor = visibleAverage(redstone);
assert.ok(waterColor.blue > waterColor.red * 2 && waterColor.blue > waterColor.green * 1.35, 'water icon must be blue');
assert.ok(lavaColor.red > lavaColor.green * 1.35 && lavaColor.green > lavaColor.blue * 3, 'lava icon must be orange');
assert.ok(redstoneColor.red > redstoneColor.green * 5 && redstoneColor.red > redstoneColor.blue * 7, 'redstone icon must be red');
assert.ok(redstoneColor.count > 8, 'redstone icon must contain a visible wire');
console.log(`BLOCK_ICONS PASS square=3 water=blue lava=orange redstone=red visible=${redstoneColor.count}`);
