/**
 * System Constants for WhatsApp Direct-Cart Catalog
 * Conforms to Master Blueprint Rules
 */

export const RESERVED_SLUGS = [
  'dashboard',
  'api',
  'login',
  'register',
  'settings',
  'admin',
  'auth',
  'welcome',
  'terms',
  'privacy',
  'checkout',
  'cart',
  'pricing',
  'support'
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
 * NOTE: Currently all tiers are 100% FREE with unlimited products per user directive.
 */
export const MONETIZATION_CONFIG = {
  FREE_TIER_MAX_PRODUCTS: Infinity, // Unlimited products (Free for all)
  PRO_MONTHLY_PRICE_NGN: 0,
  PRO_DURATION_DAYS: 365,
  CURRENCY_SYMBOL: '₦',
  CURRENCY_CODE: 'NGN'
} as const;
