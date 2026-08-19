/**
 * Account Dashboard Page
 * 
 * Main account hub with links to orders, profile, etc.
 */

import { Link } from 'react-router';
import { Package, User, MapPin, LogOut } from 'lucide-react';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';
import { ROUTES } from '@/constants';

export function AccountDashboardPage() {
  const { data: user, isLoading } = useCurrentUser();
  const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.logout();
    window.location.href = ROUTES.home;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader
          title="My Account"
          subtitle={user?.fullName || user?.email || 'Welcome'}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to={ROUTES.account.orders}
            className="group rounded-lg border border-kenz-border bg-kenz-surface/30 p-8 transition-all hover:border-kenz-gold"
          >
            <Package size={32} className="mb-4 text-kenz-gold" />
            <h3 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-kenz-gold">
              Orders
            </h3>
            <p className="text-sm text-foreground/60">
              View your order history and track shipments
            </p>
          </Link>

          <Link
            to={ROUTES.account.profile}
            className="group rounded-lg border border-kenz-border bg-kenz-surface/30 p-8 transition-all hover:border-kenz-gold"
          >
            <User size={32} className="mb-4 text-kenz-gold" />
            <h3 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-kenz-gold">
              Profile
            </h3>
            <p className="text-sm text-foreground/60">
              Manage your personal information
            </p>
          </Link>

          <Link
            to={ROUTES.account.addresses}
            className="group rounded-lg border border-kenz-border bg-kenz-surface/30 p-8 transition-all hover:border-kenz-gold"
          >
            <MapPin size={32} className="mb-4 text-kenz-gold" />
            <h3 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-kenz-gold">
              Addresses
            </h3>
            <p className="text-sm text-foreground/60">
              Manage your saved addresses
            </p>
          </Link>

          <button
            onClick={handleLogout}
            className="group rounded-lg border border-kenz-border bg-kenz-surface/30 p-8 text-left transition-all hover:border-red-500"
          >
            <LogOut size={32} className="mb-4 text-red-500" />
            <h3 className="mb-2 font-serif text-xl text-foreground transition-colors group-hover:text-red-500">
              Sign Out
            </h3>
            <p className="text-sm text-foreground/60">
              Log out of your account
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
