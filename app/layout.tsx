import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tink — Your Shop in a Link | WhatsApp Menus & Catalogs',
  description: 'The easiest way to sell on WhatsApp. Buyers browse your menu, build a cart, and send orders directly with Nigerian bank details. 100% Free.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
