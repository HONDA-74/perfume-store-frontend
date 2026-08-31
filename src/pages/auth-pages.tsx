import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants';
import { useConfirmPasswordReset, useLogin, useRegister, useRequestPasswordReset } from '@/hooks/api/use-auth';
import { isNormalizedApiError } from '@/lib/api-error-handler';
import * as authApi from '@/services/api/auth';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types';
import { LanguageToggle } from '@/components/ui/language-toggle';

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;

function useAuthSchemas() {
  const { t } = useTranslation();
  const login = z.object({
    email: z.string().trim().email(t('auth.invalidEmail')),
    password: z.string().min(8, t('auth.passwordMin')),
  });
  const register = login.extend({
    fullName: z.string().trim().min(2, t('auth.fullName')).max(100, t('auth.fullName')),
  });
  const forgot = z.object({ email: z.string().trim().email(t('auth.invalidEmail')) });
  const reset = z.object({
    email: z.string().trim().email(t('auth.invalidEmail')),
    otp: z.string().regex(/^\d{6}$/, t('auth.invalidCode')),
    newPassword: z.string().min(8, t('auth.passwordMin')).regex(passwordPattern, t('auth.passwordRules')),
    confirmPassword: z.string(),
  }).refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'], message: t('auth.passwordsMismatch'),
  });
  return { login, register, forgot, reset };
}

interface AuthShellProps { eyebrow: string; title: string; description: string; children: React.ReactNode }

function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  const { t } = useTranslation();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0A0C] px-5 py-16 text-[#F3F2F5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,195,163,0.12),transparent_32%),radial-gradient(circle_at_80%_85%,rgba(126,82,46,0.12),transparent_35%)]" />
      <LanguageToggle className="absolute end-5 top-5" />
      <div className="relative w-full max-w-md border border-white/[0.08] bg-[#121115]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <Link to={ROUTES.home} className="mb-10 block text-center font-serif text-2xl tracking-[0.22em] text-[#D4C3A3]" aria-label={t('common.brandHome')}>KENZ</Link>
        <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#D4C3A3]/70">{eyebrow}</p>
        <h1 className="text-center font-serif text-4xl font-normal tracking-[-0.02em]">{title}</h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-white/45">{description}</p>
        <div className="mt-9">{children}</div>
      </div>
    </main>
  );
}

