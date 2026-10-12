'use client';

/**
 * Product Management Table with Optimistic 1-Tap is_available Toggle (Crisp White Theme)
 * Conforms to Master Build Blueprint Phase 4
 */

import React, { useState } from 'react';
import { Product, Category } from '../../types/database';
import { formatNaira } from '../../lib/whatsapp';
import {
  ShoppingBag,
  Edit2,
  Trash2,
  CheckCircle,
  PackageX,
  Search,
  Plus
} from 'lucide-react';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onToggleAvailability: (productId: string, newStatus: boolean) => Promise<void>;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
  onAddNew: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  onToggleAvailability,
  onEditProduct,
  onDeleteProduct,
  onAddNew
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    categoryMap.set(c.id, c.name);
  }

  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.category_id !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggle = async (product: Product) => {
    if (togglingId) return;
    setTogglingId(product.id);
    try {
      await onToggleAvailability(product.id, !product.is_available);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
            <ShoppingBag className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {search
              ? 'No products match your search query.'
              : 'Start by adding your first product to your digital catalog.'}
          </p>
          {!search && (
            <button
              onClick={onAddNew}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Product Now
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-100">
            {filtered.map((product) => {
              const catName = product.category_id
                ? categoryMap.get(product.category_id)
                : null;

              return (
                <div
                  key={product.id}
                  className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    !product.is_available ? 'bg-slate-50/70 opacity-80' : 'hover:bg-slate-50/40'
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag className="w-6 h-6 stroke-1" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {product.title}
                        </h4>
                        {catName && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {catName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-extrabold text-blue-600 mt-0.5">
                        ₦{formatNaira(product.price)}
                      </p>

                      {product.description && (
                        <p className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions & 1-Tap Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* 1-Tap Optimistic Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggle(product)}
                      disabled={togglingId === product.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                        product.is_available
                          ? 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Tap to toggle stock availability"
                    >
                      {product.is_available ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <PackageX className="w-3.5 h-3.5 text-slate-400" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
