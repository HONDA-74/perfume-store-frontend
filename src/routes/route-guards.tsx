import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { PageLoader } from '@/components/shared/page-loader';

export function GuestRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentUser = useCurrentUser();
  if (!isHydrated || (accessToken && currentUser.isLoading)) return <PageLoader />;
  const identity = user ?? currentUser.data;
  if (!identity) return children;
  return <Navigate to={identity.role === UserRole.ADMIN ? ROUTES.admin.root : ROUTES.shop} replace />;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentUser = useCurrentUser();
  const location = useLocation();
  if (!isHydrated || (accessToken && currentUser.isLoading)) return <PageLoader />;
  if (user ?? currentUser.data) return children;
  return <Navigate to={ROUTES.auth.login} replace state={{ returnTo: location.pathname + location.search }} />;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentUser = useCurrentUser();
  if (!isHydrated || (accessToken && currentUser.isLoading)) return <PageLoader />;
  const identity = user ?? currentUser.data;
  if (identity?.role === UserRole.ADMIN) return children;
  return <Navigate to={identity ? ROUTES.shop : ROUTES.admin.login} replace />;
}
