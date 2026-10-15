'use client';

import React from 'react';
import Link from 'next/link';
import { Vendor, checkIsActivePro } from '../types/database';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StoreFooterProps {
  vendor: Vendor;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({ vendor }) => {
  const isPro = checkIsActivePro(vendor);
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Tink';

  // Pro Tier: Render vendor's custom footer with ZERO platform branding
  if (isPro) {
    return (
      <footer className="w-full py-8 text-center text-xs text-slate-400 border-t border-slate-100 mt-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {vendor.custom_footer ? (
            <p className="text-slate-600 font-medium">{vendor.custom_footer}</p>
          ) : (
            <p>© {new Date().getFullYear()} {vendor.store_name}. All rights reserved.</p>
          )}
        </div>
      </footer>
    );
  }

  // Free Tier: Clean footer growth banner linked back to homepage
  return (
    <footer className="w-full pt-8 pb-24 text-center border-t border-slate-200 mt-12 bg-slate-50/80">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-xs hover:text-blue-600 hover:border-blue-300 transition-all active:scale-95 group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Tink Logo" className="w-4 h-4 object-contain rounded" />
          <span>Made by <strong className="font-extrabold text-blue-600">{brandName}</strong> • Danmari Tech Group</span>
          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </footer>
  );
};
