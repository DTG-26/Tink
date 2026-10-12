/**
 * Slug Generator & Validator
 * Conforms to Master Build Blueprint Section 4.2
 */

import { RESERVED_SLUGS, ReservedSlug } from './constants';

/**
 * Generates a clean URL slug from a store name string.
 * E.g., "Lagos Pastries & Treats!" -> "lagos-pastries-treats"
 */
export function generateSlug(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces & hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

export interface SlugValidationResult {
  isValid: boolean;
  slug: string;
  error?: string;
}

/**
 * Validates a slug against system reserved words and format constraints.
 */
export function validateSlug(slug: string): SlugValidationResult {
  const sanitized = slug.trim().toLowerCase();

  if (!sanitized) {
    return {
      isValid: false,
      slug: '',
      error: 'Store URL slug cannot be empty.'
    };
  }

  if (sanitized.length < 3) {
    return {
      isValid: false,
      slug: sanitized,
      error: 'Store URL must be at least 3 characters long.'
    };
  }

  if (sanitized.length > 40) {
    return {
      isValid: false,
      slug: sanitized,
      error: 'Store URL must not exceed 40 characters.'
    };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sanitized)) {
    return {
      isValid: false,
      slug: sanitized,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens (no consecutive hyphens).'
    };
  }

  if (RESERVED_SLUGS.includes(sanitized as ReservedSlug)) {
    return {
      isValid: false,
      slug: sanitized,
      error: `"${sanitized}" is a reserved system path and cannot be used as a store URL.`
    };
  }

  return {
    isValid: true,
    slug: sanitized
  };
}
