import React from 'react';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/constants';
import './globals.css';

const DEFAULT_TITLE = 'Tink – Create Your Own Online Store in Nigeria';
const DEFAULT_DESCRIPTION =
  'Create your own branded online storefront with Tink. Showcase products, manage inventory, customise delivery zones and receive orders through WhatsApp.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Tink'
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'Tink',
  keywords: [
    'Tink',
    'Tink Nigeria',
    'Tink online store',
    'Tink digital storefront',
    'online store Nigeria',
    'digital storefront Nigeria',
    'create an online store',
    'WhatsApp business catalogue',
    'small business inventory management'
  ],
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'Tink',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
        alt: 'Tink – Digital Storefront Platform in Nigeria'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/logo.png`]
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
