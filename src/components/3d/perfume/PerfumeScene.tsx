import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import { PerfumeBottle } from './PerfumeBottle';

interface PerfumeSceneProps {
  scrollProgress: MotionValue<number>;
}

export function PerfumeScene({ scrollProgress }: PerfumeSceneProps) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }} // Moved camera closer for a stronger hero presence
        dpr={[1, 2]} // Optimize for mobile vs desktop
        gl={{ 
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          toneMapping: 4, // ACESFilmicToneMapping is standard for photorealism (THREE.ACESFilmicToneMapping is 4)
          toneMappingExposure: 1.2
        }}
        // Prevent default touch actions on canvas if it gets in the way of scroll
        style={{ touchAction: 'none', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          {/* Cinematic lighting setup */}
          {/* A very dark ambient light to prevent pitch black shadows */}
          <ambientLight intensity={0.15} />

          {/* Key light: warm and sophisticated, casting subtle highlights on the cap/metal */}
          <directionalLight 
            position={[4, 5, 4]} 
            intensity={2.0} 
            color="#ffd9b3" 
          />
          
          {/* Rim light: cool and crisp to separate bottle from the dark background and highlight glass edges */}
          <spotLight 
            position={[-5, 5, -5]} 
            intensity={4.0} 
            color="#a3c2ff"
            angle={0.6} 
            penumbra={1} 
          />

          {/* Fill light: subtle lift on the shadow side */}
          <directionalLight 
            position={[-4, 0, 4]} 
            intensity={0.5} 
            color="#ffffff" 
          />
          
          {/* Bottom uplight: reveals the burgundy liquid and base glass thickness */}
          <pointLight
            position={[0, -3, 0]}
            intensity={1.5}
            color="#ff6666"
            distance={8}
          />

          {/* Environment map provides subtle realistic reflections on the glass/metal. 
              Required for physical glass to not look like black plastic. */}
          <Environment preset="studio" environmentIntensity={1.0} />

          {/* The main bottle asset, animated by scroll progress */}
          <PerfumeBottle scrollProgress={scrollProgress} />
          
          {/* Preload all necessary GL objects and textures */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
