'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types/database';
import { X, ShoppingBag, Plus } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  categories: Category[];
  initialProduct?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  initialProduct
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setDescription(initialProduct.description || '');
      setPrice(initialProduct.price.toString());
      setCategoryId(initialProduct.category_id || '');
      setImageUrl(initialProduct.image_url || '');
      setIsAvailable(initialProduct.is_available);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategoryId(categories[0]?.id || '');
      setImageUrl('');
      setIsAvailable(true);
    }
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    onSave({
      id: initialProduct?.id,
      title: title.trim(),
      description: description.trim() || null,
      price: parseFloat(price) || 0,
      category_id: categoryId || null,
      image_url: imageUrl.trim() || null,
      is_available: isAvailable
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {initialProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Asun Fried Rice Special"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          {/* Price & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (₦ NGN) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₦
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Served with spicy smoked goat meat and plantain cubes."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
            {imageUrl && (
              <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageUrl('')}
                />
              </div>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">In Stock & Available</p>
              <p className="text-[11px] text-slate-500">Allow customers to add this item to their cart</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                isAvailable ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{initialProduct ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
