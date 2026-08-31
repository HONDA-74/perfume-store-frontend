/**
 * Admin Layout
 * Shell for admin pages with sidebar navigation.
 * Enforces admin authorization - redirects non-admin users.
 */

import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants/routes.constants';
import { useLogout } from '@/hooks/api/use-auth';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/ui/language-toggle';

const adminNav = [
  { key: 'admin.dashboard', icon: LayoutDashboard, path: ROUTES.admin.root },
  { key: 'admin.products', icon: Package, path: ROUTES.admin.products },
  { key: 'admin.brands', icon: Tag, path: ROUTES.admin.brands },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <div className="flex h-screen" style={{ background: '#0B0A0C' }}>
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-e" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0F0E10' }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link to={ROUTES.home}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'rgba(243,242,245,0.85)', letterSpacing: '0.02em' }}>
              KENZ
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,195,163,0.4)', marginTop: '2px' }}>
              {t('nav.admin')}
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 mb-1 rounded transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(212,195,163,0.08)' : 'transparent',
                  color: isActive ? 'rgba(243,242,245,0.9)' : 'rgba(243,242,245,0.45)',
                }}
              >
                <Icon size={18} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400 }}>
                  {t(item.key)}
                </span>
                {isActive && <ChevronRight size={14} className="directional-icon ms-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-2 mb-2">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.7)' }}>
              {user?.fullName || user?.email}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 300, color: 'rgba(243,242,245,0.3)', marginTop: '2px' }}>
              {t('nav.admin')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 w-full rounded hover:bg-white/5 transition-colors duration-150"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 300, color: 'rgba(243,242,245,0.4)' }}
          >
            <LogOut size={14} />
            {t('admin.signOut')}
          </button>
          <LanguageToggle showLabel className="mt-2 w-full" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
