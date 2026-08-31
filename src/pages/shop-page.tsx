import * as React from 'react';
import { useSearchParams } from 'react-router';
import { ChevronLeft, ChevronRight, Minus, Plus, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/shared/product-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageLoader } from '@/components/shared/page-loader';
import { useAllBrands } from '@/hooks/api/use-brands';
import { useAllCategories } from '@/hooks/api/use-categories';
import { useProducts } from '@/hooks/api/use-products';
import { FragranceConcentration, FragranceGender, type ProductQueryParams } from '@/types';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 12;
const PRICE_MAX = 500;
const SIZE_OPTIONS = [30, 50, 100, 200];

const SORT_OPTIONS = [
  { value: 'featured', key: 'catalog.featured' },
  { value: 'createdAt:desc', key: 'catalog.newest' },
  { value: 'price:asc', key: 'catalog.priceLow' },
  { value: 'price:desc', key: 'catalog.priceHigh' },
  { value: 'name:asc', key: 'catalog.nameAz' },
];

const GENDER_OPTIONS = [
  { value: FragranceGender.FEMALE, key: 'catalog.women' },
  { value: FragranceGender.MALE, key: 'catalog.men' },
  { value: FragranceGender.UNISEX, key: 'catalog.unisex' },
];

const CONCENTRATION_OPTIONS = [
  { value: FragranceConcentration.EDP, label: 'Eau de Parfum' },
  { value: FragranceConcentration.PARFUM, label: 'Parfum' },
  { value: FragranceConcentration.EDT, label: 'Eau de Toilette' },
  { value: FragranceConcentration.EDC, label: 'Eau de Cologne' },
];

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D4C3A3]/60">{children}</p>;
}

function Choice({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="group flex min-h-7 cursor-pointer items-center gap-2 py-1">
      <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition ${checked ? 'border-[#D4A017] bg-[#D4A017]/15' : 'border-white/15'}`}>
        {checked && <span className="h-1.5 w-1.5 bg-[#D4A017]" />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`text-[11px] font-light leading-tight transition-colors ${checked ? 'text-white/85' : 'text-white/40 group-hover:text-white/65'}`}>{label}</span>
    </label>
  );
}

interface FiltersProps {
  brandId?: string;
  categoryId?: string;
  gender?: FragranceGender;
  concentration?: FragranceConcentration;
  sizeMl?: number;
  maxPrice: number;
  inStock: boolean;
  brands: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  update: (key: string, value?: string) => void;
  mobile?: boolean;
}

function Filters({ brandId, categoryId, gender, concentration, sizeMl, maxPrice, inStock, brands, categories, update, mobile = false }: FiltersProps) {
  const { t } = useTranslation();
  return (
    <div className={mobile ? 'space-y-7' : 'grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7'}>
      <div>
        <FilterLabel>{t('catalog.brand')}</FilterLabel>
        <div className={mobile ? '' : 'max-h-32 overflow-y-auto pe-2'}>{brands.map((item) => <Choice key={item.id} label={item.name} checked={brandId === item.id} onChange={() => update('brandId', brandId === item.id ? undefined : item.id)} />)}</div>
      </div>
      <div><FilterLabel>{t('catalog.gender')}</FilterLabel>{GENDER_OPTIONS.map((item) => <Choice key={item.value} label={t(item.key)} checked={gender === item.value} onChange={() => update('gender', gender === item.value ? undefined : item.value)} />)}</div>
      <div>
        <FilterLabel>{t('catalog.category')}</FilterLabel>
        <div className={mobile ? '' : 'max-h-32 overflow-y-auto pe-2'}>{categories.map((item) => <Choice key={item.id} label={item.name} checked={categoryId === item.id} onChange={() => update('categoryId', categoryId === item.id ? undefined : item.id)} />)}</div>
      </div>
      <div><FilterLabel>{t('catalog.concentration')}</FilterLabel>{CONCENTRATION_OPTIONS.map((item) => <Choice key={item.value} label={item.label} checked={concentration === item.value} onChange={() => update('concentration', concentration === item.value ? undefined : item.value)} />)}</div>
      <div>
        <FilterLabel>{t('catalog.size')}</FilterLabel>
        <div className="flex flex-wrap gap-1.5">{SIZE_OPTIONS.map((value) => <button key={value} onClick={() => update('sizeMl', sizeMl === value ? undefined : String(value))} className={`border px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] transition ${sizeMl === value ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' : 'border-white/10 text-white/35 hover:border-white/20'}`}>{value}ml</button>)}</div>
      </div>
      <div>
        <FilterLabel>{t('catalog.price')}</FilterLabel>
        <input aria-label={t('catalog.maximumPrice')} type="range" min="0" max={PRICE_MAX} step="10" value={maxPrice} onChange={(event) => update('maxPrice', Number(event.target.value) < PRICE_MAX ? event.target.value : undefined)} className="h-4 w-full accent-[#D4A017]" />
        <p className="mt-2 text-[10px] font-light text-white/30">{t('catalog.upTo')} <span className="text-[#D4A017]">${maxPrice}</span></p>
      </div>
      <div><FilterLabel>{t('catalog.availability')}</FilterLabel><Choice label={t('catalog.inStockOnly')} checked={inStock} onChange={() => update('inStock', inStock ? undefined : 'true')} /></div>
    </div>
  );
}

