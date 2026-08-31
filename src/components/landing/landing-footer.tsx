import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { KenzTextPressure } from './kenz-text-pressure';
import { useTranslation } from 'react-i18next';

interface FooterLink {
  labelKey: string;
  href: string;
  external?: boolean;
}

interface FooterNavGroup {
  titleKey: string;
  links: FooterLink[];
}

const FOOTER_NAV: FooterNavGroup[] = [
  {
    titleKey: 'footer.nav.discover',
    links: [
      { labelKey: 'footer.nav.collection', href: '/collections' },
      { labelKey: 'footer.nav.newArrivals', href: '/new-arrivals' },
      { labelKey: 'footer.nav.bestSellers', href: '/best-sellers' },
      { labelKey: 'footer.nav.fragranceFinder', href: ROUTES.scentMatchmaker },
    ],
  },
  {
    titleKey: 'footer.nav.theHouse',
    links: [
      { labelKey: 'footer.nav.ourStory', href: '/heritage' },
      { labelKey: 'footer.nav.theHouses', href: '/#the-houses' },
      { labelKey: 'footer.nav.journal', href: '/journal' },
    ],
  },
  {
    titleKey: 'footer.nav.clientServices',
    links: [
      { labelKey: 'footer.nav.contact', href: '/contact' },
      { labelKey: 'footer.nav.shippingDelivery', href: '/shipping' },
      { labelKey: 'footer.nav.returns', href: '/returns' },
      { labelKey: 'footer.nav.faq', href: '/faq' },
    ],
  },
  {
    titleKey: 'footer.nav.follow',
    links: [
      {
        labelKey: 'Instagram',
        href: 'https://www.instagram.com',
        external: true,
      },
      {
        labelKey: 'Pinterest',
        href: 'https://www.pinterest.com',
        external: true,
      },
      {
        labelKey: 'TikTok',
        href: 'https://www.tiktok.com',
        external: true,
      },
    ],
  },
];

const LEGAL_LINK_KEYS = [
  { labelKey: 'footer.legal.privacy', href: '/privacy' },
  { labelKey: 'footer.legal.terms', href: '/terms' },
  { labelKey: 'footer.legal.cookies', href: '/cookies' },
];

interface FooterNavLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

function FooterNavLink({ href, label, external }: FooterNavLinkProps) {
  const sharedClassName =
    'landing-footer__link inline-block font-sans transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4C3A3]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A0C]';

  const sharedStyle = {
    fontSize: '0.8125rem',
    letterSpacing: '0.04em',
    color: 'hsl(0 0% 74% / 0.55)',
  } as const;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
        style={sharedStyle}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={sharedClassName} style={sharedStyle}>
      {label}
    </Link>
  );
}

/**
 * LandingFooter — cinematic editorial footer exclusive to the Landing Page.
 * Deliberately separate from the global Shared UI Footer.
 */
export function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer
      className="relative w-full overflow-hidden bg-[#0B0A0C] text-[#F3F2F5]"
      role="contentinfo"
      aria-label={t('footer.service')}
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
          aria-label={t('nav.primary')}
        >
          {FOOTER_NAV.map((group) => (
            <div key={group.titleKey} className="min-w-0">
              <h2
                className="mb-5 font-sans uppercase"
                style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.22em',
                  color: '#D4C3A3',
                  fontWeight: 500,
                }}
              >
                {t(group.titleKey)}
              </h2>
              <ul className="space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {/*
                      Social links keep their brand name (Instagram, Pinterest, TikTok)
                      untranslated. All other links use the i18n key.
                    */}
                    <FooterNavLink
                      href={link.href}
                      label={link.external ? link.labelKey : t(link.labelKey)}
                      external={link.external}
                    />
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
            © 2026 KENZ. {t('footer.rights')}
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINK_KEYS.map((link, index) => (
              <li key={link.href} className="flex items-center gap-5">
                <FooterNavLink href={link.href} label={t(link.labelKey)} />
                {index < LEGAL_LINK_KEYS.length - 1 && (
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

      {/* KENZ signature — dir="ltr" ensures the brand name never gets reversed in RTL mode */}
      <div className="relative px-4 pb-6 pt-2 md:pb-8 md:pt-4 lg:pb-10" dir="ltr">
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
