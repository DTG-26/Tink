import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Tink seller account.',
  robots: {
    index: false,
    follow: false
  }
};

export default function ResetPasswordLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

