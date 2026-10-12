'use client';

import React from 'react';
import { Vendor, checkIsActivePro } from '../types/database';

interface StoreFooterProps {
  vendor: Vendor;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({ vendor }) => {
  const isPro = checkIsActivePro(vendor);
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Tink';

  // Pro Tier: Hide platform branding completely
  if (isPro) {
    return (
      <footer className="w-full py-8 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {vendor.store_name}. All rights reserved.</p>
      </footer>
    );
  }

  // Free Tier: Display "Powered by Tink" badge
  return (
    <footer className="w-full pt-8 pb-24 text-center border-t border-slate-200 mt-12 bg-slate-50/60">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-white border border-slate-200 shadow-xs hover:text-blue-600 transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Tink Logo" className="w-4 h-4 object-contain rounded" />
          <span>Powered by</span>
          <span className="font-extrabold text-blue-600">{brandName}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5" />
        </a>
        <p className="text-[11px] text-slate-400">
          Your Shop in a Link • Create your free direct WhatsApp catalog.
        </p>
      </div>
    </footer>
  );
};
