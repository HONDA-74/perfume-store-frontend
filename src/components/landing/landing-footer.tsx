import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { KenzTextPressure } from './kenz-text-pressure';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterNavGroup {
  title: string;
  links: FooterLink[];
}

const FOOTER_NAV: FooterNavGroup[] = [
  {
    title: 'Discover',
    links: [
      { label: 'Collection', href: '/collections' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'Fragrance Finder', href: ROUTES.scentMatchmaker },
    ],
  },
  {
    title: 'The House',
    links: [
      { label: 'Our Story', href: '/heritage' },
      { label: 'The Houses', href: '/#the-houses' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    title: 'Client Services',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Follow',
    links: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com',
        external: true,
      },
      {
        label: 'Pinterest',
        href: 'https://www.pinterest.com',
        external: true,
      },
      {
        label: 'TikTok',
        href: 'https://www.tiktok.com',
        external: true,
      },
    ],
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
];

function FooterNavLink({ link }: { link: FooterLink }) {
  const sharedClassName =
    'landing-footer__link inline-block font-sans transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4C3A3]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A0C]';

  const sharedStyle = {
    fontSize: '0.8125rem',
    letterSpacing: '0.04em',
    color: 'hsl(0 0% 74% / 0.55)',
  } as const;

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
        style={sharedStyle}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link to={link.href} className={sharedClassName} style={sharedStyle}>
      {link.label}
    </Link>
  );
}

/**
 * LandingFooter — cinematic editorial footer exclusive to the Landing Page.
 * Deliberately separate from the global Shared UI Footer.
 */
export function LandingFooter() {
  return (
    <footer
      className="relative w-full overflow-hidden bg-[#0B0A0C] text-[#F3F2F5]"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top editorial rule */}
      <div
        className="mx-auto h-px w-[88%] max-w-7xl"
        style={{
          background:
            'linear-gradient(90deg, transparent, hsl(43 82% 52% / 0.12), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-20 pb-10 md:pt-28 md:pb-12 lg:pt-32 lg:pb-14">
        {/* Navigation */}
        <nav
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4 lg:gap-8"
          aria-label="Footer navigation"
        >
          {FOOTER_NAV.map((group) => (
            <div key={group.title} className="min-w-0">
              <h2
                className="mb-5 font-sans uppercase"
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.22em',
                  color: '#D4C3A3',
                  fontWeight: 500,
                }}
              >
                {group.title}
              </h2>
              <ul className="space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Legal row */}
        <div className="mt-20 flex flex-col gap-5 border-t border-[#19181E] pt-8 md:mt-24 md:flex-row md:items-center md:justify-between md:pt-10 lg:mt-28">
          <p
            className="font-sans"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.03em',
              color: 'hsl(0 0% 74% / 0.4)',
            }}
          >
            © 2026 KENZ. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link, index) => (
              <li key={link.href} className="flex items-center gap-5">
                <FooterNavLink link={link} />
                {index < LEGAL_LINKS.length - 1 && (
                  <span
                    className="hidden sm:inline"
                    style={{ color: 'hsl(0 0% 74% / 0.2)' }}
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* KENZ signature */}
      <div className="relative px-4 pb-6 pt-2 md:pb-8 md:pt-4 lg:pb-10">
        <KenzTextPressure text="KENZ" />
        <span className="sr-only">KENZ</span>
      </div>

      <style>{`
        .landing-footer__link:hover,
        .landing-footer__link:focus-visible {
          color: #D4C3A3;
          transform: translateX(4px);
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-footer__link:hover,
          .landing-footer__link:focus-visible {
            transform: none;
          }
        }
      `}</style>
    </footer>
  );
}
