import { safeConnectDB } from "@/lib/db";
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
