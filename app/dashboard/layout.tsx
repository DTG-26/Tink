import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seller Dashboard',
  description: 'Manage your Tink digital storefront, products, categories, and settings.',
  robots: {
    index: false,
    follow: false
  }
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

