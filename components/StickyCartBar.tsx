'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/whatsapp';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const StickyCartBar: React.FC = () => {
  const { totalCount, totalAmount, openDrawer } = useCart();

  if (totalCount === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Shopping Cart Summary"
      className="fixed bottom-4 inset-x-0 z-30 px-4 pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={openDrawer}
          id="floating-cart-bar-btn"
          className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl shadow-blue-500/10 active:scale-[0.99] transition-all border border-slate-200 hover:border-blue-500/40"
        >
          {/* Left: Cart Count & Icon */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {totalCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 font-medium">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="text-base font-extrabold text-slate-950 tracking-tight">
                ₦{formatNaira(totalAmount)}
              </p>
            </div>
          </div>

          {/* Right: Checkout Action */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
            <span>Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </aside>
  );
};
