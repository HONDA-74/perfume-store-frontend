import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PageLoader } from '@/components/shared/page-loader';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { useUpdateProfile } from '@/hooks/api/use-users';

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
}

export function ProfilePage() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileForm>({ defaultValues: { fullName: '', email: '', phone: '' } });

  useEffect(() => {
    if (user) reset({ fullName: user.fullName, email: user.email, phone: user.phone ?? '' });
  }, [reset, user]);

  if (isLoading) return <PageLoader />;

  const submit = handleSubmit(async (values) => {
    const updated = await updateProfile.mutateAsync(values);
    reset({ fullName: updated.fullName, email: updated.email, phone: updated.phone ?? '' });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  });

  return (
    <div>
      <header className="mb-8">
        <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">{t('nav.account')}</p>
        <h1 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-normal text-white/85">{t('account.profile')}</h1>
        <p className="mt-1 text-xs font-light italic text-white/30">{t('accountPage.profilePrivate')}</p>
      </header>

      <form onSubmit={submit} noValidate>
        <h2 className="mb-4 border-b border-white/[0.05] pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">{t('accountPage.personalInfo')}</h2>
        <div className="mb-6 grid grid-cols-1 gap-5 border border-white/[0.06] bg-[#121115] p-6 sm:grid-cols-2">
          <Field label={t('accountPage.fullName')} error={errors.fullName?.message}><input autoComplete="name" className={inputClass} {...register('fullName', { required: t('checkout.requiredField'), minLength: { value: 2, message: t('checkout.requiredField') } })} /></Field>
          <Field label={t('auth.email')} error={errors.email?.message}><input type="email" autoComplete="email" className={inputClass} {...register('email', { required: t('checkout.requiredEmail'), pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('checkout.invalidEmail') } })} /></Field>
          <Field label={t('accountPage.phone')}><input type="tel" autoComplete="tel" className={inputClass} {...register('phone')} /></Field>
          <Field label={t('accountPage.membership')}><input readOnly value={user?.role ?? ''} className={`${inputClass} cursor-not-allowed opacity-45`} /></Field>
        </div>

        <div className={`mb-6 overflow-hidden transition-all duration-300 ${saved || updateProfile.isError ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`} aria-live="polite">
          <div className={`border px-5 py-3 text-xs ${updateProfile.isError ? 'border-red-400/20 bg-red-400/[0.06] text-red-300/85' : 'border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200/85'}`}>{updateProfile.isError ? t('accountPage.profileFailed') : t('accountPage.profileUpdated')}</div>
        </div>
        <div className="flex justify-end"><button type="submit" disabled={updateProfile.isPending || !isDirty} className="h-11 bg-[#D4A017] px-8 text-[10px] font-medium uppercase tracking-[0.12em] text-[#0B0A0C] transition-opacity disabled:cursor-not-allowed disabled:opacity-30">{updateProfile.isPending ? t('admin.saving') : t('account.saveChanges')}</button></div>
      </form>
    </div>
  );
}

const inputClass = 'block w-full border border-white/[0.08] bg-transparent px-3.5 py-2.5 text-[13px] font-light text-white/80 outline-none transition-colors focus:border-[#D4C3A3]/40';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.14em] text-white/30">{label}</span>{children}{error && <span className="mt-1 block text-[10px] text-red-300/85">{error}</span>}</label>;
}
