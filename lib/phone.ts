/**
 * Phone Number Sanitizer & E.164 Helper for WhatsApp Direct-Cart Catalog
 * Conforms to Specification Section 4.1:
 * - Converts vendor and buyer numbers to uniform E.164 format WITHOUT '+' (e.g., 234XXXXXXXXXX).
 * - Strips all whitespace, dashes, parentheses, and special characters.
 * - If input begins with '0' (e.g. 08031234567), drops '0' and prepends '234'.
 * - If input begins with '+234', drops '+' -> '2348031234567'.
 * - Enforces exactly 13 digits for Nigerian phone numbers.
 */

// Nigerian mobile numbers are 10 digits after country code 234, starting with 7, 8, or 9
// (e.g. 070x, 080x, 081x, 090x, 091x)
const NIGERIAN_MOBILE_REGEX = /^234[789]\d{9}$/;

export interface PhoneNormalizationResult {
  isValid: boolean;
  normalized: string; // 13-digit E.164 without +
  error?: string;
}

/**
 * Sanitizes and normalizes any Nigerian phone number to uniform 13-digit E.164 format without '+'.
 *
 * Examples:
 * - "08031234567"       -> "2348031234567"
 * - "+234 803 123 4567" -> "2348031234567"
 * - "2348031234567"     -> "2348031234567"
 * - "8031234567"        -> "2348031234567"
 *
 * @param phone Raw phone number string input
 * @returns 13-digit normalized phone number (e.g., "2348031234567")
 * @throws Error if input cannot be normalized to a valid 13-digit Nigerian phone number
 */
export function normalizePhoneNumber(phone: string): string {
  const result = validateAndNormalizePhone(phone);
  if (!result.isValid) {
    throw new Error(result.error || 'Invalid Nigerian phone number.');
  }
  return result.normalized;
}

/**
 * Validates and normalizes phone number with safe result object (does not throw).
 */
export function validateAndNormalizePhone(phone: string | null | undefined): PhoneNormalizationResult {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      normalized: '',
      error: 'Phone number is required.'
    };
  }

  // 1. Strip all non-digit characters except an initial '+'
  let cleaned = phone.trim();

  // Remove leading '+' if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }

  // Strip all non-digits (spaces, dashes, parentheses, etc.)
  const digitsOnly = cleaned.replace(/\D/g, '');

  let normalized = '';

  // 2. Format conversion logic:
  // Case A: Starts with 0 (Standard local format: 080XXXXXXXX -> 11 digits)
  if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
    normalized = '234' + digitsOnly.slice(1);
  }
  // Case B: Starts with 234 (International format without + -> 13 digits)
  else if (digitsOnly.startsWith('234') && digitsOnly.length === 13) {
    normalized = digitsOnly;
  }
  // Case C: 10 digits without leading 0 (e.g. 803XXXXXXX -> prepend 234)
  else if (digitsOnly.length === 10 && ['7', '8', '9'].includes(digitsOnly[0])) {
    normalized = '234' + digitsOnly;
  }
  // Case D: Any other starting prefix or length
  else {
    return {
      isValid: false,
      normalized: digitsOnly,
      error: `Invalid Nigerian phone format. Expected 11 digits (e.g. 08012345678) or 13 digits with country code 234.`
    };
  }

  // 3. Exact 13-digit check
  if (normalized.length !== 13) {
    return {
      isValid: false,
      normalized,
      error: `Normalized number must be exactly 13 digits. Got ${normalized.length}.`
    };
  }

  // 4. Prefix check for Nigerian telco validation (must start with 234 followed by 7, 8, or 9)
  if (!NIGERIAN_MOBILE_REGEX.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: `Phone number does not match a recognized Nigerian mobile operator prefix (070, 080, 081, 090, 091).`
    };
  }

  return {
    isValid: true,
    normalized
  };
}

/**
 * Quick boolean check if a phone number is a valid Nigerian mobile number.
 */
export function isValidNigerianPhone(phone: string): boolean {
  return validateAndNormalizePhone(phone).isValid;
}

/**
 * Formats a normalized or raw phone number for human-readable display.
 * E.g., "2348031234567" -> "+234 803 123 4567" or "0803 123 4567"
 *
 * @param phone Raw or normalized phone number
 * @param style 'local' (0803 123 4567) or 'international' (+234 803 123 4567)
 */
export function formatDisplayPhone(phone: string, style: 'local' | 'international' = 'international'): string {
  const result = validateAndNormalizePhone(phone);
  if (!result.isValid) {
    return phone; // Return as-is if unparseable
  }

  const p = result.normalized; // 234 803 123 4567
  const prefix = p.slice(3, 6);
  const part1 = p.slice(6, 9);
  const part2 = p.slice(9, 13);

  if (style === 'local') {
    return `0${prefix.slice(1)} ${part1} ${part2}`;
  }

  return `+234 ${prefix} ${part1} ${part2}`;
}

/**
 * Constructs the standard wa.me link with encoded text message.
 * Guardrail Section 4.3: Must be opened synchronously in client UI (window.location.href or direct link).
 */
export function buildWhatsAppLink(normalizedPhone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}
