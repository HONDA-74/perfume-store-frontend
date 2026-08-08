/**
 * prepare-lebeni.mjs — Proper GLB preparation that preserves geometry
 * 
 * This script:
 * 1. Removes unnecessary studio objects (Plane, Plane.001, Empty)
 * 2. Separates bottle components by material
 * 3. Renames components semantically
 * 4. PRESERVES EXACT ORIGINAL WORLD-SPACE GEOMETRY
 * 
 * Usage: node prepare-lebeni.mjs lebeni-original.glb lebeni-prepared-v2.glb
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

function parseGLB(path) {
  const buf = readFileSync(path);
  
  const magic = buf.readUInt32LE(0);
  if (magic !== 0x46546C67) {
    throw new Error('Not a valid GLB file');
  }
  
  const version = buf.readUInt32LE(4);
  const length = buf.readUInt32LE(8);
  
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
  return { gltf, binChunk, version };
}

function writeGLB(outputPath, gltf, binChunk) {
  const jsonStr = JSON.stringify(gltf);
  const jsonBuf = Buffer.from(jsonStr, 'utf8');
  
  // Pad JSON to 4-byte boundary
  const jsonPadding = (4 - (jsonBuf.length % 4)) % 4;
  const jsonChunkLength = jsonBuf.length + jsonPadding;
  const jsonChunk = Buffer.alloc(jsonChunkLength);
  jsonBuf.copy(jsonChunk);
  for (let i = jsonBuf.length; i < jsonChunkLength; i++) {
    jsonChunk[i] = 0x20; // space character
  }
  
  // Pad BIN to 4-byte boundary
  const binPadding = (4 - (binChunk.length % 4)) % 4;
  const binChunkLength = binChunk.length + binPadding;
  const binChunkPadded = Buffer.alloc(binChunkLength);
  binChunk.copy(binChunkPadded);
  
  const totalLength = 12 + 8 + jsonChunkLength + 8 + binChunkLength;
  
  const glb = Buffer.alloc(totalLength);
  let offset = 0;
  
  // GLB header
  glb.writeUInt32LE(0x46546C67, offset); offset += 4; // magic
  glb.writeUInt32LE(2, offset); offset += 4;          // version
  glb.writeUInt32LE(totalLength, offset); offset += 4; // length
  
  // JSON chunk
  glb.writeUInt32LE(jsonChunkLength, offset); offset += 4;
  glb.writeUInt32LE(0x4E4F534A, offset); offset += 4; // "JSON"
  jsonChunk.copy(glb, offset); offset += jsonChunkLength;
  
  // BIN chunk
  glb.writeUInt32LE(binChunkLength, offset); offset += 4;
  glb.writeUInt32LE(0x004E4942, offset); offset += 4; // "BIN\0"
  binChunkPadded.copy(glb, offset);
  
  writeFileSync(outputPath, glb);
}

function prepareBottle(inputPath, outputPath) {
  console.log('='.repeat(80));
  console.log('PREPARING LEBENI BOTTLE GLB');
  console.log('='.repeat(80));
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log('');
  
  const { gltf, binChunk, version } = parseGLB(inputPath);
  
  console.log('=== ORIGINAL STRUCTURE ===');
  console.log(`Nodes: ${gltf.nodes.length}`);
  console.log(`Meshes: ${gltf.meshes.length}`);
  console.log(`Materials: ${gltf.materials.length}`);
  console.log('');
  
  // Material name mapping
  const materialRenameMap = {
    'Material.001': 'Mat_Glass',
    'Material.002': 'Mat_Liquid',
    'Material.003': 'Mat_Cap',
    'Material.005': 'Mat_Atomizer',
    'Material.006': 'Mat_Metal',
  };
  
  // Rename materials
  gltf.materials.forEach(mat => {
    if (materialRenameMap[mat.name]) {
      console.log(`Renaming material: ${mat.name} → ${materialRenameMap[mat.name]}`);
      mat.name = materialRenameMap[mat.name];
    }
  });
  
  // Find the Circle node (bottle) and Circle.002 node (cap)
  const bottleNodeIndex = gltf.nodes.findIndex(n => n.name === 'Circle');
  const capNodeIndex = gltf.nodes.findIndex(n => n.name === 'Circle.002');
  
  if (bottleNodeIndex === -1 || capNodeIndex === -1) {
    throw new Error('Could not find Circle (bottle) or Circle.002 (cap) nodes');
  }
  
  const bottleNode = gltf.nodes[bottleNodeIndex];
  const capNode = gltf.nodes[capNodeIndex];
  
  console.log('');
  console.log('=== SEPARATING BOTTLE COMPONENTS ===');
  
  // The original Circle mesh has multiple primitives with different materials
  // We need to split them into separate meshes
  const bottleMesh = gltf.meshes[bottleNode.mesh];
  const newMeshes = [];
  const newNodes = [];
  
  // Map material names to semantic component names
  const componentNames = {
    'Mat_Glass': 'Bottle_Glass',
    'Mat_Liquid': 'Bottle_Liquid',
    'Mat_Atomizer': 'Bottle_Atomizer',
    'Mat_Metal': 'Bottle_Metal',
  };
  
  // Split bottle primitives into separate meshes
  bottleMesh.primitives.forEach((prim, index) => {
    const matIndex = prim.material;
    const matName = gltf.materials[matIndex].name;
    const componentName = componentNames[matName];
    
    if (!componentName) {
      console.log(`Skipping primitive with material: ${matName}`);
      return;
    }
    
    console.log(`Creating ${componentName} from primitive ${index} (material: ${matName})`);
    
    // Create new mesh with single primitive
    const newMesh = {
      name: `Mesh_${componentName}`,
      primitives: [{ ...prim }]
    };
    
    const newMeshIndex = gltf.meshes.length + newMeshes.length;
    newMeshes.push(newMesh);
    
    // Create new node with SAME transform as original bottle node
    const newNode = {
      name: componentName,
      mesh: newMeshIndex,
    };
    
    // PRESERVE ORIGINAL TRANSFORM - this is critical!
    if (bottleNode.translation) newNode.translation = [...bottleNode.translation];
    if (bottleNode.rotation) newNode.rotation = [...bottleNode.rotation];
    if (bottleNode.scale) newNode.scale = [...bottleNode.scale];
    if (bottleNode.matrix) newNode.matrix = [...bottleNode.matrix];
    
    newNodes.push(newNode);
  });
  
  // Handle cap separately
  const capMesh = gltf.meshes[capNode.mesh];
  console.log(`Creating Bottle_Cap from Circle.002`);
  
  const capNewMesh = {
    name: 'Mesh_Bottle_Cap',
    primitives: capMesh.primitives.map(p => ({ ...p }))
  };
  
  const capNewMeshIndex = gltf.meshes.length + newMeshes.length;
  newMeshes.push(capNewMesh);
  
  const capNewNode = {
    name: 'Bottle_Cap',
    mesh: capNewMeshIndex,
  };
  
  // PRESERVE CAP TRANSFORM
  if (capNode.translation) capNewNode.translation = [...capNode.translation];
  if (capNode.rotation) capNewNode.rotation = [...capNode.rotation];
  if (capNode.scale) capNewNode.scale = [...capNode.scale];
  if (capNode.matrix) capNewNode.matrix = [...capNode.matrix];
  
  newNodes.push(capNewNode);
  
  // Add new meshes and nodes
  gltf.meshes.push(...newMeshes);
  
  const startNodeIndex = gltf.nodes.length;
  gltf.nodes.push(...newNodes);
  
  // Update scene to only reference new nodes and remove studio objects
  const newNodeIndices = [];
  for (let i = 0; i < newNodes.length; i++) {
    newNodeIndices.push(startNodeIndex + i);
  }
  
  // Keep only the Empty node if it exists (might be used as parent/pivot)
  const emptyNodeIndex = gltf.nodes.findIndex(n => n.name === 'Empty');
  if (emptyNodeIndex !== -1 && !gltf.nodes[emptyNodeIndex].mesh) {
    // Empty is just a transform node, keep it
    newNodeIndices.unshift(emptyNodeIndex);
  }
  
  gltf.scenes[0].nodes = newNodeIndices;
  
  console.log('');
  console.log('=== CLEANED STRUCTURE ===');
  console.log(`Nodes: ${newNodes.length}`);
  console.log(`Meshes: ${newMeshes.length}`);
  console.log('');
  
  // Remove unused materials (studio materials)
  const usedMaterialIndices = new Set();
  gltf.meshes.forEach(mesh => {
    mesh.primitives.forEach(prim => {
      if (prim.material !== undefined) {
        usedMaterialIndices.add(prim.material);
      }
    });
  });
  
  const oldMaterials = gltf.materials;
  const newMaterials = [];
  const materialIndexMap = new Map();
  
  oldMaterials.forEach((mat, oldIndex) => {
    if (usedMaterialIndices.has(oldIndex)) {
      const newIndex = newMaterials.length;
      materialIndexMap.set(oldIndex, newIndex);
      newMaterials.push(mat);
    }
  });
  
  gltf.materials = newMaterials;
  
  // Update material references in meshes
  gltf.meshes.forEach(mesh => {
    mesh.primitives.forEach(prim => {
      if (prim.material !== undefined && materialIndexMap.has(prim.material)) {
        prim.material = materialIndexMap.get(prim.material);
      }
    });
  });
  
  console.log(`Materials reduced to: ${gltf.materials.length}`);
  console.log('Material names:', gltf.materials.map(m => m.name).join(', '));
  console.log('');
  
  // Write output
  console.log('Writing output file...');
  writeGLB(outputPath, gltf, binChunk);
  
  console.log('');
  console.log('✓ Preparation complete!');
  console.log('='.repeat(80));
  console.log('');
  console.log('IMPORTANT: Vertex positions were NOT modified.');
  console.log('All transforms were preserved from the original nodes.');
  console.log('World-space geometry should be identical to the original.');
}

// Run preparation
const inputPath = resolve(process.argv[2]);
const outputPath = resolve(process.argv[3]);

if (!inputPath || !outputPath) {
  console.error('Usage: node prepare-lebeni.mjs <input.glb> <output.glb>');
  process.exit(1);
}

prepareBottle(inputPath, outputPath);
