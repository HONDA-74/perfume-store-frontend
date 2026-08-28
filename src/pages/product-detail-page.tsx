import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
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
  if (product.isError || !product.data) return <div className="mx-auto max-w-[1440px] px-6 py-24"><EmptyState title="Product not found" message="The fragrance you're looking for is unavailable." actionLabel="Back to Shop" onAction={() => navigate(ROUTES.shop)} /></div>;

  const item = product.data;
  const badge = deriveProductBadge(item);
  const isOutOfStock = item.stockQuantity < 1;
  const add = async () => {
    if (!authenticated) { toast.error('Please sign in to add items to your bag'); navigate(ROUTES.auth.login); return; }
    await addToCart.mutateAsync({ productId: item.id, quantity });
    openCartDrawer();
  };
  const toggle = async () => {
    if (!authenticated) { toast.error('Please sign in to save fragrances'); navigate(ROUTES.auth.login); return; }
    await toggleWishlist.toggle(item.id);
  };

  return (
    <main className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: ROUTES.shop }, ...(brand.data ? [{ label: brand.data.name, href: `/brands/${brand.data.slug}` }] : []), { label: item.name }]} className="mb-8" />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
          <div className="flex gap-4">
            {item.images.length > 1 && <div className="hidden w-16 shrink-0 flex-col gap-2 sm:flex">{item.images.map((image, index) => <button key={image} onClick={() => setImageIndex(index)} className={`aspect-[4/5] overflow-hidden border transition-opacity ${index === imageIndex ? 'border-[#D4A017] opacity-100' : 'border-white/[0.06] opacity-50 hover:opacity-75'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
            <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden border border-white/[0.06] bg-[#121115]"><img src={item.images[imageIndex]} alt={item.name} className="h-full w-full object-cover" />{badge && <div className="absolute left-4 top-4"><ProductBadge badge={badge} /></div>}</div>
          </div>

          <section className="pt-2 lg:pt-3">
            <div className="mb-5 flex flex-wrap items-center gap-3"><Link to={brand.data ? `/brands/${brand.data.slug}` : ROUTES.brands} className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#D4C3A3]/65 transition-colors hover:text-[#D4A017]">{brand.data?.name ?? ''}</Link>{badge && <ProductBadge badge={badge} />}</div>
            <h1 className="mb-5 font-serif text-[clamp(2.5rem,4vw,3.6rem)] font-normal leading-[1.05] text-white/[0.92]">{item.name}</h1>
            <Rating value={item.ratingAverage} count={item.ratingCount} />
            <Price price={item.price} discountPrice={item.discountPrice} size="lg" className="mt-6" />

            <div className="mt-8 border-t border-white/[0.06] pt-7"><p className="text-sm font-light leading-[1.75] text-white/48">{item.description}</p><p className="mt-6 text-[9px] font-medium uppercase tracking-[0.13em] text-white/20">{getConcentrationLabel(item.concentration)} <span className="mx-2">·</span> {category.data?.name}</p></div>

            <div className="mt-7"><p className="mb-3 text-[9px] font-medium uppercase tracking-[0.15em] text-white/35">Size</p><span className="inline-flex h-10 items-center border border-[#D4A017] px-5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#D4A017]">{item.sizeMl}ml</span></div>
            <div className="mt-7"><p className="mb-3 text-[9px] font-medium uppercase tracking-[0.15em] text-white/35">Quantity</p><div className="flex h-9 w-full border border-white/[0.08]"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="w-11 text-white/25 hover:text-white/60" aria-label="Decrease quantity">−</button><span className="flex w-10 items-center justify-center border-x border-white/[0.06] text-xs text-white/80">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(item.stockQuantity, value + 1))} className="w-11 text-white/40 hover:text-white/70" aria-label="Increase quantity">+</button></div></div>
            {item.stockQuantity > 0 && item.stockQuantity <= 5 && <p className="mt-3 text-[10px] text-[#D4C3A3]/60">Only {item.stockQuantity} left in stock</p>}
            <button onClick={add} disabled={isOutOfStock || addToCart.isPending} className="mt-8 flex h-[52px] w-full items-center justify-center gap-2.5 bg-[#D4A017] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0B0A0C] transition-opacity hover:opacity-90 disabled:opacity-35"><ShoppingBag size={13} />{isOutOfStock ? 'Out of Stock' : addToCart.isPending ? 'Adding…' : 'Add to Bag'}</button>
            <button onClick={toggle} className="mt-5 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.1em] text-white/35 transition-colors hover:text-white/65"><Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'text-[#D4A017]' : ''} />{wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</button>
            <p className="mt-10 text-[9px] font-light text-white/20">Complimentary shipping on qualifying orders. Discreet packaging.</p>
          </section>
        </div>

        {!!(item.notes?.top?.length || item.notes?.middle?.length || item.notes?.base?.length) && <section className="mt-12 border-t border-white/[0.06] pt-14"><h2 className="mb-10 font-serif text-[clamp(1.8rem,3vw,2.4rem)] text-white/85">The Composition</h2><div className="grid gap-8 sm:grid-cols-3"><NoteGroup label="Top Notes" notes={item.notes?.top} /><NoteGroup label="Heart Notes" notes={item.notes?.middle} /><NoteGroup label="Base Notes" notes={item.notes?.base} /></div></section>}
      </div>
    </main>
  );
}

function NoteGroup({ label, notes = [] }: { label: string; notes?: string[] }) { return <div><p className="mb-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[#D4C3A3]/45">{label}</p><p className="font-serif text-xl leading-relaxed text-white/55">{notes.join(' · ') || '—'}</p></div>; }
