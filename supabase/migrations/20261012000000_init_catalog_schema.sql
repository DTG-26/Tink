-- ==============================================================================
-- WhatsApp Direct-Cart Catalog: Supabase Database Migration
-- Phase 1 Foundation: Vendors, Categories, Products & RLS Policies
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. VENDORS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- e.g. "bites-by-khalid"
  whatsapp_number TEXT NOT NULL, -- Normalized: 234XXXXXXXXXX (13 digits)
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  
  -- Vendor's Bank Details (Printed in WhatsApp order for buyer payment)
  bank_name TEXT,
  account_number VARCHAR(10),
  account_name TEXT,
  
  -- Store Controls
  is_open BOOLEAN DEFAULT true NOT NULL,
  
  -- Monetization Engine
  is_pro BOOLEAN DEFAULT false NOT NULL,
  pro_expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 2. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 3. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true NOT NULL, -- 1-tap out-of-stock toggle
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 4. PERFORMANCE & LOOKUP INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);
CREATE INDEX IF NOT EXISTS idx_categories_vendor_id ON public.categories(vendor_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(vendor_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor_availability ON public.products(vendor_id, is_available);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- ==============================================================================
-- 5. AUTOMATIC TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_vendors_updated_at ON public.vendors;
CREATE TRIGGER set_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6.1 VENDORS POLICIES
-- ------------------------------------------------------------------------------
-- Public Read: Anyone can view vendor profiles for public storefronts
DROP POLICY IF EXISTS "Public can view vendors" ON public.vendors;
CREATE POLICY "Public can view vendors"
  ON public.vendors
  FOR SELECT
  USING (true);

-- Vendor Insert: Authenticated vendor can insert their own profile matching auth.uid()
DROP POLICY IF EXISTS "Vendors can insert own profile" ON public.vendors;
CREATE POLICY "Vendors can insert own profile"
  ON public.vendors
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Vendor Update: Authenticated vendor can update their own profile
DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;
CREATE POLICY "Vendors can update own profile"
  ON public.vendors
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vendor Delete: Authenticated vendor can delete their own profile
DROP POLICY IF EXISTS "Vendors can delete own profile" ON public.vendors;
CREATE POLICY "Vendors can delete own profile"
  ON public.vendors
  FOR DELETE
  USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 6.2 CATEGORIES POLICIES
-- ------------------------------------------------------------------------------
-- Public Read: Anyone can view categories
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Vendor Insert: Authenticated vendor can insert categories for their store
DROP POLICY IF EXISTS "Vendors can insert own categories" ON public.categories;
CREATE POLICY "Vendors can insert own categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

-- Vendor Update: Authenticated vendor can update their own categories
DROP POLICY IF EXISTS "Vendors can update own categories" ON public.categories;
CREATE POLICY "Vendors can update own categories"
  ON public.categories
  FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

-- Vendor Delete: Authenticated vendor can delete their own categories
DROP POLICY IF EXISTS "Vendors can delete own categories" ON public.categories;
CREATE POLICY "Vendors can delete own categories"
  ON public.categories
  FOR DELETE
  USING (auth.uid() = vendor_id);

-- ------------------------------------------------------------------------------
-- 6.3 PRODUCTS POLICIES
-- ------------------------------------------------------------------------------
-- Public Read: Anyone can select available products, OR the vendor can view all their own products
DROP POLICY IF EXISTS "Public can view available products" ON public.products;
CREATE POLICY "Public can view available products"
  ON public.products
  FOR SELECT
  USING (is_available = true OR auth.uid() = vendor_id);

-- Vendor Insert: Authenticated vendor can insert their own products
DROP POLICY IF EXISTS "Vendors can insert own products" ON public.products;
CREATE POLICY "Vendors can insert own products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

-- Vendor Update: Authenticated vendor can update their own products (including 1-tap toggle)
DROP POLICY IF EXISTS "Vendors can update own products" ON public.products;
CREATE POLICY "Vendors can update own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

-- Vendor Delete: Authenticated vendor can delete their own products
DROP POLICY IF EXISTS "Vendors can delete own products" ON public.products;
CREATE POLICY "Vendors can delete own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = vendor_id);

-- ==============================================================================
-- 7. STORAGE BUCKET: catalog-assets
-- ==============================================================================
-- Insert the public bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'catalog-assets',
  'catalog-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view catalog assets" ON storage.objects;
CREATE POLICY "Public can view catalog assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'catalog-assets');

DROP POLICY IF EXISTS "Vendors can upload catalog assets" ON storage.objects;
CREATE POLICY "Vendors can upload catalog assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'catalog-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Vendors can update catalog assets" ON storage.objects;
CREATE POLICY "Vendors can update catalog assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'catalog-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Vendors can delete catalog assets" ON storage.objects;
CREATE POLICY "Vendors can delete catalog assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'catalog-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
