import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { PageLoader } from '@/components/shared/page-loader';
import { ProductCard } from '@/components/shared/product-card';
import { useProduct } from '@/hooks/api/use-products';
import { useWishlist } from '@/hooks/api/use-wishlist';
import { ROUTES } from '@/constants';

export function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: wishlist, isLoading, error } = useWishlist();

  if (isLoading) return <PageLoader />;

  const count = wishlist?.items.length ?? 0;

  return (
    <main className="min-h-screen bg-[#0B0A0C]">
      <header className="border-b border-white/5 bg-[#0D0C10]">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
          <Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('wishlist.eyebrow') }]} className="mb-6" />
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/45">{t('wishlist.eyebrow')}</p>
          <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal text-white/85">{t('wishlist.title')}</h1>
          {count > 0 && <p className="mt-3 text-[11px] font-light text-white/30">{t('wishlist.savedCount', { count })}</p>}
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
        {error ? (
          <WishlistMessage title={t('wishlist.error')} description={t('wishlist.errorDescription')} action={t('wishlist.returnShop')} onAction={() => navigate(ROUTES.shop)} />
        ) : count === 0 ? (
          <WishlistMessage icon={<Heart size={36} strokeWidth={1} />} title={t('wishlist.empty')} description={t('wishlist.emptyDescription')} action={t('wishlist.explore')} onAction={() => navigate(ROUTES.shop)} />
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">
            {wishlist!.items.map((item) => <WishlistProductCard key={item.productId} productId={item.productId} />)}
          </div>
        )}
      </div>
    </main>
  );
}

function WishlistMessage({ icon, title, description, action, onAction }: { icon?: React.ReactNode; title: string; description: string; action: string; onAction: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      {icon && <div className="mb-6 text-white/25">{icon}</div>}
      <h2 className="font-serif text-xl font-normal text-white/55">{title}</h2>
      <p className="mt-3 max-w-md text-[12px] font-light leading-6 text-white/30">{description}</p>
      <button type="button" onClick={onAction} className="mt-7 h-11 bg-kenz-gold px-8 text-[10px] font-medium uppercase tracking-[0.15em] text-[#0B0A0C] transition-opacity hover:opacity-80">{action}</button>
    </div>
  );
}

function WishlistProductCard({ productId }: { productId: string }) {
  const { data: product, isLoading } = useProduct(productId);
  if (isLoading) return <div className="h-96 animate-pulse border border-white/5 bg-[#121115]" />;
  if (!product) return null;
  return <ProductCard product={product} isWishlisted />;
}
