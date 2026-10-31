-- ==============================================================================
-- Storefront Analytics & Order Log RPC Function
-- Version: 20261101000000_store_analytics_rpc.sql
-- Allows public storefront visitors to increment store views and log WhatsApp
-- orders into vendors.social_links safely via SECURITY DEFINER.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.record_store_event(
  p_vendor_id UUID,
  p_event_type TEXT,
  p_order_entry JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_links JSONB;
  v_views INT;
  v_clicks INT;
  v_orders JSONB;
BEGIN
  SELECT COALESCE(social_links, '{}'::jsonb)
  INTO v_links
  FROM public.vendors
  WHERE id = p_vendor_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Vendor not found');
  END IF;

  IF p_event_type = 'view' THEN
    v_views := COALESCE((v_links->>'_store_views')::int, 0) + 1;
    v_links := jsonb_set(v_links, '{_store_views}', to_jsonb(v_views), true);

    UPDATE public.vendors
    SET social_links = v_links
    WHERE id = p_vendor_id;

    RETURN jsonb_build_object('ok', true, 'views', v_views);
  ELSIF p_event_type = 'whatsapp_order' THEN
    v_clicks := COALESCE((v_links->>'_whatsapp_clicks')::int, 0) + 1;
    v_orders := COALESCE(v_links->'_recent_orders', '[]'::jsonb);

    IF p_order_entry IS NOT NULL THEN
      v_orders := jsonb_build_array(p_order_entry) || v_orders;
      -- Keep latest 50 orders
      SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
      INTO v_orders
      FROM (
        SELECT elem
        FROM jsonb_array_elements(v_orders) WITH ORDINALITY AS t(elem, idx)
        WHERE idx <= 50
      ) sub;
    END IF;

    v_links := jsonb_set(v_links, '{_whatsapp_clicks}', to_jsonb(v_clicks), true);
    v_links := jsonb_set(v_links, '{_recent_orders}', v_orders, true);

    UPDATE public.vendors
    SET social_links = v_links
    WHERE id = p_vendor_id;

    RETURN jsonb_build_object('ok', true, 'clicks', v_clicks);
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_store_event(UUID, TEXT, JSONB) TO anon, authenticated;

