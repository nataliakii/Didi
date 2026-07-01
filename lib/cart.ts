import type {
  CartCustomRingItem,
  CartItem,
  CartProductItem,
  CartProductSelectedOptions,
} from "@/types/cart";
import type { ProductImage } from "@/types";

export const CART_STORAGE_KEY = "di-di-cart";

/** Stable empty cart reference for useSyncExternalStore snapshots. */
export const EMPTY_CART: CartItem[] = [];

/**
 * Client-side cart prices are for display only.
 * Future checkout must recalculate all prices on the server from DB.
 */

export function generateCartItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getPrimaryImageUrl(
  images?: ProductImage[],
): string | undefined {
  if (!images || images.length === 0) return undefined;
  return images.find((image) => image.isPrimary)?.url ?? images[0]?.url;
}

export function getProductUnitPrice(
  item: Pick<CartProductItem, "price" | "salePrice">,
): number {
  if (item.salePrice !== undefined && item.salePrice < item.price) {
    return item.salePrice;
  }
  return item.price;
}

export function getCartItemLineTotal(item: CartItem): number {
  const unitPrice =
    item.type === "product" ? getProductUnitPrice(item) : item.price;
  return unitPrice * item.quantity;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function normalizeOptions(
  options?: CartProductSelectedOptions,
): CartProductSelectedOptions {
  return {
    metal: options?.metal ?? undefined,
    ringSize: options?.ringSize ?? undefined,
    variantId: options?.variantId ?? undefined,
  };
}

export function buildProductCartKey(
  productId: string,
  options?: CartProductSelectedOptions,
): string {
  const normalized = normalizeOptions(options);
  return [
    productId,
    normalized.metal ?? "",
    normalized.ringSize ?? "",
    normalized.variantId ?? "",
  ].join("|");
}

export function findMatchingProductItem(
  items: CartItem[],
  productId: string,
  options?: CartProductSelectedOptions,
): CartProductItem | undefined {
  const key = buildProductCartKey(productId, options);
  return items.find(
    (item): item is CartProductItem =>
      item.type === "product" &&
      buildProductCartKey(item.productId, item.selectedOptions) === key,
  );
}

export function parseCartFromStorage(raw: string | null): CartItem[] {
  if (!raw) return EMPTY_CART;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;
    const items = parsed.filter(isValidCartItem);
    return items.length > 0 ? items : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  if (item.type === "product") {
    return (
      typeof item.id === "string" &&
      typeof item.productId === "string" &&
      typeof item.name === "string" &&
      typeof item.slug === "string" &&
      typeof item.price === "number" &&
      typeof item.quantity === "number" &&
      item.quantity >= 1
    );
  }

  if (item.type === "custom-ring") {
    return (
      typeof item.id === "string" &&
      typeof item.settingId === "string" &&
      typeof item.diamondId === "string" &&
      typeof item.selectedMetal === "string" &&
      typeof item.ringSize === "string" &&
      typeof item.name === "string" &&
      typeof item.price === "number" &&
      item.quantity === 1 &&
      typeof item.settingSnapshot === "object" &&
      item.settingSnapshot !== null &&
      typeof item.diamondSnapshot === "object" &&
      item.diamondSnapshot !== null
    );
  }

  return false;
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

export function createCustomRingCartItem(
  input: Omit<CartCustomRingItem, "id" | "type" | "quantity">,
): CartCustomRingItem {
  return {
    id: generateCartItemId(),
    type: "custom-ring",
    quantity: 1,
    ...input,
  };
}

export function createProductCartItem(
  input: Omit<CartProductItem, "id" | "type">,
): CartProductItem {
  return {
    id: generateCartItemId(),
    type: "product",
    ...input,
  };
}
