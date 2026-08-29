import assert from 'node:assert/strict';
import { compound, list, tag } from '../nbt.js';
import { blockShape, buildCatalog, ensurePaletteEntry, iconCandidates } from '../app.js';

assert.equal(blockShape('minecraft:stone'), 'full');
assert.equal(blockShape('minecraft:stone_slab'), 'slab');
assert.equal(blockShape('minecraft:oak_stairs'), 'stairs');
assert.equal(blockShape('minecraft:oak_trapdoor'), 'trapdoor');
assert.equal(blockShape('minecraft:glass_pane'), 'pane');
const catalog = buildCatalog();
assert.equal(catalog.some(item => item.id === 'minecraft:air'), false);
assert.equal(catalog.find(item => item.id === 'minecraft:stone_brick_wall')?.name, '石砖墙');

const region = compound({ BlockStatePalette: list(10, [{ Name: tag(8, 'minecraft:oak_stairs') }]) });
const properties = compound({ facing: tag(8, 'west'), half: tag(8, 'top'), shape: tag(8, 'inner_left'), waterlogged: tag(8, 'false') }, 'Properties');
const target = ensurePaletteEntry(region, 'minecraft:birch_stairs', properties);
assert.equal(target, 1);
assert.equal(region.value.BlockStatePalette.value.items[1].Properties.value.facing.value, 'west');
assert.equal(region.value.BlockStatePalette.value.items[1].Properties.value.half.value, 'top');
assert.equal(iconCandidates('minecraft:stone_pressure_plate')[0].endsWith('/stone.png'), true);
assert.equal(iconCandidates('minecraft:white_bed')[0].endsWith('/white_wool.png'), true);
assert.equal(iconCandidates('minecraft:redstone_wire')[0].endsWith('/redstone_dust_line0.png'), true);
console.log(`REPLACEMENT_RULES PASS catalog=${catalog.length} properties=preserved`);
