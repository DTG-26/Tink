'use client';

/**
 * Client-Side Cart Context for WhatsApp Direct-Cart Catalog
 * Guardrail Conformance:
 * - Cart is strictly stored client-side in localStorage.
 * - Zero buyer logins or server database shopping cart tables.
 * - Cart data is scoped by vendor slug (`directcart_${vendorSlug}`) to prevent cross-store pollution.
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem } from '../types/database';

interface CartContextType {
  vendorSlug: string;
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  vendorSlug: string;
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ vendorSlug, children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const storageKey = `directcart_${vendorSlug}`;

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  // Sync to localStorage on items change (only after initial hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (items.length === 0) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(items));
      }
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items, isHydrated, storageKey]);

  const addItem = (item: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    if (qty <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        vendorSlug,
        items,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        totalCount,
        totalAmount,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
