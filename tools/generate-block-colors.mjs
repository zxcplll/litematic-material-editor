import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const assetsRoot = path.resolve(process.argv[2] || '');
const output = path.resolve(process.argv[3] || 'block-colors-26.2.js');
if (!assetsRoot || !fs.existsSync(assetsRoot)) throw new Error('Usage: node tools/generate-block-colors.mjs <extracted-client-root> [output]');
const mc = path.join(assetsRoot, 'assets', 'minecraft');
const blockstatesDir = path.join(mc, 'blockstates');
const modelsDir = path.join(mc, 'models');
const texturesDir = path.join(mc, 'textures');

function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } }
function namesFromCatalog() {
  const source = fs.readFileSync(path.resolve('blocks-26.2.js'), 'utf8');
  return [...new Set([...source.matchAll(/'minecraft:([^']+)'/g)].map((match) => match[1]))];
}
function firstModel(value) {
  if (Array.isArray(value)) return firstModel(value[0]);
  if (value && typeof value === 'object') return value.model || firstModel(Object.values(value)[0]);
  return typeof value === 'string' ? value : null;
}
const modelCache = new Map();
const tintCache = new Map();
function modelTextures(modelName, stack = new Set()) {
  const key = modelName.replace(/^minecraft:/, '');
  if (modelCache.has(key)) return modelCache.get(key);
  if (stack.has(key)) return {};
  const file = path.join(modelsDir, `${key}.json`);
  const model = readJson(file);
  if (!model) return {};
  const nextStack = new Set(stack).add(key);
  const textures = model.parent ? { ...modelTextures(model.parent, nextStack) } : {};
  Object.assign(textures, model.textures || {});
  modelCache.set(key, textures);
  return textures;
}
function modelHasTint(modelName, stack = new Set()) {
  const key = modelName.replace(/^minecraft:/, '');
  if (tintCache.has(key)) return tintCache.get(key);
  if (stack.has(key)) return false;
  const model = readJson(path.join(modelsDir, `${key}.json`));
  if (!model) return false;
  const ownTint = JSON.stringify(model.elements || []).includes('tintindex');
  const tinted = ownTint || Boolean(model.parent && modelHasTint(model.parent, new Set(stack).add(key)));
  tintCache.set(key, tinted);
  return tinted;
}
function resolveTexture(textures, key, depth = 0) {
  if (!key || depth > 8) return null;
  const value = textures[key] || key;
  if (value && typeof value === 'object') return resolveTexture(textures, value.sprite || value.texture, depth + 1);
  if (typeof value !== 'string') return null;
  if (value.startsWith('#')) return resolveTexture(textures, value.slice(1), depth + 1);
  return value.replace(/^minecraft:/, '').replace(/^textures\//, '').replace(/\.png$/, '');
}
function representativeTexture(textures) {
  const preferred = ['side', 'all', 'particle', 'front', 'texture', 'wall', 'top', 'up', 'bottom', 'down'];
  for (const key of preferred) { if (!Object.hasOwn(textures, key)) continue; const texture = resolveTexture(textures, key); if (texture) return texture; }
  for (const key of Object.keys(textures)) { const texture = resolveTexture(textures, key); if (texture) return texture; }
  return null;
}

const pngCache = new Map();
function averagePng(textureName) {
  if (pngCache.has(textureName)) return pngCache.get(textureName);
  const file = path.join(texturesDir, `${textureName}.png`);
  if (!fs.existsSync(file)) return null;
  const bytes = fs.readFileSync(file); let offset = 8; let width = 0; let height = 0; let bitDepth = 8; let colorType = 6; const idat = []; let palette = null; let transparency = null;
  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset); const type = bytes.toString('ascii', offset + 4, offset + 8); const data = bytes.subarray(offset + 8, offset + 8 + length); offset += 12 + length;
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    if (type === 'IDAT') idat.push(data);
    if (type === 'PLTE') palette = data;
    if (type === 'tRNS') transparency = data;
    if (type === 'IEND') break;
  }
  if (!width || !height || !idat.length || ![0, 2, 3, 4, 6].includes(colorType)) return null;
  const channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[colorType]; const bytesPerPixel = Math.max(1, Math.ceil((channels * bitDepth) / 8)); const stride = Math.ceil(width * channels * bitDepth / 8); const raw = zlib.inflateSync(Buffer.concat(idat)); let previous = Buffer.alloc(stride); let cursor = 0; let r = 0; let g = 0; let b = 0; let weight = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[cursor++]; const row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x += 1) {
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0; const up = previous[x] || 0; const upLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] || 0 : 0; const value = raw[cursor++];
      const estimate = left + up - upLeft; const leftDistance = Math.abs(estimate - left); const upDistance = Math.abs(estimate - up); const diagonalDistance = Math.abs(estimate - upLeft); const paeth = leftDistance <= upDistance && leftDistance <= diagonalDistance ? left : upDistance <= diagonalDistance ? up : upLeft;
      row[x] = filter === 0 ? value : filter === 1 ? (value + left) & 255 : filter === 2 ? (value + up) & 255 : filter === 3 ? (value + Math.floor((left + up) / 2)) & 255 : (value + paeth) & 255;
    }
    const sample = (position) => { if (bitDepth === 8) return row[position]; if (bitDepth === 16) return row[position * 2]; const perByte = 8 / bitDepth; const shift = (perByte - 1 - (position % perByte)) * bitDepth; return (row[Math.floor(position / perByte)] >> shift) & ((1 << bitDepth) - 1); };
    for (let x = 0; x < width; x += 1) {
      let red; let green; let blue; let alpha = 255;
      if (colorType === 3) { const indexValue = sample(x); const pi = indexValue * 3; red = palette?.[pi] ?? 128; green = palette?.[pi + 1] ?? 128; blue = palette?.[pi + 2] ?? 128; alpha = transparency?.[indexValue] ?? 255; }
      else if (colorType === 0 || colorType === 4) { const value = sample(x * channels); red = green = blue = bitDepth < 8 ? Math.round(value * 255 / ((1 << bitDepth) - 1)) : value; if (colorType === 4) alpha = sample(x * channels + 1); }
      else { const i = x * channels; red = sample(i); green = sample(i + 1); blue = sample(i + 2); if (colorType === 6) alpha = sample(i + 3); }
      const opacity = alpha / 255; if (opacity < 0.08) continue; r += red * opacity; g += green * opacity; b += blue * opacity; weight += opacity;
    }
    previous = row;
  }
  if (!weight) return null;
  const color = `#${[r, g, b].map((value) => Math.round(value / weight).toString(16).padStart(2, '0')).join('')}`; pngCache.set(textureName, color); return color;
}

const colors = {};
const tintedBlocks = [];
for (const id of namesFromCatalog()) {
  const state = readJson(path.join(blockstatesDir, `${id}.json`));
  const modelName = firstModel(state?.variants ? Object.values(state.variants)[0] : state?.multipart?.[0]?.apply);
  const texture = modelName ? representativeTexture(modelTextures(modelName)) : null;
  const color = texture ? averagePng(texture) : null;
  if (modelName && modelHasTint(modelName)) tintedBlocks.push(id);
  if (color) colors[`minecraft:${id}`] = color;
}
const lines = Object.entries(colors).sort(([a], [b]) => a.localeCompare(b)).map(([id, color]) => `  ${JSON.stringify(id)}: ${JSON.stringify(color)}`);
fs.writeFileSync(output, `// Generated from Minecraft 26.2 client blockstates, models and textures.\nexport const BLOCK_COLORS_26_2 = {\n${lines.join(',\n')}\n};\n`);
console.log(`BLOCK_COLORS_GENERATED entries=${lines.length} output=${output}`);
console.log(`TINTED_MODELS entries=${tintedBlocks.length} ids=${tintedBlocks.join(',')}`);
