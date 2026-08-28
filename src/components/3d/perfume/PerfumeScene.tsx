import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { PerfumeBottle } from './PerfumeBottle';
import { useMediaQuery } from '@/hooks/use-media-query';

interface PerfumeSceneProps {
  scrollProgress: MotionValue<number>;
}

export function PerfumeScene({ scrollProgress }: PerfumeSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const isPhone = useMediaQuery('(max-width: 767px)');
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const update = (inViewport: boolean) => {
      const nextVisible = inViewport && !document.hidden;
      setVisible(nextVisible);
      if (nextVisible) setHasEnteredViewport(true);
    };
    const observer = new IntersectionObserver(([entry]) => update(entry.isIntersecting), {
      rootMargin: '150px',
    });
    const onVisibility = () =>
      update(
        wrapper.getBoundingClientRect().bottom > -150 &&
          wrapper.getBoundingClientRect().top < window.innerHeight + 150,
      );
    observer.observe(wrapper);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 h-full w-full">
      {hasEnteredViewport && (
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          camera={
            isCompact ? { position: [0, 0.15, 6.8], fov: 42 } : { position: [0, 0, 5.5], fov: 45 }
          }
          dpr={isPhone ? 1 : [1, 1.5]}
          gl={{
            antialias: !isPhone,
            powerPreference: 'high-performance',
            alpha: true,
            toneMapping: 4, // ACESFilmicToneMapping is standard for photorealism (THREE.ACESFilmicToneMapping is 4)
            toneMappingExposure: 1.2,
          }}
          // Prevent default touch actions on canvas if it gets in the way of scroll
          style={{ touchAction: 'none', pointerEvents: 'none' }}
        >
          <Suspense fallback={null}>
            {/* Cinematic lighting setup */}
            {/* A very dark ambient light to prevent pitch black shadows */}
            <ambientLight intensity={0.15} />

            {/* Key light: warm and sophisticated, casting subtle highlights on the cap/metal */}
            <directionalLight position={[4, 5, 4]} intensity={2.0} color="#ffd9b3" />

            {/* Rim light: cool and crisp to separate bottle from the dark background and highlight glass edges */}
            <spotLight
              position={[-5, 5, -5]}
              intensity={4.0}
              color="#a3c2ff"
              angle={0.6}
              penumbra={1}
            />

            {/* Fill light: subtle lift on the shadow side */}
            <directionalLight position={[-4, 0, 4]} intensity={0.5} color="#ffffff" />

            {/* Bottom uplight: reveals the burgundy liquid and base glass thickness */}
            <pointLight position={[0, -3, 0]} intensity={1.5} color="#ff6666" distance={8} />

            {/* Environment map provides subtle realistic reflections on the glass/metal.
              Required for physical glass to not look like black plastic. */}
            <Environment preset="studio" environmentIntensity={1.0} />

            {/* The main bottle asset, animated by scroll progress */}
            <PerfumeBottle
              scrollProgress={scrollProgress}
              reducedMotion={!!reducedMotion}
              compact={isCompact}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
