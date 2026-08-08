/**
 * compare-glb.mjs — Compare two GLB files for geometry differences
 * Usage: node compare-glb.mjs <original.glb> <prepared.glb>
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

function parseGLB(path) {
  const buf = readFileSync(path);
  
  // Parse GLB header
  const magic = buf.readUInt32LE(0);
  if (magic !== 0x46546C67) {
    throw new Error('Not a valid GLB file');
  }
  
  // Find chunks
  let offset = 12;
  let jsonChunk = null;
  let binChunk = null;
  
  while (offset < buf.length) {
    const chunkLength = buf.readUInt32LE(offset);
    const chunkType = buf.readUInt32LE(offset + 4);
    const chunkData = buf.slice(offset + 8, offset + 8 + chunkLength);
    
    if (chunkType === 0x4E4F534A) {
      jsonChunk = chunkData;
    } else if (chunkType === 0x004E4942) {
      binChunk = chunkData;
    }
    offset += 8 + chunkLength;
    if (offset % 4 !== 0) offset += 4 - (offset % 4);
  }
  
  const gltf = JSON.parse(jsonChunk.toString('utf8'));
  return { gltf, binChunk, buffer: buf };
}

function getAccessorData(gltf, binChunk, accessorIndex) {
  const accessor = gltf.accessors[accessorIndex];
  const bufferView = gltf.bufferViews[accessor.bufferView];
  
  const componentTypeSize = {
    5120: 1, // BYTE
    5121: 1, // UNSIGNED_BYTE
    5122: 2, // SHORT
    5123: 2, // UNSIGNED_SHORT
    5125: 4, // UNSIGNED_INT
    5126: 4, // FLOAT
  }[accessor.componentType];
  
  const typeComponents = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
  }[accessor.type];
  
  const start = bufferView.byteOffset || 0;
  const stride = bufferView.byteStride || (componentTypeSize * typeComponents);
  const offset = accessor.byteOffset || 0;
  
  const data = [];
  for (let i = 0; i < accessor.count; i++) {
    const element = [];
    for (let j = 0; j < typeComponents; j++) {
      const byteOffset = start + offset + (i * stride) + (j * componentTypeSize);
      let value;
      
      if (accessor.componentType === 5126) { // FLOAT
        value = binChunk.readFloatLE(byteOffset);
      } else if (accessor.componentType === 5123) { // UNSIGNED_SHORT
        value = binChunk.readUInt16LE(byteOffset);
      } else if (accessor.componentType === 5125) { // UNSIGNED_INT
        value = binChunk.readUInt32LE(byteOffset);
      }
      
      element.push(value);
    }
    data.push(typeComponents === 1 ? element[0] : element);
  }
  
  return data;
}

function calculateBoundingBox(positions) {
  if (!positions || positions.length === 0) {
    return { min: [0, 0, 0], max: [0, 0, 0], size: [0, 0, 0] };
  }
  
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  
  for (const pos of positions) {
    for (let i = 0; i < 3; i++) {
      if (pos[i] < min[i]) min[i] = pos[i];
      if (pos[i] > max[i]) max[i] = pos[i];
    }
  }
  
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  
  return { min, max, size };
}

function applyTransform(positions, translation, rotation, scale) {
  // Simple transform application (for basic cases)
  const t = translation || [0, 0, 0];
  const s = scale || [1, 1, 1];
  
  return positions.map(pos => [
    pos[0] * s[0] + t[0],
    pos[1] * s[1] + t[1],
    pos[2] * s[2] + t[2],
  ]);
}

function analyzeMesh(gltf, binChunk, meshIndex, nodeName, nodeTransform) {
  const mesh = gltf.meshes[meshIndex];
  const results = [];
  
  for (let pi = 0; pi < mesh.primitives.length; pi++) {
    const prim = mesh.primitives[pi];
    const posAccessor = prim.attributes.POSITION;
    
    if (posAccessor === undefined) continue;
    
    const positions = getAccessorData(gltf, binChunk, posAccessor);
    const localBBox = calculateBoundingBox(positions);
    
    // Apply node transform
    const worldPositions = applyTransform(
      positions,
      nodeTransform.translation,
      nodeTransform.rotation,
      nodeTransform.scale
    );
    const worldBBox = calculateBoundingBox(worldPositions);
    
    const material = prim.material !== undefined ? gltf.materials[prim.material] : null;
    const materialName = material?.name || '(no material)';
    
    // Count triangles
    let triangles = 0;
    if (prim.indices !== undefined) {
      const indices = getAccessorData(gltf, binChunk, prim.indices);
      triangles = Math.floor(indices.length / 3);
    }
    
    results.push({
      primIndex: pi,
      meshName: mesh.name,
      nodeName,
      materialName,
      vertexCount: positions.length,
      triangleCount: triangles,
      localBBox,
      worldBBox,
    });
  }
  
  return results;
}

function compareFiles(originalPath, preparedPath) {
  console.log('='.repeat(80));
  console.log('COMPARING GLB FILES');
  console.log('='.repeat(80));
  console.log(`Original:  ${originalPath}`);
  console.log(`Prepared:  ${preparedPath}`);
  console.log('');
  
  const original = parseGLB(originalPath);
  const prepared = parseGLB(preparedPath);
  
  console.log('=== OVERVIEW ===');
  console.log(`Original: ${original.gltf.nodes?.length || 0} nodes, ${original.gltf.meshes?.length || 0} meshes, ${original.gltf.materials?.length || 0} materials`);
  console.log(`Prepared: ${prepared.gltf.nodes?.length || 0} nodes, ${prepared.gltf.meshes?.length || 0} meshes, ${prepared.gltf.materials?.length || 0} materials`);
  console.log('');
  
  // Analyze all meshes
  const originalMeshes = [];
  const preparedMeshes = [];
  
  console.log('=== ORIGINAL FILE COMPONENTS ===');
  for (let i = 0; i < original.gltf.nodes.length; i++) {
    const node = original.gltf.nodes[i];
    if (node.mesh !== undefined) {
      const transform = {
        translation: node.translation,
        rotation: node.rotation,
        scale: node.scale,
      };
      const analyses = analyzeMesh(original.gltf, original.binChunk, node.mesh, node.name, transform);
      originalMeshes.push(...analyses);
      
      for (const a of analyses) {
        console.log(`Node: "${a.nodeName}" / Mesh: "${a.meshName}" / Material: "${a.materialName}"`);
        console.log(`  Vertices: ${a.vertexCount}, Triangles: ${a.triangleCount}`);
        console.log(`  Local BBox: min=[${a.localBBox.min.map(v => v.toFixed(4)).join(', ')}]`);
        console.log(`              max=[${a.localBBox.max.map(v => v.toFixed(4)).join(', ')}]`);
        console.log(`              size=[${a.localBBox.size.map(v => v.toFixed(4)).join(', ')}] (W×H×D)`);
        console.log(`  World BBox: size=[${a.worldBBox.size.map(v => v.toFixed(4)).join(', ')}] (W×H×D)`);
        console.log('');
      }
    }
  }
  
  console.log('=== PREPARED FILE COMPONENTS ===');
  for (let i = 0; i < prepared.gltf.nodes.length; i++) {
    const node = prepared.gltf.nodes[i];
    if (node.mesh !== undefined) {
      const transform = {
        translation: node.translation,
        rotation: node.rotation,
        scale: node.scale,
      };
      const analyses = analyzeMesh(prepared.gltf, prepared.binChunk, node.mesh, node.name, transform);
      preparedMeshes.push(...analyses);
      
      for (const a of analyses) {
        console.log(`Node: "${a.nodeName}" / Mesh: "${a.meshName}" / Material: "${a.materialName}"`);
        console.log(`  Vertices: ${a.vertexCount}, Triangles: ${a.triangleCount}`);
        console.log(`  Local BBox: min=[${a.localBBox.min.map(v => v.toFixed(4)).join(', ')}]`);
        console.log(`              max=[${a.localBBox.max.map(v => v.toFixed(4)).join(', ')}]`);
        console.log(`              size=[${a.localBBox.size.map(v => v.toFixed(4)).join(', ')}] (W×H×D)`);
        console.log(`  World BBox: size=[${a.worldBBox.size.map(v => v.toFixed(4)).join(', ')}] (W×H×D)`);
        console.log('');
      }
    }
  }
  
  // Overall bounding boxes
  console.log('=== OVERALL BOUNDING BOX COMPARISON ===');
  const allOriginalPositions = [];
  const allPreparedPositions = [];
  
  for (let i = 0; i < original.gltf.nodes.length; i++) {
    const node = original.gltf.nodes[i];
    if (node.mesh !== undefined) {
      const mesh = original.gltf.meshes[node.mesh];
      for (const prim of mesh.primitives) {
        if (prim.attributes.POSITION !== undefined) {
          const positions = getAccessorData(original.gltf, original.binChunk, prim.attributes.POSITION);
          const transformed = applyTransform(positions, node.translation, node.rotation, node.scale);
          allOriginalPositions.push(...transformed);
        }
      }
    }
  }
  
  for (let i = 0; i < prepared.gltf.nodes.length; i++) {
    const node = prepared.gltf.nodes[i];
    if (node.mesh !== undefined) {
      const mesh = prepared.gltf.meshes[node.mesh];
      for (const prim of mesh.primitives) {
        if (prim.attributes.POSITION !== undefined) {
          const positions = getAccessorData(prepared.gltf, prepared.binChunk, prim.attributes.POSITION);
          const transformed = applyTransform(positions, node.translation, node.rotation, node.scale);
          allPreparedPositions.push(...transformed);
        }
      }
    }
  }
  
  const originalOverall = calculateBoundingBox(allOriginalPositions);
  const preparedOverall = calculateBoundingBox(allPreparedPositions);
  
  console.log(`Original Overall: W=${originalOverall.size[0].toFixed(4)}, H=${originalOverall.size[1].toFixed(4)}, D=${originalOverall.size[2].toFixed(4)}`);
  console.log(`Prepared Overall: W=${preparedOverall.size[0].toFixed(4)}, H=${preparedOverall.size[1].toFixed(4)}, D=${preparedOverall.size[2].toFixed(4)}`);
  console.log('');
  
  const widthDiff = ((preparedOverall.size[0] / originalOverall.size[0]) * 100 - 100).toFixed(2);
  const heightDiff = ((preparedOverall.size[1] / originalOverall.size[1]) * 100 - 100).toFixed(2);
  const depthDiff = ((preparedOverall.size[2] / originalOverall.size[2]) * 100 - 100).toFixed(2);
  
  console.log('=== DIFFERENCE ANALYSIS ===');
  console.log(`Width:  ${widthDiff > 0 ? '+' : ''}${widthDiff}%`);
  console.log(`Height: ${heightDiff > 0 ? '+' : ''}${heightDiff}%`);
  console.log(`Depth:  ${depthDiff > 0 ? '+' : ''}${depthDiff}%`);
  console.log('');
  
  if (Math.abs(parseFloat(depthDiff)) > 1) {
    console.log('⚠️  WARNING: Significant depth difference detected!');
  }
  
  console.log('='.repeat(80));
}

// Run comparison
const originalPath = resolve(process.argv[2]);
const preparedPath = resolve(process.argv[3]);

compareFiles(originalPath, preparedPath);
