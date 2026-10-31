-- ==============================================================================
-- Tink Pro Power Features Migration
-- Version: 20261031000000_tink_pro_power_features.sql
-- Features:
--   1. Delivery Zones / Fees selector (vendors.delivery_zones)
--   2. Auto Open/Closed Business Hours schedule (vendors.business_hours)
--   3. Product Variants & Options - sizes, flavors, colors (products.variants)
-- ==============================================================================

-- 1. Add delivery_zones and business_hours JSONB columns to vendors
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS delivery_zones JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"enabled": false, "open_time": "09:00", "close_time": "21:00", "days": [1, 2, 3, 4, 5, 6]}'::jsonb;

-- 2. Add variants JSONB column to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 3. Column comments
COMMENT ON COLUMN public.vendors.delivery_zones IS 'Array of delivery zones { id, name, fee } for Tink Pro checkout calculation';
COMMENT ON COLUMN public.vendors.business_hours IS 'Automatic operating schedule { enabled, open_time, close_time, days } in WAT (Africa/Lagos) for Tink Pro';
COMMENT ON COLUMN public.products.variants IS 'Array of product variants/options { id, name, price } (sizes, flavors, colors) for Tink Pro';

