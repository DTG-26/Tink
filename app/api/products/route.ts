import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { checkIsActivePro } from '@/types/database';
import { MONETIZATION_CONFIG } from '@/lib/constants';

/**
 * POST /api/products
 * Enforces Free Tier 5-product limit server-side and allows unlimited for Tink Pro vendors
 */
export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const {
      vendor_id,
      title,
      price,
      description,
      category_id,
      image_url,
      is_available = true,
      is_featured = false
    } = body;

    if (!vendor_id || !title || price === undefined) {
      return NextResponse.json(
        { error: 'vendor_id, title, and price are required fields' },
        { status: 400 }
      );
    }

    // 1. Fetch vendor to verify active Pro status
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, is_pro, pro_expires_at')
      .eq('id', vendor_id)
      .maybeSingle();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const isPro = checkIsActivePro(vendor);

    // 2. Count existing products
    const { count, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('vendor_id', vendor_id);

    if (countError) {
      return NextResponse.json(
        { error: 'Failed to verify current product count' },
        { status: 500 }
      );
    }

    // 3. Free Tier Rule: Max 5 products
    if (!isPro && (count || 0) >= MONETIZATION_CONFIG.FREE_TIER_MAX_PRODUCTS) {
      return NextResponse.json(
        {
          error: `Free tier product limit reached (${MONETIZATION_CONFIG.FREE_TIER_MAX_PRODUCTS} products max). Please upgrade to Tink Pro for unlimited products.`,
          code: 'PRO_UPGRADE_REQUIRED',
          current_count: count,
          max_allowed: MONETIZATION_CONFIG.FREE_TIER_MAX_PRODUCTS
        },
        { status: 403 }
      );
    }

    // 4. Insert new product
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert([
        {
          vendor_id,
          title: title.trim(),
          price: Number(price),
          description: description?.trim() || null,
          category_id: category_id || null,
          image_url: image_url?.trim() || null,
          is_available: Boolean(is_available),
          is_featured: isPro ? Boolean(is_featured) : false,
          sort_order: (count || 0) + 1
        }
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
