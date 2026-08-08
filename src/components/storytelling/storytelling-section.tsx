import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from 'framer-motion';
import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { BlurText } from '@/components/hero/BlurText';
import { PerfumeScene } from '@/components/3d/perfume';

/* ═══════════════════════════════════════════════════════════════════════════
 * CONSTANTS
 * ═════════════════════════════════════════════════════════════════════════ */

const STATEMENTS = [
  { line: 'It begins with a note.', scene: 1 },
  { line: 'Becomes a feeling.',     scene: 2 },
  { line: 'Becomes a memory.',      scene: 3 },
] as const;

/* ═══════════════════════════════════════════════════════════════════════════
 * UTILITY HOOKS / COMPONENTS
 * ═════════════════════════════════════════════════════════════════════════ */

/**
 * InViewBlock — fades + slides up on viewport entry.
 * `once: true` so it stays visible after first reveal.
 */
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
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Thin gold rule that scales in from left on scroll entry. */
function GoldRule({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`origin-center h-px ${className}`}
      style={{ background: 'hsl(43 82% 52% / 0.28)' }}
    />
  );
}

/** Eyebrow label — shared between intro and closing. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-3 font-sans uppercase"
      style={{
        fontSize: '0.6875rem',
        letterSpacing: '0.22em',
        color: 'hsl(43 82% 65% / 0.75)',
        fontWeight: 500,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '1.75rem',
          height: '1px',
          background: 'hsl(43 82% 65% / 0.3)',
        }}
      />
      {children}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '1.75rem',
          height: '1px',
          background: 'hsl(43 82% 65% / 0.3)',
        }}
      />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * STORY STATEMENT — scroll-driven single text line
 * ═════════════════════════════════════════════════════════════════════════ */

interface StoryStatementProps {
  text: string;
  scrollProgress: MotionValue<number>;
  enter: number;
  peak: number;
  exit: number;
}

function StoryStatement({ text, scrollProgress, enter, peak, exit }: StoryStatementProps) {
  const opacity = useTransform(
    scrollProgress,
    [enter, peak, exit - 0.05, exit],
    [0,     1,    1,            0],
  );
  const blurPx = useTransform(
    scrollProgress,
    [enter, peak, exit - 0.05, exit],
    [14,    0,    0,            12],
  );
  const y = useTransform(scrollProgress, [enter, peak], [28, 0]);
  const blurFilter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <motion.span style={{ filter: blurFilter }}>
        <span
          className="block font-serif font-bold uppercase text-center"
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 4rem)',
            color: 'hsl(0 0% 97%)',
            letterSpacing: '0.08em',
            lineHeight: 1.08,
          }}
        >
          {text}
        </span>
      </motion.span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * STORY DOT — progress indicator (own component to satisfy Rules of Hooks)
 * ═════════════════════════════════════════════════════════════════════════ */

