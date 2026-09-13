import { safeConnectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import mongoose from "mongoose";

export type AdminCustomerSummary = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt?: string;
};

export type AdminCustomerDetail = AdminCustomerSummary & {
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  orders: Array<{
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
    currency: string;
    createdAt: string;
  }>;
};

export async function getAdminCustomers(): Promise<AdminCustomerSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const customers = await User.find({ role: "customer" })
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    if (customers.length === 0) return [];

    const emails = customers.map((c) => String(c.email).toLowerCase());
    const ids = customers.map((c) => c._id);

    const orders = await Order.find({
      $or: [{ userId: { $in: ids } }, { "customer.email": { $in: emails } }],
    })
      .select("userId customer.email total paymentStatus createdAt")
      .lean();

    type Acc = { count: number; totalSpent: number; lastOrderAt?: Date };
    const byUserId = new Map<string, Acc>();
    const byEmail = new Map<string, Acc>();

    function bump(map: Map<string, Acc>, key: string, order: (typeof orders)[number]) {
      const current = map.get(key) ?? { count: 0, totalSpent: 0 };
      current.count += 1;
      if (order.paymentStatus === "paid") {
        current.totalSpent += order.total as number;
      }
      const created = new Date(order.createdAt as Date);
      if (!current.lastOrderAt || created > current.lastOrderAt) {
        current.lastOrderAt = created;
      }
      map.set(key, current);
    }

    for (const order of orders) {
      if (order.userId) bump(byUserId, String(order.userId), order);
      const email = String(order.customer?.email ?? "").toLowerCase();
      if (email) bump(byEmail, email, order);
    }

    return customers.map((customer) => {
      const id = String(customer._id);
      const email = String(customer.email).toLowerCase();
      const stats = byUserId.get(id) ?? byEmail.get(email);
      return {
        _id: id,
        name: customer.name as string,
        email: customer.email as string,
        phone: customer.phone as string | undefined,
        isActive: Boolean(customer.isActive),
        orderCount: stats?.count ?? 0,
        totalSpent: stats?.totalSpent ?? 0,
        createdAt: new Date(customer.createdAt as Date).toISOString(),
        lastOrderAt: stats?.lastOrderAt?.toISOString(),
      };
    });
  } catch (error) {
    console.error("getAdminCustomers error:", error);
    return [];
  }
}

export async function getAdminCustomerById(
  id: string,
): Promise<AdminCustomerDetail | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const customer = (await User.findOne({ _id: id, role: "customer" })
      .select("-passwordHash")
      .lean()) as {
      _id: { toString(): string };
      name: string;
      email: string;
      phone?: string;
      isActive?: boolean;
      shippingAddress?: AdminCustomerDetail["shippingAddress"];
      createdAt: Date;
    } | null;
    if (!customer) return null;

    const email = String(customer.email).toLowerCase();
    const orders = await Order.find({
      $or: [{ userId: customer._id }, { "customer.email": email }],
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const paidTotal = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + (o.total as number), 0);

    return {
      _id: String(customer._id),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      isActive: Boolean(customer.isActive),
      shippingAddress: customer.shippingAddress,
      orderCount: orders.length,
      totalSpent: paidTotal,
      createdAt: new Date(customer.createdAt).toISOString(),
      lastOrderAt: orders[0]
        ? new Date(orders[0].createdAt as Date).toISOString()
        : undefined,
      orders: orders.map((order) => ({
        _id: String(order._id),
        orderNumber: order.orderNumber as string,
        status: order.status as string,
        paymentStatus: order.paymentStatus as string,
        total: order.total as number,
        currency: (order.currency as string) || "EUR",
        createdAt: new Date(order.createdAt as Date).toISOString(),
      })),
    };
  } catch (error) {
    console.error("getAdminCustomerById error:", error);
    return null;
  }
}

export async function getOrdersForCustomer(userId: string, email: string) {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const query: Record<string, unknown> = {
      $or: [{ "customer.email": email.toLowerCase() }],
    };
    if (mongoose.Types.ObjectId.isValid(userId)) {
      (query.$or as unknown[]).push({ userId });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50).lean();
    return orders.map((order) => ({
      _id: String(order._id),
      orderNumber: order.orderNumber as string,
      status: order.status as string,
      paymentStatus: order.paymentStatus as string,
      total: order.total as number,
      currency: (order.currency as string) || "EUR",
      createdAt: new Date(order.createdAt as Date).toISOString(),
      items: (order.items as Array<{ snapshot?: { name?: string }; quantity?: number }>).map(
        (item) => ({
          name: item.snapshot?.name ?? "Item",
          quantity: item.quantity ?? 1,
        }),
      ),
    }));
  } catch (error) {
    console.error("getOrdersForCustomer error:", error);
    return [];
  }
}
