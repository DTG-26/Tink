/**
 * TypeScript Interfaces and Database Definitions
 * WhatsApp Direct-Cart Catalog
 * Conforms to Master Build Blueprint Section 2 & 3
 */

// ==============================================================================
// 1. CORE ENTITY INTERFACES
// ==============================================================================

export interface DeliveryZone {
  id: string;
  name: string; // e.g. "Mainland (Ikeja / Yaba)"
  fee: number; // Delivery fee in Naira (0 for Pickup / Free)
}

export interface BusinessHours {
  enabled: boolean;
  open_time: string; // 24-hour "HH:mm", e.g. "09:00"
  close_time: string; // 24-hour "HH:mm", e.g. "21:00"
  days: number[]; // Days of week active: 0 (Sun) through 6 (Sat)
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Large", "Size XL", "Spicy"
  price: number; // Variant price in Naira
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  // JSONB fallback storage so Pro features persist even before running extra SQL migrations
  _delivery_zones?: DeliveryZone[];
  _business_hours?: BusinessHours;
  _product_variants?: Record<string, ProductVariant[]>;
}

export interface Vendor {
  id: string; // UUID primary key matching auth.users(id)
  store_name: string;
  slug: string; // Unique URL slug (e.g. "my-store")
  whatsapp_number: string; // 13-digit normalized E.164 (234XXXXXXXXXX)
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;

  // Store Customization (Pro Features)
  accent_color?: string; // Hex color code (default #000000)
  bio?: string | null; // Tagline / bio
  custom_footer?: string | null; // Custom footer text
  social_links?: SocialLinks; // JSON links for instagram, twitter, tiktok (+ Pro config fallback)
  delivery_zones?: DeliveryZone[] | null; // Pro delivery zones & fees
  business_hours?: BusinessHours | null; // Pro auto open/close schedule

  // Vendor Bank Details for WhatsApp order wire transfer
  bank_name: string | null;
  account_number: string | null; // 10 digits
  account_name: string | null;

  // Store Controls
  is_open: boolean;

  // Monetization Engine
  is_pro: boolean;
  pro_expires_at: string | null; // ISO 8601 TIMESTAMPTZ string

  created_at: string;
  updated_at: string;
}

export type VendorInsert = Omit<Vendor, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type VendorUpdate = Partial<Omit<Vendor, 'id' | 'created_at' | 'updated_at'>>;