export function ShopPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [desktopOpen, setDesktopOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const sort = searchParams.get('sort') || 'featured';
  const brandId = searchParams.get('brandId') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const gender = (searchParams.get('gender') || undefined) as FragranceGender | undefined;
  const concentration = (searchParams.get('concentration') || undefined) as FragranceConcentration | undefined;
  const sizeMl = Number(searchParams.get('sizeMl')) || undefined;
  const maxPrice = Math.min(PRICE_MAX, Math.max(0, Number(searchParams.get('maxPrice')) || PRICE_MAX));
  const inStock = searchParams.get('inStock') === 'true';

  const params: ProductQueryParams = {
    page, limit: ITEMS_PER_PAGE, brandId, categoryId, gender, concentration, sizeMl,
    maxPrice: maxPrice < PRICE_MAX ? maxPrice : undefined,
    inStock: inStock || undefined,
    sort: sort === 'featured' ? undefined : sort,
  };

  const products = useProducts(params);
  const brands = useAllBrands();
  const categories = useAllCategories();
  const productData = products.data;

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  const reset = () => setSearchParams({}, { replace: true });
  const activeCount = [brandId, categoryId, gender, concentration, sizeMl, maxPrice < PRICE_MAX ? maxPrice : undefined, inStock ? 'yes' : undefined].filter(Boolean).length;
  const total = productData ? productData.meta.totalItems : 0;
  const totalPages = productData ? productData.meta.totalPages : 1;

  const changePage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    update('page', String(next));
    requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <div className="sticky top-16 z-20 border-b border-white/[0.05] bg-[#0B0A0C] lg:top-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex h-12 items-center justify-between gap-4">
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">{products.isLoading ? t('catalog.loading') : t('catalog.productsFound', { count: total })}</span>
            <div className="flex items-center gap-3">
              {activeCount > 0 && <button onClick={reset} className="hidden items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#D4A017]/80 lg:flex"><X size={9} />{t('catalog.active', { count: activeCount })}</button>}
              <label className="sr-only" htmlFor="shop-sort">{t('catalog.sortBy')}</label>
              <select id="shop-sort" value={sort} onChange={(event) => update('sort', event.target.value)} className="h-8 cursor-pointer appearance-none border border-white/[0.08] bg-transparent py-0 ps-3 pe-8 text-[10px] tracking-[0.06em] text-white/55 outline-none focus:border-[#D4C3A3]/50">
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value} className="bg-[#121115]">{t(option.key)}</option>)}
              </select>
            </div>
          </div>
          <div className="-mt-1 flex items-center justify-between pb-2">
            <button onClick={() => setDesktopOpen((value) => !value)} className="hidden h-7 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/40 transition hover:text-white/70 lg:flex" aria-expanded={desktopOpen}>{desktopOpen ? <Minus size={10} /> : <Plus size={10} />}{t('catalog.filters')}{activeCount > 0 && !desktopOpen && ` · ${activeCount}`}</button>
            <button onClick={() => setMobileOpen(true)} className="flex h-7 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/50 lg:hidden"><SlidersHorizontal size={11} />{t('catalog.filters')}{activeCount > 0 && ` (${activeCount})`}</button>
          </div>
        </div>
      </div>

      <div className={`hidden overflow-hidden border-b border-white/[0.05] bg-[#0D0C10] transition-[max-height,opacity] duration-300 lg:block ${desktopOpen ? 'max-h-[24rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mx-auto max-w-[1440px] px-12 py-7">
          <Filters brandId={brandId} categoryId={categoryId} gender={gender} concentration={concentration} sizeMl={sizeMl} maxPrice={maxPrice} inStock={inStock} brands={brands.data?.items ?? []} categories={categories.data?.items ?? []} update={update} />
          {activeCount > 0 && <div className="mt-5 flex justify-end border-t border-white/[0.05] pt-4"><button onClick={reset} className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.15em] text-white/35 hover:text-white/65"><X size={9} />{t('catalog.resetFilters')}</button></div>}
        </div>
      </div>

      <div ref={gridRef} className="mx-auto max-w-[1440px] scroll-mt-36 px-6 py-8 lg:px-12 lg:py-10">
        {products.isLoading ? <PageLoader /> : products.isError ? <ErrorState className="min-h-[50vh]" onRetry={() => products.refetch()} message={t('catalog.loadError')} /> : !productData?.items.length ? <EmptyState className="min-h-[50vh]" title={t('catalog.empty')} message={t('catalog.emptyHelp')} actionLabel={t('catalog.resetFilters')} onAction={reset} /> : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">{productData.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            {totalPages > 1 && <nav className="mt-14 flex items-center justify-center gap-2" aria-label={t('catalog.productPages')}>
              <button onClick={() => changePage(page - 1)} disabled={page === 1} className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-25" aria-label={t('catalog.previousPage')}><ChevronLeft size={14} className="directional-icon" /></button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).filter((item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1).map((item, index, list) => <React.Fragment key={item}>{index > 0 && item - list[index - 1] > 1 && <span className="px-1 text-white/25">…</span>}<button onClick={() => changePage(item)} aria-current={item === page ? 'page' : undefined} className={`h-9 min-w-9 border px-3 text-[11px] ${item === page ? 'border-[#D4A017]/45 bg-[#D4A017]/[0.08] text-[#D4A017]' : 'border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70'}`}>{item}</button></React.Fragment>)}
              <button onClick={() => changePage(page + 1)} disabled={page === totalPages} className="flex h-9 w-9 items-center justify-center border border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-25" aria-label={t('catalog.nextPage')}><ChevronRight size={14} className="directional-icon" /></button>
            </nav>}
          </>
        )}
      </div>

      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden">
        <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label={t('catalog.closeFilters')} />
        <aside className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col border-t border-white/10 bg-[#121115]" role="dialog" aria-modal="true" aria-label={t('catalog.productFilters')}>
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">{t('catalog.filters')} {activeCount > 0 && `(${activeCount})`}</span><button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center text-white/45" aria-label={t('catalog.closeFilters')}><X size={17} /></button></div>
          <div className="overflow-y-auto px-5 py-5"><Filters mobile brandId={brandId} categoryId={categoryId} gender={gender} concentration={concentration} sizeMl={sizeMl} maxPrice={maxPrice} inStock={inStock} brands={brands.data?.items ?? []} categories={categories.data?.items ?? []} update={update} /></div>
          <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] p-5"><button onClick={reset} className="h-12 border border-white/10 text-[10px] font-medium uppercase tracking-[0.15em] text-white/50">{t('catalog.resetFilters')}</button><button onClick={() => setMobileOpen(false)} className="h-12 bg-[#D4A017] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0B0A0C]">{t('catalog.applyFilters')}</button></div>
        </aside>
      </div>}
    </div>
  );
}
