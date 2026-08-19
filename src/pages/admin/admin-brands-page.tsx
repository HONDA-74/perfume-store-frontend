/**
 * Admin Brands Page - CRUD for brands
 */

import { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle, X, Save } from 'lucide-react';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/hooks/api/use-brands';
import { PageLoader } from '@/components/shared/page-loader';
import type { CreateBrandDto, Brand } from '@/types';

export function AdminBrandsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<CreateBrandDto>({ name: '', description: '', logoUrl: '', countryOfOrigin: '' });

  const brandsQuery = useBrands({ limit: 100 });
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateBrandDto = {
      name: formData.name,
      description: formData.description || undefined,
      logoUrl: formData.logoUrl || undefined,
      countryOfOrigin: formData.countryOfOrigin || undefined,
    };

    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, payload }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingBrand(null);
          setFormData({ name: '', description: '', logoUrl: '', countryOfOrigin: '' });
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          setFormData({ name: '', description: '', logoUrl: '', countryOfOrigin: '' });
        },
      });
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, description: brand.description || '', logoUrl: brand.logoUrl || '', countryOfOrigin: brand.countryOfOrigin || '' });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this brand? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (brandsQuery.isLoading) return <PageLoader />;

  const brands = brandsQuery.data?.items ?? [];
  const mutation = editingBrand ? updateMutation : createMutation;

  return (
    <div className="p-8" style={{ background: '#0B0A0C', minHeight: '100%' }}>
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '2rem', color: 'rgba(243,242,245,0.9)' }}>Brands</h1>
        <button
          onClick={() => { setIsFormOpen(true); setEditingBrand(null); setFormData({ name: '', description: '', logoUrl: '', countryOfOrigin: '' }); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded hover:opacity-85 transition-opacity"
          style={{ background: 'hsl(43 82% 52%)', color: '#0B0A0C', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500 }}
        >
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg p-6 border rounded" style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'rgba(243,242,245,0.9)' }}>
                {editingBrand ? 'Edit Brand' : 'Create Brand'}
              </h2>
              <button onClick={() => setIsFormOpen(false)}><X size={20} style={{ color: 'rgba(243,242,245,0.5)' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(243,242,245,0.6)' }}>Name *</label>
                <input required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border rounded bg-transparent outline-none" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }} />
              </div>
              <div>
                <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(243,242,245,0.6)' }}>Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2 border rounded bg-transparent outline-none resize-y" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }} />
              </div>
              <div>
                <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(243,242,245,0.6)' }}>Logo URL</label>
                <input type="url" value={formData.logoUrl} onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))} className="w-full px-4 py-2 border rounded bg-transparent outline-none" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }} />
              </div>
              <div>
                <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(243,242,245,0.6)' }}>Country</label>
                <input value={formData.countryOfOrigin} onChange={(e) => setFormData(prev => ({ ...prev, countryOfOrigin: e.target.value }))} className="w-full px-4 py-2 border rounded bg-transparent outline-none" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }} />
              </div>
              {mutation.isError && (
                <div className="p-3 border rounded flex items-start gap-2" style={{ background: 'rgba(244,67,54,0.05)', borderColor: 'rgba(244,67,54,0.2)' }}>
                  <AlertCircle size={14} style={{ color: 'rgb(244,67,54)' }} />
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'rgb(244,67,54)' }}>
                    {mutation.error instanceof Error ? mutation.error.message : 'An error occurred.'}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={mutation.isPending} className="inline-flex items-center gap-2 px-5 py-2 rounded hover:opacity-85 transition-opacity disabled:opacity-50" style={{ background: 'hsl(43 82% 52%)', color: '#0B0A0C', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>
                  <Save size={16} /> {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2 border rounded hover:bg-white/5 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(243,242,245,0.6)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {brands.length === 0 ? (
        <div className="p-12 border rounded text-center" style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.06)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(243,242,245,0.4)' }}>No brands yet.</p>
        </div>
      ) : (
        <div className="border rounded overflow-hidden" style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.06)' }}>
          <table className="w-full">
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <tr>
                <th className="text-left px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>Name</th>
                <th className="text-left px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>Country</th>
                <th className="text-right px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-6 py-4" style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(243,242,245,0.85)' }}>{brand.name}</td>
                  <td className="px-6 py-4" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(243,242,245,0.5)' }}>{brand.countryOfOrigin || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(brand)} className="p-2 rounded hover:bg-white/5 transition-colors"><Edit size={16} style={{ color: 'rgba(243,242,245,0.5)' }} /></button>
                      <button onClick={() => handleDelete(brand.id)} className="p-2 rounded hover:bg-red-500/10 transition-colors"><Trash2 size={16} style={{ color: 'rgb(244,67,54)' }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
