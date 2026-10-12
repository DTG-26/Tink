'use client';

import React, { useState, useMemo } from 'react';
import { Vendor, Category, Product } from '../types/database';
import { StoreHeader } from './StoreHeader';
import { CategoryPills } from './CategoryPills';
import { ProductCard } from './ProductCard';
import { StickyCartBar } from './StickyCartBar';
import { CheckoutDrawer } from './CheckoutDrawer';
import { StoreFooter } from './StoreFooter';
import { ShoppingBag, Search } from 'lucide-react';

interface StorefrontViewProps {
  vendor: Vendor;
  categories: Category[];
  products: Product[];
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  vendor,
  categories,
  products
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Count items per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const prod of products) {
      if (prod.category_id) {
        counts[prod.category_id] = (counts[prod.category_id] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  // Category name map for fast lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of categories) {
      map.set(cat.id, cat.name);
    }
    return map;
  }, [categories]);

  // Filter products by selected category and search input
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategoryId !== null && prod.category_id !== selectedCategoryId) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prod.title.toLowerCase().includes(query);
        const matchesDesc = prod.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategoryId, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Store Header */}
      <StoreHeader vendor={vendor} />

      {/* Category Pills Navigation */}
      <CategoryPills
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        productCounts={productCounts}
        totalProductsCount={products.length}
      />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${vendor.store_name}'s menu...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 pb-24">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={product.category_id ? categoryMap.get(product.category_id) : undefined}
                isStoreOpen={vendor.is_open}
              />
            ))}
          </div>
        ) : (
          /* Empty Catalog State */
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 mb-3 shadow-xs">
              <ShoppingBag className="w-8 h-8 stroke-1 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No products found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {searchQuery
                ? `No items match "${searchQuery}". Try a different keyword.`
                : 'There are no active products in this category at the moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Reset search
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (Appears when items are in cart) */}
      <StickyCartBar />

      {/* Slide-Up Checkout Drawer (Phase 3 WhatsApp Engine) */}
      <CheckoutDrawer vendor={vendor} />

      {/* Store Footer */}
      <StoreFooter vendor={vendor} />
    </div>
  );
};
