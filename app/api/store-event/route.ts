import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { OrderLogEntry, SocialLinks } from '@/types/database';

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const body = await req.json();
    const { vendorId, type, orderEntry, accessToken } = body as {
      vendorId?: string;
      type?: 'view' | 'whatsapp_order';
      orderEntry?: OrderLogEntry;
      accessToken?: string;
    };

    if (!vendorId || !type) {
      return NextResponse.json({ error: 'Missing vendorId or type' }, { status: 400 });
    }

    // 1. Try SECURITY DEFINER RPC function first (if migration was applied)
    const { data: rpcData, error: rpcError } = await supabase.rpc('record_store_event', {
      p_vendor_id: vendorId,
      p_event_type: type,
      p_order_entry: orderEntry || null
    });

    if (!rpcError && rpcData) {
      return NextResponse.json(rpcData);
    }

    // 2. Choose best available Supabase client (Service Role -> Caller Access Token -> Anon)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const dbClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        })
      : accessToken
      ? createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        })
      : supabase;

    const { data: vendor } = await dbClient
      .from('vendors')
      .select('social_links')
      .eq('id', vendorId)
      .maybeSingle();

    const currentLinks: SocialLinks = (vendor?.social_links as SocialLinks) || {};

    if (type === 'view') {
      const nextViews = (currentLinks._store_views || 0) + 1;
      await dbClient
        .from('vendors')
        .update({
          social_links: {
            ...currentLinks,
            _store_views: nextViews
          }
        })
        .eq('id', vendorId);

      return NextResponse.json({ ok: true, views: nextViews });
    }

    if (type === 'whatsapp_order') {
      const nextClicks = (currentLinks._whatsapp_clicks || 0) + 1;
      const existingOrders = Array.isArray(currentLinks._recent_orders)
        ? currentLinks._recent_orders
        : [];
      const nextOrders = orderEntry
        ? [orderEntry, ...existingOrders].slice(0, 50)
        : existingOrders;

      await dbClient
        .from('vendors')
        .update({
          social_links: {
            ...currentLinks,
            _whatsapp_clicks: nextClicks,
            _recent_orders: nextOrders
          }
        })
        .eq('id', vendorId);

      return NextResponse.json({ ok: true, clicks: nextClicks });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Store event tracking error:', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
