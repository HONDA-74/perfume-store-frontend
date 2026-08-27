import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { AccordionGallery } from './AccordionGallery';
import { useProducts } from '@/hooks/api/use-products';
import { Link } from 'react-router';
import { ROUTES } from '@/constants';

export function CollectionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const products = useProducts({ limit: 5, isFeatured: true });
  const galleryItems = (products.data?.items ?? []).map(product => ({
    image: product.images[0],
    label: product.name,
    sublabel: product.brand?.name ?? product.concentration,
    description: product.description,
    link: `/products/${product.slug}`,
    alt: product.name,
  }));

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#0B0A0C] py-24 md:py-32 lg:py-40"
      aria-label="The Collection"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
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
              THE COLLECTION
              <span
                aria-hidden="true"
                className="md:hidden"
                style={{
                  display: 'inline-block',
                  width: '1.75rem',
                  height: '1px',
                  background: 'hsl(43 82% 65% / 0.3)',
                }}
              />
            </span>
            
            <h2 
              className="font-serif text-[#F3F2F5] leading-tight"
              style={{
                fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                letterSpacing: '-0.02em',
              }}
            >
              A Study in Scent.
            </h2>
          </div>
          
          <div className="max-w-md md:text-right">
            <p 
              className="font-sans text-[hsl(0,0%,82%)]/65"
              style={{
                fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
                lineHeight: 1.65,
                letterSpacing: '0.01em',
              }}
            >
              Discover the compositions that define our collection — from dark woods and warm amber to luminous florals and modern oud.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {products.isLoading ? (
            <div className="flex h-[550px] items-center justify-center border border-white/[0.06] text-xs uppercase tracking-[0.18em] text-white/30" role="status">Curating the collection…</div>
          ) : products.isError ? (
            <div className="flex h-[420px] flex-col items-center justify-center gap-5 border border-white/[0.06] text-center text-white/45"><p>We couldn't load the collection.</p><button onClick={() => products.refetch()} className="border border-[#D4C3A3]/35 px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-[#D4C3A3]">Try Again</button></div>
          ) : galleryItems.length ? (
            <AccordionGallery items={galleryItems} height={550} defaultIndex={0} tilt={6} parallax={0.3} />
          ) : (
            <div className="flex h-[420px] flex-col items-center justify-center gap-5 border border-white/[0.06] text-center text-white/45"><p>No featured fragrances are available yet.</p><Link to={ROUTES.shop} className="border border-[#D4C3A3]/35 px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-[#D4C3A3]">Explore the Shop</Link></div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
