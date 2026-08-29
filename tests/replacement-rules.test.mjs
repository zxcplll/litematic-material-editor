import assert from 'node:assert/strict';
import { compound, list, tag } from '../nbt.js';
import { blockShape, buildCatalog, ensurePaletteEntry, iconCandidates, packStates, replaceRegionBlocks, unpackStates } from '../app.js';

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

function deletionRegion() {
  const sourceProperties = compound({ type: tag(8, 'top'), waterlogged: tag(8, 'false') }, 'Properties');
  const palette = [
    { Name: tag(8, 'minecraft:stone_slab'), Properties: sourceProperties },
    { Name: tag(8, 'minecraft:dirt') }
  ];
  const values = new Uint32Array([0, 1, 0, 1, 0, 1, 0, 1]);
  return compound({
    Size: compound({ x: tag(3, 2), y: tag(3, 2), z: tag(3, 2) }),
    BlockStatePalette: list(10, palette),
    BlockStates: packStates(values, 2)
  });
}

const oneLayerRegion = deletionRegion();
assert.equal(replaceRegionBlocks(oneLayerRegion, 'minecraft:stone_slab', 'minecraft:air', 1), 2);
const oneLayerDecoded = unpackStates(oneLayerRegion);
const oneLayerIds = [...oneLayerDecoded.values].map(index => oneLayerDecoded.palette[index].Name.value);
assert.deepEqual(oneLayerIds, ['minecraft:stone_slab', 'minecraft:dirt', 'minecraft:stone_slab', 'minecraft:dirt', 'minecraft:air', 'minecraft:dirt', 'minecraft:air', 'minecraft:dirt']);
const airEntry = oneLayerDecoded.palette.find(entry => entry.Name.value === 'minecraft:air');
assert.equal(airEntry.Properties, undefined, 'air must not inherit source block properties');

const allLayersRegion = deletionRegion();
assert.equal(replaceRegionBlocks(allLayersRegion, 'minecraft:stone_slab', 'minecraft:air', null, false), 4);
const allLayersDecoded = unpackStates(allLayersRegion);
const allLayerIds = [...allLayersDecoded.values].map(index => allLayersDecoded.palette[index].Name.value);
assert.equal(allLayerIds.filter(id => id === 'minecraft:stone_slab').length, 0);
assert.equal(allLayerIds.filter(id => id === 'minecraft:dirt').length, 4);
assert.equal(iconCandidates('minecraft:stone_pressure_plate')[0].endsWith('/stone.png'), true);
assert.equal(iconCandidates('minecraft:white_bed')[0].endsWith('/white_wool.png'), true);
assert.equal(iconCandidates('minecraft:water')[0], 'assets/block-icons/water.png');
assert.equal(iconCandidates('minecraft:lava')[0], 'assets/block-icons/lava.png');
assert.equal(iconCandidates('minecraft:redstone_wire')[0], 'assets/block-icons/redstone_wire.png');
console.log(`REPLACEMENT_RULES PASS catalog=${catalog.length} properties=preserved delete_scope=all+layer air_properties=none`);