function Field({ label, error, password, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; password?: boolean }) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const id = props.id ?? props.name;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-white/55">{label}</span>
      <span className="relative block">
        <input {...props} id={id} type={password ? (visible ? 'text' : 'password') : props.type} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className="h-12 w-full border border-white/10 bg-black/20 px-4 pe-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4C3A3]/70 disabled:opacity-50" />
        {password && <button type="button" onClick={() => setVisible((value) => !value)} className="absolute end-1 top-1 flex h-10 w-10 items-center justify-center text-white/35 hover:text-white/70" aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
      </span>
      {error && <span id={`${id}-error`} className="mt-2 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  const { t } = useTranslation();
  return <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center bg-[#D4A017] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0B0A0C] transition hover:bg-[#E2BB55] disabled:cursor-wait disabled:opacity-60">{pending ? t('common.pleaseWait') : children}</button>;
}

function FormError({ error, message }: { error?: unknown; message?: string }) {
  const { t } = useTranslation();
  if (!error && !message) return null;
  const safeMessage = message ?? (isNormalizedApiError(error) && error.status === 429 ? error.message : t('common.error'));
  return <div role="alert" className="border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">{safeMessage}</div>;
}

export function LoginPage() {
  const { t } = useTranslation();
  const schemas = useAuthSchemas();
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schemas.login>>({ resolver: zodResolver(schemas.login) });
  const onSubmit = handleSubmit(async (values) => {
    const result = await login.mutateAsync(values);
    navigate(result.user.role === UserRole.ADMIN ? ROUTES.admin.root : returnTo || ROUTES.shop, { replace: true });
  });

  return <AuthShell eyebrow={t('auth.privateAccess')} title={t('auth.welcomeBack')} description={t('auth.loginDescription')}>
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label={t('auth.email')} type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
      <div><Field label={t('auth.password')} autoComplete="current-password" password {...register('password')} error={errors.password?.message} /><div className="mt-2 text-end"><Link to={ROUTES.auth.forgotPassword} className="text-xs text-[#D4C3A3]/70 transition hover:text-[#E2BB55]">{t('auth.forgotPassword')}</Link></div></div>
      <FormError error={login.error} />
      <SubmitButton pending={login.isPending}>{t('nav.signIn')}</SubmitButton>
    </form>
    <p className="mt-7 text-center text-sm text-white/40">{t('auth.newToKenz')} <Link to={ROUTES.auth.register} className="text-[#D4C3A3] hover:text-[#E2BB55]">{t('auth.createAccount')}</Link></p>
  </AuthShell>;
}

export function RegisterPage() {
  const { t } = useTranslation();
  const schemas = useAuthSchemas();
  const mutation = useRegister();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schemas.register>>({ resolver: zodResolver(schemas.register) });
  const onSubmit = handleSubmit(async (values) => { await mutation.mutateAsync(values); navigate(ROUTES.shop, { replace: true }); });
  return <AuthShell eyebrow={t('auth.member')} title={t('auth.createTitle')} description={t('auth.createDescription')}>
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label={t('auth.fullName')} autoComplete="name" {...register('fullName')} error={errors.fullName?.message} />
      <Field label={t('auth.email')} type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
      <Field label={t('auth.password')} autoComplete="new-password" password {...register('password')} error={errors.password?.message} />
      <FormError error={mutation.error} /><SubmitButton pending={mutation.isPending}>{t('auth.createTitle')}</SubmitButton>
    </form>
    <p className="mt-7 text-center text-sm text-white/40">{t('auth.alreadyMember')} <Link to={ROUTES.auth.login} className="text-[#D4C3A3] hover:text-[#E2BB55]">{t('nav.signIn')}</Link></p>
  </AuthShell>;
}

export function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const schemas = useAuthSchemas();
  const mutation = useRequestPasswordReset();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schemas.forgot>>({ resolver: zodResolver(schemas.forgot) });
  const onSubmit = handleSubmit(async ({ email }) => {
    await mutation.mutateAsync({ email, locale: i18n.language.startsWith('ar') ? 'ar' : 'en' });
    navigate(`${ROUTES.auth.resetPassword}?email=${encodeURIComponent(email)}`, { state: { codeSent: true } });
  });
  return <AuthShell eyebrow={t('auth.forgotEyebrow')} title={t('auth.forgotTitle')} description={t('auth.forgotDescription')}>
    <form onSubmit={onSubmit} className="space-y-5" noValidate><Field label={t('auth.email')} type="email" autoComplete="email" {...register('email')} error={errors.email?.message} /><FormError error={mutation.error} /><SubmitButton pending={mutation.isPending}>{t('auth.sendCode')}</SubmitButton></form>
    <p className="mt-7 text-center"><Link to={ROUTES.auth.login} className="text-sm text-[#D4C3A3] hover:text-[#E2BB55]">{t('auth.returnToLogin')}</Link></p>
  </AuthShell>;
}

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const schemas = useAuthSchemas();
  const mutation = useConfirmPasswordReset();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [complete, setComplete] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schemas.reset>>({ resolver: zodResolver(schemas.reset), defaultValues: { email: searchParams.get('email') ?? '' } });
  const onSubmit = handleSubmit(async ({ email, otp, newPassword }) => { await mutation.mutateAsync({ email, otp, newPassword }); setComplete(true); });
  return <AuthShell eyebrow={t('auth.forgotEyebrow')} title={t('auth.forgotTitle')} description={t('auth.resetDescription')}>
    {complete ? <div className="text-center"><CheckCircle2 className="mx-auto mb-5 text-[#D4A017]" size={38} /><p className="text-sm leading-7 text-white/60">{t('auth.resetSuccess')}</p><Link to={ROUTES.auth.login} className="mt-7 inline-flex h-12 w-full items-center justify-center bg-[#D4A017] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0B0A0C]">{t('auth.returnToLogin')}</Link></div> : <>
      {(location.state as { codeSent?: boolean } | null)?.codeSent && <div role="status" className="mb-5 border border-[#D4A017]/20 bg-[#D4A017]/[0.06] px-4 py-3 text-sm text-[#D4C3A3]">{t('auth.codeSent')}</div>}
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label={t('auth.email')} type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Field label={t('auth.verificationCode')} inputMode="numeric" autoComplete="one-time-code" maxLength={6} {...register('otp')} error={errors.otp?.message} />
        <Field label={t('auth.newPassword')} autoComplete="new-password" password {...register('newPassword')} error={errors.newPassword?.message} />
        <Field label={t('auth.confirmPassword')} autoComplete="new-password" password {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <FormError error={mutation.error} message={mutation.isError ? t('auth.invalidCode') : undefined} />
        <SubmitButton pending={mutation.isPending}>{t('auth.resetPassword')}</SubmitButton>
      </form>
      <p className="mt-7 text-center"><Link to={ROUTES.auth.forgotPassword} className="text-sm text-[#D4C3A3] hover:text-[#E2BB55]">{t('auth.resendCode')}</Link></p>
    </>}
  </AuthShell>;
}

export function AdminLoginPage() {
  const { t } = useTranslation();
  const schemas = useAuthSchemas();
  const login = useLogin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [roleError, setRoleError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schemas.login>>({ resolver: zodResolver(schemas.login) });
  const onSubmit = handleSubmit(async (values) => {
    setRoleError(null);
    const result = await login.mutateAsync(values);
    if (result.user.role !== UserRole.ADMIN) {
      try { await authApi.logout(result.refreshToken); } finally { clearAuth(); queryClient.clear(); }
      setRoleError(t('auth.adminRestricted')); return;
    }
    navigate(ROUTES.admin.root, { replace: true });
  });
  return <AuthShell eyebrow={t('auth.adminEyebrow')} title={t('auth.adminTitle')} description={t('auth.adminDescription')}>
    <div className="mb-6 flex items-center justify-center gap-2 text-xs text-[#D4C3A3]/60"><LockKeyhole size={14} />{t('auth.roleVerification')}</div>
    <form onSubmit={onSubmit} className="space-y-5" noValidate><Field label={t('auth.adminEmail')} type="email" autoComplete="email" {...register('email')} error={errors.email?.message} /><Field label={t('auth.password')} autoComplete="current-password" password {...register('password')} error={errors.password?.message} /><FormError error={login.error} message={roleError ?? undefined} /><SubmitButton pending={login.isPending}>{t('auth.enterAdmin')}</SubmitButton></form>
  </AuthShell>;
}
