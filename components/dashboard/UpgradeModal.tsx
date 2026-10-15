'use client';

import React, { useState } from 'react';
import { Vendor } from '@/types/database';
import { MONETIZATION_CONFIG, PLATFORM_BANK_DETAILS } from '@/lib/constants';
import { formatNaira } from '@/lib/whatsapp';
import {
  X,
  Sparkles,
  Check,
  Copy,
  Building,
  CreditCard,
  User,
  MessageCircle,
  ShieldCheck,
  Zap,
  Palette,
  Pin,
  Flame,
  ArrowRight
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  vendor
}) => {
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const storeName = vendor?.store_name || 'My Store';
  const storeSlug = vendor?.slug || 'store';
  const supportPhone = MONETIZATION_CONFIG.SUPPORT_PHONE;

  const whatsappMessage = `Hi Tink Team, I just transferred ₦${formatNaira(
    MONETIZATION_CONFIG.PRO_MONTHLY_PRICE_NGN
  )} for a 1-month Tink Pro subscription for my store ${storeName} (${storeSlug}). Here is my payment receipt:`;

  const whatsappUrl = `https://wa.me/${supportPhone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PLATFORM_BANK_DETAILS.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 z-10 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Header Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 pt-2 pr-1">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 text-blue-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>Unlock Tink Pro</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Tink Pro — ₦{formatNaira(MONETIZATION_CONFIG.PRO_MONTHLY_PRICE_NGN)} <span className="text-sm font-semibold text-slate-500">/ month</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Scale your digital storefront without limits. Professional branding, zero Tink ads, and instant WhatsApp verification.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-4 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Included in Tink Pro:
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3 h-3 font-bold" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Unlimited Products:</span>{' '}
                  <span className="text-slate-600">Break free from the 5-product limit and showcase your entire catalog.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3 font-bold" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">100% Ad-Free Storefront:</span>{' '}
                  <span className="text-slate-600">Removes the &ldquo;Powered by Tink&rdquo; growth banner for a pure luxury brand feel.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Palette className="w-3 h-3 font-bold" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Custom Brand Identity:</span>{' '}
                  <span className="text-slate-600">Custom accent colors, store cover banner, bio tagline, custom footer & social links.</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Pin className="w-3 h-3 font-bold" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">Pin Up to 3 Best-Sellers:</span>{' '}
                  <span className="text-slate-600">Feature priority deals and high-converting items at the top of your store.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Bank Transfer Details Section */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Manual Bank Transfer
              </span>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                ₦{formatNaira(PLATFORM_BANK_DETAILS.amount)}
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-blue-100 space-y-2 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Bank
                </span>
                <span className="font-bold text-slate-900">{PLATFORM_BANK_DETAILS.bankName}</span>
              </div>

              <div className="flex items-center justify-between py-0.5 border-t border-slate-100 pt-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Account Name
                </span>
                <span className="font-bold text-slate-900">{PLATFORM_BANK_DETAILS.accountName}</span>
              </div>

              <div className="flex items-center justify-between py-0.5 border-t border-slate-100 pt-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Account Number
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    {PLATFORM_BANK_DETAILS.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Transfer <strong>₦{formatNaira(PLATFORM_BANK_DETAILS.amount)}</strong>, then tap the button below to send your receipt directly to our team via WhatsApp for instant activation.
            </p>
          </div>

          {/* Action CTA: Verify & Activate via WhatsApp */}
          <div className="space-y-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md shadow-[#25D366]/25 hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Verify & Activate via WhatsApp</span>
            </a>

            <p className="text-center text-[10px] text-slate-400">
              Manual verification typically completed within 5-15 minutes during operating hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
