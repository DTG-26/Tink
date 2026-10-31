import React from 'react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Seller Log In — Manage Your Digital Storefront',
  description:
    'Log in to your Tink seller dashboard to manage products, inventory availability, delivery zones, and WhatsApp storefront settings.',
  alternates: {
    canonical: `${SITE_URL}/login`
  },
  openGraph: {
    title: 'Seller Log In — Manage Your Digital Storefront | Tink',
    description:
      'Log in to your Tink seller dashboard to manage products, inventory availability, delivery zones, and WhatsApp storefront settings.',
    url: `${SITE_URL}/login`,
    siteName: 'Tink',
    locale: 'en_NG',
    type: 'website',
    images: [`${SITE_URL}/logo.png`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seller Log In — Manage Your Digital Storefront | Tink',
    description:
      'Log in to your Tink seller dashboard to manage products, inventory availability, delivery zones, and WhatsApp storefront settings.',
    images: [`${SITE_URL}/logo.png`]
  }
};

export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

