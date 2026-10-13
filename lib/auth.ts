import { supabase, isSupabaseConfigured } from './supabaseClient';
import { validateAndNormalizePhone } from './phone';
import { Vendor } from '@/types/database';

export interface IdentifierParseResult {
  email: string;
  isPhone: boolean;
  normalizedPhone?: string;
  error?: string;
}

/**
 * Parses user input to determine if it is an email or a Nigerian phone number.
 * If phone number, converts to internal auth identifier (e.g. 2348012345678@phone.tink.store).
 */
export function parseAuthIdentifier(input: string): IdentifierParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { email: '', isPhone: false, error: 'Email or phone number is required.' };
  }

  // Check if user input is an email address
  if (trimmed.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { email: '', isPhone: false, error: 'Please enter a valid email address.' };
    }
    return { email: trimmed.toLowerCase(), isPhone: false };
  }

  // Otherwise, treat as phone number
  const phoneCheck = validateAndNormalizePhone(trimmed);
  if (!phoneCheck.isValid) {
    return {
      email: '',
      isPhone: true,
      error: phoneCheck.error || 'Please enter a valid 11-digit Nigerian phone number.'
    };
  }

  return {
    email: `${phoneCheck.normalized}@phone.tink.store`,
    isPhone: true,
    normalizedPhone: phoneCheck.normalized
  };
}

export interface SignUpVendorParams {
  identifier: string; // Email or Nigerian phone number
  password: string;
  storeName: string;
  slug: string;
  whatsappNumber: string;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  needsEmailConfirmation?: boolean;
}

/**
 * Sign up a new vendor with Supabase Auth and initialize their store record.
 */
export async function signUpVendor(params: SignUpVendorParams): Promise<AuthResponse<{ vendor: Vendor }>> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured in .env.local.' };
  }

  if (!params.password || params.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const parsed = parseAuthIdentifier(params.identifier);
  if (parsed.error) {
    return { success: false, error: parsed.error };
  }

  try {
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.email,
      password: params.password,
      options: {
        data: {
          store_name: params.storeName,
          raw_identifier: params.identifier,
          is_phone_auth: parsed.isPhone
        }
      }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'An account with this email or phone number already exists. Please log in.' };
      }
      return { success: false, error: authError.message };
    }

    const user = authData.user;
    if (!user) {
      return { success: false, error: 'Failed to create user account. Please try again.' };
    }

    // 2. Check if email confirmation is required by Supabase project
    if (!authData.session) {
      return {
        success: false,
        needsEmailConfirmation: true,
        error: parsed.isPhone
          ? 'Supabase "Confirm email" setting is currently enabled in your Supabase project. For phone or instant registration without email links, disable "Confirm email" in Supabase Auth settings.'
          : 'A confirmation link has been sent to your email. Please verify to log in.'
      };
    }

    // 3. Insert vendor row with id matching user.id (satisfying RLS auth.uid() = id)
    const insertPayload = {
      id: user.id,
      store_name: params.storeName.trim(),
      slug: params.slug.trim(),
      whatsapp_number: params.whatsappNumber.trim(),
      description: params.description?.trim() || null,
      logo_url: null,
      banner_url: null,
      bank_name: params.bankName?.trim() || null,
      account_number: params.accountNumber?.trim() || null,
      account_name: params.accountName?.trim() || params.storeName.trim(),
      is_open: true,
      is_pro: true, // Unlimited free tier
      pro_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert([insertPayload])
      .select()
      .single();

    if (vendorError) {
      console.error('Vendor insertion error:', vendorError);
      if (vendorError.code === '23505') {
        return { success: false, error: 'This store link (URL slug) is already taken. Please choose another.' };
      }
      return { success: false, error: `Failed to create store: ${vendorError.message}` };
    }

    // Store in localStorage for rapid client access
    if (typeof window !== 'undefined') {
      localStorage.setItem('tink_vendor', JSON.stringify(vendorData));
      localStorage.setItem('tink_vendor_id', vendorData.id);
    }

    return { success: true, data: { vendor: vendorData as Vendor } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return { success: false, error: msg };
  }
}

/**
 * Sign in an existing vendor using Email or Nigerian Phone Number + Password.
 */
export async function signInVendor(identifier: string, password: string): Promise<AuthResponse<{ vendor: Vendor | null }>> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  const parsed = parseAuthIdentifier(identifier);
  if (parsed.error) {
    return { success: false, error: parsed.error };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: password
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('invalid login credentials')) {
        return { success: false, error: 'Incorrect email/phone number or password.' };
      }
      if (authError.message.toLowerCase().includes('email not confirmed')) {
        return {
          success: false,
          error: 'Email address is not yet confirmed. Please verify your email or disable "Confirm email" in Supabase Auth settings.'
        };
      }
      return { success: false, error: authError.message };
    }

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: 'No user session established.' };
    }

    // Fetch vendor profile
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (vendorError) {
      console.error('Error fetching vendor:', vendorError);
    }

    if (vendorData && typeof window !== 'undefined') {
      localStorage.setItem('tink_vendor', JSON.stringify(vendorData));
      localStorage.setItem('tink_vendor_id', vendorData.id);
    }

    return { success: true, data: { vendor: (vendorData as Vendor) || null } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
    return { success: false, error: msg };
  }
}

/**
 * Sign out vendor and clear credentials
 */
export async function signOutVendor(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tink_vendor');
    localStorage.removeItem('tink_vendor_id');
  }
}

/**
 * Get current authenticated vendor
 */
export async function getCurrentVendor(): Promise<Vendor | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return (vendor as Vendor) || null;
  } catch {
    return null;
  }
}
