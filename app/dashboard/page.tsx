'use client';

/**
 * Vendor Dashboard & Store Management
 * Conforms to Master Build Blueprint Phase 4 (100% Free / Unlimited Tier)
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Vendor, Category, Product } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { signOutVendor } from '@/lib/auth';
import { ProductList } from '@/components/dashboard/ProductList';
import { ProductModal } from '@/components/dashboard/ProductModal';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { StoreSettingsModal } from '@/components/dashboard/StoreSettingsModal';
import {
  Store,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Settings,
  ShoppingBag,
  FolderTree,
  Power,
  Sparkles,
  ArrowRight,
  Loader2,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load vendor from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const localVendorId = typeof window !== 'undefined' ? localStorage.getItem('tink_vendor_id') : null;

      if (isSupabaseConfigured) {
        // 1. Check current logged-in user session
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;

        let v: Vendor | null = null;

        // Fetch vendor by auth user ID
        if (currentUser) {
          const { data } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
          if (data) v = data as Vendor;
        }

        // Fallback: check localStorage vendor ID if session check wasn't immediate
        if (!v && localVendorId) {
          const { data } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', localVendorId)
            .maybeSingle();
          if (data) v = data as Vendor;
        }

        if (v) {
          setVendor(v);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tink_vendor_id', v.id);
            localStorage.setItem('tink_vendor', JSON.stringify(v));
          }

          const { data: c } = await supabase
            .from('categories')
            .select('*')
            .eq('vendor_id', v.id)
            .order('sort_order', { ascending: true });
          if (c) setCategories(c as Category[]);

          const { data: p } = await supabase
            .from('products')
            .select('*')
            .eq('vendor_id', v.id)
            .order('sort_order', { ascending: true });
          if (p) setProducts(p as Product[]);

          setIsLoading(false);
          return;
        }

        // If not logged in and no local vendor, redirect to login
        if (!currentUser && !localVendorId) {
          router.push('/login');
          return;
        }
      }

      // Check localStorage for offline created store if any
      try {
        const localVendor = localStorage.getItem('tink_vendor');
        if (localVendor) {
          const parsed = JSON.parse(localVendor);
          setVendor(parsed);
        } else {
          setVendor(null);
        }
      } catch {
        setVendor(null);
      }

      setIsLoading(false);
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await signOutVendor();
    router.push('/login');
  };

  // Toggle Store Open/Closed
  const handleToggleStoreOpen = async () => {
    if (!vendor) return;
    const updated = { ...vendor, is_open: !vendor.is_open };
    setVendor(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tink_vendor', JSON.stringify(updated));
    }

    if (isSupabaseConfigured) {
      await supabase.from('vendors').update({ is_open: updated.is_open }).eq('id', vendor.id);
    }
  };

  // Optimistic 1-Tap Stock Availability Toggle
  const handleToggleProductAvailability = async (
    productId: string,
    newStatus: boolean
  ) => {
    // 1. Optimistic UI update immediately
    const updated = products.map((p) =>
      p.id === productId ? { ...p, is_available: newStatus } : p
    );
    setProducts(updated);

    // 2. Dispatch background Supabase update
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ is_available: newStatus })
        .eq('id', productId);

      if (error) {
        console.error('Failed to update product availability:', error);
        // Revert on error
        setProducts(
          products.map((p) =>
            p.id === productId ? { ...p, is_available: !newStatus } : p
          )
        );
      }
    }
  };

  // Save (Create or Update) Product
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (!vendor) return;

    if (productData.id) {
      // Edit existing
      const updated = products.map((p) =>
        p.id === productData.id ? ({ ...p, ...productData } as Product) : p
      );
      setProducts(updated);

      if (isSupabaseConfigured) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', productData.id);
      }
    } else {
      // Create new
      if (isSupabaseConfigured) {
        const insertPayload = {
          vendor_id: vendor.id,
          category_id: productData.category_id || null,
          title: productData.title || 'New Item',
          description: productData.description || null,
          price: productData.price || 0,
          image_url: productData.image_url || null,
          is_available: productData.is_available ?? true,
          sort_order: products.length + 1
        };

        const { data, error } = await supabase
          .from('products')
          .insert([insertPayload])
          .select()
          .single();

        if (data) {
          setProducts([...products, data as Product]);
          return;
        } else if (error) {
          console.error('Product creation error:', error);
        }
      }

      // Local fallback
      const newProduct: Product = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
        vendor_id: vendor.id,
        category_id: productData.category_id || null,
        title: productData.title || 'New Item',
        description: productData.description || null,
        price: productData.price || 0,
        image_url: productData.image_url || null,
        is_available: productData.is_available ?? true,
        sort_order: products.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts(products.filter((p) => p.id !== productId));

    if (isSupabaseConfigured) {
      await supabase.from('products').delete().eq('id', productId);
    }
  };

  // Add Category
  const handleAddCategory = async (name: string) => {
    if (!vendor) return;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          vendor_id: vendor.id,
          name,
          sort_order: categories.length + 1
        }])
        .select()
        .single();

      if (data) {
        setCategories([...categories, data as Category]);
        return;
      } else if (error) {
        console.error('Category creation error:', error);
      }
    }

    const newCategory: Category = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cat-${Date.now()}`,
      vendor_id: vendor.id,
      name,
      sort_order: categories.length + 1,
      created_at: new Date().toISOString()
    };
    setCategories([...categories, newCategory]);
  };

  // Delete Category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category? Items in it will move to Uncategorized.')) return;
    setCategories(categories.filter((c) => c.id !== categoryId));
    setProducts(
      products.map((p) =>
        p.category_id === categoryId ? { ...p, category_id: null } : p
      )
    );

    if (isSupabaseConfigured) {
      await supabase.from('categories').delete().eq('id', categoryId);
    }
  };

  // Save Store Settings
  const handleSaveStoreSettings = async (updatedFields: Partial<Vendor>) => {
    if (!vendor) return;
    const updated = { ...vendor, ...updatedFields };
    setVendor(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tink_vendor', JSON.stringify(updated));
    }

    if (isSupabaseConfigured) {
      await supabase.from('vendors').update(updatedFields).eq('id', vendor.id);
    }
  };

  const copyStoreLink = () => {
    if (!vendor) return;
    const url = `${window.location.origin}/${vendor.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold">Loading your Tink dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty State: No Store Registered Yet
  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col justify-between">
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Tink Logo" className="h-8 w-auto object-contain" />
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Dashboard
              </span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
            >
              <span>Create Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            No Store Created Yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
            You don&apos;t have an active store yet. Set up your WhatsApp catalog in 60 seconds to start adding products and taking orders.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20"
          >
            <span>Create Your Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>

        <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400 bg-white">
          <p>© {new Date().getFullYear()} Tink is a product of Danmari Tech Group.</p>
        </footer>
      </div>
    );
  }

  const inStockCount = products.filter((p) => p.is_available).length;
  const soldOutCount = products.filter((p) => !p.is_available).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Tink Logo" className="h-8 w-auto object-contain" />
              <span className="font-extrabold text-base tracking-tight text-slate-900 hidden sm:inline">
                Dashboard
              </span>
            </Link>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
              <Sparkles className="w-3 h-3 text-blue-600" />
              100% Free • Unlimited
            </span>
            <span className="hidden md:inline-flex text-[11px] font-medium text-slate-400 border-l border-slate-200 pl-2.5">
              A product of Danmari Tech Group
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex text-[11px] font-medium text-slate-400 mr-1">
              Tink is a product of Danmari Tech Group
            </span>
            <Link
              href={`/${vendor.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>View Catalog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Store & Bank Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Log Out of Seller Dashboard"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Store Profile Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden ring-2 ring-blue-500/20 flex-shrink-0 flex items-center justify-center">
              {vendor.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vendor.logo_url}
                  alt={vendor.store_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {vendor.store_name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    vendor.is_open
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      vendor.is_open ? 'bg-blue-600 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {vendor.is_open ? 'Open for Orders' : 'Store Paused'}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>/{vendor.slug}</span>
                <span>•</span>
                <button
                  onClick={copyStoreLink}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Store Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
            <button
              onClick={handleToggleStoreOpen}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                vendor.is_open
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{vendor.is_open ? 'Pause Store' : 'Resume Orders'}</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Total Products</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {products.length}
            </p>
            <span className="text-[10px] text-blue-600 font-semibold">Unlimited Free</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">In Stock</span>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">
              {inStockCount}
            </p>
            <span className="text-[10px] text-slate-400">Ready to order</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Sold Out</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-500 mt-1">
              {soldOutCount}
            </p>
            <span className="text-[10px] text-slate-400">1-tap toggleable</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Categories</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {categories.length}
            </p>
            <span className="text-[10px] text-slate-400">Menu sections</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>

        {/* Active Tab View */}
        <div>
          {activeTab === 'products' ? (
            <ProductList
              products={products}
              categories={categories}
              onAddNew={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(p) => {
                setEditingProduct(p);
                setIsProductModalOpen(true);
              }}
              onToggleAvailability={handleToggleProductAvailability}
              onDeleteProduct={handleDeleteProduct}
            />
          ) : (
            <CategoryManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}
        </div>
      </main>

      {/* Product Modal (Create / Edit) */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        categories={categories}
        vendorId={vendor.id}
      />

      {/* Store Settings Modal */}
      <StoreSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        vendor={vendor}
        onSave={handleSaveStoreSettings}
      />
    </div>
  );
}
