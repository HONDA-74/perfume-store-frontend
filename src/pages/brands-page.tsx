import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { useAllBrands } from '@/hooks/api/use-brands';
import { useAllProducts } from '@/hooks/api/use-products';

export function BrandsPage() {
  const brands = useAllBrands();
  const products = useAllProducts();

  if (brands.isLoading || products.isLoading) return <div className="min-h-screen bg-[#0B0A0C]"><PageLoader /></div>;
  if (brands.isError || products.isError) return <div className="min-h-screen bg-[#0B0A0C] px-6 py-24"><EmptyState title="Failed to load brands" message="Please try again later" /></div>;

  const items = brands.data?.items ?? [];
  const counts = new Map<string, number>();
  products.data?.items.forEach((product) => counts.set(product.brandId, (counts.get(product.brandId) ?? 0) + 1));

  return (
    <div className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Brands' }]} className="mb-10" />

        <div className="mb-12">
          <p className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.22em] text-[#D4C3A3]/40">The Houses</p>
          <h1 className="mb-2.5 font-serif text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.15] text-white/[0.88]">Our Curated Brands</h1>
          <p className="max-w-[480px] text-[13px] font-light italic text-white/30">Each house in our registry has been chosen for a singular reason: excellence.</p>
        </div>

        {!items.length ? <EmptyState title="No brands available" message="Check back later for new brands" /> : (
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
                      <div className="flex translate-x-2 items-center gap-1.5 text-[#D4A017] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"><span className="text-[9px] font-medium uppercase tracking-[0.12em]">View</span><ArrowRight size={11} /></div>
                    </div>
                    <h2 className="mb-2 font-serif text-[1.2rem] font-normal leading-[1.2] text-white/80 transition-colors group-hover:text-white">{brand.name}</h2>
                    <p className="mb-5 min-h-10 text-xs font-light leading-[1.65] text-white/[0.33]">{brand.description || 'Discover the signature fragrances of this distinguished house.'}</p>
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">{productCount} {productCount === 1 ? 'fragrance' : 'fragrances'}</span>
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
