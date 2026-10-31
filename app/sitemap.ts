import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${SITE_URL}/guides/online-store-nigeria`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${SITE_URL}/guides/whatsapp-business-catalogue`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${SITE_URL}/guides/small-business-inventory-management`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85
    }
  ];

  if (!isSupabaseConfigured) {
    return staticRoutes;
  }

  try {
    const { data: vendors } = await supabase
      .from('vendors')
      .select('slug, updated_at, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (vendors && vendors.length > 0) {
      const storeRoutes: MetadataRoute.Sitemap = vendors
        .filter((v) => Boolean(v.slug))
        .map((v) => ({
          url: `${SITE_URL}/${v.slug.toLowerCase().trim()}`,
          lastModified: v.updated_at ? new Date(v.updated_at) : now,
          changeFrequency: 'daily',
          priority: 0.7
        }));

      return [...staticRoutes, ...storeRoutes];
    }
  } catch (err) {
    console.error('Error building vendor sitemap entries:', err);
  }

  return staticRoutes;
}

