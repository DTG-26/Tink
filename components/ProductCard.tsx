'use client';

import React from 'react';
import { Product } from '../types/database';
import { formatNaira } from '../lib/whatsapp';
import { useCart } from '../context/CartContext';
import { Plus, Minus, PackageX, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  isStoreOpen: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  isStoreOpen
}) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const isAvailable = product.is_available && isStoreOpen;

  const handleAdd = () => {
    if (!isAvailable) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      category_name: categoryName
    });
  };

  const handleIncrement = () => {
    if (!isAvailable) return;
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantity - 1);
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

          {/* Out-of-Stock Badge */}
          {!product.is_available && (
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-white/95 border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-700 shadow-sm backdrop-blur-sm">
              <PackageX className="w-3.5 h-3.5 text-rose-600" />
              Sold Out
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4">
          {categoryName && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
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
        </div>
      </div>

      {/* Footer: Price & Cart Actions */}
      <div className="p-3.5 sm:p-4 pt-0 sm:pt-0 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Price</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-950">
            ₦{formatNaira(product.price)}
          </span>
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
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label={`Decrease quantity of ${product.title}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-blue-700 hover:bg-blue-100 active:scale-95 transition-all shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-blue-950">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label={`Increase quantity of ${product.title}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
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
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20"
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
