import { useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ROUTES } from '@/constants';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { useEnrichedCart } from '@/hooks/api/use-cart';
import { useCreateOrder } from '@/hooks/api/use-orders';
import { useAddresses, useCreateAddress } from '@/hooks/api/use-users';

interface CheckoutForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cart = useEnrichedCart();
  const user = useCurrentUser();
  const addresses = useAddresses();
  const createAddress = useCreateAddress();
  const createOrder = useCreateOrder();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({ defaultValues: { country: '' } });

  useEffect(() => {
    if (!user.data) return;
    const [firstName = '', ...rest] = user.data.fullName.trim().split(/\s+/);
    setValue('firstName', firstName);
    setValue('lastName', rest.join(' '));
    setValue('email', user.data.email);
    setValue('phone', user.data.phone ?? '');
  }, [setValue, user.data]);

  if (cart.isLoading || addresses.isLoading) return <PageLoader />;
  if (!cart.data?.items.length) return <div className="flex min-h-screen items-center justify-center bg-[#0B0A0C] px-6"><EmptyState title={t('checkout.emptyBag')} message={t('checkout.emptyBagDescription')} actionLabel={t('checkout.returnShop')} onAction={() => navigate(ROUTES.shop)} /></div>;

  const subtotal = cart.data.items.reduce((sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity, 0);
  const submit = handleSubmit(async (values) => {
    const recipientName = `${values.firstName} ${values.lastName}`.trim();
    const existing = addresses.data?.find((address) => address.recipientName === recipientName && address.phone === values.phone && address.street === values.street && address.city === values.city && address.country === values.country && (address.postalCode ?? '') === values.postalCode);
    const address = existing ?? await createAddress.mutateAsync({ recipientName, phone: values.phone, street: values.street, city: values.city, country: values.country, postalCode: values.postalCode || undefined, isDefault: !(addresses.data?.length) });
    const order = await createOrder.mutateAsync({ addressId: address.id });
    navigate(`/orders/${order.id}/success`);
  });

  return (
    <main className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <header className="border-b border-white/[0.05] bg-[#0D0C10]"><div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12"><Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('cart.eyebrow'), href: ROUTES.cart }, { label: t('checkout.eyebrow') }]} className="mb-6" /><p className="mb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/45">{t('checkout.eyebrow')}</p><h1 className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-white/85">{t('checkout.title')}</h1></div></header>
      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14"><div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_440px]">
        <form onSubmit={submit} className="space-y-10" noValidate>
          <section><SectionTitle>{t('checkout.contact')}</SectionTitle><div className="grid gap-5 sm:grid-cols-2"><Field label={t('checkout.email')} error={errors.email?.message}><input type="email" autoComplete="email" className={inputClass} {...register('email', { required: t('checkout.requiredEmail'), pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('checkout.invalidEmail') } })} /></Field><Field label={t('checkout.phone')} error={errors.phone?.message}><input type="tel" autoComplete="tel" className={inputClass} {...register('phone', { required: t('checkout.requiredPhone') })} /></Field></div></section>
          <section><SectionTitle>{t('checkout.delivery')}</SectionTitle><div className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Field label={t('checkout.firstName')} error={errors.firstName?.message}><input autoComplete="given-name" className={inputClass} {...register('firstName', { required: t('checkout.requiredField') })} /></Field><Field label={t('checkout.lastName')} error={errors.lastName?.message}><input autoComplete="family-name" className={inputClass} {...register('lastName', { required: t('checkout.requiredField') })} /></Field></div><Field label={t('checkout.street')} error={errors.street?.message}><input autoComplete="street-address" className={inputClass} {...register('street', { required: t('checkout.requiredField') })} /></Field><div className="grid gap-5 sm:grid-cols-3"><Field label={t('checkout.city')} error={errors.city?.message}><input autoComplete="address-level2" className={inputClass} {...register('city', { required: t('checkout.requiredField') })} /></Field><Field label={t('checkout.postalCode')}><input autoComplete="postal-code" className={inputClass} {...register('postalCode')} /></Field><Field label={t('checkout.country')} error={errors.country?.message}><input autoComplete="country-name" className={inputClass} {...register('country', { required: t('checkout.requiredField') })} /></Field></div></div></section>
          <section><SectionTitle>{t('checkout.shippingMethod')}</SectionTitle><RadioCard title={t('checkout.complimentaryDelivery')} subtitle={t('checkout.deliveryEstimate')} right={t('checkout.free')} /></section>
          <section><SectionTitle>{t('checkout.payment')}</SectionTitle><RadioCard title={t('checkout.cashDelivery')} subtitle={t('checkout.payArrival')} /><p className="mt-4 border-t border-white/[0.05] pt-4 text-[11px] font-light italic leading-relaxed text-white/30">{t('checkout.cashNote')}</p></section>
          {(createAddress.isError || createOrder.isError) && <p role="alert" className="border border-red-300/20 bg-red-300/[0.06] px-4 py-3 text-[11px] text-red-300/80">{t('checkout.error')}</p>}
          <div><button disabled={isSubmitting || createAddress.isPending || createOrder.isPending} className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-sm bg-[#D4A017] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0B0A0C] disabled:opacity-60">{isSubmitting || createAddress.isPending || createOrder.isPending ? t('checkout.placingOrder') : <>{t('checkout.placeOrder')} <ArrowRight size={13} className="directional-icon" /></>}</button><p className="mt-4 text-center text-[9px] font-light tracking-[0.04em] text-white/20">{t('checkout.terms')}</p></div>
        </form>
        <aside className="border border-white/[0.06] bg-[#121115] lg:sticky lg:top-28"><div className="border-b border-white/[0.06] px-6 py-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">{t('checkout.orderSummary')}</div><div className="space-y-4 border-b border-white/[0.05] px-6 py-4">{cart.data.items.map((item) => <div key={item.productId} className="flex gap-3"><div className="h-16 w-[52px] shrink-0 overflow-hidden border border-white/[0.05] bg-[#19181E]"><img src={item.product.images?.[0]} alt="" className="h-full w-full object-cover" /></div><div className="min-w-0 flex-1"><p className="mb-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#D4C3A3]/45">{item.product.brand?.name}</p><p className="truncate font-serif text-[13px] text-white/80">{item.product.name}</p><p className="mt-0.5 text-[10px] font-light text-white/30">{item.product.sizeMl} ml · {t('checkout.quantityShort', { count: item.quantity })}</p></div><p className="shrink-0 text-xs text-[#D4A017]">${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}</p></div>)}</div><div className="space-y-2 px-6 py-4"><SummaryRow label={t('cart.subtotal')} value={`$${subtotal.toFixed(2)}`} /><SummaryRow label={t('cart.shipping')} value={t('cart.complimentary')} accent /><div className="mt-2 flex justify-between border-t border-white/[0.06] pt-3"><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/60">{t('cart.total')}</span><span className="text-sm font-medium text-[#D4A017]">${subtotal.toFixed(2)}</span></div><p className="pt-2 text-center text-[9px] font-light text-white/20">{t('cart.shippingNote')}</p></div></aside>
      </div></div>
    </main>
  );
}

const inputClass = 'h-11 w-full rounded-sm border border-white/[0.08] bg-[#121115] px-3.5 text-[13px] font-light text-white/85 outline-none transition-colors focus:border-[#D4A017]';
function SectionTitle({ children }: { children: ReactNode }) { return <div className="mb-6 flex items-center gap-4"><h2 className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">{children}</h2><div className="h-px flex-1 bg-white/[0.05]" /></div>; }
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="block"><span className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.15em] text-[#D4C3A3]/50">{label}</span>{children}{error && <span className="mt-1 block text-[10px] text-red-300/90">{error}</span>}</label>; }
function RadioCard({ title, subtitle, right }: { title: string; subtitle: string; right?: string }) { return <div className="flex items-center justify-between rounded-sm border border-[#D4A017]/35 bg-[#D4A017]/[0.05] px-4 py-3.5"><div className="flex items-center gap-3"><span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#D4A017]"><span className="h-1.5 w-1.5 rounded-full bg-[#D4A017]" /></span><div><p className="text-xs text-white/85">{title}</p><p className="mt-0.5 text-[10px] font-light text-white/30">{subtitle}</p></div></div>{right && <span className="text-[11px] text-[#D4C3A3]/80">{right}</span>}</div>; }
function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <div className="flex justify-between py-1"><span className="text-[11px] font-light text-white/35">{label}</span><span className={`text-xs font-light ${accent ? 'text-[#D4C3A3]/70' : 'text-white/50'}`}>{value}</span></div>; }
