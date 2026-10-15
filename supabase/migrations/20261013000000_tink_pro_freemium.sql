-- ==============================================================================
-- Tink Pro Freemium Subscription Tier Migration
-- Version: 20261013000000_tink_pro_freemium.sql
-- Conforms to Tink Pro Freemium Specification
-- ==============================================================================

-- 1. Update vendors table with customization & monetization columns
ALTER TABLE public.vendors 
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS custom_footer TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{"instagram": "", "twitter": "", "tiktok": ""}'::jsonb;

-- 2. Update products table with is_featured flag
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false NOT NULL;

-- 3. Performance indexes
CREATE INDEX IF NOT EXISTS idx_products_vendor_featured ON public.products(vendor_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_vendors_pro_status ON public.vendors(is_pro, pro_expires_at);

-- 4. Table and Column Comments
COMMENT ON COLUMN public.vendors.is_pro IS 'Indicates if vendor has upgraded to Tink Pro subscription';
COMMENT ON COLUMN public.vendors.pro_expires_at IS 'Expiration timestamp for active Tink Pro subscription';
COMMENT ON COLUMN public.vendors.accent_color IS 'Custom hex color for storefront buttons, badges, and headers (Pro only)';
COMMENT ON COLUMN public.vendors.banner_url IS 'Custom store banner/cover image URL';
COMMENT ON COLUMN public.vendors.bio IS 'Store tagline or short biography displayed on header';
COMMENT ON COLUMN public.vendors.custom_footer IS 'Custom storefront footer copy replacing platform promotion (Pro only)';
COMMENT ON COLUMN public.vendors.social_links IS 'JSON object with instagram, twitter, tiktok usernames/links';
COMMENT ON COLUMN public.products.is_featured IS 'Pinned best-seller or featured product displayed at top of storefront (Max 3, Pro only)';
