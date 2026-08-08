import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

interface PerfumeBottleProps {
  scrollProgress: MotionValue<number>;
}

export function PerfumeBottle({ scrollProgress }: PerfumeBottleProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the prepared GLB asset
  const { nodes } = useGLTF('/3d-assets/lebeni/lebeni-prepared.glb') as any;

  // Custom high-end materials built dynamically so we don't destructively modify the GLB
  const materials = useMemo(() => {
    return {
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'), // Base bright to allow transmission
        metalness: 0.05,
        roughness: 0.1,
        transmission: 1.0,     
        thickness: 1.5,        
        ior: 1.5,
        attenuationColor: new THREE.Color('#0a0a0a'), // Deep smoky tint
        attenuationDistance: 1.0,
        transparent: true,
        side: THREE.DoubleSide,
      }),
      liquid: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#6a0e17'), // Rich burgundy
        metalness: 0.0,
        roughness: 0.25,
        transmission: 0.95,
        thickness: 0.8,
        ior: 1.33,             
        attenuationColor: new THREE.Color('#3a0205'), // Deepens the red internally
        attenuationDistance: 0.5,
        transparent: true,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4c39e'), // Elegant champagne gold
        metalness: 1.0,
        roughness: 0.35,       
      }),
      cap: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141414'), // Near-black
        metalness: 0.85,
        roughness: 0.25,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Read the current normalized scroll progress (0 to 1 over the sequence)
    const p = scrollProgress.get();

    // SCENE 1 (p ~ 0.0 - 0.33): Intro, strong 3/4 angle to show depth, slightly smaller, pushed back
    // SCENE 2 (p ~ 0.33 - 0.67): Rotates forward, grows, comes into focus
    // SCENE 3 (p ~ 0.67 - 1.0): Final signature orientation (near front), largest, hero composition
    
    // Strong initial three-quarter angle (-1.0 rad = ~-57 deg) -> near front (0.1 rad = ~5 deg)
    const targetRotY = THREE.MathUtils.lerp(-1.0, 0.1, p);
    
    // Scale grows from 0.85 to 1.15 to give a feeling of "revealing" the product
    const targetScale = THREE.MathUtils.lerp(0.85, 1.15, p);

    // Subtle continuous float (breathing)
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
    // Position shifts slightly up as it gets closer
    const scrollYOffset = THREE.MathUtils.lerp(-0.4, 0.2, p);
    const targetY = scrollYOffset + floatOffset;

    // Use smooth damping for luxurious, weighty movement
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 4, delta);
    
    const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 
        The nodes were explicitly named during the GLB preparation phase.
        We apply our custom R3F materials to each part.
      */}
      <mesh
        geometry={nodes.Bottle_Glass.geometry}
        material={materials.glass}
      />
      <mesh
        geometry={nodes.Bottle_Liquid.geometry}
        material={materials.liquid}
      />
      <mesh
        geometry={nodes.Bottle_Metal.geometry}
        material={materials.metal}
      />
      <mesh
        geometry={nodes.Bottle_Atomizer.geometry}
        material={materials.metal} // Using the same champagne metal for atomizer
      />
      
      {/* The cap retained its local pivot at T=[0, 2.3851, 0] during preparation, 
          so we must re-apply its translation here so it sits on top of the bottle. */}
      <mesh
        geometry={nodes.Bottle_Cap.geometry}
        material={materials.cap}
        position={[0, 2.3851, 0]} 
      />
    </group>
  );
}

// Preload the GLB so it's ready immediately
useGLTF.preload('/3d-assets/lebeni/lebeni-prepared.glb');
