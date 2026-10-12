'use client';

import React, { useState } from 'react';
import { Vendor } from '../../types/database';
import { validateAndNormalizePhone } from '../../lib/phone';
import { validateSlug } from '../../lib/slug';
import { X, Building, Store, AlertCircle, Save } from 'lucide-react';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  onSave: (updatedVendor: Partial<Vendor>) => Promise<void>;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSave
}) => {
  const [storeName, setStoreName] = useState(vendor.store_name);
  const [slug, setSlug] = useState(vendor.slug);
  const [phone, setPhone] = useState(vendor.whatsapp_number);
  const [description, setDescription] = useState(vendor.description || '');
  const [logoUrl, setLogoUrl] = useState(vendor.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(vendor.banner_url || '');

  // Bank details
  const [bankName, setBankName] = useState(vendor.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(vendor.account_number || '');
  const [accountName, setAccountName] = useState(vendor.account_name || '');

  const [errors, setErrors] = useState<{
    storeName?: string;
    slug?: string;
    phone?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

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
      await onSave({
        store_name: storeName.trim(),
        slug: slugCheck.slug,
        whatsapp_number: phoneCheck.normalized,
        description: description.trim() || null,
        logo_url: logoUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
        bank_name: bankName.trim() || null,
        account_number: accountNumber.trim() || null,
        account_name: accountName.trim() || null
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Store & Bank Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form id="settings-form" onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-5 flex-1">
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

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Store Description / Bio
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Banner URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bank Details */}
          <div className="space-y-3.5 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Nigerian Bank Details (Printed in WhatsApp Orders)</span>
            </h3>

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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:bg-white"
                />
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white"
              />
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
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
