import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { Container } from '@/components/shared';
import { cn } from '@/lib';
import LiquidEther from './LiquidEther';
import { DepthText } from './DepthText';
import { BlurText } from './BlurText';

/**
 * Hero Section — Landing Page
 *
 * Premium, cinematic hero with the "Liquid Ether" WebGL fluid background.
 * React Bits animated components provide a slow, elegant reveal sequence:
 *
 * 1. Eyebrow  — refined editorial label (static, fades in via CSS)
 * 2. Headline — DepthText (3-D depth + cursor-tracking)
 * 3. Body     — BlurText (word-by-word blur entrance)
 * 4. CTAs     — fade-in with sophisticated hover interaction
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero — KENZ Luxury Perfume"
      className="relative min-h-svh flex items-center overflow-hidden"
    >
      {/* ── Liquid Ether WebGL background ──────────────────────────────── */}
      <div className="absolute inset-0" style={{ zIndex: -1 }}>
        {/* Deep obsidian base so we never show raw white */}
        <div
          className="absolute inset-0"
          style={{ background: 'hsl(0 0% 4%)' }}
        />

        {/* WebGL fluid layer — brand palette colours tuned from design tokens */}
        <div className="absolute inset-0">
          <LiquidEther
            colors={[
              /* Deep violet-indigo — depth */
              '#1a0a2e',
              /* Muted mauve-gold — brand warmth */
              '#6b4226',
              /* Champagne shimmer — primary-300 adjacent */
              '#c9954a',
            ]}
            autoDemo={true}
            autoSpeed={0.25}
            autoIntensity={1.6}
            autoResumeDelay={800}
            autoRampDuration={1.2}
            mouseForce={18}
            cursorSize={90}
            resolution={0.5}
            dt={0.012}
            BFECC={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Gradient vignette — keeps edges dark, text legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, hsl(0 0% 4% / 0.55) 100%)',
          }}
        />

        {/* Bottom fade — anchors content visually */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background:
              'linear-gradient(to top, hsl(0 0% 4% / 0.9) 0%, transparent 100%)',
          }}
        />

        {/* Subtle noise grain for filmic texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '256px 256px',
          }}
        />
      </div>

      {/* ── Hero content ───────────────────────────────────────────────── */}
      <Container className="relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-4xl text-center" style={{ padding: '8rem 0 6rem' }}>

          {/* 1 — Eyebrow */}
          <div
            className="hero-eyebrow mb-8"
            style={{
              animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.1s',
            }}
          >
            <span
              className="inline-flex items-center gap-3 font-sans uppercase"
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.22em',
                color: 'hsl(43 82% 65% / 0.85)',
                fontWeight: 500,
              }}
            >
              {/* Decorative rule */}
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '1px',
                  background: 'hsl(43 82% 65% / 0.45)',
                }}
              />
              The Art of Perfumery
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '2rem',
                  height: '1px',
                  background: 'hsl(43 82% 65% / 0.45)',
                }}
              />
            </span>
          </div>

          {/* 2 — Headline via DepthText */}
          <h1
            className="font-serif"
            style={{
              marginBottom: '2.5rem',
              animation: 'hero-fade-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.25s',
            }}
          >
            {/*
              DepthText renders a cursor-reactive 3-D depth illusion.
              Font size cascades from responsive CSS vars below.
            */}
            <DepthText
              text="Your Signature."
              fontSize="clamp(2.6rem, 7vw, 5.5rem)"
              fontFamily="var(--font-serif)"
              fontWeight={700}
              faceColor="hsl(0 0% 98%)"
              layerColor="hsl(43 78% 44% / 0.25)"
              layerCount={10}
              layerDistance={1.2}
              perspective="600px"
              className="block"
            />
            <DepthText
              text="Reimagined."
              fontSize="clamp(2.6rem, 7vw, 5.5rem)"
              fontFamily="var(--font-serif)"
              fontWeight={700}
              faceColor="hsl(43 82% 65%)"
              layerColor="hsl(43 78% 44% / 0.3)"
              layerCount={10}
              layerDistance={1.2}
              perspective="600px"
              className="block"
            />
          </h1>

          {/* 3 — Supporting text via BlurText */}
          <div
            className="mx-auto mb-14"
            style={{
              maxWidth: '38rem',
              animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.5s',
            }}
          >
            <BlurText
              text="Discover fragrances curated around your taste, your mood, and the moments that define you."
              animateBy="words"
              direction="bottom"
              delay={60}
              stepDuration={0.55}
              className={cn(
                'font-sans leading-relaxed',
                'text-center',
              )}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'hsl(0 0% 88% / 0.82)',
                justifyContent: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.3em',
              } as React.CSSProperties}
            />
          </div>

          {/* 4 — CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{
              animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0.8s',
            }}
          >
            {/* Primary CTA */}
            <Link
              to={ROUTES.shop}
              id="hero-cta-primary"
              className={cn(
                'group relative inline-flex items-center justify-center',
                'font-sans font-medium',
                'transition-all focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
              )}
              style={{
                height: '3.25rem',
                padding: '0 2.25rem',
                fontSize: '0.875rem',
                letterSpacing: '0.06em',
                background: 'hsl(43 82% 52%)',
                color: 'hsl(0 0% 4%)',
                borderRadius: '2px',
                transition: 'background 300ms cubic-bezier(0.2, 0, 0, 1), box-shadow 300ms cubic-bezier(0.2, 0, 0, 1), transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'hsl(43 88% 60%)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 32px -4px hsl(43 78% 44% / 0.55)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'hsl(43 82% 52%)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              Explore the Collection
            </Link>

            {/* Secondary CTA */}
            <Link
              to={ROUTES.scentMatchmaker}
              id="hero-cta-secondary"
              className={cn(
                'group relative inline-flex items-center justify-center gap-2',
                'font-sans font-medium',
                'transition-all focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
              )}
              style={{
                height: '3.25rem',
                padding: '0 2.25rem',
                fontSize: '0.875rem',
                letterSpacing: '0.06em',
                color: 'hsl(43 82% 65%)',
                border: '1px solid hsl(43 82% 52% / 0.4)',
                borderRadius: '2px',
                background: 'transparent',
                transition: 'border-color 300ms cubic-bezier(0.2, 0, 0, 1), background 300ms cubic-bezier(0.2, 0, 0, 1), transform 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'hsl(43 82% 52% / 0.8)';
                (e.currentTarget as HTMLElement).style.background = 'hsl(43 82% 52% / 0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'hsl(43 82% 52% / 0.4)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              <span>Find Your Signature</span>
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
                }}
                className="group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 1,
          animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '1.4s',
        }}
        aria-hidden="true"
      >
        <span
          className="font-sans uppercase"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'hsl(0 0% 74% / 0.45)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '2.5rem',
            background: 'linear-gradient(to bottom, hsl(43 82% 52% / 0.5), transparent)',
            animation: 'hero-scroll-line 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      </div>

      {/* ── Hero animation keyframes ───────────────────────────────────── */}
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes hero-scroll-line {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.15); }
        }

        /* Reduced-motion: instant, no movement */
        @media (prefers-reduced-motion: reduce) {
          .hero-eyebrow,
          [style*="hero-fade-up"],
          [style*="hero-scroll-line"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
