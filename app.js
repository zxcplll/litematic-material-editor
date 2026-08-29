import { compound, getInt, getString, list, readLitematic, setInt, setLong, setString, tag, writeLitematic } from './nbt.js';
import { BLOCKSTATE_IDS } from './blocks-26.2.js';
import { BLOCK_NAMES_ZH } from './block-names-26.2.js';
import { BLOCK_COLORS_26_2 } from './block-colors-26.2.js';

const iconBase = 'https://assets.mcasset.cloud/1.21.5/assets/minecraft/textures/block/';
const COMMON_BLOCKS = [
  ['air', '空气'], ['stone', '石头'], ['granite', '花岗岩'], ['polished_granite', '磨制花岗岩'], ['diorite', '闪长岩'], ['polished_diorite', '磨制闪长岩'], ['andesite', '安山岩'], ['polished_andesite', '磨制安山岩'], ['deepslate', '深板岩'], ['cobbled_deepslate', '深板岩圆石'], ['polished_deepslate', '磨制深板岩'], ['tuff', '凝灰岩'], ['calcite', '方解石'], ['smooth_basalt', '平滑玄武岩'], ['bedrock', '基岩'], ['dirt', '泥土'], ['coarse_dirt', '砂土'], ['rooted_dirt', '缠根泥土'], ['grass_block', '草方块'], ['podzol', '灰化土'], ['mycelium', '菌丝体'], ['sand', '沙子'], ['red_sand', '红沙'], ['gravel', '沙砾'], ['clay', '黏土'], ['snow_block', '雪块'], ['ice', '冰'], ['packed_ice', '浮冰'], ['blue_ice', '蓝冰'], ['netherrack', '下界岩'], ['soul_sand', '灵魂沙'], ['soul_soil', '灵魂土'], ['basalt', '玄武岩'], ['blackstone', '黑石'], ['glowstone', '荧石'], ['obsidian', '黑曜石'], ['crying_obsidian', '哭泣的黑曜石'], ['end_stone', '末地石'], ['purpur_block', '紫珀块'], ['prismarine', '海晶石'], ['prismarine_bricks', '海晶石砖'], ['dark_prismarine', '暗海晶石'], ['sea_lantern', '海晶灯'], ['moss_block', '苔藓块'], ['moss_carpet', '苔藓地毯'], ['mud', '泥巴'], ['packed_mud', '泥坯'], ['mud_bricks', '泥砖'], ['terracotta', '陶瓦'], ['bricks', '砖块'], ['stone_bricks', '石砖'], ['mossy_stone_bricks', '苔石砖'], ['cracked_stone_bricks', '裂纹石砖'], ['chiseled_stone_bricks', '錾制石砖'], ['sandstone', '砂岩'], ['cut_sandstone', '切制砂岩'], ['smooth_sandstone', '平滑砂岩'], ['red_sandstone', '红砂岩'], ['cut_red_sandstone', '切制红砂岩'], ['smooth_red_sandstone', '平滑红砂岩'], ['quartz_block', '石英块'], ['smooth_quartz', '平滑石英块'], ['quartz_bricks', '石英砖'], ['iron_block', '铁块'], ['gold_block', '金块'], ['diamond_block', '钻石块'], ['emerald_block', '绿宝石块'], ['coal_block', '煤炭块'], ['lapis_block', '青金石块'], ['redstone_block', '红石块'], ['copper_block', '铜块'], ['raw_iron_block', '粗铁块'], ['raw_gold_block', '粗金块'], ['raw_copper_block', '粗铜块'], ['amethyst_block', '紫水晶块'], ['budding_amethyst', '紫水晶母岩'], ['hay_block', '干草块'], ['sponge', '海绵'], ['wet_sponge', '湿海绵'], ['honey_block', '蜂蜜块'], ['slime_block', '黏液块'], ['tnt', 'TNT'], ['crafting_table', '工作台'], ['furnace', '熔炉'], ['blast_furnace', '高炉'], ['smoker', '烟熏炉'], ['stonecutter', '切石机'], ['anvil', '铁砧'], ['chest', '箱子'], ['barrel', '木桶'], ['hopper', '漏斗'], ['dropper', '投掷器'], ['dispenser', '发射器'], ['observer', '侦测器'], ['piston', '活塞'], ['sticky_piston', '黏性活塞'], ['redstone_lamp', '红石灯'], ['lever', '拉杆'], ['torch', '火把'], ['soul_torch', '灵魂火把'], ['lantern', '灯笼'], ['soul_lantern', '灵魂灯笼'], ['ladder', '梯子'], ['scaffolding', '脚手架'], ['glass', '玻璃'], ['glass_pane', '玻璃板'], ['iron_bars', '铁栏杆'], ['rail', '铁轨'], ['powered_rail', '动力铁轨'], ['detector_rail', '探测铁轨'], ['activator_rail', '激活铁轨'], ['water', '水'], ['lava', '熔岩'], ['fire', '火'], ['soul_fire', '灵魂火'], ['oak_leaves', '橡树树叶'], ['azalea_leaves', '杜鹃树叶'], ['flowering_azalea_leaves', '盛开的杜鹃树叶'], ['cactus', '仙人掌'], ['sugar_cane', '甘蔗'], ['bamboo', '竹子'], ['kelp', '海带'], ['seagrass', '海草'], ['short_grass', '短草'], ['fern', '蕨'], ['dandelion', '蒲公英'], ['poppy', '虞美人'], ['torchflower', '火把花'], ['brown_mushroom', '棕色蘑菇'], ['red_mushroom', '红色蘑菇'], ['shulker_box', '潜影盒'], ['ender_chest', '末影箱'], ['beacon', '信标'], ['conduit', '潮涌核心'], ['sculk', '幽匿块'], ['sculk_catalyst', '幽匿催发体'], ['sculk_sensor', '幽匿感测体'], ['reinforced_deepslate', '强化深板岩'], ['trial_spawner', '试炼刷怪笼'], ['vault', '宝库']
];

function buildCatalog() {
  const commonNames = new Map(COMMON_BLOCKS);
  const map = new Map();
  for (const id of BLOCKSTATE_IDS) {
    const bare = id.replace(/^minecraft:/, '');
    map.set(bare, BLOCK_NAMES_ZH[bare] || commonNames.get(bare) || bare.split('_').map(part => part[0]?.toUpperCase() + part.slice(1)).join(' '));
  }
  return [...map].map(([id, name]) => ({ id: `minecraft:${id}`, name })).filter(item => !isAirId(item.id));
}
const SHAPE_NAMES = { full: '普通方块', slab: '半砖', stairs: '台阶', trapdoor: '活板门', door: '门', fence: '栅栏', wall: '墙', pane: '玻璃板', button: '按钮', pressure_plate: '压力板', sign: '告示牌', carpet: '地毯', rail: '铁轨', plant: '植物', fluid: '流体', other: '特殊方块' };
const SHAPE_DEFAULTS = { full: 'minecraft:stone', slab: 'minecraft:stone_slab', stairs: 'minecraft:stone_stairs', trapdoor: 'minecraft:oak_trapdoor', door: 'minecraft:oak_door', fence: 'minecraft:oak_fence', wall: 'minecraft:cobblestone_wall', pane: 'minecraft:glass_pane', button: 'minecraft:stone_button', pressure_plate: 'minecraft:stone_pressure_plate', sign: 'minecraft:oak_sign', carpet: 'minecraft:white_carpet', rail: 'minecraft:rail', plant: 'minecraft:grass', fluid: 'minecraft:water' };
const LOCAL_BLOCK_ICONS = { water: 'assets/block-icons/water.png', lava: 'assets/block-icons/lava.png', redstone_wire: 'assets/block-icons/redstone_wire.png' };
const ICON_ALIASES = { water: 'water_still', lava: 'lava_still', fire: 'fire_0', soul_fire: 'soul_fire_0', stone_brick_wall: 'stone_bricks', stone_brick_stairs: 'stone_bricks', stone_pressure_plate: 'stone', mossy_stone_brick_wall: 'mossy_stone_bricks', cobblestone_wall: 'cobblestone', deepslate_brick_wall: 'deepslate_bricks', deepslate_tile_wall: 'deepslate_tiles', grass_block: 'grass_block_top', redstone_wire: 'redstone_dust_line0', oak_wall_sign: 'oak_planks' };
const isAirId = (id) => /^(minecraft:)?(air|cave_air|void_air)$/.test(id);
function blockShape(id) {
  const bare = id.replace(/^minecraft:/, '');
  if (isAirId(id)) return 'other';
  if (bare.endsWith('_slab')) return 'slab';
  if (bare.endsWith('_stairs')) return 'stairs';
  if (bare.endsWith('_trapdoor')) return 'trapdoor';
  if (bare.endsWith('_door')) return 'door';
  if (bare.endsWith('_fence_gate') || bare.endsWith('_fence')) return 'fence';
  if (bare.endsWith('_wall')) return 'wall';
  if (bare.endsWith('_pane') || bare.endsWith('_bars') || bare === 'iron_bars') return 'pane';
  if (bare.endsWith('_button')) return 'button';
  if (bare.endsWith('_pressure_plate')) return 'pressure_plate';
  if (bare.endsWith('_hanging_sign') || bare.endsWith('_sign')) return 'sign';
  if (bare.endsWith('_carpet') || bare === 'moss_carpet') return 'carpet';
  if (/(^|_)(rail|powered_rail|detector_rail|activator_rail)$/.test(bare)) return 'rail';
  if (bare === 'water' || bare === 'lava') return 'fluid';
  if (/(leaves|sapling|flower|grass|fern|mushroom|cactus|sugar_cane|bamboo|kelp|vine|lichen|fungus|roots)$/.test(bare)) return 'plant';
  return 'full';
}
function shapeLabel(id) { return SHAPE_NAMES[blockShape(id)] || SHAPE_NAMES.other; }
const CATALOG = buildCatalog();
const CATALOG_MAP = new Map(CATALOG.map(item => [item.id, item]));

