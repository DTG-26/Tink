'use client';

import React, { useState } from 'react';
import { Product, ProductVariant } from '../types/database';
import { formatNaira } from '../lib/whatsapp';
import { SITE_URL } from '../lib/constants';
import { useCart } from '../context/CartContext';
import { Plus, Minus, PackageX, ShoppingBag, Pin, Share2, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  isStoreOpen: boolean;
  accentColor?: string;
  variants?: ProductVariant[];
  compareAtPrice?: number | null;
  storeSlug?: string;
  storeName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  isStoreOpen,
  accentColor,
  variants = [],
  compareAtPrice = null,
  storeSlug,
  storeName
}) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const [sharedStatus, setSharedStatus] = useState(false);

  const hasVariants = Array.isArray(variants) && variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    hasVariants ? variants[0].id : ''
  );

  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedVariantId) || variants[0]
    : null;

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const hasSlashDiscount =
    typeof compareAtPrice === 'number' && compareAtPrice > activePrice;
  const discountPercent = hasSlashDiscount
    ? Math.round(((compareAtPrice! - activePrice) / compareAtPrice!) * 100)
    : 0;

  const cartLineId = selectedVariant ? `${product.id}__${selectedVariant.id}` : product.id;

  const quantity = getItemQuantity(cartLineId);
  const isAvailable = product.is_available && isStoreOpen;

  const handleShareItem = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const storeUrl =
      typeof window !== 'undefined' && storeSlug
        ? `${window.location.origin}/${storeSlug}`
        : storeSlug
        ? `${SITE_URL}/${storeSlug}`
        : SITE_URL;

    const shareCaption = `🔥 *${product.title}* — ₦${formatNaira(activePrice)}${
      hasSlashDiscount ? ` (was ₦${formatNaira(compareAtPrice!)})` : ''
    }${storeName ? ` at *${storeName}*` : ''}!\n\nTap here to order directly on WhatsApp: ${storeUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareCaption,
          url: storeUrl
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareCaption);
      setSharedStatus(true);
      setTimeout(() => setSharedStatus(false), 2000);
    }
  };

  const handleAdd = () => {
    if (!isAvailable) return;
    addItem({
      id: cartLineId,
      product_id: product.id,
      title: selectedVariant
        ? `${product.title} (${selectedVariant.name})`
        : product.title,
      price: activePrice,
      image_url: product.image_url,
      category_name: categoryName,
      variant_id: selectedVariant?.id,
      variant_name: selectedVariant?.name
    });
  };

  const handleIncrement = () => {
    if (!isAvailable) return;
    updateQuantity(cartLineId, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(cartLineId, quantity - 1);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden ${
        !isAvailable ? 'opacity-75 bg-slate-50/70' : ''
      }`}
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <ShoppingBag className="w-12 h-12 stroke-[1.2]" />
            </div>
          )}

          {/* Featured Pin Badge */}
          {product.is_featured && (
            <div
              className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm"
              style={{ backgroundColor: accentColor || '#d97706' }}
            >
              <Pin className="w-2.5 h-2.5 fill-current" />
              Featured
            </div>
          )}

          {/* Out-of-Stock or Discount Sale Badge */}
          {!product.is_available ? (
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-white/95 border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm backdrop-blur-sm">
              <PackageX className="w-3.5 h-3.5 text-rose-600" />
              Sold Out
            </div>
          ) : hasSlashDiscount && discountPercent > 0 ? (
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
              -{discountPercent}% SALE
            </div>
          ) : null}

          {/* 1-Tap Share to WhatsApp Status / Copy Caption button */}
          <button
            type="button"
            onClick={handleShareItem}
            title="Share item to WhatsApp Status"
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200/80 flex items-center justify-center transition-transform active:scale-90"
          >
            {sharedStatus ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4">
          {categoryName && (
            <p
              className="text-[11px] font-bold uppercase tracking-wider text-blue-600"
              style={accentColor ? { color: accentColor } : undefined}
            >
              {categoryName}
            </p>
          )}

          <h3 className="mt-1 font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Product Variants Selector (Tink Pro) */}
          {hasVariants && (
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Select Option
              </span>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const varQty = getItemQuantity(`${product.id}__${variant.id}`);
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      style={
                        isSelected
                          ? {
                              backgroundColor: accentColor || '#2563EB',
                              borderColor: accentColor || '#2563EB',
                              color: '#ffffff'
                            }
                          : undefined
                      }
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{variant.name}</span>
                      {varQty > 0 && (
                        <span
                          className={`px-1 rounded text-[9px] font-extrabold ${
                            isSelected
                              ? 'bg-white/25 text-white'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {varQty}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price & Cart Actions */}
      <div className="p-3.5 sm:p-4 pt-0 sm:pt-0 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">
            {selectedVariant ? selectedVariant.name : 'Price'}
          </span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-slate-950">
              ₦{formatNaira(activePrice)}
            </span>
            {hasSlashDiscount && (
              <span className="text-[11px] font-semibold text-slate-400 line-through">
                ₦{formatNaira(compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div>
          {!product.is_available ? (
            <span className="inline-block px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 cursor-not-allowed">
              Out of stock
            </span>
          ) : !isStoreOpen ? (
            <span className="inline-block px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 cursor-not-allowed">
              Closed
            </span>
          ) : quantity > 0 ? (
            /* Active Stepper Control */
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label={`Decrease quantity of ${product.title}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label={`Increase quantity of ${product.title}`}
                style={accentColor ? { backgroundColor: accentColor } : undefined}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Add to Cart Button */
            <button
              type="button"
              onClick={handleAdd}
              id={`add-to-cart-${product.id}`}
              style={accentColor ? { backgroundColor: accentColor } : undefined}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
