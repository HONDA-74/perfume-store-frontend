import { useEffect, useMemo, useRef } from 'react';
import './kenz-text-pressure.css';

interface KenzTextPressureProps {
  text?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

const REST_CURSOR: Point = { x: -9999, y: -9999 };

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function mapByDistance(
  dist: number,
  maxDist: number,
  min: number,
  max: number,
): number {
  const val = max - (dist / maxDist) * (max - min);
  return Math.max(min, Math.min(max, val));
}

/**
 * KenzTextPressure — luxury editorial typography that subtly responds to cursor
 * proximity. Adapted from the TextPressure interaction concept, using Playfair
 * Display variable axes (wght, ital) with scaleX for width breathing.
 */
export function KenzTextPressure({
  text = 'KENZ',
  className = '',
}: KenzTextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef = useRef<Point>(REST_CURSOR);
  const mouseRef = useRef<Point>(REST_CURSOR);
  const isVisibleRef = useRef(false);
  const isPageVisibleRef = useRef(true);
  const canInteractRef = useRef(false);

  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqFinePointer = window.matchMedia('(pointer: fine)');

    const updateInteractionMode = () => {
      canInteractRef.current = !mqReduced.matches && mqFinePointer.matches;
      container.classList.toggle('kenz-text-pressure--static', !canInteractRef.current);

      if (!canInteractRef.current) {
        cursorRef.current = REST_CURSOR;
        mouseRef.current = REST_CURSOR;
        spansRef.current.forEach((span) => {
          if (!span) return;
          span.style.fontVariationSettings = "'wght' 350, 'ital' 0";
          span.style.transform = 'scaleX(1)';
        });
      }
    };

    updateInteractionMode();
    mqReduced.addEventListener('change', updateInteractionMode);
    mqFinePointer.addEventListener('change', updateInteractionMode);

    let rafId = 0;
    let isAnimating = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (!canInteractRef.current || !isVisibleRef.current) return;
      cursorRef.current = { x: event.clientX, y: event.clientY };
      startAnimation();
    };

    const handleMouseLeave = () => {
      cursorRef.current = REST_CURSOR;
      startAnimation();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          cursorRef.current = REST_CURSOR;
          stopAnimation();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState === 'visible';
      if (!isPageVisibleRef.current) {
        cursorRef.current = REST_CURSOR;
        stopAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (
        !canInteractRef.current ||
        !isVisibleRef.current ||
        !isPageVisibleRef.current
      ) {
        isAnimating = false;
        return;
      }

      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 14;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 14;

      const cursorAtRest =
        cursorRef.current.x === REST_CURSOR.x &&
        cursorRef.current.y === REST_CURSOR.y;
      const mouseAtRest =
        Math.abs(mouseRef.current.x - REST_CURSOR.x) < 1 &&
        Math.abs(mouseRef.current.y - REST_CURSOR.y) < 1;

      const titleRect = titleRef.current?.getBoundingClientRect();
      const maxDist = titleRect ? titleRect.width * 0.38 : 240;

      spansRef.current.forEach((span) => {
        if (!span) return;

        const rect = span.getBoundingClientRect();
        const charCenter: Point = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const d = distance(mouseRef.current, charCenter);

        const wght = Math.round(mapByDistance(d, maxDist, 280, 680));
        const scaleX = mapByDistance(d, maxDist, 0.9, 1.08);
        const italVal = mapByDistance(d, maxDist, 0, 0.22).toFixed(2);
        const nextSettings = `'wght' ${wght}, 'ital' ${italVal}`;
        const nextTransform = `scaleX(${scaleX.toFixed(3)})`;

        if (span.style.fontVariationSettings !== nextSettings) {
          span.style.fontVariationSettings = nextSettings;
        }
        if (span.style.transform !== nextTransform) {
          span.style.transform = nextTransform;
        }
      });

      if (cursorAtRest && mouseAtRest) {
        isAnimating = false;
        return;
      }

      rafId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (isAnimating || !canInteractRef.current) return;
      isAnimating = true;
      rafId = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (!isAnimating) return;
      cancelAnimationFrame(rafId);
      isAnimating = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      stopAnimation();
      observer.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mqReduced.removeEventListener('change', updateInteractionMode);
      mqFinePointer.removeEventListener('change', updateInteractionMode);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`kenz-text-pressure ${className}`.trim()}
      aria-hidden="true"
    >
      <p ref={titleRef} className="kenz-text-pressure__title font-serif">
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(element) => {
              spansRef.current[index] = element;
            }}
            className="kenz-text-pressure__char"
            data-char={char}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  );
}