function blockId(paletteEntry) { return getString(paletteEntry, 'Name', 'minecraft:air'); }
function blockName(id) { return CATALOG_MAP.get(id)?.name || id.replace(/^minecraft:/, '').split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
function iconCandidates(id) {
  const bare = id.replace(/^minecraft:/, '');
  const candidates = [ICON_ALIASES[bare]];
  if (bare.endsWith('_pressure_plate')) candidates.push(bare.replace(/_pressure_plate$/, ''));
  if (bare.endsWith('_fence_gate')) candidates.push(`${bare.replace(/_fence_gate$/, '')}_planks`);
  if (bare.endsWith('_bed')) candidates.push(`${bare.replace(/_bed$/, '')}_wool`);
  if (bare.endsWith('_wall_sign')) candidates.push(`${bare.replace(/_wall_sign$/, '')}_planks`);
  if (bare.endsWith('_wall')) candidates.push(bare.replace(/_wall$/, ''));
  if (bare.endsWith('_stairs')) candidates.push(bare.replace(/_stairs$/, ''));
  if (bare.endsWith('_slab')) candidates.push(bare.replace(/_slab$/, ''));
  candidates.push(bare);
  const remote = [...new Set(candidates.filter(Boolean))].map(path => `${iconBase}${path}.png`);
  return LOCAL_BLOCK_ICONS[bare] ? [LOCAL_BLOCK_ICONS[bare], ...remote] : remote;
}
function fallbackColor(id) {
  const bare = id.replace(/^minecraft:/, '');
  const tintOverrides = {
    grass_block: '#91bd59', short_grass: '#91bd59', tall_grass: '#91bd59', fern: '#91bd59', large_fern: '#91bd59', bush: '#91bd59', potted_fern: '#91bd59',
    oak_leaves: '#77ab2f', jungle_leaves: '#77ab2f', acacia_leaves: '#77ab2f', dark_oak_leaves: '#77ab2f', mangrove_leaves: '#77ab2f', vine: '#77ab2f',
    birch_leaves: '#80a755', spruce_leaves: '#619961', leaf_litter: '#a37546',
    water: '#3f76e4', bubble_column: '#3f76e4', water_cauldron: '#3f76e4', lily_pad: '#208030', redstone_wire: '#c62820',
    sea_lantern: '#acc8be', glowstone: '#ac8354', sugar_cane: '#91bd59', attached_melon_stem: '#e0c71c', attached_pumpkin_stem: '#e0c71c'
  };
  if (tintOverrides[bare]) return tintOverrides[bare];
  if (BLOCK_COLORS_26_2[id]) return BLOCK_COLORS_26_2[id];
  const colorFamilies = { white: '#e9edf0', orange: '#d9814b', magenta: '#a94e9c', light_blue: '#6aaed0', yellow: '#d8bd4d', lime: '#88b83f', pink: '#d883a3', gray: '#646b70', light_gray: '#a8afb0', cyan: '#3eaaa6', purple: '#8552a5', blue: '#4b70bb', brown: '#80563e', green: '#5c9a4b', red: '#b84c45', black: '#25272c' };
  const colorFamily = Object.entries(colorFamilies).find(([name]) => bare.startsWith(`${name}_`));
  if (colorFamily) return colorFamily[1];
  const materialColors = [
    [/^prismarine_bricks?/, '#4ca6a4'], [/^prismarine/, '#579b91'], [/^dark_prismarine/, '#2f7478'], [/^sea_lantern/, '#a8e7cf'],
    [/^amethyst/, '#9867c8'], [/^purpur/, '#a875ad'], [/^copper|^raw_copper/, '#b96c51'], [/^quartz|^calcite|^diorite/, '#d8d8d0'],
    [/^deepslate/, '#4c5559'], [/^blackstone/, '#403b45'], [/^netherrack/, '#864d4b'], [/^end_stone/, '#d9d18f'], [/^sand|^sandstone/, '#d2af72'],
    [/^obsidian/, '#29203f'], [/^glowstone/, '#f1c768'], [/^lapis/, '#416fbd'], [/^diamond/, '#5bc5d1'], [/^emerald/, '#49ad69'],
    [/^redstone/, '#b94145'], [/^honey/, '#e0a63f'], [/^slime/, '#76bd62'], [/^tuff/, '#888779'], [/^clay/, '#9da9ae']
  ];
  const materialColor = materialColors.find(([pattern]) => pattern.test(bare));
  if (materialColor) return materialColor[1];
  if (bare.includes('water')) return '#3c86b6';
  if (bare.includes('lava')) return '#d96a28';
  if (bare.includes('grass') || bare.includes('leaves') || bare.includes('moss')) return '#579354';
  if (bare.includes('wood') || bare.includes('planks') || bare.includes('log')) return '#a8794f';
  if (bare.includes('glass') || bare.includes('pane')) return '#86c4c6';
  if (bare.includes('redstone')) return '#ba4e48';
  if (bare.includes('snow') || bare.includes('ice')) return '#b7d8e6';
  if (bare.includes('gold') || bare.includes('yellow')) return '#d4a947';
  if (bare.includes('iron') || bare.includes('stone') || bare.includes('brick')) return '#7b8587';
  let hash = 0; for (const char of bare) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `hsl(${hash % 360} 28% 43%)`;
}
function swapIcon(image) {
  const candidates = JSON.parse(image.dataset.iconCandidates || '[]'); const next = Number(image.dataset.iconIndex || 0) + 1;
  if (candidates[next]) { image.dataset.iconIndex = String(next); image.src = candidates[next]; }
  else { const fallback = document.createElement('span'); fallback.className = 'block-icon missing-icon'; fallback.style.background = fallbackColor(image.dataset.blockId || 'minecraft:unknown'); fallback.style.width = `${image.width}px`; fallback.style.height = `${image.height}px`; fallback.title = image.dataset.blockId || ''; image.replaceWith(fallback); }
}
globalThis.swapIcon = swapIcon;
function regionDimensions(region) {
  const size = region.value.Size?.value || {};
  return { x: Math.abs(getInt(size, 'x', 1)), y: Math.abs(getInt(size, 'y', 1)), z: Math.abs(getInt(size, 'z', 1)) };
}
function bitsForPalette(length) { return Math.max(2, Math.ceil(Math.log2(Math.max(1, length)))); }
function unpackStates(region) {
  const palette = region.value.BlockStatePalette?.value?.items || [];
  const longs = region.value.BlockStates?.value || new BigInt64Array(0);
  const { x, y, z } = regionDimensions(region);
  const total = x * y * z;
  const bits = bitsForPalette(palette.length);
  const mask = (1n << BigInt(bits)) - 1n;
  const values = new Uint32Array(total);
  for (let i = 0; i < total; i += 1) {
    const bit = i * bits; const index = Math.floor(bit / 64); const offset = bit % 64;
    let word = BigInt.asUintN(64, longs[index] ?? 0n) >> BigInt(offset);
    if (offset + bits > 64) word |= BigInt.asUintN(64, longs[index + 1] ?? 0n) << BigInt(64 - offset);
    values[i] = Number(word & mask);
  }
  return { values, bits, dimensions: { x, y, z }, palette };
}
function packStates(values, bits) {
  const length = Math.ceil((values.length * bits) / 64);
  const longs = new BigInt64Array(length);
  const mask = (1n << BigInt(bits)) - 1n;
  for (let i = 0; i < values.length; i += 1) {
    const bit = i * bits; const index = Math.floor(bit / 64); const offset = bit % 64; const value = BigInt(values[i]) & mask;
    let word = BigInt.asUintN(64, longs[index]) | (value << BigInt(offset));
    longs[index] = BigInt.asIntN(64, word);
    if (offset + bits > 64) longs[index + 1] = BigInt.asIntN(64, BigInt.asUintN(64, longs[index + 1]) | (value >> BigInt(64 - offset)));
  }
  return tag(12, longs, 'BlockStates');
}
function cloneTag(node, name = node?.name || '') {
  if (!node) return null;
  if (node.type === 7) return tag(node.type, new Int8Array(node.value), name);
  if (node.type === 11) return tag(node.type, new Int32Array(node.value), name);
  if (node.type === 12) return tag(node.type, new BigInt64Array(node.value), name);
  if (node.type === 9) return list(node.value.itemType, node.value.items.map(item => node.value.itemType === 10 ? Object.fromEntries(Object.entries(item).map(([key, child]) => [key, cloneTag(child, key)])) : item), name);
  if (node.type === 10) return compound(Object.fromEntries(Object.entries(node.value).map(([key, child]) => [key, cloneTag(child, key)])), name);
  return tag(node.type, node.value, name);
}
function ensurePaletteEntry(region, id, sourceProperties = null) {
  const palette = region.value.BlockStatePalette.value.items;
  const signature = (properties) => Object.entries(properties?.value || {}).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value.value}`).join('|');
  const wanted = signature(sourceProperties);
  const existing = palette.findIndex(entry => blockId(entry) === id && signature(entry.Properties) === wanted);
  if (existing >= 0) return existing;
  const entry = { Name: tag(8, id, 'Name') };
  if (sourceProperties) entry.Properties = cloneTag(sourceProperties, 'Properties');
  palette.push(entry);
  return palette.length - 1;
}
function replaceRegionBlocks(region, sourceId, targetId, scopeLayer = null, preserveProperties = true) {
  const data = unpackStates(region); let changed = 0;
  data.values.forEach((paletteIndex, index) => {
    const layer = Math.floor(index / (data.dimensions.x * data.dimensions.z));
    if (blockId(data.palette[paletteIndex]) !== sourceId || (scopeLayer !== null && layer !== scopeLayer)) return;
    const properties = preserveProperties && !isAirId(targetId) ? data.palette[paletteIndex]?.Properties : null;
    data.values[index] = ensurePaletteEntry(region, targetId, properties);
    changed += 1;
  });
  if (changed) region.value.BlockStates = packStates(data.values, bitsForPalette(region.value.BlockStatePalette.value.items.length));
  return changed;
}
function countRegion(region) {
  const decoded = unpackStates(region); const all = new Map(); const layers = new Map();
  decoded.values.forEach((paletteIndex, index) => {
    const layer = Math.floor(index / (decoded.dimensions.x * decoded.dimensions.z));
    all.set(paletteIndex, (all.get(paletteIndex) || 0) + 1);
    if (!layers.has(layer)) layers.set(layer, new Map());
    const row = layers.get(layer); row.set(paletteIndex, (row.get(paletteIndex) || 0) + 1);
  });
  return { ...decoded, counts: all, layers };
}

function makeSample() {
  const sampleEntry = (id, properties = {}) => { const value = { Name: tag(8, id, 'Name') }; if (Object.keys(properties).length) value.Properties = compound(Object.fromEntries(Object.entries(properties).map(([key, item]) => [key, tag(8, String(item), key)])), 'Properties'); return compound(value); };
  const palette = [
    sampleEntry('minecraft:stone'), sampleEntry('minecraft:oak_planks'), sampleEntry('minecraft:glowstone'),
    sampleEntry('minecraft:stone_slab', { type: 'bottom', waterlogged: 'false' }), sampleEntry('minecraft:oak_stairs', { facing: 'east', half: 'bottom', shape: 'straight', waterlogged: 'false' }),
    sampleEntry('minecraft:oak_trapdoor', { facing: 'north', half: 'top', open: 'false', powered: 'false', waterlogged: 'false' }), sampleEntry('minecraft:redstone_wire', { north: 'side', east: 'side', south: 'side', west: 'side', power: '15' }),
    sampleEntry('minecraft:oak_fence'), sampleEntry('minecraft:glass_pane'), sampleEntry('minecraft:oak_door', { facing: 'south', half: 'lower', hinge: 'left', open: 'false', powered: 'false' }),
    sampleEntry('minecraft:rail', { shape: 'east_west', powered: 'false', waterlogged: 'false' }), sampleEntry('minecraft:fern'), sampleEntry('minecraft:white_bed', { facing: 'south', part: 'foot', occupied: 'false' }),
    sampleEntry('minecraft:stone_button', { face: 'wall', facing: 'north', powered: 'false' }), sampleEntry('minecraft:cobblestone_wall')
  ];
  const values = new Uint32Array(48); for (let i = 0; i < values.length; i += 1) { if (i % 37 === 0) values[i] = 14; else if (i % 31 === 0) values[i] = 13; else if (i % 29 === 0) values[i] = 12; else if (i % 23 === 0) values[i] = 2; else if (i % 19 === 0) values[i] = 9; else if (i % 17 === 0) values[i] = 6; else if (i % 13 === 0) values[i] = 10; else if (i % 11 === 0) values[i] = 4; else if (i % 9 === 0) values[i] = 5; else if (i % 7 === 0) values[i] = 3; else if (i % 5 === 0) values[i] = 7; else if (i % 4 === 0) values[i] = 8; else if (i % 3 === 0) values[i] = 11; else if (i % 2 === 0) values[i] = 1; else values[i] = 0; }
  const region = compound({ Position: compound({ x: tag(3, 0), y: tag(3, 0), z: tag(3, 0) }), Size: compound({ x: tag(3, 4), y: tag(3, 3), z: tag(3, 4) }), BlockStatePalette: list(10, palette.map(entry => entry.value)), BlockStates: packStates(values, bitsForPalette(palette.length)) });
  const metadata = compound({ Name: tag(8, '示例建筑', 'Name'), Author: tag(8, 'Litematic Editor', 'Author'), Description: tag(8, '浏览器端示例蓝图', 'Description'), RegionCount: tag(3, 1), TotalBlocks: tag(3, values.length), TotalVolume: tag(3, values.length), EnclosingSize: compound({ x: tag(3, 4), y: tag(3, 3), z: tag(3, 4) }) });
  return compound({ MinecraftDataVersion: tag(3, 3953), Version: tag(3, 6), SubVersion: tag(3, 0), Metadata: metadata, Regions: compound({ '示例区域': region }) });
}

const state = { root: null, fileName: '示例建筑.litematic', projectName: '示例建筑', scope: 'all', rows: [], sourceId: '', targetId: 'minecraft:stone', pendingDeleteId: '', filter: '', filterTarget: '', advanced: false };
const $ = (id) => document.getElementById(id);
const fmt = (value) => new Intl.NumberFormat('zh-CN').format(value);
function fileSize(bytes) { return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`; }
function allRegions() { return Object.values(state.root?.value?.Regions?.value || {}); }
function projectStats() {
  const all = new Map(); const layers = new Map(); let total = 0; let volume = 0; let maxLayer = 0;
  for (const region of allRegions()) {
    const data = countRegion(region); volume += data.values.length; maxLayer = Math.max(maxLayer, data.dimensions.y - 1);
    for (const [idx, count] of data.counts) { const id = data.palette[idx] ? blockId(data.palette[idx]) : 'minecraft:air'; if (!isAirId(id)) { total += count; all.set(id, (all.get(id) || 0) + count); } }
    for (const [layer, map] of data.layers) { if (!layers.has(layer)) layers.set(layer, new Map()); for (const [idx, count] of map) { const id = blockId(data.palette[idx]); if (!isAirId(id)) layers.get(layer).set(id, (layers.get(layer).get(id) || 0) + count); } }
  }
  const source = state.scope === 'all' ? all : (layers.get(Number(state.scope)) || new Map());
  const rows = [...source.entries()].filter(([id]) => !isAirId(id)).map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  return { rows, total, volume, layers, maxLayer };
}

