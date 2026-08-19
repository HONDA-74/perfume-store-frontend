/**
 * Profile Page
 * 
 * NOTE: Backend has no PATCH /users/me endpoint for profile updates.
 * Displays user information as read-only until backend implements this feature.
 */

import { Lock } from 'lucide-react';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';

export function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <SectionHeader title="Profile" subtitle="Your account information" />

        {/* Backend Limitation Notice */}
        <div className="mt-8 rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
          <div className="flex items-start gap-3">
            <Lock size={20} className="mt-0.5 flex-shrink-0 text-amber-500" />
            <div>
              <h3 className="mb-2 font-sans text-sm font-medium uppercase tracking-wider text-amber-500">
                Read-Only Mode
              </h3>
              <p className="text-sm text-foreground/70">
                Profile editing requires backend API implementation.
                Contact support to update your information.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6 rounded-lg border border-kenz-border bg-kenz-surface/30 p-8">
          <div>
            <label className="mb-2 block font-sans text-xs uppercase tracking-wider text-foreground/50">
              Full Name
            </label>
            <p className="text-foreground">{user?.fullName || 'Not set'}</p>
          </div>

          <div>
            <label className="mb-2 block font-sans text-xs uppercase tracking-wider text-foreground/50">
              Email
            </label>
            <p className="text-foreground">{user?.email || 'Not set'}</p>
          </div>

          <div>
            <label className="mb-2 block font-sans text-xs uppercase tracking-wider text-foreground/50">
              Role
            </label>
            <p className="text-foreground">{user?.role || 'Not set'}</p>
          </div>

          <div>
            <label className="mb-2 block font-sans text-xs uppercase tracking-wider text-foreground/50">
              Member Since
            </label>
            <p className="text-foreground">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