function StoryDot({ progress }: { progress: MotionValue<number> }) {
  const bg = useTransform(
    progress,
    [0, 0.35, 0.65, 1],
    [
      'hsl(0 0% 40% / 0.35)',
      'hsl(43 82% 68%)',
      'hsl(43 82% 68%)',
      'hsl(0 0% 40% / 0.35)',
    ],
  );
  return (
    <motion.div
      className="rounded-full transition-all duration-500"
      style={{ width: '5px', height: '5px', background: bg }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * BOTTLE VISUAL — scroll-animated perfume bottle
 *
 * Sits in the right half of the viewport on desktop, centered below text
 * on mobile. All movement is driven by the shared scrollYProgress so it
 * stays synchronised with the text crossfades.
 *
 * Scene windows (each = 1/3 of [0..1]):
 *   S1: 0.00 → 0.33   crisp, left-biased, full opacity
 *   S2: 0.33 → 0.67   translates right + warms
 *   S3: 0.67 → 1.00   translates further + begins to fade
 * ═════════════════════════════════════════════════════════════════════════ */

function BottleVisual({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Opacity — full for scenes 1-2, gently fades in scene 3
  const bottleOpacity = useTransform(scrollProgress, [0, 0.05, 0.78, 1], [0, 1, 1, 0.35]);

  // Ambient glow intensity that evolves with scroll
  const glowOpacity = useTransform(scrollProgress, [0, 0.33, 0.67, 1], [0.25, 0.4, 0.35, 0.2]);

  return (
    <motion.div
      style={{ opacity: bottleOpacity }}
      className="relative flex items-center justify-center w-full"
      aria-hidden="true"
    >
      {/* Atmospheric glow beneath bottle */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(ellipse 65% 80% at 50% 60%, hsl(43 60% 30% / 0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* The interactive 3D bottle */}
      <div 
        className="relative block select-none"
        style={{
          width: '100%',
          height: '70vh', // Provides a tall canvas for the bottle
          maxWidth: '500px'
        }}
      >
        <PerfumeScene scrollProgress={scrollProgress} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SCENE ATMOSPHERE — full-screen background that evolves with scroll
 * ═════════════════════════════════════════════════════════════════════════ */

function SceneAtmosphere({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  // Scene 1 → 2: cool blue-grey → warm amber
  const atm1Opacity = useTransform(scrollProgress, [0, 0.25, 0.5], [1, 1, 0]);
  const atm2Opacity = useTransform(scrollProgress, [0.2, 0.4, 0.65, 0.8], [0, 1, 1, 0]);
  const atm3Opacity = useTransform(scrollProgress, [0.6, 0.8, 1], [0, 1, 1]);

  return (
    <>
      {/* Scene 1 atmosphere — cool, crisp */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: atm1Opacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 65% 50%, hsl(220 25% 8% / 0.8) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '20%', right: '5%', width: '35%', height: '60%',
            background: 'radial-gradient(ellipse at 50% 40%, hsl(200 30% 15% / 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Scene 2 atmosphere — warm, amber */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: atm2Opacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 65% 70% at 62% 48%, hsl(25 30% 8% / 0.85) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '15%', right: '8%', width: '38%', height: '65%',
            background: 'radial-gradient(ellipse at 50% 45%, hsl(43 50% 18% / 0.2) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </motion.div>

      {/* Scene 3 atmosphere — deep violet, intimate */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: atm3Opacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 65% 70% at 60% 52%, hsl(270 20% 6% / 0.9) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '10%', right: '6%', width: '40%', height: '70%',
            background: 'radial-gradient(ellipse at 50% 50%, hsl(280 30% 12% / 0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SCROLL STORY SEQUENCE
 *
 * Outer wrapper: 400vh (≈ 1.33 screens per statement = comfortable pacing)
 * Sticky inner: 100svh — one cinema frame
 * Layout on desktop: bottle right, text left-center
 * Layout on mobile: stacked — text top-center, bottle below
 * ═════════════════════════════════════════════════════════════════════════ */

function ScrollStorySequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const seg = 1 / STATEMENTS.length;
  const overlap = 0.055;

  const progressValues = STATEMENTS.map((_, i) => ({
    enter: Math.max(0, i * seg - overlap),
    peak:  i * seg + seg * 0.1,
    exit:  Math.min(1, (i + 1) * seg + overlap),
  }));

  // Individual normalised progress for each statement (0→1 within its window)
  const p0 = useTransform(scrollYProgress, [progressValues[0].enter, progressValues[0].exit], [0, 1]);
  const p1 = useTransform(scrollYProgress, [progressValues[1].enter, progressValues[1].exit], [0, 1]);
  const p2 = useTransform(scrollYProgress, [progressValues[2].enter, progressValues[2].exit], [0, 1]);
  const progressArr = [p0, p1, p2];

  // Progress bar
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '400vh' }}
      aria-label="Story sequence"
    >
      {/* ── Sticky cinema frame ─────────────────────────────────────── */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{
          height: '100svh',
          background: 'hsl(0 0% 3%)',
        }}
      >
        {/* Base obsidian layer */}
        <div className="absolute inset-0" style={{ background: 'hsl(0 0% 3%)' }} />

        {/* Evolving atmosphere */}
        <SceneAtmosphere scrollProgress={scrollYProgress} />

        {/* Subtle noise grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.028,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Gold progress line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'hsl(43 82% 52% / 0.12)' }} />
        <motion.div
          className="absolute top-0 left-0 h-px origin-left"
          style={{ scaleX: lineScaleX, background: 'hsl(43 82% 60%)', right: 0 }}
        />

        {/* ── Main composition ─────────────────────────────────────── */}
        <div className="relative h-full flex items-center">

          {/* Desktop: two-column. Mobile: stacked (bottle below text). */}
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 lg:justify-between">

            {/* ── LEFT — text statements ─────────────────────────── */}
            <div
              className="relative lg:w-1/2"
              style={{ height: 'clamp(8rem, 20vw, 14rem)' }}
            >
              {STATEMENTS.map(({ line }, i) => (
                <StoryStatement
                  key={line}
                  text={line}
                  scrollProgress={progressArr[i]}
                  enter={progressValues[i].enter}
                  peak={progressValues[i].peak}
                  exit={progressValues[i].exit}
                />
              ))}
            </div>

            {/* ── RIGHT — animated bottle ─────────────────────────── */}
            <div className="lg:w-1/2 flex items-center justify-center">
              <BottleVisual scrollProgress={scrollYProgress} />
            </div>
          </div>

          {/* Progress dots — centered bottom */}
          <div
            className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-2.5"
            aria-hidden="true"
          >
            {progressArr.map((p, i) => (
              <StoryDot key={i} progress={p} />
            ))}
          </div>

          {/* Scroll hint — visible before first statement peaks */}
          <div
            className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2"
            aria-hidden="true"
          >
            <span
              className="font-sans uppercase"
              style={{ fontSize: '0.575rem', letterSpacing: '0.2em', color: 'hsl(0 0% 55% / 0.5)', writingMode: 'vertical-rl' }}
            >
              Scroll
            </span>
            <div
              style={{
                width: '1px',
                height: '2rem',
                background: 'linear-gradient(to bottom, hsl(43 82% 52% / 0.4), transparent)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * INTRO SCENE — full-viewport cinematic frame
 * ═════════════════════════════════════════════════════════════════════════ */

function IntroScene() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100svh',
        background: 'hsl(0 0% 4%)',
      }}
    >
      {/* Faint ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 50%, hsl(43 40% 10% / 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Content */}
      <div
        className="relative mx-auto text-center px-6"
        style={{ maxWidth: '50rem' }}
      >
        {/* Eyebrow */}
        <InViewBlock delay={0}>
          <div style={{ marginBottom: '2.25rem' }}>
            <Eyebrow>The Language of Scent</Eyebrow>
          </div>
        </InViewBlock>

        {/* H2 */}
        <InViewBlock delay={0.12}>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)',
              fontWeight: 700,
              lineHeight: 1.13,
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
          <div style={{ marginBottom: '2rem' }}>
            <GoldRule className="max-w-xs mx-auto" />
          </div>
        </InViewBlock>

        {/* BlurText supporting copy */}
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
              color: 'hsl(0 0% 80% / 0.7)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.28em',
            } as React.CSSProperties}
          />
        </InViewBlock>

        {/* Scroll nudge */}
        <InViewBlock delay={0.7}>
          <div
            className="flex flex-col items-center gap-2 mx-auto"
            style={{ marginTop: '4rem', opacity: 0.5 }}
            aria-hidden="true"
          >
            <div
              style={{
                width: '1px',
                height: '2.5rem',
                background: 'linear-gradient(to bottom, hsl(43 82% 52% / 0.5), transparent)',
                animation: 'story-scroll-pulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
              }}
            />
          </div>
        </InViewBlock>
      </div>

      <style>{`
        @keyframes story-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 0.8; transform: scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * CLOSING SCENE — full-viewport, bottle fades out, CTA becomes focal point
 * ═════════════════════════════════════════════════════════════════════════ */

function ClosingScene() {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100svh',
        background: 'hsl(0 0% 3%)',
      }}
    >
      {/* Faint warm vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at 50% 45%, hsl(43 30% 8% / 0.4) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative mx-auto text-center px-6"
        style={{ maxWidth: '44rem' }}
      >
        {/* Closing eyebrow */}
        <InViewBlock delay={0}>
          <div style={{ marginBottom: '2rem' }}>
            <Eyebrow>A Fragrance is a Statement</Eyebrow>
          </div>
        </InViewBlock>

        {/* Closing headline */}
        <InViewBlock delay={0.12}>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              fontWeight: 700,
              lineHeight: 1.18,
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

        {/* Gold rule */}
        <InViewBlock delay={0.22}>
          <div style={{ marginBottom: '2rem' }}>
            <GoldRule className="max-w-40 mx-auto" />
          </div>
        </InViewBlock>

        {/* Supporting line */}
        <InViewBlock delay={0.3}>
          <p
            className="font-sans"
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
              color: 'hsl(0 0% 78% / 0.65)',
              marginBottom: '3.5rem',
              letterSpacing: '0.01em',
            }}
          >
            Discover the scent that speaks your language.
          </p>
        </InViewBlock>

        {/* CTA */}
        <InViewBlock delay={0.42}>
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
              transition:
                'border-color 280ms cubic-bezier(0.2,0,0,1), background 280ms cubic-bezier(0.2,0,0,1), transform 120ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'hsl(43 82% 52% / 0.7)';
              el.style.background = 'hsl(43 82% 52% / 0.07)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'hsl(43 82% 52% / 0.35)';
              el.style.background = 'transparent';
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * StorytellingSection — exported root component
 * ═════════════════════════════════════════════════════════════════════════ */

export function StorytellingSection() {
  return (
    <section
      id="storytelling"
      aria-label="The Language of Scent — brand story"
    >
      {/* ── Scene 0: Intro — full viewport ──────────────────────── */}
      <IntroScene />

      {/* ── Scenes 1-3: Scroll-driven story sequence ────────────── */}
      <ScrollStorySequence />

      {/* ── Scene 4: Closing — full viewport ────────────────────── */}
      <ClosingScene />

      {/* ── Reduced motion: skip all transforms, show final state ── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #storytelling [data-motion],
          #storytelling .framer-motion {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
            filter: none !important;
          }
        }
        @keyframes story-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 0.8; transform: scaleY(1.1); }
        }
      `}</style>
    </section>
  );
}
