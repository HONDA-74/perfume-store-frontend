import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

interface PerfumeBottleProps {
  scrollProgress: MotionValue<number>;
  reducedMotion?: boolean;
}

interface PerfumeModel {
  nodes: Record<'Bottle_Glass' | 'Bottle_Liquid' | 'Bottle_Metal' | 'Bottle_Atomizer' | 'Bottle_Cap', THREE.Mesh>;
}

export function PerfumeBottle({ scrollProgress, reducedMotion = false }: PerfumeBottleProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the prepared GLB asset
  const { nodes } = useGLTF('/3d-assets/lebeni/lebeni-prepared.glb') as unknown as PerfumeModel;

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

    // INTRO PHASE (p ~ 0.0 - 0.2): Centered hero reveal, cinematic angle
    // TRANSITION (p ~ 0.2 - 0.3): Subtle rotation adjustment as UI appears
    // STORYTELLING (p ~ 0.3 - 1.0): Existing wheel/scene progression

    let targetRotY: number;
    let targetScale: number;
    let scrollYOffset: number;

    if (p < 0.2) {
      // INTRO: Cinematic 3/4 view, larger scale for hero presence
      targetRotY = -0.75; // ~-43deg, beautiful depth reveal
      targetScale = 1.15; // Larger for hero impact
      scrollYOffset = -0.05; // Slightly below center
    } else if (p < 0.3) {
      // TRANSITION: Subtle rotation shift as text appears
      const t = (p - 0.2) / 0.1; // Normalize 0.2-0.3 to 0-1
      targetRotY = THREE.MathUtils.lerp(-0.75, -1.0, t);
      targetScale = THREE.MathUtils.lerp(1.15, 0.9, t);
      scrollYOffset = THREE.MathUtils.lerp(-0.05, -0.3, t);
    } else {
      // STORYTELLING: Existing wheel behavior
      // Remap 0.3-1.0 to 0-1 for existing animation
      const storyP = (p - 0.3) / 0.7;
      
      // Strong three-quarter angle (-1.0 rad) -> near front (0.1 rad)
      targetRotY = THREE.MathUtils.lerp(-1.0, 0.1, storyP);
      
      // Scale grows from 0.9 to 1.2
      targetScale = THREE.MathUtils.lerp(0.9, 1.2, storyP);
      
      // Position shifts slightly up as it gets closer
      scrollYOffset = THREE.MathUtils.lerp(-0.3, 0.15, storyP);
    }

    // Subtle continuous float (breathing)
    const floatOffset = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
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
