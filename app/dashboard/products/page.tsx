'use client';

/**
 * Vendor Products Management Page (`/dashboard/products`)
 * Enforces Tink Pro Freemium Rules:
 * - Active Pro status: is_pro === true && pro_expires_at && new Date(pro_expires_at) > new Date()
 * - Free Tier: Max 5 products. Blocks 6th product and triggers Pro Upgrade Modal.
 * - Active Pro: Unlimited products.
 * - Expired: Shows gentle renewal reminder badge and treats as Free.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Vendor, Category, Product, checkIsActivePro, checkIsProExpired } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MONETIZATION_CONFIG } from '@/lib/constants';
import { ProductList } from '@/components/dashboard/ProductList';
import { ProductModal } from '@/components/dashboard/ProductModal';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import {
  Store,
  ExternalLink,
  Plus,
  Settings,
  Sparkles,
  ArrowLeft,
  Loader2,
  Clock,
  AlertTriangle,
  Lock
} from 'lucide-react';

export default function DashboardProductsPage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const localVendorId =
        typeof window !== 'undefined'
          ? localStorage.getItem('tink_vendor_id')
          : null;

      if (isSupabaseConfigured) {
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;

        let v: Vendor | null = null;
        if (currentUser) {
          const { data } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
          if (data) v = data as Vendor;
        }

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

        if (!currentUser && !localVendorId) {
          router.push('/login');
          return;
        }
      }

      // LocalStorage fallback
      try {
        const stored = localStorage.getItem('tink_vendor');
        if (stored) {
          setVendor(JSON.parse(stored));
        }
      } catch {
        setVendor(null);
      }
      setIsLoading(false);
    }

    loadData();
  }, [router]);

  const isPro = checkIsActivePro(vendor);
  const isExpired = checkIsProExpired(vendor);

  // Check 5-product limit for Free tier
  const isFreeLimitReached = !isPro && products.length >= MONETIZATION_CONFIG.FREE_TIER_MAX_PRODUCTS;

  const handleAddNewProductClick = () => {
    if (isFreeLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleToggleProductAvailability = async (
    productId: string,
    newStatus: boolean
  ) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, is_available: newStatus } : p
    );
    setProducts(updated);

    if (isSupabaseConfigured) {
      await supabase
        .from('products')
        .update({ is_available: newStatus })
        .eq('id', productId);
    }
  };

  const handleToggleFeatured = async (productId: string, isFeatured: boolean) => {
    if (!isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const updated = products.map((p) =>
      p.id === productId ? { ...p, is_featured: isFeatured } : p
    );
    setProducts(updated);

    if (isSupabaseConfigured) {
      await supabase
        .from('products')
        .update({ is_featured: isFeatured })
        .eq('id', productId);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (!vendor) return;

    if (productData.id) {
      // Edit existing product
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
      // Check 5-product limit before adding 6th product
      if (!isPro && products.length >= MONETIZATION_CONFIG.FREE_TIER_MAX_PRODUCTS) {
        setIsUpgradeModalOpen(true);
        return;
      }

      if (isSupabaseConfigured) {
        const insertPayload = {
          vendor_id: vendor.id,
          category_id: productData.category_id || null,
          title: productData.title || 'New Item',
          description: productData.description || null,
          price: productData.price || 0,
          image_url: productData.image_url || null,
          is_available: productData.is_available ?? true,
          is_featured: isPro ? Boolean(productData.is_featured) : false,
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

      const newProduct: Product = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
        vendor_id: vendor.id,
        category_id: productData.category_id || null,
        title: productData.title || 'New Item',
        description: productData.description || null,
        price: productData.price || 0,
        image_url: productData.image_url || null,
        is_available: productData.is_available ?? true,
        is_featured: isPro ? Boolean(productData.is_featured) : false,
        sort_order: products.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts(products.filter((p) => p.id !== productId));

    if (isSupabaseConfigured) {
      await supabase.from('products').delete().eq('id', productId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold">Loading your catalog...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-900">Products</span>

            {/* Pro Status or Gentle Renewal Reminder Badge */}
            {isPro ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Tink Pro • Unlimited
              </span>
            ) : isExpired ? (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-colors"
                title="Your Pro subscription expired. Click to renew."
              >
                <Clock className="w-3 h-3 text-amber-600" />
                Pro Expired • Renew (₦3,000)
              </button>
            ) : (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span>Free Tier ({products.length}/5)</span>
                <span className="text-blue-600 font-bold ml-1">Upgrade</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${vendor.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/dashboard/settings"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Store Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Product Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your store&apos;s active items, prices, stock availability, and pinned best-sellers.
            </p>
          </div>

          <button
            onClick={handleAddNewProductClick}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
              isFreeLimitReached
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-600/20'
            }`}
          >
            {isFreeLimitReached ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Add Product (5/5 Free Limit)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </>
            )}
          </button>
        </div>

        {/* Product List Component */}
        <ProductList
          products={products}
          categories={categories}
          isPro={isPro}
          onToggleAvailability={handleToggleProductAvailability}
          onToggleFeatured={handleToggleFeatured}
          onAddNew={handleAddNewProductClick}
          onEditProduct={(p) => {
            setEditingProduct(p);
            setIsProductModalOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
          onTriggerUpgrade={() => setIsUpgradeModalOpen(true)}
        />
      </main>

      {/* Product Modal */}
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
        isPro={isPro}
        onTriggerUpgrade={() => {
          setIsProductModalOpen(false);
          setIsUpgradeModalOpen(true);
        }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        vendor={vendor}
      />
    </div>
  );
}
