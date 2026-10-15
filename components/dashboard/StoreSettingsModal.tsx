'use client';

import React, { useState, useRef } from 'react';
import { Vendor, checkIsActivePro } from '../../types/database';
import { validateAndNormalizePhone } from '../../lib/phone';
import { validateSlug } from '../../lib/slug';
import { uploadStoreBanner } from '../../lib/imageUpload';
import { PRESET_ACCENT_COLORS } from '../../lib/constants';
import {
  X,
  Building,
  Store,
  AlertCircle,
  Save,
  Palette,
  Upload,
  Lock,
  Sparkles,
  Instagram,
  Twitter,
  Music2,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  onSave: (updatedVendor: Partial<Vendor>) => Promise<void>;
  onTriggerUpgrade?: () => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSave,
  onTriggerUpgrade
}) => {
  const isPro = checkIsActivePro(vendor);

  const [storeName, setStoreName] = useState(vendor.store_name);
  const [slug, setSlug] = useState(vendor.slug);
  const [phone, setPhone] = useState(vendor.whatsapp_number);

  // Bank details
  const [bankName, setBankName] = useState(vendor.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(vendor.account_number || '');
  const [accountName, setAccountName] = useState(vendor.account_name || '');

  // Pro branding fields
  const [accentColor, setAccentColor] = useState(vendor.accent_color || '#000000');
  const [bannerUrl, setBannerUrl] = useState(vendor.banner_url || '');
  const [bio, setBio] = useState(vendor.bio || vendor.description || '');
  const [customFooter, setCustomFooter] = useState(vendor.custom_footer || '');
  const [instagram, setInstagram] = useState(vendor.social_links?.instagram || '');
  const [twitter, setTwitter] = useState(vendor.social_links?.twitter || '');
  const [tiktok, setTiktok] = useState(vendor.social_links?.tiktok || '');

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    storeName?: string;
    slug?: string;
    phone?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPro) {
      if (onTriggerUpgrade) onTriggerUpgrade();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required.';
    }

    const slugCheck = validateSlug(slug);
    if (!slugCheck.isValid) {
      newErrors.slug = slugCheck.error;
    }

    const phoneCheck = validateAndNormalizePhone(phone);
    if (!phoneCheck.isValid) {
      newErrors.phone = phoneCheck.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Vendor> = {
        store_name: storeName.trim(),
        slug: slugCheck.slug,
        whatsapp_number: phoneCheck.normalized,
        bank_name: bankName.trim() || null,
        account_number: accountNumber.trim() || null,
        account_name: accountName.trim() || null
      };

      if (isPro) {
        payload.accent_color = accentColor || '#000000';
        payload.banner_url = bannerUrl.trim() || null;
        payload.bio = bio.trim() || null;
        payload.custom_footer = customFooter.trim() || null;
        payload.social_links = {
          instagram: instagram.trim() || '',
          twitter: twitter.trim() || '',
          tiktok: tiktok.trim() || ''
        };
      }

      await onSave(payload);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Store Settings & Branding</h2>
              <p className="text-[11px] text-slate-400">Manage identity, bank account, and Pro styling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form id="settings-form" onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {/* Section 1: Store Identity */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Profile</h3>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor WhatsApp Number <span className="text-rose-500">*</span>
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

          {/* Section 2: Bank Details */}
          <div className="space-y-3.5 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              Your Bank Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Zenith Bank"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 digits"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pro Customization */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                Store Branding (Tink Pro)
              </h3>
              {!isPro && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onTriggerUpgrade) onTriggerUpgrade();
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  <Lock className="w-3 h-3" /> Upgrade to Pro
                </button>
              )}
            </div>

            <div className={`space-y-4 ${!isPro ? 'opacity-60 pointer-events-none' : ''}`}>
              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Store Accent Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        accentColor.toLowerCase() === c.toLowerCase()
                          ? 'ring-2 ring-blue-500 scale-110 border-white'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer ml-1"
                  />
                </div>
              </div>

              {/* Cover Banner */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Banner Image
                </label>
                {bannerUrl && (
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-2 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bannerUrl} alt="Store banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={isUploadingBanner}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{bannerUrl ? 'Change Banner' : 'Upload Banner'}</span>
                  </button>
                  {bannerUrl && (
                    <button
                      type="button"
                      onClick={() => setBannerUrl('')}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bio / Tagline
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Welcome to our store..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              {/* Social Media */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Instagram</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@handle"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">X (Twitter)</span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@handle"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">TikTok</span>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="@handle"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Custom Footer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Store Footer Text
                </label>
                <input
                  type="text"
                  value={customFooter}
                  onChange={(e) => setCustomFooter(e.target.value)}
                  placeholder="© 2026 My Store. All rights reserved."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="settings-form"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
