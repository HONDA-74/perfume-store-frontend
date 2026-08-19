/**
 * Addresses Page
 * 
 * NOTE: Backend has no address CRUD endpoints.
 * Shows informational page until backend implements this feature.
 */

import { MapPin } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';

export function AddressesPage() {
  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <SectionHeader title="Addresses" subtitle="Manage your shipping addresses" />

        <div className="mt-12 rounded-lg border border-kenz-border bg-kenz-surface/30 p-12 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-kenz-gold" />
          <h3 className="mb-2 font-serif text-xl text-foreground">Address Management Coming Soon</h3>
          <p className="text-sm text-foreground/60">
            Backend address CRUD API is required for this feature.
            Your shipping address will be collected during checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
