"use client";

import {
  addCustomRingToCart,
  addProductToCart,
  clearCartStorage,
  getCartServerSnapshot,
  getCartSnapshot,
  removeCartItem,
  subscribeToCart,
  updateCartItemQuantity,
} from "@/lib/cart-store";
import { getCartItemCount, getCartSubtotal } from "@/lib/cart";
import type {
  AddCustomRingCartInput,
  AddProductCartInput,
  CartItem,
} from "@/types/cart";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

function subscribeToHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getHydratedServerSnapshot() {
  return false;
}

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  addProductItem: (input: AddProductCartInput) => void;
  addCustomRingItem: (input: AddCustomRingCartInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getHydratedServerSnapshot,
  );

  const addProductItem = useCallback((input: AddProductCartInput) => {
    addProductToCart(input);
  }, []);

  const addCustomRingItem = useCallback((input: AddCustomRingCartInput) => {
    addCustomRingToCart(input);
  }, []);

  const removeItem = useCallback((id: string) => {
    removeCartItem(id);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    updateCartItemQuantity(id, quantity);
  }, []);

  const clearCart = useCallback(() => {
    clearCartStorage();
  }, []);

  const getItemCount = useCallback(() => getCartItemCount(items), [items]);
  const getSubtotal = useCallback(() => getCartSubtotal(items), [items]);
  const getTotal = useCallback(() => getCartSubtotal(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isHydrated,
      addProductItem,
      addCustomRingItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      getSubtotal,
      getTotal,
    }),
    [
      items,
      isHydrated,
      addProductItem,
      addCustomRingItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      getSubtotal,
      getTotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
