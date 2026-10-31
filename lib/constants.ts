/**
 * System Constants for WhatsApp Direct-Cart Catalog
 * Conforms to Master Blueprint Rules
 */

export const SITE_URL = 'https://tink.com.ng';

/**
 * Early-access launch window: every store automatically receives full Tink Pro features
 * free of charge until Mid-December (December 15, 2026 23:59:59 WAT).
 */
export const FREE_PRO_PROMO_END_ISO = '2026-12-15T23:59:59+01:00';

export const RESERVED_SLUGS = [
  'dashboard',
  'api',
  'login',
  'register',
  'forgot-password',
  'reset-password',
  'settings',
  'admin',
  'auth',
  'welcome',
  'terms',
  'privacy',
  'checkout',
  'cart',
  'pricing',
  'support',
  'guides',
  'sitemap.xml',
  'robots.txt'
] as const;

export type ReservedSlug = typeof RESERVED_SLUGS[number];

/**
 * Validates whether a requested store slug is allowed.
 * - Must be alphanumeric with hyphens
 * - Must not be in the reserved words list
 * - Length between 3 and 40 characters
 */
export function isSlugAvailable(slug: string): boolean {
  if (!slug) return false;
  const sanitized = slug.trim().toLowerCase();
  if (RESERVED_SLUGS.includes(sanitized as ReservedSlug)) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sanitized) && sanitized.length >= 3 && sanitized.length <= 40;
}

/**
 * Subscription Engine Constants
 * Tink Pro Freemium Model (₦3,000 / month)
 */
export const MONETIZATION_CONFIG = {
  FREE_TIER_MAX_PRODUCTS: 5, // Free tier max 5 products
  PRO_MONTHLY_PRICE_NGN: 3000, // ₦3,000 / month
  PRO_DURATION_DAYS: 30,
  CURRENCY_SYMBOL: '₦',
  CURRENCY_CODE: 'NGN',
  SUPPORT_PHONE: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '2348012345678',
  MAX_FEATURED_PRODUCTS: 3
} as const;

/**
 * Platform Bank Details for Tink Pro wire transfers
 */
export const PLATFORM_BANK_DETAILS = {
  bankName: process.env.NEXT_PUBLIC_ADMIN_BANK_NAME || 'Zenith Bank',
  accountNumber: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_NUMBER || '1234567890',
  accountName: process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_NAME || 'DirectCart Platforms Ltd',
  amount: 3000
} as const;

/**
 * Curated preset accent colors for Pro store branding
 */
export const PRESET_ACCENT_COLORS = [
  '#000000', // Jet Black (Default)
  '#2563EB', // Royal Blue
  '#059669', // Emerald Green
  '#7C3AED', // Vivid Violet
  '#DC2626', // Crimson Red
  '#D97706', // Warm Amber
  '#DB2777', // Rose Pink
  '#0D9488'  // Deep Teal
] as const;

