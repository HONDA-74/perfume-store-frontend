import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { PageLoader } from '@/components/shared/page-loader';
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from '@/hooks/api/use-users';
import type { CreateSavedAddressData, SavedAddress } from '@/types';

type Dialog = { kind: 'add' } | { kind: 'edit'; address: SavedAddress } | null;

export function AddressesPage() {
  const { t } = useTranslation();
  const addresses = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (addresses.isLoading) return <PageLoader />;
  const items = addresses.data ?? [];
  const save = async (data: CreateSavedAddressData) => {
    if (dialog?.kind === 'edit') await updateAddress.mutateAsync({ id: dialog.address.id, payload: data });
    else await createAddress.mutateAsync(data);
    setDialog(null);
  };

  return (
    <div>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div><p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">{t('nav.account')}</p><h1 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] text-white/85">{t('account.addressesTitle')}</h1></div>
        {!dialog && <button onClick={() => setDialog({ kind: 'add' })} className="flex h-10 shrink-0 items-center gap-2 border border-white/10 px-5 text-[10px] uppercase tracking-[0.1em] text-white/45 transition-colors hover:border-white/20"><Plus size={13} /> {t('account.addAddress')}</button>}
      </header>

      {dialog && <section className="mb-8"><h2 className="mb-4 border-b border-white/[0.05] pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">{dialog.kind === 'add' ? 'New Address' : 'Edit Address'}</h2><div className="border border-white/[0.06] bg-[#121115] p-6"><AddressForm key={dialog.kind === 'edit' ? dialog.address.id : 'new'} address={dialog.kind === 'edit' ? dialog.address : undefined} saving={createAddress.isPending || updateAddress.isPending} onSave={save} onCancel={() => setDialog(null)} /></div></section>}

      {addresses.isError ? <EmptyAddress title="Addresses could not be loaded" subtitle="Please try again." /> : !items.length ? <EmptyAddress title="No addresses saved" subtitle="Add a delivery address for a seamless checkout experience." /> : (
        <div className="space-y-4">{items.map((address) => (
          <article key={address.id} className={`border bg-[#121115] ${address.isDefault ? 'border-[#D4C3A3]/20 border-s-2 border-s-[#D4A017]' : 'border-white/[0.06] border-s-2 border-s-transparent'}`}>
            <div className="p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-medium text-white/75">{address.recipientName}</p>{address.isDefault && <span className="flex items-center gap-1 rounded-sm bg-[#D4A017]/10 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.12em] text-[#D4A017]"><Star size={8} fill="currentColor" /> {t('account.default')}</span>}</div>
                <div className="flex shrink-0 items-center">
                  {!address.isDefault && <button onClick={() => updateAddress.mutate({ id: address.id, payload: { isDefault: true } })} aria-label={t('account.setDefault')} className="p-2 text-white/25 transition-colors hover:text-white/55"><Star size={14} /></button>}
                  <button onClick={() => { setDialog({ kind: 'edit', address }); setConfirmDelete(null); }} aria-label={t('common.edit')} className="p-2 text-white/25 transition-colors hover:text-white/55"><Pencil size={14} /></button>
                  <button onClick={() => { setConfirmDelete(address.id); setDialog(null); }} aria-label={t('common.delete')} className="p-2 text-white/25 transition-colors hover:text-red-300/70"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="text-[11px] font-light leading-[1.7] text-white/35"><p>{address.street}</p><p>{address.city}{address.postalCode ? `, ${address.postalCode}` : ''} · {address.country}</p><p className="mt-0.5 text-white/25">{address.phone}</p></div>
              {confirmDelete === address.id && <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-red-300/15 pt-4"><p className="flex-1 text-[11px] text-red-300/70">Remove this address?</p><button onClick={() => setConfirmDelete(null)} className="h-8 border border-white/10 px-4 text-[9px] uppercase tracking-[0.1em] text-white/40">Keep</button><button onClick={async () => { await deleteAddress.mutateAsync(address.id); setConfirmDelete(null); }} className="h-8 border border-red-300/25 px-4 text-[9px] uppercase tracking-[0.1em] text-red-300/70">Remove</button></div>}
            </div>
          </article>
        ))}</div>
      )}
    </div>
  );
}

function AddressForm({ address, saving, onSave, onCancel }: { address?: SavedAddress; saving: boolean; onSave: (data: CreateSavedAddressData) => Promise<void>; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSavedAddressData>({ defaultValues: address ? { label: address.label, recipientName: address.recipientName, phone: address.phone, country: address.country, city: address.city, street: address.street, postalCode: address.postalCode, isDefault: address.isDefault } : { isDefault: false } });
  return <form onSubmit={handleSubmit(onSave)} className="space-y-5" noValidate>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Full Name" error={errors.recipientName?.message}><input autoComplete="name" className={inputClass} {...register('recipientName', { required: 'Full name is required.' })} /></Field>
      <Field label="Label"><input placeholder="Home, work…" className={inputClass} {...register('label')} /></Field>
      <Field label="Address" error={errors.street?.message}><input autoComplete="street-address" className={inputClass} {...register('street', { required: 'Address is required.' })} /></Field>
      <Field label="City" error={errors.city?.message}><input autoComplete="address-level2" className={inputClass} {...register('city', { required: 'City is required.' })} /></Field>
      <Field label="Country" error={errors.country?.message}><input autoComplete="country-name" className={inputClass} {...register('country', { required: 'Country is required.' })} /></Field>
      <Field label="Postal Code"><input autoComplete="postal-code" className={inputClass} {...register('postalCode')} /></Field>
      <Field label="Phone" error={errors.phone?.message}><input type="tel" autoComplete="tel" className={inputClass} {...register('phone', { required: 'Phone is required.' })} /></Field>
    </div>
    <label className="flex cursor-pointer items-center gap-3 text-[11px] font-light text-white/45"><input type="checkbox" className="h-4 w-4 accent-[#D4A017]" {...register('isDefault')} /> Set as default address</label>
    <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onCancel} className="h-10 border border-white/10 px-5 text-[10px] uppercase tracking-[0.1em] text-white/40">Cancel</button><button disabled={saving} className="h-10 bg-[#D4A017] px-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#0B0A0C] disabled:opacity-40">{saving ? 'Saving…' : 'Save Address'}</button></div>
  </form>;
}

const inputClass = 'block w-full border border-white/[0.08] bg-transparent px-3.5 py-2.5 text-[13px] font-light text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#D4C3A3]/40';
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">{label}</span>{children}{error && <span className="mt-1 block text-[10px] text-red-300/80">{error}</span>}</label>; }
function EmptyAddress({ title, subtitle }: { title: string; subtitle: string }) { return <div className="border border-white/[0.05] bg-[#121115] p-12 text-center"><MapPin size={28} strokeWidth={1} className="mx-auto mb-3 text-white/[0.18]" /><p className="mb-1.5 font-serif text-lg text-white/40">{title}</p><p className="text-[11px] font-light text-white/25">{subtitle}</p></div>; }
