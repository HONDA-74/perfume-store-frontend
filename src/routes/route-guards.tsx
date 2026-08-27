import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types';

export function GuestRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return children;
  return <Navigate to={user.role === UserRole.ADMIN ? ROUTES.admin.root : ROUTES.shop} replace />;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if (user) return children;
  return <Navigate to={ROUTES.auth.login} replace state={{ returnTo: location.pathname + location.search }} />;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (user?.role === UserRole.ADMIN) return children;
  return <Navigate to={user ? ROUTES.shop : ROUTES.admin.login} replace />;
}
