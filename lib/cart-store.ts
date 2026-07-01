import {
  CART_STORAGE_KEY,
  createCustomRingCartItem,
  createProductCartItem,
  EMPTY_CART,
  findMatchingProductItem,
  parseCartFromStorage,
  serializeCart,
} from "@/lib/cart";
import type {
  AddCustomRingCartInput,
  AddProductCartInput,
  CartItem,
} from "@/types/cart";

type CartListener = () => void;

const listeners = new Set<CartListener>();

/** In-memory cache so useSyncExternalStore gets a stable reference between updates. */
let cachedItems: CartItem[] | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key === CART_STORAGE_KEY) {
    cachedItems = readCartFromStorage();
    emitChange();
  }
}

let storageListenerAttached = false;

function attachStorageListener() {
  if (storageListenerAttached || typeof window === "undefined") return;
  storageListenerAttached = true;
  window.addEventListener("storage", handleStorageEvent);
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  return parseCartFromStorage(localStorage.getItem(CART_STORAGE_KEY));
}

function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
}

function getCachedCart(): CartItem[] {
  if (cachedItems === null) {
    cachedItems = readCartFromStorage();
  }
  return cachedItems;
}

function setCartItems(items: CartItem[]) {
  cachedItems = items;
  writeCartToStorage(items);
  emitChange();
}

export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener);
  attachStorageListener();
  return () => listeners.delete(listener);
}

export function getCartSnapshot(): CartItem[] {
  return getCachedCart();
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function updateCart(updater: (items: CartItem[]) => CartItem[]) {
  const nextItems = updater(getCachedCart());
  setCartItems(nextItems);
}

export function addProductToCart(input: AddProductCartInput) {
  const quantity = input.quantity ?? 1;

  updateCart((current) => {
    const existing = findMatchingProductItem(
      current,
      input.productId,
      input.selectedOptions,
    );

    if (existing) {
      return current.map((item) =>
        item.id === existing.id && item.type === "product"
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    }

    return [
      ...current,
      createProductCartItem({
        productId: input.productId,
        name: input.name,
        slug: input.slug,
        image: input.image,
        price: input.price,
        salePrice: input.salePrice,
        quantity,
        selectedOptions: input.selectedOptions,
      }),
    ];
  });
}

export function addCustomRingToCart(input: AddCustomRingCartInput) {
  updateCart((current) => [
    ...current,
    createCustomRingCartItem({
      settingId: input.settingId,
      diamondId: input.diamondId,
      selectedMetal: input.selectedMetal,
      ringSize: input.ringSize,
      name: input.name,
      image: input.image,
      price: input.price,
      settingSnapshot: input.settingSnapshot,
      diamondSnapshot: input.diamondSnapshot,
    }),
  ]);
}

export function removeCartItem(id: string) {
  updateCart((current) => current.filter((item) => item.id !== id));
}

export function updateCartItemQuantity(id: string, quantity: number) {
  if (quantity < 1) return;

  updateCart((current) =>
    current.map((item) => {
      if (item.id !== id) return item;
      if (item.type === "custom-ring") return item;
      return { ...item, quantity };
    }),
  );
}

export function clearCartStorage() {
  setCartItems(EMPTY_CART);
}
