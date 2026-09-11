import { safeConnectDB } from "@/lib/db";
import { sendOrderUpdateEmail } from "@/lib/order-emails";
import { Order } from "@/models/Order";
import type { DashboardStats, OrderSummary } from "@/types";
import { getPendingAppointmentsCount } from "@/services/appointment.service";
import {
  getDiamondsCount,
} from "@/services/diamond.service";
import {
  getLowStockProductsCount,
  getProductsCount,
} from "@/services/product.service";

function toOrderSummary(order: {
  _id: { toString(): string };
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}): OrderSummary {
  return {
    _id: order._id.toString(),
    orderNumber: order.orderNumber,
    customer: order.customer,
    total: order.total,
    status: order.status as OrderSummary["status"],
    paymentStatus: order.paymentStatus as OrderSummary["paymentStatus"],
    createdAt: order.createdAt.toISOString(),
  };
}

export async function getRecentOrders(limit = 5): Promise<OrderSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return orders.map((order) =>
      toOrderSummary(order as unknown as Parameters<typeof toOrderSummary>[0]),
    );
  } catch (error) {
    console.error("getRecentOrders error:", error);
    return [];
  }
}

export async function getTotalOrdersCount(): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    return await Order.countDocuments();
  } catch (error) {
    console.error("getTotalOrdersCount error:", error);
    return 0;
  }
}

export async function getPendingOrdersCount(): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    return await Order.countDocuments({
      status: { $in: ["new", "paid", "in_production"] },
    });
  } catch (error) {
    console.error("getPendingOrdersCount error:", error);
    return 0;
  }
}

export async function getTotalSales(): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    const result = await Order.aggregate<{ total: number }>([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    return result[0]?.total ?? 0;
  } catch (error) {
    console.error("getTotalSales error:", error);
    return 0;
  }
}

export async function getOrders(limit = 50): Promise<OrderSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return orders.map((order) =>
      toOrderSummary(order as unknown as Parameters<typeof toOrderSummary>[0]),
    );
  } catch (error) {
    console.error("getOrders error:", error);
    return [];
  }
}

export type AdminOrderDetail = {
  _id: { toString(): string };
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  items: Array<{
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    snapshot?: { name?: string };
  }>;
  subtotal: number;
  shippingTotal?: number;
  total: number;
  currency?: string;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  internalNotes?: string;
  promisedDeliveryDate?: Date | string | null;
  productionEta?: Date | string | null;
  timelineNotes?: string | null;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  shippingMethod?: {
    productCode?: string;
    localProductCode?: string;
    productName?: string;
    source?: string;
    estimatedDelivery?: string;
  };
  dhlShipment?: {
    status?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    lastError?: string;
    documents?: Array<{ typeCode?: string }>;
  };
};

export async function getOrderById(id: string): Promise<AdminOrderDetail | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const order = await Order.findById(id).lean();
    if (!order || Array.isArray(order)) return null;
    return order as unknown as AdminOrderDetail;
  } catch (error) {
    console.error("getOrderById error:", error);
    return null;
  }
}

export type UpdateOrderAdminInput = {
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  internalNotes?: string;
  promisedDeliveryDate?: Date | null;
  productionEta?: Date | null;
  timelineNotes?: string | null;
  notifyCustomer?: boolean;
  customerMessage?: string;
};

function sameDay(
  left?: Date | string | null,
  right?: Date | string | null,
): boolean {
  if (!left && !right) return true;
  if (!left || !right) return false;
  const a = left instanceof Date ? left : new Date(left);
  const b = right instanceof Date ? right : new Date(right);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

export async function updateOrderAdmin(
  id: string,
  input: UpdateOrderAdminInput,
): Promise<AdminOrderDetail | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const existing = await Order.findById(id);
    if (!existing) return null;

    const {
      notifyCustomer = false,
      customerMessage,
      ...fields
    } = input;

    const $set: Record<string, unknown> = {};
    const $unset: Record<string, 1> = {};

    if (fields.status !== undefined) $set.status = fields.status;
    if (fields.paymentStatus !== undefined) {
      $set.paymentStatus = fields.paymentStatus;
    }
    if (fields.trackingNumber !== undefined) {
      $set.trackingNumber = fields.trackingNumber;
    }
    if (fields.internalNotes !== undefined) {
      $set.internalNotes = fields.internalNotes;
    }
    if (fields.timelineNotes !== undefined) {
      if (fields.timelineNotes === null || fields.timelineNotes === "") {
        $unset.timelineNotes = 1;
      } else {
        $set.timelineNotes = fields.timelineNotes;
      }
    }
    if (fields.promisedDeliveryDate !== undefined) {
      if (fields.promisedDeliveryDate === null) {
        $unset.promisedDeliveryDate = 1;
      } else {
        $set.promisedDeliveryDate = fields.promisedDeliveryDate;
      }
    }
    if (fields.productionEta !== undefined) {
      if (fields.productionEta === null) {
        $unset.productionEta = 1;
      } else {
        $set.productionEta = fields.productionEta;
      }
    }

    const update: { $set?: Record<string, unknown>; $unset?: Record<string, 1> } =
      {};
    if (Object.keys($set).length > 0) update.$set = $set;
    if (Object.keys($unset).length > 0) update.$unset = $unset;

    const order = await Order.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!order || Array.isArray(order)) return null;

    const statusChanged =
      fields.status !== undefined && fields.status !== existing.status;
    const trackingChanged =
      fields.trackingNumber !== undefined &&
      (fields.trackingNumber || "") !== (existing.trackingNumber || "");
    const deliveryChanged =
      fields.promisedDeliveryDate !== undefined &&
      !sameDay(fields.promisedDeliveryDate, existing.promisedDeliveryDate);
    const productionChanged =
      fields.productionEta !== undefined &&
      !sameDay(fields.productionEta, existing.productionEta);
    const timelineChanged =
      fields.timelineNotes !== undefined &&
      (fields.timelineNotes || "") !== (existing.timelineNotes || "");

    if (
      notifyCustomer &&
      (statusChanged ||
        trackingChanged ||
        deliveryChanged ||
        productionChanged ||
        timelineChanged)
    ) {
      void sendOrderUpdateEmail(
        order as unknown as Parameters<typeof sendOrderUpdateEmail>[0],
        { reason: customerMessage },
      ).catch((error) => {
        console.error("updateOrderAdmin customer email error:", error);
      });
    }

    return order as unknown as AdminOrderDetail;
  } catch (error) {
    console.error("updateOrderAdmin error:", error);
    return null;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalSales,
    totalOrders,
    pendingOrders,
    pendingAppointments,
    productsCount,
    diamondsCount,
    lowStockProducts,
  ] = await Promise.all([
    getTotalSales(),
    getTotalOrdersCount(),
    getPendingOrdersCount(),
    getPendingAppointmentsCount(),
    getProductsCount(),
    getDiamondsCount(),
    getLowStockProductsCount(),
  ]);

  return {
    totalSales,
    totalOrders,
    pendingOrders,
    pendingAppointments,
    productsCount,
    diamondsCount,
    lowStockProducts,
  };
}
