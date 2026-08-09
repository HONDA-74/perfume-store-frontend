import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { Link } from 'react-router';
import { LogoLoop } from './LogoLoop';
import { MOCK_BRANDS } from '@/lib/mock-data';

export function HousesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  // Map our mock brands into nodes suitable for LogoLoop.
  // The LogoLoop will wrap these in a list item, but we handle the Link internally 
  // via the renderItem override or by providing a node with href. 
  // We'll pass `node` which contains a Link.
  const logoItems = MOCK_BRANDS.map(brand => ({
    node: (
      <Link 
        to={`/brands/${brand.slug}`}
        className="font-serif uppercase tracking-widest text-3xl md:text-5xl lg:text-6xl text-center px-4 md:px-8 hover:text-[hsl(43,82%,65%)] transition-colors duration-300"
        aria-label={`Explore ${brand.name}`}
      >
        {brand.name}
      </Link>
    ),
    ariaLabel: brand.name,
  }));

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#0B0A0C] py-24 md:py-32"
      aria-label="The Houses"
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
            THE HOUSES
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
            The Houses Behind the Scent.
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
            Explore the houses behind some of the world's most distinctive fragrances.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative"
      >
        <LogoLoop 
          logos={logoItems}
          speed={40} 
          gap={12} 
          fadeOut={true}
          pauseOnHover={true} 
          logoHeight={70}
        />
      </motion.div>
    </section>
  );
}
