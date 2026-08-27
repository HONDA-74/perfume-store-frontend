/**
 * Admin Product Form Page
 * Create/Edit product with real backend DTOs.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/api/use-products';
import { useBrands } from '@/hooks/api/use-brands';
import { useCategories } from '@/hooks/api/use-categories';
import { PageLoader } from '@/components/shared/page-loader';
import { FragranceConcentration, FragranceGender, type CreateProductDto } from '@/types';

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const productQuery = useProduct(id!);
  const brandsQuery = useBrands({ limit: 100 });
  const categoriesQuery = useCategories({ limit: 100 });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    name: '',
    sku: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    gender: FragranceGender.UNISEX,
    concentration: FragranceConcentration.EDP,
    sizeMl: 100,
    discountPrice: undefined,
    images: [],
    isFeatured: false,
    notes: { top: [], middle: [], base: [] },
    categoryId: '',
    brandId: '',
  });

  useEffect(() => {
    if (isEditing && productQuery.data) {
      const p = productQuery.data;
      setFormData({
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price,
        stockQuantity: p.stockQuantity,
        gender: p.gender,
        concentration: p.concentration,
        sizeMl: p.sizeMl,
        discountPrice: p.discountPrice,
        images: p.images,
        isFeatured: p.isFeatured,
        notes: p.notes,
        categoryId: p.category?.id ?? p.categoryId,
        brandId: p.brand?.id ?? p.brandId,
      });
    }
  }, [isEditing, productQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateProductDto = {
      name: formData.name!,
      sku: formData.sku!,
      description: formData.description!,
      price: formData.price!,
      stockQuantity: formData.stockQuantity!,
      gender: formData.gender!,
      categoryId: formData.categoryId!,
      brandId: formData.brandId!,
      concentration: formData.concentration!,
      sizeMl: formData.sizeMl!,
      discountPrice: formData.discountPrice,
      images: formData.images,
      isFeatured: formData.isFeatured,
      notes: formData.notes ?? { top: [], middle: [], base: [] },
    };

    if (isEditing) {
      updateMutation.mutate({ id: id!, payload }, {
        onSuccess: () => navigate('/admin/products'),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate('/admin/products'),
      });
    }
  };

  if (isEditing && productQuery.isLoading) {
    return <PageLoader />;
  }

  const mutation = isEditing ? updateMutation : createMutation;
  const brands = brandsQuery.data?.items ?? [];
  const categories = categoriesQuery.data?.items ?? [];

  return (
    <div className="p-8" style={{ background: '#0B0A0C', minHeight: '100%' }}>
      <button
        onClick={() => navigate('/admin/products')}
        className="inline-flex items-center gap-2 mb-6 text-white/40 hover:text-white/70 transition-colors duration-150"
        style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '2rem', color: 'rgba(243,242,245,0.9)', marginBottom: '8px' }}>
        {isEditing ? 'Edit Product' : 'Create Product'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border rounded bg-transparent outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
              SKU *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full px-4 py-2 border rounded bg-transparent outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border rounded bg-transparent outline-none resize-y"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Brand *
              </label>
              <select
                required
                value={formData.brandId}
                onChange={(e) => setFormData(prev => ({ ...prev, brandId: e.target.value }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              >
                <option value="">Select brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Price ($) *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Discount Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.discountPrice || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Gender & Concentration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Gender *
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as FragranceGender }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              >
                <option value={FragranceGender.MALE}>Men</option>
                <option value={FragranceGender.FEMALE}>Women</option>
                <option value={FragranceGender.UNISEX}>Unisex</option>
              </select>
            </div>

            <div>
              <label className="block mb-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 400, color: 'rgba(243,242,245,0.6)' }}>
                Concentration
              </label>
              <select
                value={formData.concentration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, concentration: e.target.value as FragranceConcentration }))}
                className="w-full px-4 py-2 border rounded bg-transparent outline-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(243,242,245,0.9)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
              >
                <option value={FragranceConcentration.EDP}>EDP</option>
                <option value={FragranceConcentration.EDT}>EDT</option>
                <option value={FragranceConcentration.EDC}>EDC</option>
                <option value={FragranceConcentration.PARFUM}>Parfum</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {mutation.isError && (
            <div className="p-4 border rounded flex items-start gap-3" style={{ background: 'rgba(244,67,54,0.05)', borderColor: 'rgba(244,67,54,0.2)' }}>
              <AlertCircle size={16} style={{ color: 'rgb(244,67,54)' }} className="flex-shrink-0 mt-0.5" />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgb(244,67,54)' }}>
                {mutation.error instanceof Error ? mutation.error.message : 'An error occurred.'}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded hover:opacity-85 transition-opacity duration-150 disabled:opacity-50"
              style={{ background: 'hsl(43 82% 52%)', color: '#0B0A0C', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}
            >
              <Save size={16} />
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2.5 border rounded hover:bg-white/5 transition-colors duration-150"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(243,242,245,0.6)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
