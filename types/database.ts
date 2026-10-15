/**
 * TypeScript Interfaces and Database Definitions
 * WhatsApp Direct-Cart Catalog
 * Conforms to Master Build Blueprint Section 2 & 3
 */

// ==============================================================================
// 1. CORE ENTITY INTERFACES
// ==============================================================================

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
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
  social_links?: SocialLinks; // JSON links for instagram, twitter, tiktok

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
// 2. MONETIZATION & PRO STATUS HELPER
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

// ==============================================================================
// 3. CART & ORDER TYPES (Client-side localStorage State)
// ==============================================================================

export interface CartItem {
  id: string; // Product id
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  category_name?: string | null;
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
