import React from 'react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Create Your Online Store in Nigeria — Register Free',
  description:
    'Launch your branded online storefront in Nigeria in 60 seconds with Tink. Add products, configure delivery zones, and receive orders directly on WhatsApp.',
  alternates: {
    canonical: `${SITE_URL}/register`
  },
  openGraph: {
    title: 'Create Your Online Store in Nigeria — Register Free | Tink',
    description:
      'Launch your branded online storefront in Nigeria in 60 seconds with Tink. Add products, configure delivery zones, and receive orders directly on WhatsApp.',
    url: `${SITE_URL}/register`,
    siteName: 'Tink',
    locale: 'en_NG',
    type: 'website',
    images: [`${SITE_URL}/logo.png`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Online Store in Nigeria — Register Free | Tink',
    description:
      'Launch your branded online storefront in Nigeria in 60 seconds with Tink. Add products, configure delivery zones, and receive orders directly on WhatsApp.',
    images: [`${SITE_URL}/logo.png`]
  }
};

export default function RegisterLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

