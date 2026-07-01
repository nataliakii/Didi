import type {
  AvailabilityStatus,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
  DiamondShape,
  DiamondType,
  Metal,
  ProductStatus,
  ProductType,
  RingStyle,
} from "@/constants/jewellery";
import type { CertificationLab } from "@/constants/certification";
import type {
  AppointmentStatus,
  AppointmentType,
  OrderStatus,
  PaymentStatus,
  UserRole,
} from "@/constants/order-status";

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  sku: string;
  metal?: Metal;
  ringSize?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  image?: string;
}

export interface ProductAttributes {
  metal?: Metal[];
  stoneType?: string;
  diamondShape?: DiamondShape;
  style?: RingStyle;
  ringSizes?: string[];
}

export interface OrderItemSnapshot {
  name: string;
  price: number;
  images: ProductImage[];
  selectedOptions?: Record<string, string>;
  diamondDetails?: {
    shape: DiamondShape;
    carat: number;
    cut: DiamondCut;
    color: DiamondColor;
    clarity: DiamondClarity;
    gradingReport?: {
      lab?: CertificationLab;
      reportNumber?: string;
    };
  };
  settingDetails?: {
    name: string;
    style: RingStyle;
    metal: Metal;
    ringSize: string;
  };
}

export interface OrderItem {
  itemType: "product" | "diamond" | "custom-ring";
  productId?: string;
  diamondId?: string;
  customRingId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  snapshot: OrderItemSnapshot;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export type {
  AvailabilityStatus,
  DiamondClarity,
  DiamondColor,
  DiamondCut,
  DiamondShape,
  DiamondType,
  Metal,
  ProductStatus,
  ProductType,
  RingStyle,
  CertificationLab,
  AppointmentStatus,
  AppointmentType,
  OrderStatus,
  PaymentStatus,
  UserRole,
};

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  pendingAppointments: number;
  productsCount: number;
  diamondsCount: number;
  lowStockProducts: number;
}

export interface CategorySummary {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductSummary {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  images: ProductImage[];
  productType: ProductType;
  isFeatured: boolean;
  isBestSeller: boolean;
  isReadyToShip: boolean;
  availabilityStatus: AvailabilityStatus;
  attributes?: ProductAttributes;
  variants?: ProductVariant[];
}

export interface DiamondCertification {
  lab?: CertificationLab;
  reportNumber?: string;
  reportUrl?: string;
  certificateFileUrl?: string;
}

export interface DiamondSummary {
  _id: string;
  diamondType: DiamondType;
  shape: DiamondShape;
  carat: number;
  cut: DiamondCut;
  color: DiamondColor;
  clarity: DiamondClarity;
  price: number;
  salePrice?: number;
  certification?: DiamondCertification;
  images: ProductImage[];
  availabilityStatus: AvailabilityStatus;
}

export interface DiamondDetail extends DiamondSummary {
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
}

export interface UpdateDiamondCertificationInput {
  lab?: CertificationLab;
  reportNumber?: string;
  reportUrl?: string;
  certificateFileUrl?: string;
}

export interface AdminDiamondSummary extends DiamondSummary {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface AppointmentSummary {
  _id: string;
  name: string;
  email: string;
  appointmentType: AppointmentType;
  preferredDate: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export type ProductSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "featured"
  | "best-sellers";

export type DiamondSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "carat-asc"
  | "carat-desc";

export interface ProductFilters {
  search?: string;
  category?: string;
  productType?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  metal?: Metal;
  stoneType?: string;
  diamondShape?: DiamondShape;
  style?: RingStyle;
  availabilityStatus?: AvailabilityStatus;
  isReadyToShip?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export interface DiamondFilters {
  diamondType?: DiamondType;
  shape?: DiamondShape;
  compatibleShapes?: DiamondShape[];
  minCarat?: number;
  maxCarat?: number;
  minPrice?: number;
  maxPrice?: number;
  cut?: DiamondCut;
  color?: DiamondColor;
  clarity?: DiamondClarity;
  certificationLab?: CertificationLab;
  availabilityStatus?: AvailabilityStatus;
  sort?: DiamondSortOption;
  page?: number;
  limit?: number;
}

export interface ProductDetail extends ProductSummary {
  description?: string;
  attributes?: ProductAttributes;
  variants?: ProductVariant[];
  stockQuantity: number;
  productionTime?: string;
  categoryId: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface RingSettingSummary {
  _id: string;
  name: string;
  slug: string;
  style: RingStyle;
  basePrice: number;
  description?: string;
  images: ProductImage[];
  availableMetals: Metal[];
  compatibleDiamondShapes: DiamondShape[];
  minRingSize: string;
  maxRingSize: string;
  productionTime?: string;
  isFeatured: boolean;
}

export type RingSettingDetail = RingSettingSummary;

export interface RingSettingFilters {
  style?: RingStyle;
  metal?: Metal;
  compatibleShape?: DiamondShape;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export interface CustomRingPriceBreakdown {
  settingPrice: number;
  diamondPrice: number;
  metalAdjustment: number;
  finalPrice: number;
}

export interface RingBuilderParams {
  settingId?: string;
  diamondId?: string;
  metal?: Metal;
  ringSize?: string;
}
