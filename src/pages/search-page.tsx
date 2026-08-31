import { useEffect, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ProductCard } from '@/components/shared/product-card';
import { useProducts } from '@/hooks/api/use-products';

const sortOptions = [
  { value: '', key: 'catalog.featured' }, { value: 'createdAt:desc', key: 'catalog.newest' },
  { value: 'price:asc', key: 'catalog.priceLow' }, { value: 'price:desc', key: 'catalog.priceHigh' },
  { value: 'name:asc', key: 'catalog.nameAz' },
] as const;

export function SearchPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const page = Math.max(1, Number(params.get('page') || 1));
  const sort = params.get('sort') ?? '';
  const [input, setInput] = useState(query);
  useEffect(() => setInput(query), [query]);
  const results = useProducts(query ? { search: query, page, limit: 8, sort: sort || undefined } : undefined);
  const count = results.data?.meta.totalItems ?? 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = input.trim();
    setParams(next ? { q: next } : {});
  };
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  return (
    <main className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <header className="border-b border-white/[0.05] bg-[#0D0C10]">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
          <Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('search.title') }]} className="mb-6" />
          <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/45">{t('search.title')}</p>
          <form onSubmit={submit}>
            <label htmlFor="search-page" className="sr-only">{t('search.placeholder')}</label>
            <div className={`flex items-center gap-4 border-b-2 pb-3 ${query ? 'border-[#D4A017]' : 'border-white/15'}`}>
              <Search size={22} className="shrink-0 text-white/25" />
              <input id="search-page" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('search.placeholder')} className="min-w-0 flex-1 bg-transparent font-serif text-[clamp(1.2rem,2.5vw,1.75rem)] text-white/90 outline-none placeholder:text-white/15" />
              <button className="h-10 shrink-0 bg-[#D4A017] px-5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#0B0A0C]">{t('common.search')}</button>
            </div>
          </form>
          {query && <div className="mt-4 flex items-center gap-3 text-[11px] font-light text-white/35"><p>{t('search.results', { query })}</p><span className="text-white/15">·</span><p>{t('search.resultsCount', { count })}</p></div>}
        </div>
      </header>

      {query && !!results.data?.items.length && <div className="sticky top-16 z-20 border-b border-white/[0.05] bg-[#0B0A0C]/95 backdrop-blur-lg lg:top-20"><div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-6 lg:px-12"><span className="text-[10px] uppercase tracking-[0.12em] text-white/30">{t('search.resultsCount', { count })}</span><select aria-label={t('catalog.sortBy')} value={sort} onChange={(event) => change('sort', event.target.value)} className="h-8 cursor-pointer border border-white/[0.08] bg-transparent px-3 text-[10px] tracking-[0.06em] text-white/50 outline-none">{sortOptions.map((option) => <option key={option.key} value={option.value} className="bg-[#121115]">{t(option.key)}</option>)}</select></div></div>}

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
        {!query ? <div className="flex min-h-[40vh] flex-col items-center justify-center text-center"><Search size={40} strokeWidth={1} className="mb-6 text-white/10" /><p className="mb-3 font-serif text-xl text-white/40">{t('search.startTitle')}</p><p className="max-w-xs text-xs font-light text-white/25">{t('search.start')}</p></div> : results.isLoading || results.isFetching ? <PageLoader /> : !results.data?.items.length ? <EmptyState title={t('search.noResults')} message={t('search.noResultsDescription', { query })} actionLabel={t('search.clear')} onAction={() => { setInput(''); setParams({}); }} /> : <><div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">{results.data.items.map((product) => <ProductCard key={product.id} product={product} />)}</div><Pagination page={page} total={results.data.meta.totalPages} onChange={(value) => change('page', String(value))} /></>}
      </div>
    </main>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  const { t } = useTranslation();
  if (total <= 1) return null;
  const pages = Array.from({ length: Math.min(total, 7) }, (_, index) => index + 1);
  return <nav aria-label={t('search.resultPages')} className="mt-14 flex justify-center gap-2"><button aria-label={t('common.previous')} disabled={page === 1} onClick={() => onChange(page - 1)} className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/35 disabled:opacity-25"><ChevronLeft size={14} className="directional-icon" /></button>{pages.map((value) => <button key={value} onClick={() => onChange(value)} aria-current={value === page ? 'page' : undefined} className={`h-9 w-9 border text-[11px] ${value === page ? 'border-[#D4A017]/40 bg-[#D4A017]/[0.08] font-medium text-[#D4A017]' : 'border-white/[0.06] font-light text-white/35'}`}>{value}</button>)}<button aria-label={t('common.next')} disabled={page === total} onClick={() => onChange(page + 1)} className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/35 disabled:opacity-25"><ChevronRight size={14} className="directional-icon" /></button></nav>;
}