const previewState = { yaw: -0.72, pitch: 0.68, zoom: 1, panX: 0, panY: 0, drag: null };
const PREVIEW_MAX_BLOCKS = 12000;
const PREVIEW_ZOOM_MIN = 0.2;
const PREVIEW_ZOOM_MAX = 12;
const PREVIEW_TILE_MAX = 96;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function previewScopeLabel() { return state.scope === 'all' ? '全部层' : `第 ${Number(state.scope) + 1} 层`; }
function collectPreviewBlocks() {
  const blocks = []; const allBlocks = []; let total = 0;
  const requestedLayer = state.scope === 'all' ? null : Number(state.scope);
  for (const region of allRegions()) {
    const data = unpackStates(region); const position = region.value.Position?.value || {};
    const ox = getInt(position, 'x', 0); const oy = getInt(position, 'y', 0); const oz = getInt(position, 'z', 0);
    let eligible = 0;
    for (let index = 0; index < data.values.length; index += 1) {
      const paletteIndex = data.values[index]; const id = blockId(data.palette[paletteIndex]);
      const layer = Math.floor(index / (data.dimensions.x * data.dimensions.z));
      if (isAirId(id)) continue;
      const y = layer; const row = index % (data.dimensions.x * data.dimensions.z);
      const block = { x: ox + (row % data.dimensions.x), y: oy + y, z: oz + Math.floor(row / data.dimensions.x), id, properties: previewProperties(data.palette[paletteIndex]) };
      allBlocks.push(block);
      if (requestedLayer === null || layer === requestedLayer) eligible += 1;
    }
    total += eligible;
    const stride = Math.max(1, Math.ceil(eligible / PREVIEW_MAX_BLOCKS)); let ordinal = 0;
    for (let index = 0; index < data.values.length; index += 1) {
      const paletteIndex = data.values[index]; const id = blockId(data.palette[paletteIndex]);
      const layer = Math.floor(index / (data.dimensions.x * data.dimensions.z));
      if (isAirId(id) || (requestedLayer !== null && layer !== requestedLayer)) continue;
      if (ordinal % stride === 0) {
        const y = layer; const row = index % (data.dimensions.x * data.dimensions.z);
        blocks.push({ x: ox + (row % data.dimensions.x), y: oy + y, z: oz + Math.floor(row / data.dimensions.x), id, properties: previewProperties(data.palette[paletteIndex]) });
      }
      ordinal += 1;
    }
  }
  const occupancy = new Map(allBlocks.map((block) => [`${block.x},${block.y},${block.z}`, block]));
  for (const block of blocks) {
    const neighbors = {};
    for (const [direction, [dx, dy, dz]] of Object.entries(PREVIEW_DIRECTIONS)) neighbors[direction] = occupancy.get(`${block.x + dx},${block.y + dy},${block.z + dz}`);
    block.connections = previewConnectionFlags(block, neighbors);
    block.attachments = previewAttachmentFlags(block, neighbors);
  }
  return { blocks, total, sampled: blocks.length < total };
}
function previewProjectPoint(point, tile, yaw = previewState.yaw, pitch = previewState.pitch) {
  const cos = Math.cos(yaw); const sin = Math.sin(yaw); const rx = point.x * cos - point.z * sin; const rz = point.x * sin + point.z * cos;
  const ground = rx + rz;
  return { x: (rx - rz) * tile, y: (ground * Math.sin(pitch) - point.y * Math.cos(pitch)) * tile, depth: ground * Math.cos(pitch) + point.y * Math.sin(pitch) };
}
function previewProperties(entry) { return Object.fromEntries(Object.entries(entry?.Properties?.value || {}).map(([key, value]) => [key, value?.value ?? ''])); }
function previewProperty(block, key, fallback = '') { return block.properties?.[key] ?? fallback; }
const PREVIEW_HORIZONTAL_DIRECTIONS = { north: [0, 0, -1], east: [1, 0, 0], south: [0, 0, 1], west: [-1, 0, 0] };
const PREVIEW_DIRECTIONS = { ...PREVIEW_HORIZONTAL_DIRECTIONS, up: [0, 1, 0], down: [0, -1, 0] };
function previewConnectableKind(kind) { return ['full', 'slab', 'stairs', 'trapdoor', 'door', 'fence', 'wall', 'pane'].includes(kind); }
function previewCanConnect(block, neighbor) {
  if (!neighbor) return false;
  const kind = previewKind(block.id);
  if (kind === 'tripwire') return ['tripwire', 'hook'].includes(previewKind(neighbor.id));
  if (!previewConnectableKind(previewKind(neighbor.id))) return false;
  if (kind === 'pane') return ['full', 'slab', 'stairs', 'trapdoor', 'door', 'fence', 'wall', 'pane'].includes(previewKind(neighbor.id));
  if (kind === 'fence') return ['full', 'fence', 'wall', 'pane'].includes(previewKind(neighbor.id));
  if (kind === 'wall') return ['full', 'fence', 'wall', 'pane'].includes(previewKind(neighbor.id));
  return false;
}
function previewConnectionFlags(block, neighbors = {}) {
  const kind = previewKind(block.id); const flags = {};
  for (const direction of Object.keys(PREVIEW_HORIZONTAL_DIRECTIONS)) {
    const stateValue = block.properties?.[direction];
    if (stateValue !== undefined) {
      flags[direction] = stateValue === 'true' || stateValue === 'low' || stateValue === 'tall';
    } else if (kind === 'pane' || kind === 'fence' || kind === 'wall' || kind === 'tripwire') {
      flags[direction] = previewCanConnect(block, neighbors[direction]);
    } else flags[direction] = false;
  }
  return flags;
}
function previewAttachmentFlags(block, neighbors = {}) {
  const flags = {};
  const kind = previewKind(block.id);
  for (const direction of Object.keys(PREVIEW_DIRECTIONS)) {
    if (block.properties?.[direction] !== undefined) flags[direction] = block.properties[direction] === 'true';
    else flags[direction] = kind === 'chorus' && previewKind(neighbors[direction]?.id || '') === 'chorus';
  }
  return flags;
}
function previewKind(id) {
  const bare = id.replace(/^minecraft:/, '');
  if (bare === 'redstone_wire') return 'redstone';
  if (bare === 'tripwire') return 'tripwire';
  if (bare === 'tripwire_hook') return 'hook';
  if (bare === 'chorus_plant') return 'chorus';
  if (bare === 'chiseled_bookshelf') return 'bookshelf';
  if (bare.endsWith('_shelf')) return 'shelf';
  if (bare === 'fire' || bare === 'soul_fire') return 'fire';
  if (bare.endsWith('_coral_wall_fan')) return 'wall_fan';
  if (bare === 'leaf_litter' || bare === 'pink_petals' || bare === 'wildflowers') return 'ground_cover';
  if (bare === 'vine' || bare === 'glow_lichen' || bare === 'sculk_vein' || bare === 'resin_clump') return 'attached';
  if (bare === 'wall_torch' || bare === 'soul_wall_torch' || bare === 'redstone_wall_torch') return 'wall_torch';
  if (/(^|_)(rail|powered_rail|detector_rail|activator_rail)$/.test(bare)) return 'rail';
  if (bare.endsWith('_slab')) return 'slab';
  if (bare.endsWith('_stairs')) return 'stairs';
  if (bare.endsWith('_trapdoor')) return 'trapdoor';
  if (bare.endsWith('_door')) return 'door';
  if (bare.endsWith('_fence_gate') || bare.endsWith('_fence')) return 'fence';
  if (bare.endsWith('_wall')) return 'wall';
  if (bare.endsWith('_pane') || bare.endsWith('_bars') || bare === 'iron_bars') return 'pane';
  if (bare.endsWith('_pressure_plate')) return 'pressure';
  if (bare.endsWith('_button')) return 'button';
  if (bare.endsWith('_carpet') || bare === 'moss_carpet') return 'carpet';
  if (bare.endsWith('_sign') || bare.endsWith('_hanging_sign')) return 'sign';
  if (bare === 'ladder') return 'ladder';
  if (bare === 'torch' || bare === 'soul_torch' || bare === 'redstone_torch' || bare === 'lantern' || bare === 'soul_lantern') return 'torch';
  if (bare === 'water' || bare === 'lava') return 'fluid';
  if (/(leaves|sapling|flower|grass|fern|mushroom|cactus|sugar_cane|bamboo|kelp|vine|lichen|fungus|roots)$/.test(bare)) return 'plant';
  if (bare.endsWith('_bed')) return 'bed';
  return 'full';
}
function previewPrismPoints(block, tile, box = {}) {
  const { x, y, z } = block; const x0 = x + (box.x0 ?? 0); const x1 = x + (box.x1 ?? 1); const y0 = y + (box.y0 ?? 0); const y1 = y + (box.y1 ?? 1); const z0 = z + (box.z0 ?? 0); const z1 = z + (box.z1 ?? 1);
  const point = (px, py, pz) => previewProjectPoint({ x: px, y: py, z: pz }, tile);
  return {
    top: [point(x0, y1, z0), point(x1, y1, z0), point(x1, y1, z1), point(x0, y1, z1)],
    left: [point(x0, y1, z0), point(x0, y1, z1), point(x0, y0, z1), point(x0, y0, z0)],
    right: [point(x1, y1, z0), point(x1, y1, z1), point(x1, y0, z1), point(x1, y0, z0)]
  };
}
function previewCubePoints(block, tile) { return previewPrismPoints(block, tile); }
function drawPreviewFace(ctx, points, fill, overlay = null) {
  ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  if (overlay) { ctx.fillStyle = overlay; ctx.fill(); }
  ctx.strokeStyle = 'rgba(4, 9, 10, .28)'; ctx.lineWidth = 0.55; ctx.stroke();
}
function drawPreviewPolygon(ctx, points, fill, stroke = 'rgba(4, 9, 10, .35)') {
  ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 0.6; ctx.stroke();
}
function drawPreviewLine(ctx, points, stroke, width = 1) { ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y); ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.stroke(); }
function drawPreviewTexture(ctx, points, id, tile) {
  if (tile < 9) return;
  let hash = 0; for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const lerp = (a, b, amount) => ({ x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount });
  ctx.save(); ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y); ctx.closePath(); ctx.clip(); ctx.strokeStyle = `rgba(255,255,255,${0.08 + (hash % 4) * .015})`; ctx.lineWidth = .45;
  for (let index = 1; index < 4; index += 1) { const amount = index / 4; const start = lerp(points[0], points[3], amount); const end = lerp(points[1], points[2], amount); ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(0,0,0,.08)'; for (let index = 1; index < 3; index += 1) { const amount = index / 3; const start = lerp(points[0], points[1], amount); const end = lerp(points[3], points[2], amount); ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke(); }
  ctx.restore();
}
function drawPreviewCuboid(ctx, block, tile, toScreen, box, color, alpha = 1) {
  const faces = previewPrismPoints(block, tile, box); const top = faces.top.map(toScreen); ctx.save(); ctx.globalAlpha = alpha; drawPreviewFace(ctx, faces.left.map(toScreen), color, 'rgba(0, 0, 0, .18)'); drawPreviewFace(ctx, faces.right.map(toScreen), color, 'rgba(0, 0, 0, .31)'); drawPreviewFace(ctx, top, color, 'rgba(255, 255, 255, .13)'); drawPreviewTexture(ctx, top, block.id, tile); ctx.restore();
}
function previewPoint(block, tile, toScreen, localX, localY, localZ) { return toScreen(previewProjectPoint({ x: block.x + localX, y: block.y + localY, z: block.z + localZ }, tile)); }
function drawPreviewShape(ctx, block, tile, toScreen) {
  const color = fallbackColor(block.id); const kind = previewKind(block.id); const facing = previewProperty(block, 'facing', 'south'); const topHalf = previewProperty(block, 'half', previewProperty(block, 'type', 'bottom')) === 'top';
  if (kind === 'slab') { drawPreviewCuboid(ctx, block, tile, toScreen, { y0: topHalf ? .5 : 0, y1: topHalf ? 1 : .5 }, color); return; }
  if (kind === 'carpet' || kind === 'pressure') {
    drawPreviewCuboid(ctx, block, tile, toScreen, { y0: .02, y1: kind === 'carpet' ? .1 : .16 }, color);
    if (block.id.endsWith('pale_moss_carpet')) for (const direction of Object.keys(PREVIEW_HORIZONTAL_DIRECTIONS)) { const height = previewProperty(block, direction, 'none'); if (height !== 'none' && height !== 'false') { const tall = height === 'tall'; const edge = direction === 'north' ? { x0: 0, x1: 1, z0: 0, z1: .12 } : direction === 'south' ? { x0: 0, x1: 1, z0: .88, z1: 1 } : direction === 'west' ? { x0: 0, x1: .12, z0: 0, z1: 1 } : { x0: .88, x1: 1, z0: 0, z1: 1 }; drawPreviewCuboid(ctx, block, tile, toScreen, { ...edge, y0: .02, y1: tall ? .35 : .2 }, color); } }
    return;
  }
  if (kind === 'stairs') {
    const baseY = topHalf ? .5 : 0; const stepY = topHalf ? 0 : .5; let step = { x0: 0, x1: 1, z0: 0, z1: .5 };
    if (facing === 'north') step = { x0: 0, x1: 1, z0: .5, z1: 1 }; else if (facing === 'east') step = { x0: 0, x1: .5, z0: 0, z1: 1 }; else if (facing === 'west') step = { x0: .5, x1: 1, z0: 0, z1: 1 };
    drawPreviewCuboid(ctx, block, tile, toScreen, { y0: baseY, y1: baseY + .5 }, color); drawPreviewCuboid(ctx, block, tile, toScreen, { ...step, y0: stepY, y1: stepY + .5 }, color); return;
  }
  if (kind === 'trapdoor') {
    const open = previewProperty(block, 'open', 'false') === 'true';
    if (!open) { drawPreviewCuboid(ctx, block, tile, toScreen, { y0: topHalf ? .8125 : 0, y1: topHalf ? 1 : .1875 }, color); return; }
    const vertical = facing === 'east' || facing === 'west' ? { x0: facing === 'east' ? .8125 : 0, x1: facing === 'east' ? 1 : .1875 } : { z0: facing === 'south' ? .8125 : 0, z1: facing === 'south' ? 1 : .1875 };
    drawPreviewCuboid(ctx, block, tile, toScreen, { ...vertical, y0: 0, y1: 1 }, color); return;
  }
  if (kind === 'door') { const panel = facing === 'east' || facing === 'west' ? { z0: .42, z1: .58 } : { x0: .42, x1: .58 }; drawPreviewCuboid(ctx, block, tile, toScreen, { ...panel, y0: 0, y1: 1 }, color); return; }
  const connections = block.connections || previewConnectionFlags(block);
  if (kind === 'fence') {
    drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .36, x1: .64, z0: .36, z1: .64, y0: 0, y1: .95 }, color);
    if (connections.north) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .43, x1: .57, z0: 0, z1: .5, y0: .32, y1: .72 }, color);
    if (connections.south) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .43, x1: .57, z0: .5, z1: 1, y0: .32, y1: .72 }, color);
    if (connections.west) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: 0, x1: .5, z0: .43, z1: .57, y0: .32, y1: .72 }, color);
    if (connections.east) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .5, x1: 1, z0: .43, z1: .57, y0: .32, y1: .72 }, color);
    return;
  }
  if (kind === 'wall') {
    const tall = Object.values(connections).some(Boolean);
    const hasWallState = Object.hasOwn(block.properties || {}, 'up') || Object.keys(PREVIEW_HORIZONTAL_DIRECTIONS).some((direction) => Object.hasOwn(block.properties || {}, direction));
    if (!hasWallState || previewProperty(block, 'up', 'true') === 'true' || tall) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .25, x1: .75, z0: .25, z1: .75, y0: 0, y1: tall ? .9 : .75 }, color);
    if (connections.north) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .38, x1: .62, z0: 0, z1: .5, y0: .1, y1: .7 }, color);
    if (connections.south) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .38, x1: .62, z0: .5, z1: 1, y0: .1, y1: .7 }, color);
    if (connections.west) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: 0, x1: .5, z0: .38, z1: .62, y0: .1, y1: .7 }, color);
    if (connections.east) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .5, x1: 1, z0: .38, z1: .62, y0: .1, y1: .7 }, color);
    return;
  }
  if (kind === 'pane') {
    // The vanilla post/noside models form a centered cross. Only true
    // connection states add a side segment reaching the block boundary.
    drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .43, x1: .57, z0: .28, z1: .72, y0: 0, y1: 1 }, color, .7);
    drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .28, x1: .72, z0: .43, z1: .57, y0: 0, y1: 1 }, color, .7);
    if (connections.north) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .43, x1: .57, z0: 0, z1: .5, y0: 0, y1: 1 }, color, .7);
    if (connections.south) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .43, x1: .57, z0: .5, z1: 1, y0: 0, y1: 1 }, color, .7);
    if (connections.west) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: 0, x1: .5, z0: .43, z1: .57, y0: 0, y1: 1 }, color, .7);
    if (connections.east) drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .5, x1: 1, z0: .43, z1: .57, y0: 0, y1: 1 }, color, .7);
    return;
  }
  if (kind === 'chorus') {
    const attached = block.attachments || previewAttachmentFlags(block); const branchColor = color;
    // A chorus plant is a narrow core with one branch for each connected face.
    drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .34, x1: .66, z0: .34, z1: .66, y0: .12, y1: .88 }, branchColor, .9);
    const branches = {
      north: { x0: .34, x1: .66, z0: 0, z1: .5, y0: .34, y1: .66 },
      south: { x0: .34, x1: .66, z0: .5, z1: 1, y0: .34, y1: .66 },
      west: { x0: 0, x1: .5, z0: .34, z1: .66, y0: .34, y1: .66 },
      east: { x0: .5, x1: 1, z0: .34, z1: .66, y0: .34, y1: .66 },
      up: { x0: .34, x1: .66, z0: .34, z1: .66, y0: .5, y1: 1 },
      down: { x0: .34, x1: .66, z0: .34, z1: .66, y0: 0, y1: .5 }
    };
    for (const [direction, enabled] of Object.entries(attached)) if (enabled) drawPreviewCuboid(ctx, block, tile, toScreen, branches[direction], branchColor, .9);
    return;
  }
  if (kind === 'shelf') {
    const shelfFacing = facing === 'east' || facing === 'west';
    const board = shelfFacing ? { z0: .08, z1: .92, y0: .18, y1: .82 } : { x0: .08, x1: .92, y0: .18, y1: .82 };
    drawPreviewCuboid(ctx, block, tile, toScreen, board, color, .9);
    const chain = previewProperty(block, 'side_chain', 'unconnected');
    const left = chain === 'left' || chain === 'center'; const right = chain === 'right' || chain === 'center';
    const depth = shelfFacing ? { x0: .08, x1: .92, z0: .08, z1: .2 } : { x0: .08, x1: .2, z0: .08, z1: .92 };
    if (chain === 'unconnected') drawPreviewCuboid(ctx, block, tile, toScreen, depth, color, .9);
    if (left) {
      const segment = shelfFacing ? { x0: 0, x1: .5, z0: .08, z1: .2 } : { x0: .08, x1: .2, z0: 0, z1: .5 };
      drawPreviewCuboid(ctx, block, tile, toScreen, segment, color, .9);
    }
    if (right) {
      const segment = shelfFacing ? { x0: .5, x1: 1, z0: .08, z1: .2 } : { x0: .08, x1: .2, z0: .5, z1: 1 };
      drawPreviewCuboid(ctx, block, tile, toScreen, segment, color, .9);
    }
    return;
  }
  if (kind === 'bookshelf') {
    drawPreviewCuboid(ctx, block, tile, toScreen, { y0: 0, y1: 1 }, color);
    const bookshelfFacing = facing === 'east' || facing === 'west';
    for (let slot = 0; slot < 6; slot += 1) {
      if (previewProperty(block, `slot_${slot}_occupied`, 'false') !== 'true') continue;
      const column = slot % 3; const row = slot < 3 ? 0 : 1; const inset = .06; const gap = .04;
      const u0 = inset + column * ((1 - inset * 2) / 3) + gap; const u1 = inset + (column + 1) * ((1 - inset * 2) / 3) - gap;
      const v0 = row === 0 ? .55 : .08; const v1 = row === 0 ? .92 : .45;
      const slotBox = bookshelfFacing ? { x0: .08, x1: .22, z0: u0, z1: u1, y0: v0, y1: v1 } : { x0: u0, x1: u1, z0: .08, z1: .22, y0: v0, y1: v1 };
      drawPreviewCuboid(ctx, block, tile, toScreen, slotBox, '#7d4a2f', .95);
    }
    return;
  }
  if (kind === 'ground_cover') {
    const amount = clamp(Number(previewProperty(block, 'segment_amount', previewProperty(block, 'flower_amount', '1'))) || 1, 1, 4);
    const facingCover = facing === 'east' || facing === 'west'; const width = .16 + amount * .16;
    const box = facingCover ? { x0: .1, x1: .9, z0: .1, z1: .1 + width, y0: .02, y1: .08 + amount * .015 } : { x0: .1, x1: .1 + width, z0: .1, z1: .9, y0: .02, y1: .08 + amount * .015 };
    drawPreviewCuboid(ctx, block, tile, toScreen, box, color, .92); return;
  }
  if (kind === 'wall_fan') {
    const fan = facing === 'north' ? { x0: .08, x1: .92, z0: 0, z1: .08 } : facing === 'south' ? { x0: .08, x1: .92, z0: .92, z1: 1 } : facing === 'west' ? { x0: 0, x1: .08, z0: .08, z1: .92 } : { x0: .92, x1: 1, z0: .08, z1: .92 };
    drawPreviewCuboid(ctx, block, tile, toScreen, { ...fan, y0: .2, y1: .82 }, color, .82); return;
  }
  if (kind === 'fire') {
    const attached = block.properties || {}; const sides = Object.keys(PREVIEW_HORIZONTAL_DIRECTIONS).filter((direction) => attached[direction] === 'true');
    const fireColor = block.id.endsWith('soul_fire') ? '#52d3d0' : '#f27b22';
    if (attached.up === 'true') drawPreviewCuboid(ctx, block, tile, toScreen, { y0: .55, y1: 1 }, fireColor, .55);
    const a = [previewPoint(block, tile, toScreen, .12, .08, .12), previewPoint(block, tile, toScreen, .88, .92, .88), previewPoint(block, tile, toScreen, .88, .08, .88), previewPoint(block, tile, toScreen, .12, .92, .12)];
    const b = [previewPoint(block, tile, toScreen, .88, .08, .12), previewPoint(block, tile, toScreen, .12, .92, .88), previewPoint(block, tile, toScreen, .12, .08, .88), previewPoint(block, tile, toScreen, .88, .92, .12)];
    if (!sides.length || attached.down !== 'false') { drawPreviewPolygon(ctx, [a[0], a[1], a[3]], fireColor, 'rgba(255,190,60,.35)'); drawPreviewPolygon(ctx, [b[0], b[1], b[3]], fireColor, 'rgba(255,190,60,.35)'); }
    for (const direction of sides) { const edge = direction === 'north' ? { x0: .08, x1: .92, z0: 0, z1: .05 } : direction === 'south' ? { x0: .08, x1: .92, z0: .95, z1: 1 } : direction === 'west' ? { x0: 0, x1: .05, z0: .08, z1: .92 } : { x0: .95, x1: 1, z0: .08, z1: .92 }; drawPreviewCuboid(ctx, block, tile, toScreen, { ...edge, y0: .12, y1: .8 }, fireColor, .6); }
    return;
  }
  if (kind === 'tripwire') {
    const wireColor = block.properties?.attached === 'true' ? '#d8d0b8' : '#bdb7a9'; const height = block.properties?.attached === 'true' ? .13 : .08; const center = previewPoint(block, tile, toScreen, .5, height, .5);
    for (const [direction, connected] of Object.entries(connections)) if (connected) { const end = direction === 'north' ? previewPoint(block, tile, toScreen, .5, height, 0) : direction === 'south' ? previewPoint(block, tile, toScreen, .5, height, 1) : direction === 'west' ? previewPoint(block, tile, toScreen, 0, height, .5) : previewPoint(block, tile, toScreen, 1, height, .5); drawPreviewLine(ctx, [center, end], wireColor, Math.max(1, tile * .035)); }
    if (!Object.values(connections).some(Boolean)) { drawPreviewLine(ctx, [previewPoint(block, tile, toScreen, .18, height, .5), previewPoint(block, tile, toScreen, .82, height, .5)], wireColor, Math.max(1, tile * .03)); drawPreviewLine(ctx, [previewPoint(block, tile, toScreen, .5, height, .18), previewPoint(block, tile, toScreen, .5, height, .82)], wireColor, Math.max(1, tile * .03)); }
    return;
  }
  if (kind === 'attached') {
    const attached = block.attachments || previewAttachmentFlags(block); const faces = { north: { x0: 0, x1: 1, z0: 0, z1: .045 }, south: { x0: 0, x1: 1, z0: .955, z1: 1 }, west: { x0: 0, x1: .045, z0: 0, z1: 1 }, east: { x0: .955, x1: 1, z0: 0, z1: 1 }, up: { x0: 0, x1: 1, z0: 0, z1: 1, y0: .955, y1: 1 }, down: { x0: 0, x1: 1, z0: 0, z1: 1, y0: 0, y1: .045 } };
    for (const [direction, enabled] of Object.entries(attached)) if (enabled) drawPreviewCuboid(ctx, block, tile, toScreen, faces[direction], color, .78);
    if (!Object.values(attached).some(Boolean)) drawPreviewPolygon(ctx, [previewPoint(block, tile, toScreen, .15, .05, .15), previewPoint(block, tile, toScreen, .85, .05, .85), previewPoint(block, tile, toScreen, .85, .85, .85), previewPoint(block, tile, toScreen, .15, .85, .15)], color, 'rgba(30,70,40,.45)');
    return;
  }
  if (kind === 'wall_torch') {
    const mount = facing === 'north' ? { x0: .38, x1: .62, z0: 0, z1: .2 } : facing === 'south' ? { x0: .38, x1: .62, z0: .8, z1: 1 } : facing === 'west' ? { x0: 0, x1: .2, z0: .38, z1: .62 } : { x0: .8, x1: 1, z0: .38, z1: .62 };
    drawPreviewCuboid(ctx, block, tile, toScreen, { ...mount, y0: .3, y1: .5 }, color, .9); drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .4, x1: .6, z0: .4, z1: .6, y0: .42, y1: .85 }, color); return;
  }
  if (kind === 'button') { const panel = facing === 'east' ? { x0: .82, x1: 1 } : facing === 'west' ? { x0: 0, x1: .18 } : facing === 'north' ? { z0: 0, z1: .18 } : { z0: .82, z1: 1 }; drawPreviewCuboid(ctx, block, tile, toScreen, { ...panel, y0: .38, y1: .62 }, color); return; }
  if (kind === 'hook') { const panel = facing === 'east' ? { x0: .82, x1: 1 } : facing === 'west' ? { x0: 0, x1: .18 } : facing === 'north' ? { z0: 0, z1: .18 } : { z0: .82, z1: 1 }; drawPreviewCuboid(ctx, block, tile, toScreen, { ...panel, y0: .38, y1: .62 }, color); const hooked = previewProperty(block, 'attached', 'false') === 'true'; drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .44, x1: .56, z0: .44, z1: .56, y0: .5, y1: hooked ? .74 : .66 }, color); return; }
  if (kind === 'redstone') {
    const power = clamp(Number(previewProperty(block, 'power', '0')) || 0, 0, 15); const red = `rgb(${Math.round(82 + power * 11.5)}, ${Math.round(8 + power * 1.8)}, ${Math.round(5 + power * .5)})`; drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .35, x1: .65, z0: .35, z1: .65, y0: .01, y1: .045 }, red);
    const arms = [['north', 0, .5, .5, .12], ['south', 0, .5, .5, .88], ['west', .12, .5, 0, .5], ['east', .88, .5, 0, .5]]; for (const [name, x0, y, z0, end] of arms) { const value = previewProperty(block, name, 'side'); if (value !== 'none') { const start = previewPoint(block, tile, toScreen, .5, .05, .5); const finish = name === 'north' || name === 'south' ? previewPoint(block, tile, toScreen, .5, .05, end) : previewPoint(block, tile, toScreen, end, .05, .5); drawPreviewLine(ctx, [start, finish], red, Math.max(1.4, tile * .055)); } } return;
  }
  if (kind === 'rail') {
    const rail = '#8a7770'; drawPreviewCuboid(ctx, block, tile, toScreen, { y0: .02, y1: .08 }, rail); const axisX = facing === 'east' || facing === 'west' || previewProperty(block, 'shape', '').includes('east_west'); const zA = previewPoint(block, tile, toScreen, axisX ? .5 : .28, .09, axisX ? .28 : .5); const zB = previewPoint(block, tile, toScreen, axisX ? .5 : .72, .09, axisX ? .72 : .5); drawPreviewLine(ctx, [zA, zB], '#cfc0a6', Math.max(1.2, tile * .045)); return;
  }
  if (kind === 'plant') { const green = color; const a = [previewPoint(block, tile, toScreen, .12, .05, .12), previewPoint(block, tile, toScreen, .88, .95, .88), previewPoint(block, tile, toScreen, .88, .05, .88), previewPoint(block, tile, toScreen, .12, .95, .12)]; const b = [previewPoint(block, tile, toScreen, .88, .05, .12), previewPoint(block, tile, toScreen, .12, .95, .88), previewPoint(block, tile, toScreen, .12, .05, .88), previewPoint(block, tile, toScreen, .88, .95, .12)]; drawPreviewPolygon(ctx, [a[0], a[1], a[3]], green, 'rgba(30,70,40,.45)'); drawPreviewPolygon(ctx, [b[0], b[1], b[3]], green, 'rgba(30,70,40,.45)'); return; }
  if (kind === 'torch') { drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .43, x1: .57, z0: .43, z1: .57, y0: .12, y1: .78 }, color); drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .3, x1: .7, z0: .3, z1: .7, y0: .72, y1: 1 }, color, .86); return; }
  if (kind === 'ladder' || kind === 'sign') { const panel = facing === 'east' || facing === 'west' ? { z0: .05, z1: .14 } : { x0: .05, x1: .14 }; drawPreviewCuboid(ctx, block, tile, toScreen, { ...panel, y0: kind === 'sign' ? .35 : .08, y1: kind === 'sign' ? .9 : .92 }, color); if (kind === 'sign') drawPreviewCuboid(ctx, block, tile, toScreen, { x0: .46, x1: .54, z0: .46, z1: .54, y0: 0, y1: .4 }, color); return; }
  if (kind === 'bed') { drawPreviewCuboid(ctx, block, tile, toScreen, { y0: .08, y1: .55 }, color); drawPreviewLine(ctx, [previewPoint(block, tile, toScreen, .08, .56, .08), previewPoint(block, tile, toScreen, .92, .56, .08)], 'rgba(255,255,255,.45)', Math.max(.8, tile * .025)); return; }
  if (kind === 'fluid') { drawPreviewCuboid(ctx, block, tile, toScreen, { y0: .02, y1: .9 }, color, .5); return; }
  drawPreviewCuboid(ctx, block, tile, toScreen, {}, color);
}
function renderPreview() {
  const canvas = typeof document !== 'undefined' ? $('preview-canvas') : null;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect(); const width = Math.max(1, Math.floor(rect.width)); const height = Math.max(1, Math.floor(rect.height)); const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) { canvas.width = width * dpr; canvas.height = height * dpr; }
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height); ctx.fillStyle = '#0b1214'; ctx.fillRect(0, 0, width, height);
  canvas.dataset.viewYaw = previewState.yaw.toFixed(4); canvas.dataset.viewPitch = previewState.pitch.toFixed(4); canvas.dataset.viewZoom = previewState.zoom.toFixed(4); canvas.dataset.viewPanX = previewState.panX.toFixed(1); canvas.dataset.viewPanY = previewState.panY.toFixed(1);
  const zoomLabel = $('preview-zoom-label'); if (zoomLabel) zoomLabel.textContent = `${previewState.zoom.toFixed(1)}x`;
  const empty = $('preview-empty');
  if (!state.root) { empty.hidden = false; empty.textContent = '打开 .litematic 后显示投影'; $('preview-status').textContent = '等待加载蓝图'; return; }
  const dataset = collectPreviewBlocks(); empty.hidden = dataset.blocks.length > 0; empty.textContent = '当前范围没有可显示的方块'; $('preview-status').textContent = `预览${previewScopeLabel()} · ${fmt(dataset.total)} 个方块${dataset.sampled ? ' · 已抽样显示' : ''}`;
  if (!dataset.blocks.length) return;
  let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
  for (const block of dataset.blocks) for (const face of Object.values(previewCubePoints(block, 1))) for (const point of face) { minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x); minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y); }
  const fit = Math.min((width - 44) / Math.max(1, maxX - minX), (height - 44) / Math.max(1, maxY - minY)); const tile = clamp(fit * previewState.zoom, 3, PREVIEW_TILE_MAX);
  const centerX = (minX + maxX) * tile / 2; const centerY = (minY + maxY) * tile / 2; const toScreen = (point) => ({ x: point.x + width / 2 - centerX + previewState.panX, y: point.y + height / 2 - centerY + previewState.panY });
  const sorted = dataset.blocks.map(block => ({ block, depth: previewProjectPoint({ x: block.x + 0.5, y: block.y, z: block.z + 0.5 }, 1).depth })).sort((a, b) => a.depth - b.depth);
  for (const { block } of sorted) drawPreviewShape(ctx, block, tile, toScreen);
}
function setPreviewZoom(value) { previewState.zoom = clamp(value, PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX); renderPreview(); }
function resetPreviewView() { previewState.yaw = -0.72; previewState.pitch = 0.68; previewState.zoom = 1; previewState.panX = 0; previewState.panY = 0; renderPreview(); }

