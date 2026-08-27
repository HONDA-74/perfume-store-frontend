import { lazy, Suspense } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { Container } from '@/components/shared';
import { cn } from '@/lib';
import { BlurText } from './BlurText';
import { LandingNavbar } from './LandingNavbar';

const LiquidEther = lazy(() => import('./LiquidEther'));

/**
 * HeroSection — Landing Page
 *
 * Composition:
 *  1. LandingNavbar — floating glassmorphic nav (no utility icons)
 *  2. Eyebrow       — "THE ART OF PERFUMERY" (static, editorial)
 *  3. Headline      — "Your Signature. Reimagined." (static serif, no 3D/depth)
 *  4. Body          — BlurText (word-by-word blur reveal)
 *  5. CTAs          — Primary gold + Secondary ghost
 *  6. Scroll indicator
 *
 * Background: LiquidEther WebGL fluid — unchanged.
 * DepthText has been removed per design decision.
 * BlurText is reused exactly as implemented, not recreated.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero — KENZ Luxury Perfume"
      className="relative min-h-svh flex flex-col overflow-hidden"
    >
      {/* ── Liquid Ether WebGL background ─────────────────────────────── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {/* Obsidian base — never show raw white */}
        <div className="absolute inset-0" style={{ background: 'hsl(0 0% 4%)' }} />

        {/* WebGL fluid layer */}
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <LiquidEther
              colors={[
                '#1a0a2e', /* deep violet-indigo */
                '#6b4226', /* muted mauve-gold */
                '#c9954a', /* champagne shimmer */
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
          </Suspense>
        </div>

        {/* Radial vignette — text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, hsl(0 0% 4% / 0.55) 100%)',
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: 'linear-gradient(to top, hsl(0 0% 4% / 0.9) 0%, transparent 100%)',
          }}
        />

        {/* Filmic grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '256px 256px',
          }}
        />
      </div>

      {/* ── Landing Navbar (floats above background) ──────────────────── */}
      <div className="relative" style={{ zIndex: 10 }}>
        <LandingNavbar />
      </div>

      {/* ── Hero content — vertically centred in remaining space ────────── */}
      <div className="relative flex flex-1 items-center" style={{ zIndex: 1 }}>
        <Container>
          <div
            className="mx-auto text-center"
            style={{ maxWidth: '52rem', padding: '4rem 0 6rem' }}
          >

            {/* 1 — Eyebrow */}
            <div
              style={{
                marginBottom: '2rem',
                animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0.15s',
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

            {/* 2 — Static serif headline (DepthText removed) */}
            <h1
              className="font-serif"
              style={{
                marginBottom: '2rem',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                animation: 'hero-fade-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0.3s',
              }}
            >
              {/* Line 1 — white */}
              <span
                className="block"
                style={{
                  fontSize: 'clamp(2.75rem, 7.5vw, 5.75rem)',
                  color: 'hsl(0 0% 98%)',
                  fontWeight: 700,
                }}
              >
                Your Signature.
              </span>

              {/* Line 2 — champagne gold accent */}
              <span
                className="block"
                style={{
                  fontSize: 'clamp(2.75rem, 7.5vw, 5.75rem)',
                  color: 'hsl(43 82% 65%)',
                  fontWeight: 700,
                }}
              >
                Reimagined.
              </span>
            </h1>

            {/* 3 — Supporting text — BlurText (reused, not recreated) */}
            <div
              className="mx-auto"
              style={{
                maxWidth: '36rem',
                marginBottom: '3.5rem',
              }}
            >
              <BlurText
                text="Discover fragrances curated around your taste, your mood, and the moments that define you."
                animateBy="words"
                direction="bottom"
                delay={55}
                stepDuration={0.5}
                className={cn('font-sans leading-relaxed text-center')}
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  color: 'hsl(0 0% 88% / 0.80)',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '0.28em',
                } as React.CSSProperties}
              />
            </div>

            {/* 4 — CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              style={{
                animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0.85s',
              }}
            >
              {/* Primary — solid gold */}
              <Link
                to={ROUTES.shop}
                id="hero-cta-primary"
                className={cn(
                  'group inline-flex items-center justify-center',
                  'font-sans font-medium',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
                )}
                style={{
                  height: '3.125rem',
                  padding: '0 2.25rem',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  background: 'hsl(43 82% 52%)',
                  color: 'hsl(0 0% 4%)',
                  borderRadius: '2px',
                  transition: 'background 280ms cubic-bezier(0.2,0,0,1), box-shadow 280ms cubic-bezier(0.2,0,0,1), transform 120ms ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'hsl(43 88% 60%)';
                  el.style.boxShadow = '0 4px 28px -4px hsl(43 78% 44% / 0.5)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'hsl(43 82% 52%)';
                  el.style.boxShadow = 'none';
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                Explore the Collection
              </Link>

              {/* Secondary — ghost gold */}
              <Link
                to={ROUTES.scentMatchmaker}
                id="hero-cta-secondary"
                className={cn(
                  'group inline-flex items-center justify-center gap-2',
                  'font-sans font-medium',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
                )}
                style={{
                  height: '3.125rem',
                  padding: '0 2.25rem',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  color: 'hsl(43 82% 65%)',
                  border: '1px solid hsl(43 82% 52% / 0.38)',
                  borderRadius: '2px',
                  background: 'transparent',
                  transition: 'border-color 280ms cubic-bezier(0.2,0,0,1), background 280ms cubic-bezier(0.2,0,0,1), transform 120ms ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'hsl(43 82% 52% / 0.75)';
                  el.style.background = 'hsl(43 82% 52% / 0.07)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'hsl(43 82% 52% / 0.38)';
                  el.style.background = 'transparent';
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                <span>Find Your Signature</span>
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
            </div>
          </div>
        </Container>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 2,
          animation: 'hero-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '1.5s',
        }}
        aria-hidden="true"
      >
        <span
          className="font-sans uppercase"
          style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'hsl(0 0% 74% / 0.4)' }}
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

      {/* ── Keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-scroll-line {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="hero-fade-up"],
          [style*="hero-scroll-line"],
          [style*="landing-nav-enter"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
