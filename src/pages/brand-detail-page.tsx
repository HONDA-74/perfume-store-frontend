import { useNavigate, useParams } from 'react-router';
import { MapPin } from 'lucide-react';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ProductCard } from '@/components/shared/product-card';
import { ROUTES } from '@/constants';
import { useBrand } from '@/hooks/api/use-brands';
import { useProducts } from '@/hooks/api/use-products';

export function BrandDetailPage() {
  const { brandSlug = '' } = useParams<{ brandSlug: string }>();
  const navigate = useNavigate();
  const brandQuery = useBrand(brandSlug);
  const products = useProducts(brandQuery.data ? { brandId: brandQuery.data.id, limit: 50 } : { limit: 1 });

  if (brandQuery.isLoading) return <PageLoader />;
  if (brandQuery.isError || !brandQuery.data) {
    return <div className="mx-auto max-w-[1440px] px-6 py-24"><EmptyState title="Brand not found" message="The fragrance house you're looking for doesn't exist." actionLabel="View All Brands" onAction={() => navigate(ROUTES.brands)} /></div>;
  }

  const brand = brandQuery.data;
  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
        <Breadcrumb items={[{ label: 'Home', href: ROUTES.home }, { label: 'Brands', href: ROUTES.brands }, { label: brand.name }]} className="mb-8" />
        <section className="mb-14 border border-kenz-border bg-kenz-surface/30 p-8 text-center lg:p-12">
          {brand.logoUrl && <img src={brand.logoUrl} alt="" className="mx-auto mb-6 max-h-28 max-w-full object-contain" />}
          <h1 className="font-serif text-4xl font-normal text-foreground">{brand.name}</h1>
          {brand.description && <p className="mx-auto mt-4 max-w-2xl text-foreground/70">{brand.description}</p>}
          {brand.countryOfOrigin && <p className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/50"><MapPin size={14} />{brand.countryOfOrigin}</p>}
        </section>
        <h2 className="mb-8 font-serif text-2xl font-normal text-foreground">Products by {brand.name}</h2>
        {products.isLoading ? <PageLoader /> : !products.data?.items.length ? <EmptyState title="No products available" message={`${brand.name} doesn't have any products yet.`} /> : <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">{products.data.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      </div>
    </div>
  );
}