function renderIcon(id, size = 32) { const candidates = iconCandidates(id); return `<img class="block-icon" width="${size}" height="${size}" src="${candidates[0]}" data-block-id="${id}" data-icon-candidates='${JSON.stringify(candidates)}' data-icon-index="0" alt="" loading="lazy" onerror="swapIcon(this)">`; }
function render() {
  const metadata = state.root?.value.Metadata?.value || {};
  const stats = state.root ? projectStats() : { rows: [], total: 0, volume: 0, layers: new Map(), maxLayer: 0 };
  state.rows = stats.rows;
  $('project-name').textContent = state.root ? getString(metadata, 'Name', state.projectName) : '未加载蓝图';
  $('file-label').textContent = state.fileName || '未加载文件';
  $('region-count').textContent = fmt(state.root ? allRegions().length : 0);
  $('total-blocks').textContent = fmt(stats.total);
  $('total-volume').textContent = fmt(stats.volume);
  $('palette-size').textContent = fmt(stats.rows.length);
  const layerOptions = ['<option value="all">全部层</option>']; for (let i = 0; i <= stats.maxLayer; i += 1) layerOptions.push(`<option value="${i}">第 ${i + 1} 层</option>`); $('layer-select').innerHTML = layerOptions.join(''); $('layer-select').value = state.scope;
  const query = state.filter.trim().toLowerCase(); const rows = stats.rows.filter(row => !query || row.id.toLowerCase().includes(query) || blockName(row.id).toLowerCase().includes(query));
  $('material-count').textContent = `${rows.length} 种材料`;
  $('materials').innerHTML = rows.length ? rows.map(row => `<div class="material-row" data-id="${row.id}"><div class="material-main">${renderIcon(row.id, 38)}<div><strong>${blockName(row.id)}</strong><span>${row.id}</span></div></div><div class="material-amount">${fmt(row.count)} <small>个</small></div><div class="material-actions"><button type="button" class="ghost-button row-replace" data-id="${row.id}" title="将此材料设为替换来源">替换</button><button type="button" class="delete-button row-delete" data-id="${row.id}" title="用空气替换此材料">删除</button></div></div>`).join('') : `<div class="empty-state">${state.root ? '没有匹配的建材' : '打开 .litematic 后显示建材清单'}</div>`;
  const layers = [...stats.layers.keys()].sort((a, b) => a - b); $('layer-summary').innerHTML = layers.map(layer => { const count = [...stats.layers.get(layer).values()].reduce((sum, n) => sum + n, 0); return `<button class="layer-chip ${String(state.scope) === String(layer) ? 'active' : ''}" data-layer="${layer}"><span>Y${layer + 1}</span><strong>${fmt(count)}</strong></button>`; }).join('');
  $('source-label').textContent = state.sourceId ? `${blockName(state.sourceId)} · ${state.sourceId}` : '选择表格中的材料';
  $('source-label-duplicate').textContent = state.sourceId ? blockName(state.sourceId) : '从清单选择';
  $('source-preview').innerHTML = state.sourceId ? renderIcon(state.sourceId, 30) : '<span class="preview-placeholder">?</span>';
  $('target-preview').innerHTML = state.root ? renderIcon(state.targetId, 30) : '<span class="preview-placeholder">?</span>'; $('target-label').textContent = state.root ? `${blockName(state.targetId)} · ${state.targetId}` : '载入蓝图后选择目标方块'; $('target-search').placeholder = `搜索 26.2 方块（${CATALOG.length}）…`; $('advanced-toggle').checked = state.advanced; $('shape-rule').textContent = state.advanced ? '高级模式：允许跨形状替换' : `默认仅匹配：${state.sourceId ? shapeLabel(state.sourceId) : '相同形状'}`;
  renderPreview();
}

