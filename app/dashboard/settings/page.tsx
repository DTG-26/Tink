'use client';

/**
 * Vendor Storefront & Branding Settings (`app/dashboard/settings/page.tsx`)
 * Conforms to Tink Pro Freemium Rules:
 * - Store Branding (Accent color, Store banner, Bio, Social links, Custom footer): Pro only
 * - Featured Products Pinning (Up to 3 products): Pro only
 * - Free tier: Displays these options with lock icons and "Upgrade to Pro to customize" trigger
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Vendor, Product, checkIsActivePro, checkIsProExpired } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { validateAndNormalizePhone } from '@/lib/phone';
import { validateSlug } from '@/lib/slug';
import { uploadStoreBanner } from '@/lib/imageUpload';
import { PRESET_ACCENT_COLORS, MONETIZATION_CONFIG } from '@/lib/constants';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import {
  ArrowLeft,
  Store,
  Palette,
  Image as ImageIcon,
  Upload,
  Check,
  Lock,
  Sparkles,
  Building,
  CreditCard,
  User,
  Instagram,
  Twitter,
  Music2,
  FileText,
  Pin,
  Save,
  Loader2,
  AlertCircle,
  ExternalLink,
  Clock
} from 'lucide-react';

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Profile fields
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Pro Branding fields
  const [accentColor, setAccentColor] = useState('#000000');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bio, setBio] = useState('');
  const [customFooter, setCustomFooter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');

  // Featured product IDs (up to 3)
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([]);

  // Banner uploading state
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    storeName?: string;
    slug?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    async function loadData() {
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
          setStoreName(v.store_name);
          setSlug(v.slug);
          setPhone(v.whatsapp_number);
          setBankName(v.bank_name || '');
          setAccountNumber(v.account_number || '');
          setAccountName(v.account_name || '');
          setAccentColor(v.accent_color || '#000000');
          setBannerUrl(v.banner_url || '');
          setBio(v.bio || v.description || '');
          setCustomFooter(v.custom_footer || '');
          setInstagram(v.social_links?.instagram || '');
          setTwitter(v.social_links?.twitter || '');
          setTiktok(v.social_links?.tiktok || '');

          const { data: p } = await supabase
            .from('products')
            .select('*')
            .eq('vendor_id', v.id)
            .order('sort_order', { ascending: true });
          if (p) {
            setProducts(p as Product[]);
            const pinned = (p as Product[])
              .filter((item) => item.is_featured)
              .map((item) => item.id);
            setFeaturedProductIds(pinned);
          }

          setIsLoading(false);
          return;
        }

        if (!currentUser && !localVendorId) {
          router.push('/login');
          return;
        }
      }

      // Local storage fallback
      try {
        const stored = localStorage.getItem('tink_vendor');
        if (stored) {
          const parsed = JSON.parse(stored);
          setVendor(parsed);
          setStoreName(parsed.store_name || '');
          setSlug(parsed.slug || '');
          setPhone(parsed.whatsapp_number || '');
          setBankName(parsed.bank_name || '');
          setAccountNumber(parsed.account_number || '');
          setAccountName(parsed.account_name || '');
          setAccentColor(parsed.accent_color || '#000000');
          setBannerUrl(parsed.banner_url || '');
          setBio(parsed.bio || parsed.description || '');
          setCustomFooter(parsed.custom_footer || '');
          setInstagram(parsed.social_links?.instagram || '');
          setTwitter(parsed.social_links?.twitter || '');
          setTiktok(parsed.social_links?.tiktok || '');
        }
      } catch {
        setVendor(null);
      }
      setIsLoading(false);
    }

    loadData();
  }, [router]);

  const isPro = checkIsActivePro(vendor);
  const isExpired = checkIsProExpired(vendor);

  // Banner image upload handler
  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor) return;

    if (!isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsUploadingBanner(true);
    try {
      const url = await uploadStoreBanner(file, vendor.id);
      setBannerUrl(url);
    } catch (err) {
      console.error('Banner upload error:', err);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Toggle Featured product checkbox
  const handleToggleFeaturedProduct = (productId: string) => {
    if (!isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }

    if (featuredProductIds.includes(productId)) {
      setFeaturedProductIds(featuredProductIds.filter((id) => id !== productId));
    } else {
      if (featuredProductIds.length >= MONETIZATION_CONFIG.MAX_FEATURED_PRODUCTS) {
        alert(`You can only pin up to ${MONETIZATION_CONFIG.MAX_FEATURED_PRODUCTS} featured products.`);
        return;
      }
      setFeaturedProductIds([...featuredProductIds, productId]);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    const newErrors: typeof errors = {};
    if (!storeName.trim()) newErrors.storeName = 'Store name is required';

    const slugCheck = validateSlug(slug);
    if (!slugCheck.isValid) newErrors.slug = slugCheck.error;

    const phoneCheck = validateAndNormalizePhone(phone);
    if (!phoneCheck.isValid) newErrors.phone = phoneCheck.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const vendorPayload: Partial<Vendor> = {
      store_name: storeName.trim(),
      slug: slugCheck.slug,
      whatsapp_number: phoneCheck.normalized,
      bank_name: bankName.trim() || null,
      account_number: accountNumber.trim() || null,
      account_name: accountName.trim() || null
    };

    // Include Pro custom branding only if Pro
    if (isPro) {
      vendorPayload.accent_color = accentColor || '#000000';
      vendorPayload.banner_url = bannerUrl.trim() || null;
      vendorPayload.bio = bio.trim() || null;
      vendorPayload.custom_footer = customFooter.trim() || null;
      vendorPayload.social_links = {
        instagram: instagram.trim() || '',
        twitter: twitter.trim() || '',
        tiktok: tiktok.trim() || ''
      };
    }

    const updatedVendor = { ...vendor, ...vendorPayload };
    setVendor(updatedVendor);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tink_vendor', JSON.stringify(updatedVendor));
    }

    if (isSupabaseConfigured) {
      await supabase.from('vendors').update(vendorPayload).eq('id', vendor.id);

      // Also update is_featured for products if Pro
      if (isPro) {
        for (const prod of products) {
          const shouldBeFeatured = featuredProductIds.includes(prod.id);
          if (prod.is_featured !== shouldBeFeatured) {
            await supabase
              .from('products')
              .update({ is_featured: shouldBeFeatured })
              .eq('id', prod.id);
          }
        }
      }
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold">Loading store settings...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    router.push('/login');
    return null;
  }

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
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-900">Settings & Branding</span>
          </div>

          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Tink Pro Active
              </span>
            ) : isExpired ? (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300"
              >
                <Clock className="w-3 h-3 text-amber-600" />
                Pro Expired • Renew
              </button>
            ) : (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs hover:from-blue-700 hover:to-indigo-700"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Pro</span>
              </button>
            )}

            <Link
              href={`/${vendor.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Title Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Store & Branding Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your store identity, payout bank accounts, and premium storefront appearance.
          </p>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Store settings saved successfully! Your changes are live.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Standard Store Profile (Free & Pro) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Store className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Store Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Store Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
                {errors.storeName && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.storeName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Store Slug (URL: /{slug}) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
                {errors.slug && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.slug}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor WhatsApp Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Bank Details (For customer wire transfers) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-blue-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your Bank Account Details</h2>
                <p className="text-[11px] text-slate-400">
                  Included in WhatsApp order summaries so customers can pay directly into your account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Zenith Bank / Moniepoint"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Khalid Gourmet Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Store Branding (Pro Only) */}
          <div className="relative bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm overflow-hidden">
            {/* Free Tier Lock Overlay Banner */}
            {!isPro && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                      Store Branding is a Tink Pro Feature
                    </h3>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Accent color theming, cover banner uploads, social links, bio, and custom footer are exclusive to Tink Pro (₦3,000/mo).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro to Customize</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-slate-900">Store Branding</h2>
              </div>
              {!isPro && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" /> Pro Only
                </span>
              )}
            </div>

            <div className={`space-y-6 ${!isPro ? 'opacity-60 pointer-events-none select-none' : ''}`}>
              {/* 1. Accent Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Store Accent Color
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Applied to CTA buttons, verified badges, headers, and highlights across your storefront.
                </p>

                {/* Preset Swatches */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {PRESET_ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        accentColor.toLowerCase() === c.toLowerCase()
                          ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 border-white'
                          : 'border-white/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}

                  {/* Custom Hex Input */}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#000000"
                      className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Store Banner Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Store Banner / Cover Photo
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Displays at the top of your public storefront (recommended: 1600 x 600px).
                </p>

                <div className="space-y-3">
                  {/* Banner Preview */}
                  <div className="relative w-full h-36 sm:h-44 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bannerUrl}
                        alt="Store Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 space-y-1">
                        <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                        <span className="text-xs">No banner uploaded yet</span>
                      </div>
                    )}

                    {isUploadingBanner && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading banner...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={bannerInputRef}
                      onChange={handleBannerFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      disabled={isUploadingBanner}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{bannerUrl ? 'Change Banner' : 'Upload Banner'}</span>
                    </button>

                    {bannerUrl && (
                      <button
                        type="button"
                        onClick={() => setBannerUrl('')}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Remove Banner
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Bio / Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Store Bio & Tagline
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Artisanal bakery craft in Abuja. Oven-fresh croissants & premium cakes delivered daily."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
                />
              </div>

              {/* 4. Social Media Handles */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Social Media Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" /> Instagram
                    </span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                      <Twitter className="w-3.5 h-3.5 text-blue-500" /> X (Twitter)
                    </span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                      <Music2 className="w-3.5 h-3.5 text-slate-900" /> TikTok
                    </span>
                    <input
                      type="text"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      placeholder="@tiktok_user"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Custom Store Footer */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Custom Store Footer Text
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Replaces the platform promotional growth banner with your custom footer.
                </p>
                <input
                  type="text"
                  value={customFooter}
                  onChange={(e) => setCustomFooter(e.target.value)}
                  placeholder="e.g. © 2026 Khalid Gourmet. Free delivery in Abuja for orders above ₦15,000."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Featured Products Pinning (Pro Only) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Pinned Featured Products ({featuredProductIds.length}/3)
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Select up to 3 best-sellers to highlight at the top of your catalog.
                  </p>
                </div>
              </div>

              {!isPro && (
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full hover:bg-amber-200"
                >
                  <Lock className="w-3 h-3" /> Pro Pinning
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No products in your catalog yet. Add products to pin them.
              </p>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${!isPro ? 'opacity-60 pointer-events-none' : ''}`}>
                {products.map((product) => {
                  const isChecked = featuredProductIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleToggleFeaturedProduct(product.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-amber-400 bg-amber-50/70'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {product.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Store className="w-5 h-5 text-slate-300 m-2.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{product.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono">₦{product.price}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked
                            ? 'bg-amber-500 border-amber-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Submit Bar */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs sm:text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        vendor={vendor}
      />
    </div>
  );
}
