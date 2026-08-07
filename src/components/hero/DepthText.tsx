import { useEffect, useRef } from 'react';
import './DepthText.css';

interface DepthTextProps {
  text?: string;
  className?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  perspective?: string;
  layerCount?: number;
  layerDistance?: number;
  layerShadow?: string;
  faceColor?: string;
  layerColor?: string;
}

/**
 * DepthText — React Bits component (verbatim).
 * Creates a cinematic 3-D depth illusion that tracks the cursor.
 */
export function DepthText({
  text = '',
  className = '',
  fontFamily = 'inherit',
  fontSize = '5rem',
  fontWeight = 700,
  perspective = '500px',
  layerCount = 8,
  layerDistance = 1.5,
  layerShadow = 'none',
  faceColor = 'currentColor',
  layerColor = 'rgba(0,0,0,0.15)',
}: DepthTextProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container) return;

    let animFrame: number;
    let targetRX = -2.4;
    let targetRY = 3.15;
    let currentRX = -2.4;
    let currentRY = 3.15;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      targetRY = dx * 8;
      targetRX = -dy * 5;
    };

    const animate = () => {
      currentRX += (targetRX - currentRX) * 0.06;
      currentRY += (targetRY - currentRY) * 0.06;
      stage.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
      animFrame = requestAnimationFrame(animate);
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      window.addEventListener('mousemove', handleMouseMove);
      animFrame = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const layers = Array.from({ length: layerCount }, (_, i) => i + 1);

  return (
    <div
      ref={containerRef}
      className={`depth-text ${className}`}
      style={
        {
          '--depth-text-perspective': perspective,
          '--depth-text-font-size': fontSize,
          '--depth-text-font-weight': String(fontWeight),
          '--depth-text-shadow': layerShadow,
          '--depth-text-face-color': faceColor,
          fontFamily,
        } as React.CSSProperties
      }
    >
      <div ref={stageRef} className="depth-text__stage">
        {layers.map((n) => (
          <span
            key={n}
            className="depth-text__layer"
            aria-hidden="true"
            style={{
              color: layerColor,
              transform: `translateZ(-${n * layerDistance}px)`,
            }}
          >
            {text}
          </span>
        ))}
        <span className="depth-text__face">{text}</span>
      </div>
    </div>
  );
}
