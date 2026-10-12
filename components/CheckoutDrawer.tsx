'use client';

/**
 * Slide-Up Checkout Drawer & WhatsApp Order Trigger (Crisp White Theme)
 * Conforms to Master Build Blueprint Section 4.3 & Phase 3 Specification
 */

import React, { useState, useEffect } from 'react';
import { Vendor, CustomerDetails, DirectCartOrder } from '../types/database';
import { useCart } from '../context/CartContext';
import { formatNaira, generateOrderWhatsAppUrl } from '../lib/whatsapp';
import { validateAndNormalizePhone } from '../lib/phone';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  Building,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

interface CheckoutDrawerProps {
  vendor: Vendor;
}

const CUSTOMER_STORAGE_KEY = 'directcart_customer_info';

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({ vendor }) => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    totalCount
  } = useCart();

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    address: '',
    note: ''
  });

  const [copiedBank, setCopiedBank] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});

  // Hydrate saved customer details from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomer((prev) => ({
          ...prev,
          name: parsed.name || '',
          phone: parsed.phone || '',
          address: parsed.address || ''
        }));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleInputChange = (
    field: keyof CustomerDetails,
    value: string
  ) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const copyAccountNumber = () => {
    if (vendor.account_number) {
      navigator.clipboard.writeText(vendor.account_number);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  /**
   * CRITICAL RULE (Blueprint 4.3): Synchronous redirect without async delays
   */
  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: typeof formErrors = {};

    if (!customer.name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    const phoneValidation = validateAndNormalizePhone(customer.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error || 'Please enter a valid Nigerian WhatsApp number (e.g. 08012345678).';
    }

    if (!customer.address.trim()) {
      errors.address = 'Please enter your delivery address.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Persist customer details
    try {
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim()
        })
      );
    } catch {
      // Ignore
    }

    // Compile DirectCartOrder
    const order: DirectCartOrder = {
      storeName: vendor.store_name,
      vendorWhatsapp: vendor.whatsapp_number,
      vendorBank: {
        bankName: vendor.bank_name,
        accountNumber: vendor.account_number,
        accountName: vendor.account_name
      },
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        note: customer.note?.trim() || undefined
      },
      items,
      totalAmount
    };

    // Synchronous redirect immediately (Zero popup blocker risk)
    const whatsappUrl = generateOrderWhatsAppUrl(order);
    window.location.href = whatsappUrl;
  };

  if (!isDrawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-[92vh] sm:h-full mt-auto sm:mt-0 rounded-t-3xl sm:rounded-none z-10 transition-transform duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Review Your Order
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} • {vendor.store_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                title="Empty Cart"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {/* 1. Items List */}
          <div className="p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Selected Items
            </h3>

            {items.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
                <p className="text-xs">Your cart is currently empty.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                          <ShoppingBag className="w-5 h-5 stroke-1" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          ₦{formatNaira(item.price)} each
                        </p>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-rose-500" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Customer Delivery Details Form */}
          <form id="order-checkout-form" onSubmit={handleSendOrder} className="p-4 sm:p-5 space-y-3.5 bg-white">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Customer Details
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Amina Bello"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white ${
                  formErrors.name ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.name}
                </p>
              )}
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={customer.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="e.g. 08012345678"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white ${
                  formErrors.phone ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {formErrors.phone ? (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                </p>
              ) : (
                <p className="mt-1 text-[10px] text-slate-500">
                  Seller will chat and confirm delivery to this WhatsApp number.
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={customer.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="House / Street, Landmark, Area, City"
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white ${
                  formErrors.address ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {formErrors.address && (
                <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.address}
                </p>
              )}
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Order Note (Optional)
              </label>
              <input
                type="text"
                value={customer.note || ''}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="e.g. Extra spicy, call when outside"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
              />
            </div>
          </form>

          {/* 3. Vendor Nigerian Bank Payment Notice */}
          {(vendor.bank_name || vendor.account_number) && (
            <div className="p-4 sm:p-5 bg-blue-50/60 border-t border-blue-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-bold text-blue-900">
                    Direct Transfer Details
                  </h4>
                </div>
                {vendor.account_number && (
                  <button
                    type="button"
                    onClick={copyAccountNumber}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline"
                  >
                    {copiedBank ? (
                      <>
                        <Check className="w-3 h-3 text-blue-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Acc
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-2 text-xs text-blue-900 space-y-0.5">
                <p>
                  <span className="font-semibold">Bank:</span> {vendor.bank_name || 'Direct Transfer'}
                </p>
                <p>
                  <span className="font-semibold">Account No:</span>{' '}
                  <span className="font-mono font-bold text-slate-950">{vendor.account_number}</span>
                </p>
                <p>
                  <span className="font-semibold">Account Name:</span> {vendor.account_name || vendor.store_name}
                </p>
              </div>
              <p className="mt-2 text-[10px] text-blue-700">
                You will transfer funds directly to this account after order confirmation on WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* Fixed Drawer Footer & WhatsApp Button */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm text-slate-500 font-semibold">Total Amount</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-950">
              ₦{formatNaira(totalAmount)}
            </span>
          </div>

          <button
            type="submit"
            form="order-checkout-form"
            disabled={items.length === 0}
            id="send-order-whatsapp-btn"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20ba5a] active:scale-[0.99] transition-all shadow-md shadow-slate-300/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span>Send Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
