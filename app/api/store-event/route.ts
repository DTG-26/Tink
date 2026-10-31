import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { OrderLogEntry, SocialLinks } from '@/types/database';

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const body = await req.json();
    const { vendorId, type, orderEntry } = body as {
      vendorId?: string;
      type?: 'view' | 'whatsapp_order';
      orderEntry?: OrderLogEntry;
    };

    if (!vendorId || !type) {
      return NextResponse.json({ error: 'Missing vendorId or type' }, { status: 400 });
    }

    const { data: vendor } = await supabase
      .from('vendors')
      .select('social_links')
      .eq('id', vendorId)
      .maybeSingle();

    const currentLinks: SocialLinks = (vendor?.social_links as SocialLinks) || {};

    if (type === 'view') {
      const nextViews = (currentLinks._store_views || 0) + 1;
      await supabase
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

      await supabase
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

