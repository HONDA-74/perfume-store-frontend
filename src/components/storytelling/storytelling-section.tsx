import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { Container } from '@/components/shared';
import { BlurText } from '@/components/hero/BlurText';

/* ─────────────────────────────────────────────────────────────────────────
 * StoryStatement — a single scroll-driven story line.
 *
 * Receives a scroll progress value [0..1] for the full pinned sequence
 * and its own visibility window [enter, exit] within that range.
 * Outside the window: invisible + blurred. Inside: fully visible.
 * ────────────────────────────────────────────────────────────────────── */
interface StoryStatementProps {
  text: string;
  scrollProgress: ReturnType<typeof useTransform<number, number>>;
  enter: number;
  peak: number;
  exit: number;
}

function StoryStatement({
  text,
  scrollProgress,
  enter,
  peak,
  exit,
}: StoryStatementProps) {
  const opacity = useTransform(
    scrollProgress,
    [enter, peak, exit - 0.06, exit],
    [0,     1,    1,           0],
  );
  const blurPx = useTransform(
    scrollProgress,
    [enter, peak, exit - 0.06, exit],
    [12,    0,    0,            10],
  );
  const y = useTransform(
    scrollProgress,
    [enter, peak],
    [32,    0],
  );
  // Derive a CSS-string MotionValue from the numeric blur value
  const blurFilter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.span style={{ filter: blurFilter, display: 'block' }}>
        <span
          className="block font-serif font-bold uppercase leading-none text-center"
          style={{
            fontSize: 'clamp(2.2rem, 7vw, 6.5rem)',
            color: 'hsl(0 0% 97%)',
            letterSpacing: '0.1em',
          }}
        >
          {text}
        </span>
      </motion.span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * InViewBlock — fades + slides up when scrolled into view.
 * Wraps any children. Used for intro and closing blocks.
 * ────────────────────────────────────────────────────────────────────── */
function InViewBlock({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * ScrollStorySequence — the pinned scroll-driven story experience.
 *
 * The outer wrapper is 350vh tall (gives ~3.5× scroll room for 3 statements).
 * The inner panel is sticky at top:0 and 100svh tall.
 * Framer Motion's useScroll tracks how far the user has scrolled through
 * the outer wrapper (0 = top, 1 = bottom) and drives each statement's
 * opacity + blur + Y via useTransform.
 * ────────────────────────────────────────────────────────────────────── */
const STATEMENTS = [
  'It begins with a note.',
  'Becomes a feeling.',
  'Becomes a memory.',
];

/* ─────────────────────────────────────────────────────────────────────────
 * StoryDot — a single progress indicator dot.
 * Must be its own component so useTransform is called at hook level.
 * ────────────────────────────────────────────────────────────────────── */
function StoryDot({
  progress,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  const bg = useTransform(
    progress,
    [0, 0.4, 0.6, 1],
    [
      'hsl(0 0% 40% / 0.4)',
      'hsl(43 82% 65%)',
      'hsl(43 82% 65%)',
      'hsl(0 0% 40% / 0.4)',
    ],
  );
  return (
    <motion.div
      className="rounded-full"
      style={{ width: '5px', height: '5px', background: bg }}
    />
  );
}

function ScrollStorySequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Each statement gets an equal share of the scroll range
  const segmentSize = 1 / STATEMENTS.length;
  // Overlap: statement starts revealing slightly before previous finishes
  const overlap = 0.06;

  const progressValues = STATEMENTS.map((_, i) => ({
    enter: Math.max(0, i * segmentSize - overlap),
    peak: i * segmentSize + segmentSize * 0.12,
    exit: Math.min(1, (i + 1) * segmentSize + overlap),
  }));

  // A single "combined" scroll counter number for each statement
  const p0 = useTransform(scrollYProgress, [progressValues[0].enter, progressValues[0].exit], [0, 1]);
  const p1 = useTransform(scrollYProgress, [progressValues[1].enter, progressValues[1].exit], [0, 1]);
  const p2 = useTransform(scrollYProgress, [progressValues[2].enter, progressValues[2].exit], [0, 1]);
  const progressArr = [p0, p1, p2];

  // Thin gold progress line
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '350vh' }}
      aria-label="Story sequence"
    >
      {/* Sticky panel */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Faint ambient glow — dark atmospheric background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, hsl(43 60% 18% / 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Gold progress line at top of viewport */}
        <div
          className="absolute top-0 left-0 right-0 h-px origin-left"
          style={{ background: 'hsl(43 82% 52% / 0.25)' }}
        />
        <motion.div
          className="absolute top-0 left-0 h-px origin-left"
          style={{
            scaleX: lineScaleX,
            background: 'hsl(43 82% 65%)',
            right: 0,
          }}
        />

        {/* Story statement stage */}
        <div className="relative h-full flex flex-col items-center justify-center px-6">
          {/* Statement container — all three overlap; opacity drives visibility */}
          <div className="relative w-full max-w-5xl mx-auto" style={{ height: '12rem' }}>
            {STATEMENTS.map((text, i) => (
              <StoryStatement
                key={text}
                text={text}
                scrollProgress={progressArr[i]}
                enter={progressValues[i].enter}
                peak={progressValues[i].peak}
                exit={progressValues[i].exit}
              />
            ))}
          </div>

          {/* Tiny scroll hint dots */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2"
            aria-hidden="true"
          >
            {progressArr.map((p, i) => (
              <StoryDot key={i} progress={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Thin horizontal rule — gold accent
 * ────────────────────────────────────────────────────────────────────── */
function GoldRule({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`origin-left h-px ${className}`}
      style={{ background: 'hsl(43 82% 52% / 0.3)' }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * StorytellingSection — exported main component
 * ────────────────────────────────────────────────────────────────────── */
export function StorytellingSection() {
  return (
    <section
      id="storytelling"
      aria-label="The Language of Scent — brand story"
      style={{ background: 'hsl(0 0% 4%)' }}
    >
      {/* ── Intro Block ─────────────────────────────────────────────── */}
      <Container>
        <div
          className="mx-auto text-center"
          style={{ maxWidth: '48rem', paddingTop: '8rem', paddingBottom: '7rem' }}
        >
          {/* Eyebrow */}
          <InViewBlock delay={0}>
            <span
              className="inline-flex items-center gap-3 font-sans uppercase"
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.22em',
                color: 'hsl(43 82% 65% / 0.75)',
                fontWeight: 500,
                marginBottom: '2.5rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '1px',
                  background: 'hsl(43 82% 65% / 0.35)',
                }}
              />
              The Language of Scent
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '1px',
                  background: 'hsl(43 82% 65% / 0.35)',
                }}
              />
            </span>
          </InViewBlock>

          {/* Headline */}
          <InViewBlock delay={0.12}>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'hsl(0 0% 97%)',
                marginBottom: '2rem',
              }}
            >
              Some moments are remembered
              <br />
              before they are understood.
            </h2>
          </InViewBlock>

          {/* Gold rule */}
          <InViewBlock delay={0.22}>
            <GoldRule className="mb-8 max-w-xs mx-auto" />
          </InViewBlock>

          {/* Supporting copy — reuses existing BlurText */}
          <InViewBlock delay={0.3}>
            <BlurText
              text="A fragrance is more than a collection of notes. It is an atmosphere, a feeling, a memory — captured in a bottle."
              animateBy="words"
              direction="bottom"
              delay={55}
              stepDuration={0.5}
              className="font-sans leading-relaxed text-center"
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                color: 'hsl(0 0% 80% / 0.72)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.28em',
              } as React.CSSProperties}
            />
          </InViewBlock>
        </div>
      </Container>

      {/* ── Scroll-driven Story Sequence ──────────────────────────── */}
      <ScrollStorySequence />

      {/* ── Closing Block ───────────────────────────────────────────── */}
      <Container>
        <div
          className="mx-auto text-center"
          style={{ maxWidth: '44rem', paddingTop: '8rem', paddingBottom: '10rem' }}
        >
          {/* Closing headline */}
          <InViewBlock delay={0}>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3.1rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'hsl(0 0% 97%)',
                marginBottom: '1.5rem',
              }}
            >
              A fragrance doesn&rsquo;t define you.
              <br />
              <span style={{ color: 'hsl(43 82% 68%)' }}>
                It reveals something about you.
              </span>
            </h2>
          </InViewBlock>

          {/* Supporting line */}
          <InViewBlock delay={0.15}>
            <p
              className="font-sans"
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                color: 'hsl(0 0% 78% / 0.7)',
                marginBottom: '3rem',
                letterSpacing: '0.01em',
              }}
            >
              Discover the scent that speaks your language.
            </p>
          </InViewBlock>

          {/* CTA */}
          <InViewBlock delay={0.28}>
            <Link
              to={ROUTES.scentMatchmaker}
              id="story-cta"
              className="inline-flex items-center gap-2 font-sans font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              style={{
                fontSize: '0.8125rem',
                letterSpacing: '0.08em',
                color: 'hsl(43 82% 65%)',
                border: '1px solid hsl(43 82% 52% / 0.35)',
                borderRadius: '2px',
                height: '3.125rem',
                padding: '0 2.25rem',
                transition: 'border-color 280ms cubic-bezier(0.2,0,0,1), background 280ms cubic-bezier(0.2,0,0,1), transform 120ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'hsl(43 82% 52% / 0.75)';
                el.style.background = 'hsl(43 82% 52% / 0.07)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'hsl(43 82% 52% / 0.35)';
                el.style.background = 'transparent';
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              Find Your Signature
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform duration-300"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </InViewBlock>
        </div>
      </Container>

      {/* ── Reduced-motion overrides ─────────────────────────────────── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          /* All framer-motion elements: skip animation, show final state */
          #storytelling [style*="opacity"] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}
