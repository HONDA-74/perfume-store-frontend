import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { useAllBrands } from '@/hooks/api/use-brands';
import { useAllProducts } from '@/hooks/api/use-products';
import { useTranslation } from 'react-i18next';

export function BrandsPage() {
  const { t } = useTranslation();
  const brands = useAllBrands();
  const products = useAllProducts();

  if (brands.isLoading || products.isLoading) return <div className="min-h-screen bg-[#0B0A0C]"><PageLoader /></div>;
  if (brands.isError || products.isError) return <div className="min-h-screen bg-[#0B0A0C] px-6 py-24"><EmptyState title={t('brands.empty')} message={t('common.retry')} /></div>;

  const items = brands.data?.items ?? [];
  const counts = new Map<string, number>();
  products.data?.items.forEach((product) => counts.set(product.brandId, (counts.get(product.brandId) ?? 0) + 1));

  return (
    <div className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('brands.title') }]} className="mb-10" />

        <div className="mb-12">
          <p className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.22em] text-[#D4C3A3]/40">{t('brands.eyebrow')}</p>
          <h1 className="mb-2.5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.15] text-white/[0.88]">{t('brands.title')}</h1>
          <p className="max-w-[480px] text-[13px] font-light italic text-white/30">{t('brands.description')}</p>
        </div>

        {!items.length ? <EmptyState title={t('brands.empty')} message={t('brands.description')} /> : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((brand) => {
              const productCount = counts.get(brand.id) ?? 0;
              return (
                <Link key={brand.id} to={`/brands/${brand.slug}`} className="group relative block overflow-hidden border border-white/[0.06] bg-[#121115] transition-all duration-300 hover:border-[#D4A017]/25">
                  <div className="p-7 lg:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center border border-[#D4C3A3]/[0.12] text-[#D4C3A3]/35">
                        {brand.logoUrl ? <img src={brand.logoUrl} alt="" className="h-8 w-8 object-contain opacity-60" /> : <span className="font-serif text-lg">{brand.name.charAt(0)}</span>}
                      </div>
                      <div className="flex translate-x-2 items-center gap-1.5 text-[#D4A017] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"><span className="text-[9px] font-medium uppercase tracking-[0.12em]">{t('brands.explore')}</span><ArrowRight size={11} className="directional-icon" /></div>
                    </div>
                    <h2 className="mb-2 font-serif text-[1.2rem] font-normal leading-[1.2] text-white/80 transition-colors group-hover:text-white">{brand.name}</h2>
                    <p className="mb-5 min-h-10 text-xs font-light leading-[1.65] text-white/[0.33]">{brand.description || brand.name}</p>
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">{t('catalog.productsFound', { count: productCount })}</span>
                  </div>
                  <div className="h-px w-0 bg-[#D4A017] transition-all duration-500 group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
