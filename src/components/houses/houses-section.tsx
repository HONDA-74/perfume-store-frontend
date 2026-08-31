import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { Link } from 'react-router';
import { LogoLoop } from './LogoLoop';
import { useAllBrands } from '@/hooks/api/use-brands';
import { useTranslation } from 'react-i18next';

export function HousesSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const brands = useAllBrands();
  const logoItems = (brands.data?.items ?? []).map(brand => ({
    node: (
      <Link 
        to={`/brands/${brand.slug}`}
        className="font-serif uppercase tracking-widest text-3xl md:text-5xl lg:text-6xl text-center px-4 md:px-8 hover:text-[hsl(43,82%,65%)] transition-colors duration-300"
        aria-label={`${t('brands.explore')} ${brand.name}`}
      >
        {brand.name}
      </Link>
    ),
    ariaLabel: brand.name,
  }));

  return (
    <section 
      id="the-houses"
      className="relative w-full overflow-hidden bg-[#0B0A0C] py-24 md:py-32"
      aria-label={t('landing.housesEyebrow')}
    >
      {/* Top Border Rule */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(43 82% 52% / 0.15), transparent)' }}
      />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-16 md:mb-24">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span
            className="inline-flex items-center gap-3 font-sans uppercase mb-6"
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
            {t('landing.housesEyebrow')}
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
          
          <h2 
            className="font-serif text-[#F3F2F5] leading-tight mb-6"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {t('landing.housesTitle')}
          </h2>
          
          <p 
            className="font-sans text-[hsl(0,0%,82%)]/65 mx-auto"
            style={{
              fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
              lineHeight: 1.65,
              letterSpacing: '0.01em',
              maxWidth: '42ch',
            }}
          >
            {t('landing.housesDescription')}
          </p>
        </motion.div>
      </div>

      {/*
        dir="ltr" pins the marquee to left-to-right scroll direction in every language.
        RTL on the html element would flip the flex layout of logoloop__track and reverse
        the perceived direction of the animation. By explicitly setting dir="ltr" here we
        isolate the marquee without touching the global document direction.
        Brand names inside still render normally — only the track scroll direction is locked.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative"
        dir="ltr"
      >
        {brands.isLoading ? (
          <p className="py-12 text-center text-xs uppercase tracking-[0.18em] text-white/30" role="status">{t('brands.loading')}</p>
        ) : brands.isError ? (
          <div className="flex justify-center py-10"><button onClick={() => brands.refetch()} className="border border-[#D4C3A3]/35 px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-[#D4C3A3]">{t('common.retry')}</button></div>
        ) : logoItems.length ? (
          <LogoLoop logos={logoItems} speed={40} gap={12} fadeOut={true} pauseOnHover={true} logoHeight={70} />
        ) : (
          <p className="py-12 text-center text-sm text-white/40">{t('brands.empty')}</p>
        )}
      </motion.div>
    </section>
  );
}
