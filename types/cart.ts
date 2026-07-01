export interface CartProductSelectedOptions {
  metal?: string;
  ringSize?: string;
  variantId?: string;
}

export interface CartProductItem {
  id: string;
  type: "product";
  productId: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  salePrice?: number;
  quantity: number;
  selectedOptions?: CartProductSelectedOptions;
}

export interface CartCustomRingCertificationSnapshot {
  lab?: string;
  reportNumber?: string;
  reportUrl?: string;
  certificateFileUrl?: string;
}

export interface CartSettingSnapshot {
  id: string;
  name: string;
  style?: string;
  basePrice: number;
  image?: string;
}

export interface CartDiamondSnapshot {
  id: string;
  diamondType?: string;
  shape: string;
  carat: number;
  cut?: string;
  color?: string;
  clarity?: string;
  price: number;
  certification?: CartCustomRingCertificationSnapshot;
}

export interface CartCustomRingItem {
  id: string;
  type: "custom-ring";
  settingId: string;
  diamondId: string;
  selectedMetal: string;
  ringSize: string;
  name: string;
  image?: string;
  price: number;
  quantity: 1;
  settingSnapshot: CartSettingSnapshot;
  diamondSnapshot: CartDiamondSnapshot;
}

export type CartItem = CartProductItem | CartCustomRingItem;

export interface AddProductCartInput {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  salePrice?: number;
  quantity?: number;
  selectedOptions?: CartProductSelectedOptions;
}

export interface AddCustomRingCartInput {
  settingId: string;
  diamondId: string;
  selectedMetal: string;
  ringSize: string;
  name: string;
  image?: string;
  price: number;
  settingSnapshot: CartSettingSnapshot;
  diamondSnapshot: CartDiamondSnapshot;
}
