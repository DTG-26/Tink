import React from 'react';
import { notFound } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Vendor, Category, Product, checkIsActivePro } from '@/types/database';
import { MONETIZATION_CONFIG, SITE_URL } from '@/lib/constants';
import { CartProvider } from '@/context/CartContext';
import { StorefrontView } from '@/components/StorefrontView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      .select('store_name, slug, description, bio, logo_url, banner_url')
      .ilike('slug', normalizedSlug)
      .maybeSingle();

    if (vendor) {
      const storeUrl = `${SITE_URL}/${vendor.slug}`;
      const title = `${vendor.store_name} — Online Store on Tink`;
      const description =
        vendor.bio ||
        vendor.description ||
        `Browse the digital storefront and order directly on WhatsApp from ${vendor.store_name} on Tink.`;
      const previewImage = vendor.banner_url || vendor.logo_url || `${SITE_URL}/logo.png`;

      return {
        title,
        description,
        alternates: {
          canonical: storeUrl
        },
        openGraph: {
          type: 'website',
          locale: 'en_NG',
          url: storeUrl,
          siteName: 'Tink',
          title,
          description,
          images: [
            {
              url: previewImage,
              alt: `${vendor.store_name} storefront on Tink`
            }
          ]
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [previewImage]
        }
      };
    }
  }

  return {
    title: 'Store Not Found',
    robots: {
      index: false,
      follow: false
    }
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

  // Free Tier Rule: Max 5 products displayed on storefront
  const isPro = checkIsActivePro(vendor);
  if (!isPro) {
    products = products.slice(0, MONETIZATION_CONFIG.FREE_TIER_MAX_PRODUCTS);
  }

  const storeSameAs: string[] = [];
  if (vendor.social_links?.instagram) {
    const ig = vendor.social_links.instagram.trim();
    storeSameAs.push(ig.startsWith('http') ? ig : `https://instagram.com/${ig.replace('@', '')}`);
  }
  if (vendor.social_links?.twitter) {
    const tw = vendor.social_links.twitter.trim();
    storeSameAs.push(tw.startsWith('http') ? tw : `https://x.com/${tw.replace('@', '')}`);
  }
  if (vendor.social_links?.tiktok) {
    const tt = vendor.social_links.tiktok.trim();
    storeSameAs.push(tt.startsWith('http') ? tt : `https://tiktok.com/@${tt.replace('@', '')}`);
  }

  const storeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: vendor.store_name,
    url: `${SITE_URL}/${vendor.slug}`,
    description:
      vendor.bio ||
      vendor.description ||
      `${vendor.store_name} digital storefront powered by Tink.`,
    image: vendor.logo_url || vendor.banner_url || `${SITE_URL}/logo.png`,
    ...(storeSameAs.length > 0 ? { sameAs: storeSameAs } : {})
  };

  return (
    <CartProvider vendorSlug={vendor.slug}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <StorefrontView
        vendor={vendor}
        categories={categories}
        products={products}
      />
    </CartProvider>
  );
}
