import assert from 'node:assert/strict';
import { gunzip, parseNbt, writeLitematic, readLitematic, writeNbt } from '../nbt.js';
import { makeSample, countRegion, packStates, unpackStates } from '../app.js';

const root = makeSample();
const raw = writeNbt(root);
assert.equal(raw[0], 10, 'root tag is compound');
const parsed = parseNbt(raw.buffer);
assert.equal(parsed.value.Metadata.value.Name.value, '示例建筑');
const region = parsed.value.Regions.value['示例区域'];
const decoded = unpackStates(region);
assert.equal(decoded.values.length, 48);
assert.deepEqual([...countRegion(region).counts.values()].reduce((a, b) => a + b, 0), 48);

const packed = packStates(decoded.values, decoded.bits);
region.value.BlockStates = packed;
assert.deepEqual([...unpackStates(region).values], [...decoded.values]);

const gz = await writeLitematic(root);
const roundTrip = await readLitematic(gz);
assert.equal(roundTrip.value.Regions.value['示例区域'].value.Size.value.y.value, 3);
const plain = await gunzip(raw);
assert.equal(plain[0], 10, 'plain NBT remains unchanged');
console.log(`NBT_ROUNDTRIP PASS bytes=${gz.byteLength} blocks=${decoded.values.length}`);
