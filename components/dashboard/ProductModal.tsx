'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '../../types/database';
import { uploadProductImage } from '../../lib/imageUpload';
import {
  X,
  ShoppingBag,
  Plus,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Camera,
  Pin,
  Lock,
  Sparkles
} from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  categories: Category[];
  initialProduct?: Product | null;
  vendorId?: string;
  isPro?: boolean;
  onTriggerUpgrade?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  initialProduct,
  vendorId = 'default-vendor',
  isPro = false,
  onTriggerUpgrade
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Photo upload state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setDescription(initialProduct.description || '');
      setPrice(initialProduct.price.toString());
      setCategoryId(initialProduct.category_id || '');
      setImageUrl(initialProduct.image_url || '');
      setIsAvailable(initialProduct.is_available);
      setIsFeatured(Boolean(initialProduct.is_featured));
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategoryId(categories[0]?.id || '');
      setImageUrl('');
      setIsAvailable(true);
      setIsFeatured(false);
    }
    setPhotoError(null);
    setIsUploadingPhoto(false);
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    setPhotoError(null);
    setIsUploadingPhoto(true);

    try {
      const uploadedUrl = await uploadProductImage(file, vendorId);
      setImageUrl(uploadedUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process photo from gallery.';
      setPhotoError(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError(null);

    if (!title.trim() || !price) return;

    // MANDATORY PHOTO VALIDATION
    if (!imageUrl.trim()) {
      setPhotoError('A real product photo is mandatory. Please upload a clear photo from your gallery or camera.');
      return;
    }

    onSave({
      id: initialProduct?.id,
      title: title.trim(),
      description: description.trim() || null,
      price: parseFloat(price) || 0,
      category_id: categoryId || null,
      image_url: imageUrl.trim(),
      is_available: isAvailable,
      is_featured: isFeatured
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {initialProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* 1. Mandatory Product Photo Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Product Photo <span className="text-rose-500">* (Mandatory)</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Upload from Gallery or Camera
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />

            {/* Photo preview or upload prompt */}
            {imageUrl ? (
              <div className="relative rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/30 p-3 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Real Photo Attached</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Crisp photo ready for customer WhatsApp catalog.
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline px-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                className={`w-full p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  photoError
                    ? 'border-rose-400 bg-rose-50/40 hover:bg-rose-50'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/30'
                }`}
              >
                {isUploadingPhoto ? (
                  <div className="flex flex-col items-center gap-2 text-blue-600 py-2">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-xs font-bold">Compressing & Attaching Photo...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-blue-600 mb-2.5">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">
                      Tap to Choose Photo from Gallery or Photos
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                      Legitimate, clear photo of your dish, snack, or product. JPEG, PNG, or WebP.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-xs">
                      <Upload className="w-3 h-3" />
                      Browse Photos
                    </span>
                  </>
                )}
              </div>
            )}

            {photoError && (
              <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{photoError}</span>
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Asun Fried Rice Special"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          {/* Price & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (₦ NGN) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ₦
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Served with spicy smoked goat meat and plantain cubes."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">In Stock & Available</p>
              <p className="text-[11px] text-slate-500">Allow customers to add this item to their cart</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                isAvailable ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform" />
            </button>
          </div>

          {/* Featured / Pin to Top Toggle (Pro Feature) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-amber-600" />
                <p className="text-xs font-bold text-amber-950">Pin to Top Featured</p>
                {!isPro && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900">
                    <Lock className="w-2.5 h-2.5" /> Pro
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                {isPro
                  ? 'Display in the highlight best-seller carousel at the top of your store'
                  : 'Upgrade to Tink Pro to pin up to 3 best-selling products'}
              </p>
            </div>

            {isPro ? (
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  isFeatured ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onTriggerUpgrade) onTriggerUpgrade();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>Upgrade</span>
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isUploadingPhoto}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            {isUploadingPhoto ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading Photo...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{initialProduct ? 'Save Changes' : 'Create Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