function setSource(id) { state.sourceId = id; if (!state.advanced && blockShape(state.targetId) !== blockShape(id)) { const preferred = SHAPE_DEFAULTS[blockShape(id)]; const compatible = CATALOG.find(item => item.id === preferred && blockShape(item.id) === blockShape(id)) || CATALOG.find(item => blockShape(item.id) === blockShape(id)); if (compatible) state.targetId = compatible.id; } render(); }
function replaceProjectBlocks(sourceId, targetId, preserveProperties = true) {
  const scopeLayer = state.scope === 'all' ? null : Number(state.scope);
  return allRegions().reduce((total, region) => total + replaceRegionBlocks(region, sourceId, targetId, scopeLayer, preserveProperties), 0);
}
function replaceMaterial() {
  if (!state.sourceId || !state.targetId || state.sourceId === state.targetId) return;
  if (!state.advanced && blockShape(state.sourceId) !== blockShape(state.targetId)) { toast(`默认模式仅允许${shapeLabel(state.sourceId)}替换${shapeLabel(state.sourceId)}`); return; }
  replaceProjectBlocks(state.sourceId, state.targetId);
  state.sourceId = ''; render(); toast('已完成统一替换');
}
function openDeleteModal(id) {
  state.pendingDeleteId = id;
  const scope = state.scope === 'all' ? '全部层' : `第 ${Number(state.scope) + 1} 层`;
  $('delete-message').textContent = `是否确认用空气替换“${blockName(id)}”？此操作仅应用于${scope}。`;
  $('delete-modal').hidden = false;
  $('delete-confirm').focus();
}
function closeDeleteModal() { state.pendingDeleteId = ''; $('delete-modal').hidden = true; }
function deleteMaterial() {
  if (!state.pendingDeleteId) return;
  const deletedId = state.pendingDeleteId; const changed = replaceProjectBlocks(deletedId, 'minecraft:air', false);
  if (state.sourceId === deletedId) state.sourceId = '';
  closeDeleteModal(); render(); toast(`已用空气替换 ${fmt(changed)} 个${blockName(deletedId)}`);
}

