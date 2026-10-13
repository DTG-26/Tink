import React from 'react';
import { notFound } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Vendor, Category, Product } from '@/types/database';
import { CartProvider } from '@/context/CartContext';
import { StorefrontView } from '@/components/StorefrontView';
import { Metadata } from 'next';

interface StorefrontPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const normalizedSlug = (params.slug || '').toLowerCase().trim();

  if (isSupabaseConfigured && normalizedSlug) {
    const { data: vendor } = await supabase
      .from('vendors')
      .select('store_name, description')
      .ilike('slug', normalizedSlug)
      .maybeSingle();

    if (vendor) {
      return {
        title: `${vendor.store_name} — Order Direct on WhatsApp`,
        description: vendor.description || `Browse the catalog and order directly on WhatsApp from ${vendor.store_name}.`
      };
    }
  }

  return {
    title: 'Store Not Found — Tink'
  };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const normalizedSlug = (params.slug || '').toLowerCase().trim();

  let vendor: Vendor | null = null;
  let categories: Category[] = [];
  let products: Product[] = [];

  if (isSupabaseConfigured && normalizedSlug) {
    // 1. Fetch vendor profile by slug (case-insensitive)
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .ilike('slug', normalizedSlug)
      .maybeSingle();

    if (!vendorError && vendorData) {
      vendor = vendorData as Vendor;

      // 2. Fetch categories ordered by sort_order
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('sort_order', { ascending: true });

      if (catData) {
        categories = catData as Category[];
      }

      // 3. Fetch available products ordered by sort_order
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendor.id)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (prodData) {
        products = prodData as Product[];
      }
    }
  }

  // If store does not exist in the database, return 404
  if (!vendor) {
    notFound();
  }

  return (
    <CartProvider vendorSlug={vendor.slug}>
      <StorefrontView
        vendor={vendor}
        categories={categories}
        products={products}
      />
    </CartProvider>
  );
}
