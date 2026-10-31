import React from 'react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Forgot Password — Reset Your Tink Seller Password',
  description:
    'Reset your Tink seller account password via email link or WhatsApp support verification.',
  alternates: {
    canonical: `${SITE_URL}/forgot-password`
  }
};

export default function ForgotPasswordLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

