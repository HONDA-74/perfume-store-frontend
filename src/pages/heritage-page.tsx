import { Link } from 'react-router';
import { ROUTES } from '@/constants/routes.constants';

const principles = [
  ['01', 'Discernment', 'A focused edit of fragrances chosen for character, craft, and the way they live on skin.'],
  ['02', 'Provenance', 'Clear houses, concentrations, notes, and formats so every selection can be made with confidence.'],
  ['03', 'Ritual', 'A calm digital experience designed to make discovering a signature scent feel considered.'],
];

export function HeritagePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0A0C] text-[#F3F2F5]">
      <section className="relative flex min-h-[72vh] items-end border-b border-white/10 px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(212,195,163,0.12),transparent_34%),linear-gradient(135deg,transparent_35%,rgba(255,255,255,0.025))]" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="mb-6 text-[10px] uppercase tracking-[0.26em] text-[#D4C3A3]">The KENZ point of view</p>
          <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.055em]">Scent, chosen with intention.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-32">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4C3A3]">Our heritage</p>
        <div>
          <p className="font-serif text-3xl leading-tight text-white/90 sm:text-5xl">KENZ was shaped around a simple belief: fragrance deserves the same care as every lasting object in your life.</p>
          <p className="mt-8 max-w-2xl text-base font-light leading-8 text-white/48">We bring together celebrated houses and distinctive compositions in a catalogue that values clarity over noise. From the first note to the final dry-down, the experience is built for thoughtful discovery.</p>
        </div>
      </section>

      <section className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-5 sm:px-8 lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:px-12">
          {principles.map(([number, title, copy]) => (
            <article key={number} className="py-12 lg:px-9 lg:py-16 first:lg:pl-0 last:lg:pr-0">
              <span className="text-[10px] tracking-[0.2em] text-[#D4C3A3]">{number}</span>
              <h2 className="mt-10 font-serif text-3xl">{title}</h2>
              <p className="mt-4 text-sm font-light leading-7 text-white/42">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 text-center sm:px-8 lg:py-36">
        <p className="font-serif text-4xl sm:text-6xl">Find the scent that stays with you.</p>
        <Link to={ROUTES.shop} className="mt-10 inline-block border border-[#D4C3A3]/50 px-8 py-4 text-[10px] uppercase tracking-[0.2em] text-[#D4C3A3] transition-colors hover:bg-[#D4C3A3] hover:text-[#0B0A0C]">Explore the collection</Link>
      </section>
    </main>
  );
}
