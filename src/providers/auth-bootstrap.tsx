import type { PropsWithChildren } from 'react';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';

export function AuthBootstrap({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const currentUser = useCurrentUser();

  const isBootstrapping =
    !isHydrated || (!!accessToken && !user && !currentUser.isError);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0A0C]" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border border-white/15 border-t-[#D4C3A3]" />
        <span className="sr-only">{t('auth.restoringSession')}</span>
      </div>
    );
  }

  return children;
}
