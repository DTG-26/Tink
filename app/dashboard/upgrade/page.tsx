'use client';

/**
 * Tink Pro Upgrade & Monetization Page
 * ₦3,000 / month Freemium Tier with manual bank transfer & WhatsApp verification
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Vendor, checkIsActivePro, checkIsProExpired } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MONETIZATION_CONFIG, PLATFORM_BANK_DETAILS } from '@/lib/constants';
import { formatNaira } from '@/lib/whatsapp';
import {
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
  ArrowLeft,
  Store,
  Clock,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export default function UpgradePage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState(false);

  useEffect(() => {
    async function loadVendor() {
      setIsLoading(true);
      const localVendorId =
        typeof window !== 'undefined'
          ? localStorage.getItem('tink_vendor_id')
          : null;

      if (isSupabaseConfigured) {
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;

        let v: Vendor | null = null;
        if (currentUser) {
          const { data } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
          if (data) v = data as Vendor;
        }

        if (!v && localVendorId) {
          const { data } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', localVendorId)
            .maybeSingle();
          if (data) v = data as Vendor;
        }

        if (v) {
          setVendor(v);
          setIsLoading(false);
          return;
        }
      }

      // Local storage fallback
      try {
        const stored = localStorage.getItem('tink_vendor');
        if (stored) {
          setVendor(JSON.parse(stored));
        }
      } catch {
        setVendor(null);
      }
      setIsLoading(false);
    }

    loadVendor();
  }, []);

  const isPro = checkIsActivePro(vendor);
  const isExpired = checkIsProExpired(vendor);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Active Pro Store
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Pro Expired • Renewal Needed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Free Tier Store
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Tink Pro Membership</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Grow Faster With Tink Pro
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Upgrade your store to unlock unlimited product capacity, custom branding, best-seller product pinning, and an ad-free buyer experience.
          </p>
        </div>

        {/* Expiry Banner if expired */}
        {isExpired && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start sm:items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 text-xs">
              <strong className="font-bold">Your Tink Pro subscription has expired.</strong>{' '}
              Your store is currently restricted to the Free tier (5-product catalog and standard platform branding). Renew today to re-enable your custom branding and unlimited catalog.
            </div>
          </div>
        )}

        {/* Pricing Card & Features Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Plan Breakdown Card (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  The Premium Growth Plan
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">Tink Pro</h2>
                <p className="text-xs text-slate-500 mt-1">Billed monthly • Instant WhatsApp Activation</p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">
                  ₦{formatNaira(MONETIZATION_CONFIG.PRO_MONTHLY_PRICE_NGN)}
                </span>
                <span className="block text-xs font-semibold text-slate-400">/ month</span>
              </div>
            </div>

            {/* Core Features List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Everything You Get:
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Unlimited Products</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Never worry about catalog caps. Showcase dozens or hundreds of items. (Free tier capped at 5).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">100% Ad-Free Storefront</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Removes the &ldquo;Powered by Tink&rdquo; footer badge so your brand remains the sole focus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Palette className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Custom Brand Identity & Colors</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Pick custom accent color hex swatches, cover banner photo, bio tagline, and social media handles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Pin className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Pin Up to 3 Best-Sellers</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Highlight your top-selling products in a distinguished row at the top of your catalog.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Store Status */}
            {vendor && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Subscribing Store:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-blue-600" />
                  {vendor.store_name} ({vendor.slug})
                </span>
              </div>
            )}
          </div>

          {/* Payment & Verification Box (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-blue-200/90 shadow-md p-6 space-y-5">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  <CreditCard className="w-3.5 h-3.5" />
                  Step 1: Direct Bank Transfer
                </span>
                <h3 className="text-lg font-bold text-slate-900">Transfer ₦{formatNaira(PLATFORM_BANK_DETAILS.amount)}</h3>
                <p className="text-xs text-slate-500">
                  Send payment using your banking app to the official Tink account:
                </p>
              </div>

              {/* Bank Details Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-bold text-slate-900">{PLATFORM_BANK_DETAILS.bankName}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Account Name</span>
                  <span className="font-bold text-slate-900 text-right">{PLATFORM_BANK_DETAILS.accountName}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Account Number</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {PLATFORM_BANK_DETAILS.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedAccount ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-extrabold text-blue-600 text-sm">
                    ₦{formatNaira(PLATFORM_BANK_DETAILS.amount)}
                  </span>
                </div>
              </div>

              {/* Step 2 CTA */}
              <div className="space-y-3 pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Step 2: Instant WhatsApp Verification
                </span>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#25D366]/20 active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Verify & Activate via WhatsApp</span>
                </a>

                <p className="text-[11px] text-slate-400 text-center leading-tight">
                  Tapping opens WhatsApp with your pre-filled store details. Attach your transfer screenshot for rapid 1-click activation.
                </p>
              </div>
            </div>

            {/* Quick FAQ note */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Need Help?
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Have questions before upgrading? Message our support desk at +{supportPhone} anytime.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