function renderTargetMenu() {
  const query = state.filterTarget?.trim().toLowerCase() || ''; const sourceShape = state.sourceId ? blockShape(state.sourceId) : null; const items = CATALOG.filter(item => (state.advanced || !sourceShape || blockShape(item.id) === sourceShape) && (!query || item.id.includes(query) || item.name.toLowerCase().includes(query))).slice(0, 120);
  $('target-menu').innerHTML = items.length ? items.map(item => `<button class="target-option" data-id="${item.id}">${renderIcon(item.id, 24)}<span>${item.name}</span><small>${shapeLabel(item.id)} · ${item.id.replace('minecraft:', '')}</small></button>`).join('') : '<div class="target-empty">没有符合形状的方块</div>';
}
function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200); }
async function importFile(file) {
  await importBuffer(await file.arrayBuffer(), file.name);
}
async function importBuffer(buffer, fileName) {
  try { state.root = await readLitematic(buffer); state.fileName = fileName; state.projectName = getString(state.root.value.Metadata?.value, 'Name', fileName.replace(/\.litematic$/i, '')); state.scope = 'all'; state.sourceId = ''; resetPreviewView(); render(); toast(`已载入 ${fileName}`); }
  catch (error) { toast(`载入失败：${error.message}`); }
}
async function exportFile() {
  if (!state.root) return;
  const metadata = state.root.value.Metadata?.value || {}; const stats = projectStats(); setInt(metadata, 'TotalBlocks', stats.total); setInt(metadata, 'TotalVolume', stats.volume); setInt(metadata, 'RegionCount', allRegions().length); setLong(metadata, 'TimeModified', BigInt(Date.now())); setString(metadata, 'Name', getString(metadata, 'Name', state.projectName));
  const output = await writeLitematic(state.root); const blob = new Blob([output], { type: 'application/octet-stream' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = state.fileName.toLowerCase().endsWith('.litematic') ? state.fileName : `${state.fileName}.litematic`; link.click(); URL.revokeObjectURL(link.href); toast(`已导出 ${link.download} · ${fileSize(output.byteLength)}`);
}

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', () => {
  state.root = null; state.fileName = ''; state.projectName = '';
  $('file-input').addEventListener('change', (event) => event.target.files[0] && importFile(event.target.files[0]));
  if (globalThis.desktopBridge?.onOpenFile) globalThis.desktopBridge.onOpenFile((payload) => importBuffer(payload.data, payload.name));
  $('import-button').addEventListener('click', () => $('file-input').click()); $('export-button').addEventListener('click', exportFile); $('load-demo').addEventListener('click', () => { state.root = makeSample(); state.fileName = '示例建筑.litematic'; state.projectName = '示例建筑'; resetPreviewView(); render(); toast('已恢复示例蓝图'); });
  $('layer-select').addEventListener('change', (event) => { state.scope = event.target.value; render(); }); $('material-search').addEventListener('input', (event) => { state.filter = event.target.value; render(); });
  $('materials').addEventListener('click', (event) => { const replaceButton = event.target.closest('.row-replace'); const deleteButton = event.target.closest('.row-delete'); if (replaceButton) setSource(replaceButton.dataset.id); if (deleteButton) openDeleteModal(deleteButton.dataset.id); }); $('layer-summary').addEventListener('click', (event) => { const button = event.target.closest('[data-layer]'); if (button) { state.scope = button.dataset.layer; render(); } });
  $('replace-button').addEventListener('click', replaceMaterial); $('target-search').addEventListener('input', (event) => { state.filterTarget = event.target.value; $('target-menu').classList.add('open'); renderTargetMenu(); }); $('target-menu').addEventListener('click', (event) => { const option = event.target.closest('.target-option'); if (!option) return; state.targetId = option.dataset.id; $('target-menu').classList.remove('open'); render(); }); document.addEventListener('click', (event) => { if (!event.target.closest('.target-picker')) $('target-menu').classList.remove('open'); });
  const advancedToggle = $('advanced-toggle'); const advancedModal = $('advanced-modal'); advancedToggle.addEventListener('change', () => { if (advancedToggle.checked) { advancedToggle.checked = false; advancedModal.hidden = false; } else { state.advanced = false; render(); } }); $('advanced-cancel').addEventListener('click', () => { advancedModal.hidden = true; advancedToggle.checked = state.advanced; }); $('advanced-confirm').addEventListener('click', () => { state.advanced = true; advancedToggle.checked = true; advancedModal.hidden = true; state.filterTarget = ''; render(); toast('高级模式已开启'); });
  $('delete-cancel').addEventListener('click', closeDeleteModal); $('delete-confirm').addEventListener('click', deleteMaterial); $('delete-modal').addEventListener('click', (event) => { if (event.target.id === 'delete-modal') closeDeleteModal(); }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !$('delete-modal').hidden) closeDeleteModal(); });
  const dropzone = $('dropzone'); ['dragenter', 'dragover'].forEach(type => dropzone.addEventListener(type, (event) => { event.preventDefault(); dropzone.classList.add('dragging'); })); ['dragleave', 'drop'].forEach(type => dropzone.addEventListener(type, (event) => { event.preventDefault(); dropzone.classList.remove('dragging'); })); dropzone.addEventListener('drop', (event) => event.dataTransfer.files[0] && importFile(event.dataTransfer.files[0]));
  $('target-search').addEventListener('focus', () => { $('target-menu').classList.add('open'); renderTargetMenu(); });
  const previewCanvas = $('preview-canvas'); previewCanvas.addEventListener('contextmenu', (event) => event.preventDefault()); previewCanvas.addEventListener('pointerdown', (event) => { event.preventDefault(); previewCanvas.setPointerCapture(event.pointerId); previewState.drag = { mode: event.button === 2 ? 'rotate' : 'pan', x: event.clientX, y: event.clientY }; previewCanvas.classList.add('dragging'); }); previewCanvas.addEventListener('pointermove', (event) => { if (!previewState.drag) return; const dx = event.clientX - previewState.drag.x; const dy = event.clientY - previewState.drag.y; previewState.drag.x = event.clientX; previewState.drag.y = event.clientY; if (previewState.drag.mode === 'rotate') { previewState.yaw += dx * 0.012; previewState.pitch = clamp(previewState.pitch + dy * 0.008, 0.25, 1.25); } else { previewState.panX += dx; previewState.panY += dy; } renderPreview(); }); const endPreviewDrag = (event) => { if (previewState.drag) { previewState.drag = null; previewCanvas.classList.remove('dragging'); if (previewCanvas.hasPointerCapture(event.pointerId)) previewCanvas.releasePointerCapture(event.pointerId); } }; previewCanvas.addEventListener('pointerup', endPreviewDrag); previewCanvas.addEventListener('pointercancel', endPreviewDrag); previewCanvas.addEventListener('wheel', (event) => { event.preventDefault(); setPreviewZoom(previewState.zoom * Math.exp(-event.deltaY * 0.001)); }, { passive: false }); $('preview-zoom-out').addEventListener('click', () => setPreviewZoom(previewState.zoom / 1.25)); $('preview-zoom-in').addEventListener('click', () => setPreviewZoom(previewState.zoom * 1.25)); $('preview-reset').addEventListener('click', resetPreviewView); window.addEventListener('resize', renderPreview); render();
 });

export { blockShape, buildCatalog, collectPreviewBlocks, countRegion, ensurePaletteEntry, fallbackColor, iconCandidates, makeSample, packStates, PREVIEW_ZOOM_MAX, PREVIEW_ZOOM_MIN, previewAttachmentFlags, previewConnectionFlags, previewKind, previewProjectPoint, replaceRegionBlocks, unpackStates };
