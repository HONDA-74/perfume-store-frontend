/**
 * inspect-glb.mjs — zero-dependency GLB inspector
 * Reads the glTF JSON chunk from a GLB binary and prints the full structure.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

const glbPath = resolve(process.argv[2]);
const buf = readFileSync(glbPath);

// ── GLB header ──────────────────────────────────────────────────────────
const magic    = buf.readUInt32LE(0);   // 0x46546C67 = "glTF"
const version  = buf.readUInt32LE(4);
const length   = buf.readUInt32LE(8);

if (magic !== 0x46546C67) {
  console.error('Not a valid GLB file (wrong magic)');
  process.exit(1);
}

console.log('=== GLB HEADER ===');
console.log('Magic:  ', magic.toString(16), '(glTF)');
console.log('Version:', version);
console.log('Length: ', length, 'bytes');
console.log('');

// ── Chunks ───────────────────────────────────────────────────────────────
let offset = 12;
let jsonChunk = null;
let binChunk  = null;

while (offset < buf.length) {
  const chunkLength = buf.readUInt32LE(offset);
  const chunkType   = buf.readUInt32LE(offset + 4);
  const chunkData   = buf.slice(offset + 8, offset + 8 + chunkLength);
  
  if (chunkType === 0x4E4F534A) {   // JSON
    jsonChunk = chunkData;
    console.log(`JSON chunk: ${chunkLength} bytes`);
  } else if (chunkType === 0x004E4942) { // BIN
    binChunk = chunkData;
    console.log(`BIN  chunk: ${chunkLength} bytes`);
  } else {
    console.log(`Unknown chunk type: 0x${chunkType.toString(16)}, length: ${chunkLength}`);
  }
  offset += 8 + chunkLength;
  // chunks must be 4-byte aligned
  if (offset % 4 !== 0) offset += 4 - (offset % 4);
}

if (!jsonChunk) {
  console.error('No JSON chunk found!');
  process.exit(1);
}

const gltf = JSON.parse(jsonChunk.toString('utf8'));

console.log('\n=== GLTF JSON STRUCTURE ===');
console.log('Keys:', Object.keys(gltf).join(', '));
console.log('');

// ── Asset ─────────────────────────────────────────────────────────────
if (gltf.asset) {
  console.log('=== ASSET ===');
  console.log(JSON.stringify(gltf.asset, null, 2));
}

// ── Scenes & Nodes ────────────────────────────────────────────────────
console.log('\n=== SCENES ===');
(gltf.scenes || []).forEach((s, i) => {
  console.log(`Scene[${i}]: "${s.name || '(unnamed)'}" nodes=[${(s.nodes||[]).join(', ')}]`);
});

console.log('\n=== NODES (full) ===');
(gltf.nodes || []).forEach((n, i) => {
  const parts = [`  [${i}] "${n.name || '(unnamed)'}"`];
  if (n.mesh !== undefined)     parts.push(`mesh=${n.mesh}`);
  if (n.children)               parts.push(`children=[${n.children.join(',')}]`);
  if (n.translation)            parts.push(`T=[${n.translation.map(v=>v.toFixed(4)).join(',')}]`);
  if (n.rotation)               parts.push(`R=[${n.rotation.map(v=>v.toFixed(4)).join(',')}]`);
  if (n.scale)                  parts.push(`S=[${n.scale.map(v=>v.toFixed(4)).join(',')}]`);
  if (n.matrix)                 parts.push(`matrix=[…]`);
  console.log(parts.join('  '));
});

// ── Meshes ───────────────────────────────────────────────────────────
console.log('\n=== MESHES ===');
(gltf.meshes || []).forEach((m, i) => {
  console.log(`  Mesh[${i}]: "${m.name || '(unnamed)'}"`);
  (m.primitives || []).forEach((p, pi) => {
    const matName = p.material !== undefined
      ? (gltf.materials[p.material]?.name || `mat[${p.material}]`)
      : '(no material)';
    const attrs = Object.keys(p.attributes || {}).join(', ');
    const mode = p.mode !== undefined ? p.mode : 4; // 4 = TRIANGLES default
    console.log(`    Primitive[${pi}]: material="${matName}" (mat_idx=${p.material}) attrs=[${attrs}] mode=${mode} indices=${p.indices}`);
  });
});

// ── Materials ─────────────────────────────────────────────────────────
console.log('\n=== MATERIALS ===');
(gltf.materials || []).forEach((m, i) => {
  const pbr = m.pbrMetallicRoughness || {};
  const parts = [
    `  Mat[${i}]: "${m.name || '(unnamed)'}"`,
    `alphaMode=${m.alphaMode || 'OPAQUE'}`,
  ];
  if (pbr.baseColorFactor)     parts.push(`baseColor=[${pbr.baseColorFactor.map(v=>v.toFixed(3)).join(',')}]`);
  if (pbr.metallicFactor !== undefined) parts.push(`metallic=${pbr.metallicFactor.toFixed(3)}`);
  if (pbr.roughnessFactor !== undefined) parts.push(`roughness=${pbr.roughnessFactor.toFixed(3)}`);
  if (m.emissiveFactor && m.emissiveFactor.some(v=>v>0)) parts.push(`emissive=[${m.emissiveFactor.join(',')}]`);
  if (pbr.baseColorTexture)    parts.push(`baseColorTex=${pbr.baseColorTexture.index}`);
  if (pbr.metallicRoughnessTexture) parts.push(`mrTex=${pbr.metallicRoughnessTexture.index}`);
  if (m.normalTexture)         parts.push(`normalTex=${m.normalTexture.index}`);
  console.log(parts.join('  '));
});

// ── Textures ──────────────────────────────────────────────────────────
console.log('\n=== TEXTURES ===');
console.log(`  Count: ${(gltf.textures || []).length}`);
(gltf.textures || []).forEach((t, i) => {
  console.log(`  Tex[${i}]: source=${t.source} sampler=${t.sampler}`);
});

// ── Accessors / Triangle count ────────────────────────────────────────
console.log('\n=== ACCESSORS (index buffers → triangle count) ===');
let totalTriangles = 0;
(gltf.meshes || []).forEach((m) => {
  (m.primitives || []).forEach((p) => {
    if (p.indices !== undefined) {
      const acc = gltf.accessors[p.indices];
      const tris = Math.floor(acc.count / 3);
      totalTriangles += tris;
      console.log(`  Mesh "${m.name}" prim indices accessor[${p.indices}]: count=${acc.count} → ${tris} triangles`);
    }
  });
});
console.log(`  TOTAL TRIANGLES: ${totalTriangles}`);

// ── Cameras / Lights ─────────────────────────────────────────────────
if (gltf.cameras?.length) console.log(`\n=== CAMERAS: ${gltf.cameras.length} ===`);
if (gltf.extensions?.KHR_lights_punctual?.lights?.length)
  console.log(`\n=== LIGHTS: ${gltf.extensions.KHR_lights_punctual.lights.length} ===`);

console.log('\n=== DONE ===');
