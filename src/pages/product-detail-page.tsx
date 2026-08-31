import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { Price } from '@/components/shared/price';
import { ProductBadge } from '@/components/shared/product-badge';
import { Rating } from '@/components/shared/rating';
import { ROUTES } from '@/constants';
import { useBrand } from '@/hooks/api/use-brands';
import { useAddToCart } from '@/hooks/api/use-cart';
import { useCategory } from '@/hooks/api/use-categories';
import { useProduct } from '@/hooks/api/use-products';
import { useIsInWishlist, useToggleWishlist } from '@/hooks/api/use-wishlist';
import { deriveProductBadge } from '@/lib/adapters/product-adapter';
import { getConcentrationLabel } from '@/lib/adapters/enum-adapter';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = useProduct(slug);
  const brand = useBrand(product.data?.brandId ?? '');
  const category = useCategory(product.data?.categoryId ?? '');
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const authenticated = useAuthStore((state) => state.isAuthenticated());
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const wishlisted = useIsInWishlist(product.data?.id ?? '');
  const { openCartDrawer } = useUIStore();

  if (product.isLoading) return <PageLoader />;
  if (product.isError || !product.data)
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <EmptyState
          title={t('product.notFound')}
          message={t('product.unavailable')}
          actionLabel={t('product.backShop')}
          onAction={() => navigate(ROUTES.shop)}
        />
      </div>
    );

  const item = product.data;
  const badge = deriveProductBadge(item);
  const isOutOfStock = item.stockQuantity < 1;
  const add = async () => {
    if (!authenticated) {
      toast.error(t('catalog.signInCart'));
      navigate(ROUTES.auth.login);
      return;
    }
    await addToCart.mutateAsync({ productId: item.id, quantity });
    openCartDrawer();
  };
  const toggle = async () => {
    if (!authenticated) {
      toast.error(t('catalog.signInWishlist'));
      navigate(ROUTES.auth.login);
      return;
    }
    await toggleWishlist.toggle(item.id);
  };

  return (
    <main className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'KENZ', href: '/' },
            { label: t('nav.shop'), href: ROUTES.shop },
            ...(brand.data ? [{ label: brand.data.name, href: `/brands/${brand.data.slug}` }] : []),
            { label: item.name },
          ]}
          className="mb-8"
        />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
          <div className="flex gap-4">
            {item.images.length > 1 && (
              <div className="hidden w-16 shrink-0 flex-col gap-2 sm:flex">
                {item.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setImageIndex(index)}
                    className={`aspect-[4/5] overflow-hidden border transition-opacity ${index === imageIndex ? 'border-[#D4A017] opacity-100' : 'border-white/[0.06] opacity-50 hover:opacity-75'}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden border border-white/[0.06] bg-[#121115]">
              <img
                src={item.images[imageIndex]}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              {badge && (
                <div className="absolute start-4 top-4">
                  <ProductBadge badge={badge} />
                </div>
              )}
            </div>
          </div>

          <section className="pt-2 lg:pt-3">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Link
                to={brand.data ? `/brands/${brand.data.slug}` : ROUTES.brands}
                className="text-[10px] font-medium tracking-[0.13em] text-[#D4C3A3]/65 uppercase transition-colors hover:text-[#D4A017]"
              >
                {brand.data?.name ?? ''}
              </Link>
              {badge && <ProductBadge badge={badge} />}
            </div>
            <h1 className="mb-5 font-serif text-[clamp(2.5rem,4vw,3.6rem)] leading-[1.05] font-normal text-white/[0.92]">
              {item.name}
            </h1>
            <Rating value={item.ratingAverage} count={item.ratingCount} />
            <Price
              price={item.price}
              discountPrice={item.discountPrice}
              size="lg"
              className="mt-6"
            />

            <div className="mt-8 border-t border-white/[0.06] pt-7">
              <p className="text-sm leading-[1.75] font-light text-white/48">{item.description}</p>
              <p className="mt-6 text-[9px] font-medium tracking-[0.13em] text-white/20 uppercase">
                {getConcentrationLabel(item.concentration)} <span className="mx-2">·</span>{' '}
                {category.data?.name}
              </p>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-[9px] font-medium tracking-[0.15em] text-white/35 uppercase">
                {t('product.size')}
              </p>
              <span className="inline-flex h-10 items-center border border-[#D4A017] px-5 text-[10px] font-medium tracking-[0.1em] text-[#D4A017] uppercase">
                {item.sizeMl}ml
              </span>
            </div>
            <div className="mt-7">
              <p className="mb-3 text-[9px] font-medium tracking-[0.15em] text-white/35 uppercase">
                {t('product.quantity')}
              </p>
              <div className="inline-flex h-9 w-auto overflow-hidden border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  className="flex h-full w-11 items-center justify-center text-white/35 transition-colors hover:bg-white/[0.03] hover:text-white/65 disabled:cursor-not-allowed disabled:text-white/15"
                  aria-label={t('product.decrease')}
                >
                  −
                </button>
                <span
                  className="flex h-full w-10 items-center justify-center border-x border-white/[0.06] text-xs text-white/80 tabular-nums"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(item.stockQuantity, value + 1))}
                  disabled={isOutOfStock || quantity >= item.stockQuantity}
                  className="flex h-full w-11 items-center justify-center text-white/40 transition-colors hover:bg-white/[0.03] hover:text-white/70 disabled:cursor-not-allowed disabled:text-white/15"
                  aria-label={t('product.increase')}
                >
                  +
                </button>
              </div>
            </div>
            {item.stockQuantity > 0 && item.stockQuantity <= 5 && (
              <p className="mt-3 text-[10px] text-[#D4C3A3]/60">
                {t('product.lowStock', { count: item.stockQuantity })}
              </p>
            )}
            <button
              onClick={add}
              disabled={isOutOfStock || addToCart.isPending}
              className="mt-8 flex h-[52px] w-full items-center justify-center gap-2.5 bg-[#D4A017] text-[10px] font-semibold tracking-[0.18em] text-[#0B0A0C] uppercase transition-opacity hover:opacity-90 disabled:opacity-35"
            >
              <ShoppingBag size={13} />
              {isOutOfStock ? t('catalog.outOfStock') : addToCart.isPending ? t('catalog.adding') : t('catalog.addToBag')}
            </button>
            <button
              onClick={toggle}
              className="mt-5 flex items-center gap-2.5 text-[10px] tracking-[0.1em] text-white/35 uppercase transition-colors hover:text-white/65"
            >
              <Heart
                size={14}
                fill={wishlisted ? 'currentColor' : 'none'}
                className={wishlisted ? 'text-[#D4A017]' : ''}
              />
              {wishlisted ? t('catalog.savedWishlist') : t('catalog.saveWishlist')}
            </button>
            <p className="mt-10 text-[9px] font-light text-white/20">
              {t('product.shipping')}
            </p>
          </section>
        </div>

        {!!(item.notes?.top?.length || item.notes?.middle?.length || item.notes?.base?.length) && (
          <section className="mt-12 border-t border-white/[0.06] pt-14">
            <h2 className="mb-10 font-serif text-[clamp(1.8rem,3vw,2.4rem)] text-white/85">
               {t('product.notes')}
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <NoteGroup label={t('product.topNotes')} notes={item.notes?.top} />
              <NoteGroup label={t('product.heartNotes')} notes={item.notes?.middle} />
              <NoteGroup label={t('product.baseNotes')} notes={item.notes?.base} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function NoteGroup({ label, notes = [] }: { label: string; notes?: string[] }) {
  return (
    <div>
      <p className="mb-3 text-[9px] font-medium tracking-[0.16em] text-[#D4C3A3]/45 uppercase">
        {label}
      </p>
      <p className="font-serif text-xl leading-relaxed text-white/55">{notes.join(' · ') || '—'}</p>
    </div>
  );
}
