import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';

const principles = [
  ['01', 'Craft', 'Every fragrance in our registry is the result of years of refinement — raw materials sourced with intention, compositions layered with patience. We do not rush what is meant to last.'],
  ['02', 'Character', 'Scent is one of the most honest languages. We curate only those fragrances that communicate something true — about the wearer, the season, the hour. Anonymity has no place here.'],
  ['03', 'Memory', 'The olfactory is the only sense connected directly to memory and emotion. We take this seriously. What you choose to wear becomes part of how you are remembered.'],
];

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`${className} transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'}`}>{children}</div>;
}

export function HeritagePage() {
  return (
    <main className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <section className="relative flex min-h-[620px] items-start overflow-hidden">
        <img src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1600&q=85" alt="Artisan perfume bottles" className="absolute inset-0 h-full w-full object-cover brightness-[0.28]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,10,12,0.2)_0%,rgba(11,10,12,0.6)_60%,#0B0A0C_100%)]" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-24 pt-14 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4C3A3]/50">The Art of Perfumery</p>
            <h1 className="mb-5 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.1] text-white/90">A Legacy Written<br />in Scent</h1>
            <p className="max-w-[500px] text-[15px] font-light leading-[1.75] text-white/[0.38]">KENZ exists as a response to a world saturated with the ordinary. We are curators — not creators — of the world's most considered fragrances.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <p className="mb-3.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">The Philosophy</p>
              <h2 className="mb-5 font-serif text-[clamp(1.6rem,2.5vw,2.4rem)] font-normal leading-[1.2] text-white/85">Fragrance as<br />a Point of View</h2>
              <div className="space-y-4 text-sm font-light leading-[1.8] text-white/[0.38]">
                <p>We believe that what you wear on your skin is an act of authorship. Fragrance is not decoration — it is a decision. It is the invisible layer of your presence, the one that lingers after you leave the room.</p>
                <p>Our registry draws from ateliers across France, the Middle East, and beyond. We seek ingredients at their point of origin: Bulgarian rose harvested at dawn, Haitian vetiver pulled from the earth, oud from the oldest forests of Assam.</p>
                <p>We do not chase trends. We chase excellence — and we hold it to the same standard each time.</p>
              </div>
            </div>
            <div className="relative order-1 aspect-[4/5] overflow-hidden lg:order-2">
              <img src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=85" alt="Perfume craftsmanship" className="h-full w-full object-cover brightness-75 contrast-105" />
              <div className="absolute inset-0 border border-white/[0.05]" />
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="h-px bg-white/[0.05]" /></div>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <p className="mb-10 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">Our Principles</p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {principles.map(([number, title, copy]) => (
              <article key={number}>
                <p className="mb-4.5 font-serif text-[40px] leading-none text-[#D4C3A3]/[0.12]">{number}</p>
                <div className="mb-5 h-px w-6 bg-[#D4A017]" />
                <h3 className="mb-3.5 font-serif text-[1.3rem] font-normal tracking-[0.02em] text-white/80">{title}</h3>
                <p className="text-[13px] font-light leading-[1.75] text-white/[0.33]">{copy}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.04),transparent_70%),linear-gradient(135deg,#121115,#0B0A0C)] py-24 lg:py-36">
        <Reveal className="relative mx-auto max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
          <div className="mx-auto mb-12 h-16 w-px bg-[linear-gradient(to_bottom,transparent,rgba(212,195,163,0.25))]" />
          <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4C3A3]/35">In Memoriam</p>
          <blockquote className="mx-auto mb-8 max-w-[700px] font-serif text-[clamp(1.6rem,3vw,2.8rem)] font-normal italic leading-[1.3] text-white/75">“Scent is memory, made visible.”</blockquote>
          <Link to={ROUTES.shop} className="inline-flex h-12 items-center gap-2.5 bg-[#D4A017] px-8 text-[10px] font-medium uppercase tracking-[0.14em] text-[#0B0A0C] transition-opacity hover:opacity-85">Explore the Collection <ArrowRight size={13} /></Link>
        </Reveal>
      </section>
    </main>
  );
}
