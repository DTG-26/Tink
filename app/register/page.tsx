'use client';

/**
 * Vendor Registration & Store Onboarding Flow (Crisp White Theme)
 * Integrates Supabase Auth with Email or Phone Number + Password
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateSlug, validateSlug } from '@/lib/slug';
import { validateAndNormalizePhone } from '@/lib/phone';
import { signUpVendor } from '@/lib/auth';
import {
  Store,
  Building,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Account State
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Store Details State
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [description, setDescription] = useState('');

  // Bank details
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Validation & Submission
  const [errors, setErrors] = useState<{
    authIdentifier?: string;
    password?: string;
    storeName?: string;
    slug?: string;
    whatsappPhone?: string;
    accountNumber?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  // Auto-generate slug when store name changes
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
  const phoneValidation = whatsappPhone ? validateAndNormalizePhone(whatsappPhone) : null;

  // Auto-populate WhatsApp field if identifier is a phone number
  const handleIdentifierChange = (val: string) => {
    setAuthIdentifier(val);
    if (!whatsappPhone && !val.includes('@')) {
      const check = validateAndNormalizePhone(val);
      if (check.isValid) {
        setWhatsappPhone(val);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    setConfirmationNotice(null);

    if (!authIdentifier.trim()) {
      newErrors.authIdentifier = 'Please enter your email or Nigerian phone number.';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required.';
    }

    if (!slugValidation.isValid) {
      newErrors.slug = slugValidation.error || 'Invalid store URL slug.';
    }

    const pCheck = validateAndNormalizePhone(whatsappPhone || authIdentifier);
    if (!pCheck.isValid) {
      newErrors.whatsappPhone = pCheck.error || 'Valid Nigerian WhatsApp number is required for receiving orders.';
    }

    if (accountNumber && accountNumber.length !== 10) {
      newErrors.accountNumber = 'Nigerian bank account numbers must be exactly 10 digits.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signUpVendor({
        identifier: authIdentifier,
        password: password,
        storeName: storeName.trim(),
        slug: slugValidation.slug,
        whatsappNumber: pCheck.normalized,
        description: description.trim() || undefined,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        accountName: accountName.trim() || storeName.trim()
      });

      if (!result.success) {
        if (result.needsEmailConfirmation) {
          setConfirmationNotice(result.error || 'Please check your email to confirm your account.');
          setIsSubmitting(false);
          return;
        }

        setErrors({ general: result.error || 'Registration failed. Please check your details.' });
        setIsSubmitting(false);
        return;
      }

      // Store created and authenticated successfully!
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrors({ general: msg });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Tink Logo" className="h-8 w-auto object-contain" />
              <span className="font-extrabold text-base tracking-tight text-slate-900">Tink</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors hidden sm:inline"
            >
              ← Back to Home
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Seller Log In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Form Container */}
      <main className="max-w-xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>100% Free Forever • Unlimited Products</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
            Create Your Tink Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto">
            Get your instant WhatsApp ordering catalog link in 60 seconds.
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errors.general}</div>
          </div>
        )}

        {confirmationNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{confirmationNotice}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          {/* Section 1: Account Login Credentials */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>1. Your Login Details</span>
            </h2>

            {/* Email or Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address or Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={authIdentifier}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                placeholder="e.g. seller@gmail.com or 08012345678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
              {errors.authIdentifier && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.authIdentifier}
                </p>
              )}
              <p className="mt-1 text-[10px] text-slate-500">
                You will use this email or phone number to log in to your dashboard anytime.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Store Basics */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-600" />
              <span>2. Store & Catalog Details</span>
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
                  tink/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="store-name"
                  className={`w-full pl-16 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm font-mono text-slate-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white ${
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
                  This will be your shareable catalog link: customers will open this URL to place orders.
                </p>
              )}
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Order Receiving Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="e.g. 08012345678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
              {phoneValidation && !phoneValidation.isValid ? (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {phoneValidation.error}
                </p>
              ) : phoneValidation?.isValid ? (
                <p className="mt-1 text-[11px] text-blue-700 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-blue-600" /> Orders will be routed to: +{phoneValidation.normalized}
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

          {/* Section 3: Nigerian Bank Details */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              <span>3. Nigerian Bank Details for Direct Transfers</span>
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
                  placeholder="e.g. GTBank, Zenith, OPay"
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
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Creating Your Store...' : 'Create Account & Launch Store'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Already have a store registered?{' '}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Log in to your dashboard
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 bg-white">
        <p>© {new Date().getFullYear()} Tink • Built for social sellers.</p>
      </footer>
    </div>
  );
}
