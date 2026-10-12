'use client';

/**
 * Vendor Registration & Store Onboarding Flow (Crisp White Theme)
 * Conforms to Master Build Blueprint Phase 4
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Vendor } from '@/types/database';
import { generateSlug, validateSlug } from '@/lib/slug';
import { validateAndNormalizePhone } from '@/lib/phone';
import {
  Store,
  Building,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // Bank details
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Validation & Submission
  const [errors, setErrors] = useState<{
    storeName?: string;
    slug?: string;
    phone?: string;
    accountNumber?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug when store name changes (unless user manually customized it)
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (!isSlugCustomized) {
      const generated = generateSlug(val);
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugCustomized(true);
    setSlug(val.toLowerCase().replace(/\s+/g, '-'));
  };

  const slugValidation = validateSlug(slug);
  const phoneValidation = phone ? validateAndNormalizePhone(phone) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required.';
    }

    if (!slugValidation.isValid) {
      newErrors.slug = slugValidation.error || 'Invalid store URL slug.';
    }

    const pCheck = validateAndNormalizePhone(phone);
    if (!pCheck.isValid) {
      newErrors.phone = pCheck.error || 'Valid Nigerian WhatsApp number is required.';
    }

    if (accountNumber && accountNumber.length !== 10) {
      newErrors.accountNumber = 'Nigerian bank account numbers must be exactly 10 digits.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const insertPayload = {
        store_name: storeName.trim(),
        slug: slugValidation.slug,
        whatsapp_number: pCheck.normalized,
        description: description.trim() || null,
        logo_url: null,
        banner_url: null,
        bank_name: bankName.trim() || null,
        account_number: accountNumber.trim() || null,
        account_name: accountName.trim() || storeName.trim(),
        is_open: true,
        is_pro: true, // Unlimited Free tier
        pro_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };

      let createdVendor: Vendor | null = null;

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('vendors')
          .insert([insertPayload])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            setErrors({ slug: 'This URL slug is already taken. Please choose another.' });
            setIsSubmitting(false);
            return;
          }
          console.error('Supabase registration error:', error);
        } else if (data) {
          createdVendor = data as Vendor;
        }
      }

      if (!createdVendor) {
        createdVendor = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `vendor-${Date.now()}`,
          ...insertPayload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      // Persist in localStorage so dashboard immediately loads it
      localStorage.setItem('tink_vendor', JSON.stringify(createdVendor));
      localStorage.setItem('tink_vendor_id', createdVendor.id);
      localStorage.removeItem('directcart_dashboard_vendor');
      localStorage.removeItem('directcart_dashboard_categories');
      localStorage.removeItem('directcart_dashboard_products');

      // Redirect to seller dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Tink Logo" className="h-8 w-auto object-contain" />
            <span className="font-extrabold text-base tracking-tight text-slate-900">Tink</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-xl w-full mx-auto px-4 py-10 sm:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>100% Free Forever • Unlimited Products</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
            Set Up Your Tink Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto">
            Your Shop in a Link. Customers order directly to your WhatsApp with your Nigerian bank details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          {/* Section 1: Store Basics */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-600" />
              <span>1. Store Details</span>
            </h2>

            {/* Store Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                placeholder="e.g. Suya Kingdom, Lagos Treats"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
              {errors.storeName && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.storeName}
                </p>
              )}
            </div>

            {/* Real-time Store Slug Generator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Catalog Web Link <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-slate-400 font-mono select-none">
                  tink.ng/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="store-name"
                  className={`w-full pl-20 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm font-mono text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white ${
                    slug && slugValidation.isValid ? 'border-blue-500/60' : 'border-slate-200'
                  }`}
                />
                <div className="absolute right-3.5">
                  {slug && slugValidation.isValid && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                  {slug && !slugValidation.isValid && (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  )}
                </div>
              </div>

              {slug && !slugValidation.isValid ? (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {slugValidation.error}
                </p>
              ) : (
                <p className="mt-1 text-[10px] text-slate-500">
                  This will be the link you put in your Instagram bio or send on WhatsApp.
                </p>
              )}
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
              {phoneValidation && !phoneValidation.isValid ? (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {phoneValidation.error}
                </p>
              ) : phoneValidation?.isValid ? (
                <p className="mt-1 text-[11px] text-blue-700 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-blue-600" /> Formatted: {phoneValidation.normalized}
                </p>
              ) : (
                <p className="mt-1 text-[10px] text-slate-500">
                  Orders from your catalog will be sent directly to this WhatsApp number.
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Store Description / Tagline (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fresh Nigerian small chops and gourmet grills delivered in Abuja."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
            </div>
          </div>

          {/* Section 2: Nigerian Bank Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              <span>2. Nigerian Bank Details for Direct Transfers</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. GTBank, Zenith, Access"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Number (10 digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="0123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.accountNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. Khalid Gourmet Kitchen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating Your Store...' : 'Launch Store Catalog'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 bg-white">
        <p>© {new Date().getFullYear()} Tink • Your Shop in a Link. Built for social sellers.</p>
      </footer>
    </div>
  );
}
