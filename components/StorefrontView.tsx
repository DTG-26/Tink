'use client';

import React, { useState, useMemo } from 'react';
import { Vendor, Category, Product, checkIsActivePro } from '../types/database';
import { StoreHeader } from './StoreHeader';
import { CategoryPills } from './CategoryPills';
import { ProductCard } from './ProductCard';
import { StickyCartBar } from './StickyCartBar';
import { CheckoutDrawer } from './CheckoutDrawer';
import { StoreFooter } from './StoreFooter';
import { ShoppingBag, Search, Pin, Sparkles, Flame } from 'lucide-react';

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

  const isPro = checkIsActivePro(vendor);
  const accentColor = isPro && vendor.accent_color ? vendor.accent_color : '#2563EB';

  // Pinned/Featured products for Pro vendors (max 3)
  const featuredProducts = useMemo(() => {
    if (!isPro) return [];
    return products.filter((p) => p.is_featured).slice(0, 3);
  }, [isPro, products]);

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
    <div
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:text-white"
      style={{
        // Define store accent color CSS variable
        '--store-accent': accentColor
      } as React.CSSProperties}
    >
      {/* Store Header */}
      <StoreHeader vendor={vendor} />

      {/* Category Pills Navigation */}
      <CategoryPills
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        productCounts={productCounts}
        totalProductsCount={products.length}
        accentColor={accentColor}
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
            placeholder={`Search ${vendor.store_name}'s catalog...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-xs transition-all"
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

        {/* Pro Feature: Distinct Highlight Row for Pinned / Featured Products */}
        {featuredProducts.length > 0 && !searchQuery && selectedCategoryId === null && (
          <section className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Pin className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Featured Best-Sellers
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Hand-picked favorites from {vendor.store_name}
                  </p>
                </div>
              </div>

              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-white shadow-2xs"
                style={{ backgroundColor: accentColor }}
              >
                <Sparkles className="w-3 h-3" /> Popular Picks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`featured-${product.id}`}
                  product={product}
                  categoryName={
                    product.category_id ? categoryMap.get(product.category_id) : undefined
                  }
                  isStoreOpen={vendor.is_open}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </section>
        )}

        {/* Product Catalog Grid */}
        <div>
          {featuredProducts.length > 0 && !searchQuery && selectedCategoryId === null && (
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              All Items ({filteredProducts.length})
            </h3>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 pb-24">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={
                    product.category_id ? categoryMap.get(product.category_id) : undefined
                  }
                  isStoreOpen={vendor.is_open}
                  accentColor={accentColor}
                />
              ))}
            </div>
          ) : (
            /* Empty Catalog State */
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 mb-3 shadow-xs">
                <ShoppingBag className="w-8 h-8 stroke-1 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {searchQuery
                  ? `No items match "${searchQuery}". Try a different keyword.`
                  : 'There are no active products in this category at the moment.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ color: accentColor }}
                  className="mt-3 text-xs font-bold hover:underline"
                >
                  Reset search
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      <StickyCartBar accentColor={accentColor} />

      {/* Slide-Up Checkout Drawer */}
      <CheckoutDrawer vendor={vendor} />

      {/* Store Footer */}
      <StoreFooter vendor={vendor} />
    </div>
  );
};
