const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();

class NbtReader {
  constructor(buffer) {
    this.view = new DataView(buffer);
    this.bytes = new Uint8Array(buffer);
    this.offset = 0;
  }
  need(size) {
    if (this.offset + size > this.view.byteLength) throw new Error('NBT 数据已截断');
  }
  u8() { this.need(1); return this.view.getUint8(this.offset++); }
  i8() { this.need(1); return this.view.getInt8(this.offset++); }
  i16() { this.need(2); const v = this.view.getInt16(this.offset); this.offset += 2; return v; }
  i32() { this.need(4); const v = this.view.getInt32(this.offset); this.offset += 4; return v; }
  i64() { this.need(8); const v = this.view.getBigInt64(this.offset); this.offset += 8; return v; }
  f32() { this.need(4); const v = this.view.getFloat32(this.offset); this.offset += 4; return v; }
  f64() { this.need(8); const v = this.view.getFloat64(this.offset); this.offset += 8; return v; }
  string() {
    const length = this.i16();
    this.need(length);
    const value = textDecoder.decode(this.bytes.subarray(this.offset, this.offset + length));
    this.offset += length;
    return value;
  }
  payload(type, name = '') {
    if (type === 1) return { type, name, value: this.i8() };
    if (type === 2) return { type, name, value: this.i16() };
    if (type === 3) return { type, name, value: this.i32() };
    if (type === 4) return { type, name, value: this.i64() };
    if (type === 5) return { type, name, value: this.f32() };
    if (type === 6) return { type, name, value: this.f64() };
    if (type === 7) {
      const length = this.i32();
      this.need(length);
      const value = new Int8Array(this.bytes.slice(this.offset, this.offset + length).buffer);
      this.offset += length;
      return { type, name, value };
    }
    if (type === 8) return { type, name, value: this.string() };
    if (type === 9) {
      const itemType = this.u8();
      const length = this.i32();
      const items = [];
      for (let i = 0; i < length; i += 1) items.push(this.payload(itemType).value);
      return { type, name, value: { itemType, items } };
    }
    if (type === 10) {
      const value = {};
      while (true) {
        const childType = this.u8();
        if (childType === 0) break;
        const childName = this.string();
        value[childName] = this.payload(childType, childName);
      }
      return { type, name, value };
    }
    if (type === 11) {
      const length = this.i32();
      const value = new Int32Array(length);
      for (let i = 0; i < length; i += 1) value[i] = this.i32();
      return { type, name, value };
    }
    if (type === 12) {
      const length = this.i32();
      const value = new BigInt64Array(length);
      for (let i = 0; i < length; i += 1) value[i] = this.i64();
      return { type, name, value };
    }
    throw new Error(`未知的 NBT 类型 ${type}`);
  }
  root() {
    const type = this.u8();
    if (type !== 10) throw new Error('litematic 根节点必须是 Compound');
    const name = this.string();
    return this.payload(type, name);
  }
}

class NbtWriter {
  constructor() { this.bytes = []; }
  u8(value) { this.bytes.push(value & 0xff); }
  i8(value) { this.u8(value); }
  i16(value) { this.bytes.push((value >> 8) & 0xff, value & 0xff); }
  i32(value) {
    this.bytes.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
  }
  i64(value) {
    let n = BigInt.asIntN(64, BigInt(value));
    const out = new Uint8Array(8);
    const view = new DataView(out.buffer);
    view.setBigInt64(0, n);
    for (const byte of out) this.bytes.push(byte);
  }
  f32(value) { const out = new Uint8Array(4); new DataView(out.buffer).setFloat32(0, value); this.bytes.push(...out); }
  f64(value) { const out = new Uint8Array(8); new DataView(out.buffer).setFloat64(0, value); this.bytes.push(...out); }
  string(value) {
    const encoded = textEncoder.encode(String(value));
    this.i16(encoded.length);
    this.bytes.push(...encoded);
  }
  payload(type, value) {
    if (type === 1) this.i8(value);
    else if (type === 2) this.i16(value);
    else if (type === 3) this.i32(value);
    else if (type === 4) this.i64(value);
    else if (type === 5) this.f32(value);
    else if (type === 6) this.f64(value);
    else if (type === 7) { this.i32(value.length); this.bytes.push(...new Uint8Array(value.buffer, value.byteOffset, value.byteLength)); }
    else if (type === 8) this.string(value);
    else if (type === 9) {
      this.u8(value.itemType); this.i32(value.items.length);
      for (const item of value.items) this.payload(value.itemType, item);
    } else if (type === 10) {
      for (const [key, child] of Object.entries(value)) { this.u8(child.type); this.string(key); this.payload(child.type, child.value); }
      this.u8(0);
    } else if (type === 11) { this.i32(value.length); for (const item of value) this.i32(item); }
    else if (type === 12) { this.i32(value.length); for (const item of value) this.i64(item); }
    else throw new Error(`未知的 NBT 类型 ${type}`);
  }
  root(root) {
    this.u8(10); this.string(root.name || ''); this.payload(10, root.value);
    return new Uint8Array(this.bytes);
  }
}

export function parseNbt(buffer) {
  const view = buffer instanceof ArrayBuffer ? buffer : buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  return new NbtReader(view).root();
}
export function writeNbt(root) { return new NbtWriter().root(root); }

export async function gunzip(buffer) {
  if (buffer[0] !== 0x1f || buffer[1] !== 0x8b) return buffer;
  if (typeof DecompressionStream === 'undefined') throw new Error('当前浏览器缺少 GZIP 解压能力');
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function gzip(buffer) {
  if (typeof CompressionStream === 'undefined') throw new Error('当前浏览器缺少 GZIP 压缩能力');
  const stream = new Blob([buffer]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function readLitematic(buffer) { return parseNbt(await gunzip(new Uint8Array(buffer))); }
export async function writeLitematic(root) { return gzip(writeNbt(root)); }

export const tag = (type, value, name = '') => ({ type, name, value });
export const compound = (value, name = '') => tag(10, value, name);
export const list = (itemType, items, name = '') => tag(9, { itemType, items }, name);

export function getInt(compoundValue, key, fallback = 0) {
  const node = compoundValue?.[key];
  return node && typeof node.value === 'number' ? node.value : fallback;
}
export function getString(compoundValue, key, fallback = '') {
  const node = compoundValue?.[key];
  return node && typeof node.value === 'string' ? node.value : fallback;
}

export function setInt(compoundValue, key, value) { compoundValue[key] = tag(3, value, key); }
export function setLong(compoundValue, key, value) { compoundValue[key] = tag(4, BigInt(value), key); }
export function setString(compoundValue, key, value) { compoundValue[key] = tag(8, value, key); }
