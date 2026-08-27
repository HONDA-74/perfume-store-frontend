import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useCategories } from '@/hooks/api/use-categories';

export function CollectionsPage() {
  const categories = useCategories({ limit: 100 });

  return (
    <main className="min-h-screen bg-[#0B0A0C] px-5 pb-24 pt-24 text-[#F3F2F5] sm:px-8 lg:px-12 lg:pt-32">
      <header className="mx-auto max-w-7xl border-b border-white/10 pb-12">
        <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#D4C3A3]">Curated by character</p>
        <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">The Collections</h1>
        <p className="mt-7 max-w-xl text-sm font-light leading-7 text-white/50 sm:text-base">
          Explore fragrance by concentration, composition, and mood. Every collection is drawn directly from the KENZ catalogue.
        </p>
      </header>

      <section className="mx-auto mt-10 grid max-w-7xl gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.isLoading ? Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-64 animate-pulse bg-[#121013]" />
        )) : categories.isError ? (
          <div className="col-span-full bg-[#121013] px-6 py-20 text-center">
            <p className="text-sm text-white/45">The collections could not be loaded.</p>
            <button onClick={() => categories.refetch()} className="mt-6 border border-[#D4C3A3]/40 px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-[#D4C3A3]">Try again</button>
          </div>
        ) : categories.data?.items.length ? categories.data.items.map((category, index) => (
          <Link
            key={category.id}
            to={`/shop?categoryId=${category.id}`}
            className="group relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#121013] p-7 transition-colors hover:bg-[#181518]"
          >
            <span className="font-serif text-5xl text-white/[0.06]">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-serif text-3xl tracking-[-0.02em] text-white/90">{category.name}</h2>
              <p className="mt-3 line-clamp-2 text-sm font-light leading-6 text-white/40">{category.description}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#D4C3A3]">
                Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )) : (
          <p className="col-span-full bg-[#121013] px-6 py-20 text-center text-sm text-white/40">No collections are available yet.</p>
        )}
      </section>
    </main>
  );
}
