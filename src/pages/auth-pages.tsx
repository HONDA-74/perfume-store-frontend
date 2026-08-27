import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/constants';
import { useLogin, useRegister } from '@/hooks/api/use-auth';
import { isNormalizedApiError } from '@/lib/api-error-handler';
import * as authApi from '@/services/api/auth';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100, 'Name is too long'),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0A0C] px-5 py-16 text-[#F3F2F5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,195,163,0.12),transparent_32%),radial-gradient(circle_at_80%_85%,rgba(126,82,46,0.12),transparent_35%)]" />
      <div className="relative w-full max-w-md border border-white/[0.08] bg-[#121115]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <Link to={ROUTES.home} className="mb-10 block text-center font-serif text-2xl tracking-[0.22em] text-[#D4C3A3]" aria-label="KENZ home">
          KENZ
        </Link>
        <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#D4C3A3]/70">{eyebrow}</p>
        <h1 className="text-center font-serif text-4xl font-normal tracking-[-0.02em]">{title}</h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-white/45">{description}</p>
        <div className="mt-9">{children}</div>
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  password,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; password?: boolean }) {
  const [visible, setVisible] = useState(false);
  const id = props.id ?? props.name;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-white/55">{label}</span>
      <span className="relative block">
        <input
          {...props}
          id={id}
          type={password ? (visible ? 'text' : 'password') : props.type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 w-full border border-white/10 bg-black/20 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4C3A3]/70 disabled:opacity-50"
        />
        {password && (
          <button type="button" onClick={() => setVisible((value) => !value)} className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center text-white/35 hover:text-white/70" aria-label={visible ? 'Hide password' : 'Show password'}>
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </span>
      {error && <span id={`${id}-error`} className="mt-2 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="flex h-12 w-full items-center justify-center bg-[#D4A017] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0B0A0C] transition hover:bg-[#E2BB55] disabled:cursor-wait disabled:opacity-60">
      {pending ? 'Please wait…' : children}
    </button>
  );
}

function FormError({ error }: { error: unknown }) {
  if (!error) return null;
  const message = isNormalizedApiError(error) ? error.message : 'Something went wrong. Please try again.';
  return <div role="alert" className="border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">{message}</div>;
}

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    const result = await login.mutateAsync(values);
    navigate(result.user.role === UserRole.ADMIN ? ROUTES.admin.root : returnTo || ROUTES.shop, { replace: true });
  });

  return (
    <AuthShell eyebrow="Private access" title="Welcome Back" description="Sign in to continue your fragrance journey.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Field label="Password" autoComplete="current-password" password {...register('password')} error={errors.password?.message} />
        <FormError error={login.error} />
        <SubmitButton pending={login.isPending}>Sign In</SubmitButton>
      </form>
      <p className="mt-7 text-center text-sm text-white/40">New to KENZ? <Link to={ROUTES.auth.register} className="text-[#D4C3A3] hover:text-[#E2BB55]">Create an account</Link></p>
    </AuthShell>
  );
}

export function RegisterPage() {
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync(values);
    navigate(ROUTES.shop, { replace: true });
  });

  return (
    <AuthShell eyebrow="KENZ membership" title="Create Account" description="Save your favourites, manage orders, and discover scents selected for you.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Full name" autoComplete="name" {...register('fullName')} error={errors.fullName?.message} />
        <Field label="Email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Field label="Password" autoComplete="new-password" password {...register('password')} error={errors.password?.message} />
        <FormError error={registerMutation.error} />
        <SubmitButton pending={registerMutation.isPending}>Create Account</SubmitButton>
      </form>
      <p className="mt-7 text-center text-sm text-white/40">Already a member? <Link to={ROUTES.auth.login} className="text-[#D4C3A3] hover:text-[#E2BB55]">Sign in</Link></p>
    </AuthShell>
  );
}

export function AdminLoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [roleError, setRoleError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setRoleError(null);
    const result = await login.mutateAsync(values);
    if (result.user.role !== UserRole.ADMIN) {
      try { await authApi.logout(result.refreshToken); } finally {
        clearAuth();
        queryClient.clear();
      }
      setRoleError('This portal is restricted to administrator accounts.');
      return;
    }
    navigate(ROUTES.admin.root, { replace: true });
  });

  return (
    <AuthShell eyebrow="Administration" title="Admin Access" description="Secure access for authorized KENZ administrators only.">
      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-[#D4C3A3]/60"><LockKeyhole size={14} /> Role verification is enforced after authentication.</div>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Admin email" autoComplete="email" {...register('email')} error={errors.email?.message} />
        <Field label="Password" autoComplete="current-password" password {...register('password')} error={errors.password?.message} />
        <FormError error={roleError ? { status: 403, message: roleError, type: 'forbidden' } : login.error} />
        <SubmitButton pending={login.isPending}>Enter Admin</SubmitButton>
      </form>
    </AuthShell>
  );
}
