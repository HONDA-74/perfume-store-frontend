import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { PageLoader } from '@/components/shared/page-loader';
import { Price } from '@/components/shared/price';
import { useEnrichedCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/api/use-cart';
import type { EnrichedCartItem } from '@/hooks/api/use-cart';
import { ROUTES } from '@/constants';

export function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: cart, isLoading, error } = useEnrichedCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (isLoading) return <PageLoader />;

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const subtotal = cart?.items.reduce((total, item) => total + item.product.price * item.quantity, 0) ?? 0;

  return (
    <main className="min-h-screen bg-[#0B0A0C]">
      <header className="border-b border-white/5 bg-[#0D0C10]">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
          <Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('cart.eyebrow') }]} className="mb-6" />
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/45">{t('cart.eyebrow')}</p>
          <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal text-white/85">{t('cart.title')}</h1>
          {itemCount > 0 && <p className="mt-3 text-[11px] font-light text-white/30">{t('cart.itemCount', { count: itemCount })}</p>}
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
        {error ? (
          <CartMessage title={t('cart.error')} description={t('cart.errorDescription')} onAction={() => navigate(ROUTES.shop)} />
        ) : !cart?.items.length ? (
          <CartMessage icon={<ShoppingBag size={36} strokeWidth={1} />} title={t('cart.empty')} description={t('cart.emptyDescription')} onAction={() => navigate(ROUTES.shop)} />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-16 xl:grid-cols-[1fr_420px]">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">{t('cart.items')}</p>
                <Link to={ROUTES.shop} className="text-[9px] uppercase tracking-[0.12em] text-white/25 transition-colors hover:text-white/50">{t('cart.continueShopping')}</Link>
              </div>
              <div className="border-t border-white/[0.06]">
                {cart.items.map((item) => (
                  <CartItemRow key={item.productId} item={item} pending={updateItem.isPending || removeItem.isPending} onQuantity={(quantity) => updateItem.mutate({ productId: item.productId, payload: { quantity } })} onRemove={() => removeItem.mutate(item.productId)} />
                ))}
              </div>
            </section>

            <aside className="border border-white/[0.06] bg-[#121115] lg:sticky lg:top-28">
              <div className="border-b border-white/[0.06] px-6 py-5"><p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">{t('cart.summary')}</p></div>
              <div className="px-6 py-4">
                <SummaryRow label={t('cart.subtotal')}><Price price={subtotal} /></SummaryRow>
                <Divider />
                <SummaryRow label={t('cart.shipping')}><span className="text-[#D4C3A3]/70">{t('cart.complimentary')}</span></SummaryRow>
                <Divider />
                <SummaryRow label={t('cart.total')} total><Price price={subtotal} /></SummaryRow>
              </div>
              <div className="space-y-3 px-6 pb-6 pt-2">
                <p className="text-center text-[9px] font-light tracking-[0.02em] text-white/25">{t('cart.shippingNote')}</p>
                <Link to={ROUTES.checkout} className="flex h-12 w-full items-center justify-center gap-2 bg-kenz-gold text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0B0A0C] transition-opacity hover:opacity-85">{t('cart.checkout')} <ArrowRight size={13} className="directional-icon" /></Link>
                <Link to={ROUTES.shop} className="flex h-11 w-full items-center justify-center border border-white/10 text-[10px] uppercase tracking-[0.12em] text-white/35 transition-all hover:border-white/20 hover:text-white/60">{t('cart.continueShopping')}</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function CartMessage({ icon, title, description, onAction }: { icon?: React.ReactNode; title: string; description: string; onAction: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      {icon && <div className="mb-6 text-white/25">{icon}</div>}
      <h2 className="font-serif text-xl font-normal text-white/55">{title}</h2>
      <p className="mt-3 max-w-md text-[12px] font-light leading-6 text-white/30">{description}</p>
      <button type="button" onClick={onAction} className="mt-7 h-11 bg-kenz-gold px-8 text-[10px] font-medium uppercase tracking-[0.15em] text-[#0B0A0C] transition-opacity hover:opacity-80">{t('cart.explore')}</button>
    </div>
  );
}

function CartItemRow({ item, pending, onQuantity, onRemove }: { item: EnrichedCartItem; pending: boolean; onQuantity: (quantity: number) => void; onRemove: () => void }) {
  const { t } = useTranslation();
  const { product, quantity } = item;
  return (
    <article className="border-b border-white/5 py-6">
      <div className="flex gap-5">
        <Link to={`/products/${product.slug}`} className="h-[110px] w-[88px] flex-none overflow-hidden border border-white/5 bg-[#19181E] transition-opacity hover:opacity-80">
          {product.images[0] && <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.15em] text-[#D4C3A3]/50">{product.brand?.name ?? 'KENZ'}</p>
              <Link to={`/products/${product.slug}`} className="font-serif text-base font-normal text-white/85 transition-colors hover:text-white">{product.name}</Link>
              <p className="mt-1 text-[10px] font-light text-white/30">{product.concentration} · {product.sizeMl}ml</p>
            </div>
            <button type="button" onClick={onRemove} disabled={pending} className="mt-0.5 flex-none text-[9px] uppercase tracking-[0.1em] text-white/20 transition-colors hover:text-white/50 disabled:opacity-30">{t('cart.remove')}</button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="inline-flex h-[34px] items-center overflow-hidden border border-white/10">
              <button type="button" onClick={() => onQuantity(quantity - 1)} disabled={quantity <= 1 || pending} className="h-full w-9 text-base font-light text-white/40 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label={`${t('cart.quantity')} -`}>−</button>
              <span className="flex h-full w-8 items-center justify-center border-x border-white/10 text-xs text-white/80">{quantity}</span>
              <button type="button" onClick={() => onQuantity(quantity + 1)} disabled={quantity >= product.stockQuantity || pending} className="h-full w-9 text-base font-light text-white/40 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label={`${t('cart.quantity')} +`}>+</button>
            </div>
            <Price price={product.price * quantity} className="text-[13px]" />
          </div>
        </div>
      </div>
    </article>
  );
}

function Divider() { return <div className="border-t border-white/5" />; }
function SummaryRow({ label, total = false, children }: { label: string; total?: boolean; children: React.ReactNode }) {
  return <div className="flex items-center justify-between py-3"><span className={total ? 'text-[10px] font-medium uppercase tracking-[0.15em] text-white/70' : 'text-[11px] font-light text-white/40'}>{label}</span><span className={total ? 'text-[13px] font-medium text-kenz-gold' : 'text-[12px] font-light text-white/50'}>{children}</span></div>;
}
