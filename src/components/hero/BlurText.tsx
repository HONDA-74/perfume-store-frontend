import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type EasingFunction = (t: number) => number;

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, number | string>;
  animationTo?: Record<string, number | string>[];
  easing?: EasingFunction;
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const buildKeyframes = (
  from: Record<string, number | string>,
  steps: Record<string, number | string>[],
) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes: Record<string, (number | string)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

/**
 * BlurText — React Bits component adapted to TypeScript.
 * Animates text word-by-word (or char-by-char) with a blur + translate entrance.
 * Uses framer-motion (already a project dependency).
 */
export function BlurText({
  text = '',
  delay = 200,
  className = '',
  style,
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom: Record<string, number | string> =
    direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, y: -20 }
      : { filter: 'blur(10px)', opacity: 0, y: 20 };

  const defaultTo: Record<string, number | string>[] = [
    { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? -10 : 10 },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ];

  const from = animationFrom ?? defaultFrom;
  const to = animationTo ?? defaultTo;
  const keyframes = buildKeyframes(from, to);
  const times = [0, ...to.map((_, i) => easing((i + 1) / to.length))];

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em', ...style }}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={from}
          animate={inView ? keyframes : from}
          transition={{
            duration: stepDuration * to.length,
            delay: index * (delay / 1000),
            ease: 'easeOut',
            times,
          }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {element}
        </motion.span>
      ))}
    </p>
  );
}