export interface Category {
  id: string; // UUID
  vendor_id: string; // Foreign key to vendors.id
  name: string;
  sort_order: number;
  created_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type CategoryUpdate = Partial<Omit<Category, 'id' | 'vendor_id' | 'created_at'>>;

export interface Product {
  id: string; // UUID
  vendor_id: string; // Foreign key to vendors.id
  category_id: string | null; // Foreign key to categories.id
  title: string;
  description: string | null;
  price: number; // Stored as NUMERIC(10, 2) in Postgres, represented as number
  image_url: string | null;
  is_available: boolean; // 1-tap out-of-stock toggle
  is_featured?: boolean; // Pinned / Best-seller toggle (Pro only, max 3)
  variants?: ProductVariant[] | null; // Pro product variants (sizes, flavors, colors)
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<Omit<Product, 'id' | 'vendor_id' | 'created_at' | 'updated_at'>>;

// Product joined with its Category details
export interface ProductWithCategory extends Product {
  category?: Category | null;
}

// ==============================================================================
// 2. MONETIZATION, PRO FEATURES & SCHEDULE HELPERS
// ==============================================================================

/**
 * Evaluates vendor active Pro subscription status according to Blueprint Section 2:
 * isActivePro = (is_pro == true) && (pro_expires_at != null) && (new Date(pro_expires_at) > new Date())
 */
export function checkIsActivePro(
  vendor: Pick<Vendor, 'is_pro' | 'pro_expires_at'> | null | undefined
): boolean {
  if (!vendor || !vendor.is_pro || !vendor.pro_expires_at) {
    return false;
  }
  const expiryDate = new Date(vendor.pro_expires_at);
  const now = new Date();
  return !isNaN(expiryDate.getTime()) && expiryDate.getTime() > now.getTime();
}

/**
 * Checks if a vendor's Pro subscription was previously active but has now expired
 */
export function checkIsProExpired(
  vendor: Pick<Vendor, 'is_pro' | 'pro_expires_at'> | null | undefined
): boolean {
  if (!vendor || !vendor.pro_expires_at) {
    return false;
  }
  const expiryDate = new Date(vendor.pro_expires_at);
  const now = new Date();
  return !isNaN(expiryDate.getTime()) && expiryDate.getTime() <= now.getTime();
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  enabled: false,
  open_time: '09:00',
  close_time: '21:00',
  days: [1, 2, 3, 4, 5, 6] // Mon - Sat
};

/**
 * Retrieves the vendor's configured Delivery Zones (supports column or social_links JSONB fallback)
 */
export function getVendorDeliveryZones(vendor: Vendor | null | undefined): DeliveryZone[] {
  if (!vendor) return [];
  if (Array.isArray(vendor.delivery_zones) && vendor.delivery_zones.length > 0) {
    return vendor.delivery_zones;
  }
  if (Array.isArray(vendor.social_links?._delivery_zones)) {
    return vendor.social_links!._delivery_zones!;
  }
  return [];
}

/**
 * Retrieves the vendor's configured Business Hours (supports column or social_links JSONB fallback)
 */
export function getVendorBusinessHours(vendor: Vendor | null | undefined): BusinessHours {
  if (!vendor) return DEFAULT_BUSINESS_HOURS;
  if (vendor.business_hours && typeof vendor.business_hours.enabled === 'boolean') {
    return {
      ...DEFAULT_BUSINESS_HOURS,
      ...vendor.business_hours
    };
  }
  if (vendor.social_links?._business_hours && typeof vendor.social_links._business_hours.enabled === 'boolean') {
    return {
      ...DEFAULT_BUSINESS_HOURS,
      ...vendor.social_links._business_hours
    };
  }
  return DEFAULT_BUSINESS_HOURS;
}

/**
 * Retrieves a product's variants (supports products.variants column or vendor.social_links._product_variants fallback)
 */
export function getProductVariants(
  product: Product | null | undefined,
  vendor?: Vendor | null
): ProductVariant[] {
  if (!product) return [];
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants;
  }
  const fallbackMap = vendor?.social_links?._product_variants;
  if (fallbackMap && Array.isArray(fallbackMap[product.id])) {
    return fallbackMap[product.id];
  }
  return [];
}

/**
 * Formats 24h "HH:mm" time into 12h "9:00 AM" display string
 */
export function formatTime12h(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr || '00'} ${period}`;
}

/**
 * Evaluates whether a store is currently open for orders, taking into account:
 * 1. Manual pause toggle (`vendor.is_open`)
 * 2. Tink Pro Automatic Business Hours schedule (in West Africa Time, Africa/Lagos)
 */
export function checkStoreOpenStatus(vendor: Vendor | null | undefined): {
  isOpen: boolean;
  reason: 'open' | 'manual_paused' | 'outside_hours';
  statusText: string;
  scheduleBadge?: string;
} {
  if (!vendor) {
    return { isOpen: false, reason: 'manual_paused', statusText: 'Closed for Orders' };
  }

  if (!vendor.is_open) {
    return { isOpen: false, reason: 'manual_paused', statusText: 'Closed for Orders' };
  }

  const isPro = checkIsActivePro(vendor);
  if (isPro) {
    const bh = getVendorBusinessHours(vendor);
    if (bh.enabled) {
      try {
        // Get current time in West Africa Time (Africa/Lagos, UTC+1)
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Lagos',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const parts = formatter.formatToParts(now);
        const weekdayStr = parts.find((p) => p.type === 'weekday')?.value || 'Mon';
        const hourStr = parts.find((p) => p.type === 'hour')?.value || '12';
        const minuteStr = parts.find((p) => p.type === 'minute')?.value || '00';

        const dayMap: Record<string, number> = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6
        };
        const currentDay = dayMap[weekdayStr] ?? now.getDay();
        const currentMinutes = (parseInt(hourStr, 10) % 24) * 60 + parseInt(minuteStr, 10);

        const [openH, openM] = (bh.open_time || '09:00').split(':').map((n) => parseInt(n, 10));
        const [closeH, closeM] = (bh.close_time || '21:00').split(':').map((n) => parseInt(n, 10));
        const openMinutes = (openH || 0) * 60 + (openM || 0);
        const closeMinutes = (closeH || 0) * 60 + (closeM || 0);

        const isDayActive = Array.isArray(bh.days) ? bh.days.includes(currentDay) : true;

        let isWithinHours = false;
        if (closeMinutes >= openMinutes) {
          isWithinHours = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
        } else {
          // Overnight schedule (e.g. 18:00 to 02:00)
          isWithinHours = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
        }

        const openFormatted = formatTime12h(bh.open_time);
        const closeFormatted = formatTime12h(bh.close_time);

        if (!isDayActive || !isWithinHours) {
          return {
            isOpen: false,
            reason: 'outside_hours',
            statusText: `Closed • Opens ${openFormatted}`,
            scheduleBadge: `Hours: ${openFormatted} – ${closeFormatted} WAT`
          };
        }

        return {
          isOpen: true,
          reason: 'open',
          statusText: 'Open Now',
          scheduleBadge: `Open until ${closeFormatted}`
        };
      } catch {
        // Fallback if Intl timezone fails
      }
    }
  }

  return { isOpen: true, reason: 'open', statusText: 'Open Now' };
}

// ==============================================================================
// 3. CART & ORDER TYPES (Client-side localStorage State)
// ==============================================================================

export interface CartItem {
  id: string; // Unique cart line ID: productId or `${productId}__${variantId}`
  product_id?: string; // Base product ID
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  category_name?: string | null;
  variant_id?: string;
  variant_name?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

export interface DirectCartOrder {
  storeName: string;
  vendorWhatsapp: string;
  vendorBank: {
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
  };
  customer: CustomerDetails;
  items: CartItem[];
  subtotalAmount?: number;
  deliveryZone?: DeliveryZone | null;
  totalAmount: number;
}

// ==============================================================================
// 4. SUPABASE DATABASE GENERIC SCHEMA TYPE
// ==============================================================================

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: Vendor;
        Insert: VendorInsert;
        Update: VendorUpdate;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
