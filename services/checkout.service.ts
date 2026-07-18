import { getVivaCurrency, isVivaConfigured } from "@/constants/viva";
import { connectDB } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import {
  createVivaPaymentOrder,
  isSuccessfulVivaStatus,
  retrieveVivaTransaction,
} from "@/lib/viva";
import { Order } from "@/models/Order";
import { getDiamondById } from "@/services/diamond.service";
import { getProductById } from "@/services/product.service";
import { getRingSettingById } from "@/services/ring-setting.service";
import { tryCreateShipmentAfterPayment } from "@/services/shipment.service";
import { resolveShippingOption } from "@/services/shipping.service";
import type { CheckoutRequestInput } from "@/validation/checkout.schema";
import mongoose from "mongoose";

type BuiltOrderItem = {
  itemType: "product" | "custom-ring";
  productId?: mongoose.Types.ObjectId;
  diamondId?: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  snapshot: {
    name: string;
    price: number;
    images: Array<{ url?: string; alt?: string; isPrimary?: boolean }>;
    selectedOptions?: Record<string, string>;
    diamondDetails?: {
      shape: string;
      carat: number;
      cut?: string;
      color?: string;
      clarity?: string;
      gradingReport?: {
        lab?: string;
        reportNumber?: string;
      };
    };
    settingDetails?: {
      name: string;
      style?: string;
      metal: string;
      ringSize: string;
    };
  };
};

async function buildOrderItems(
  items: CheckoutRequestInput["items"],
): Promise<{ orderItems: BuiltOrderItem[]; subtotal: number } | { error: string }> {
  const orderItems: BuiltOrderItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.type === "product") {
      const product = await getProductById(item.productId);
      if (!product) {
        return { error: "One of the products in your bag is no longer available." };
      }

      let unitPrice = product.salePrice ?? product.basePrice;
      const selectedOptions: Record<string, string> = {};

      if (item.selectedOptions?.metal) {
        selectedOptions.metal = item.selectedOptions.metal;
      }
      if (item.selectedOptions?.ringSize) {
        selectedOptions.ringSize = item.selectedOptions.ringSize;
      }

      const options = item.selectedOptions;
      if (options?.variantId && product.variants?.length) {
        const variant =
          product.variants.find((v) => v.sku === options.variantId) ??
          product.variants.find(
            (v) =>
              v.metal === options.metal &&
              (!options.ringSize || v.ringSize === options.ringSize),
          );

        if (variant) {
          unitPrice = variant.salePrice ?? variant.price;
          if (variant.metal) selectedOptions.metal = variant.metal;
          if (variant.ringSize) selectedOptions.ringSize = variant.ringSize;
          selectedOptions.variantId = variant.sku;
        }
      } else if (options?.metal && product.variants?.length) {
        const variant = product.variants.find(
          (v) =>
            v.metal === options.metal &&
            (!options.ringSize || v.ringSize === options.ringSize),
        );
        if (variant) {
          unitPrice = variant.salePrice ?? variant.price;
          selectedOptions.variantId = variant.sku;
        }
      }

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        itemType: "product",
        productId: new mongoose.Types.ObjectId(product._id),
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        snapshot: {
          name: product.name,
          price: unitPrice,
          images: product.images ?? [],
          selectedOptions:
            Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
        },
      });
      continue;
    }

    const [setting, diamond] = await Promise.all([
      getRingSettingById(item.settingId),
      getDiamondById(item.diamondId),
    ]);

    if (!setting || !diamond) {
      return {
        error: "One of the custom ring selections is no longer available.",
      };
    }

    const unitPrice = setting.basePrice + (diamond.salePrice ?? diamond.price);
    subtotal += unitPrice;

    orderItems.push({
      itemType: "custom-ring",
      diamondId: new mongoose.Types.ObjectId(diamond._id),
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
      snapshot: {
        name: `${setting.name} with ${diamond.carat}ct ${diamond.shape}`,
        price: unitPrice,
        images: setting.images?.length
          ? setting.images
          : diamond.images?.length
            ? diamond.images
            : [],
        settingDetails: {
          name: setting.name,
          style: setting.style,
          metal: item.selectedMetal,
          ringSize: item.ringSize,
        },
        diamondDetails: {
          shape: diamond.shape,
          carat: diamond.carat,
          cut: diamond.cut,
          color: diamond.color,
          clarity: diamond.clarity,
          gradingReport: diamond.certification
            ? {
                lab: diamond.certification.lab,
                reportNumber: diamond.certification.reportNumber,
              }
            : undefined,
        },
      },
    });
  }

  return { orderItems, subtotal };
}

export async function startCheckout(input: CheckoutRequestInput): Promise<
  | { success: true; data: { orderNumber: string; checkoutUrl: string } }
  | { success: false; error: string; status: number }
> {
  if (!isVivaConfigured()) {
    return {
      success: false,
      error: "Online payments are not configured yet. Please contact us for a private appointment.",
      status: 503,
    };
  }

  try {
    await connectDB();
  } catch {
    return {
      success: false,
      error: "Could not connect to the database. Please try again shortly.",
      status: 503,
    };
  }

  const built = await buildOrderItems(input.items);
  if ("error" in built) {
    return { success: false, error: built.error, status: 400 };
  }

  const { orderItems, subtotal } = built;
  if (subtotal <= 0) {
    return { success: false, error: "Order total must be greater than zero.", status: 400 };
  }

  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const currency = getVivaCurrency();

  const shippingResult = await resolveShippingOption({
    country: input.shippingAddress.country,
    city: input.shippingAddress.city,
    postalCode: input.shippingAddress.postalCode,
    productCode: input.shipping.productCode,
    itemCount,
    currency,
  });

  if (!shippingResult.success) {
    return { success: false, error: shippingResult.error, status: 400 };
  }

  const shipping = shippingResult.option;
  const shippingTotal = shipping.price;
  const total = Math.round((subtotal + shippingTotal) * 100) / 100;

  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customer: input.customer,
    items: orderItems,
    subtotal,
    discountTotal: 0,
    shippingTotal,
    taxTotal: 0,
    total,
    currency,
    status: "new",
    paymentStatus: "pending",
    paymentProvider: "viva",
    shippingAddress: input.shippingAddress,
    billingAddress: input.shippingAddress,
    shippingMethod: {
      carrier: shipping.carrier,
      productCode: shipping.productCode,
      localProductCode: shipping.localProductCode,
      productName: shipping.productName,
      estimatedDelivery: shipping.estimatedDelivery,
      source: shipping.source,
    },
    dhlShipment: {
      status: "pending",
    },
  });

  try {
    const viva = await createVivaPaymentOrder({
      amountMajor: total,
      orderNumber,
      customer: {
        email: input.customer.email,
        fullName: input.customer.name,
        phone: input.customer.phone,
        countryCode: input.shippingAddress.country,
      },
      locale: input.locale,
      description: `Asteria Diamond House — ${orderNumber}`,
    });

    order.vivaOrderCode = viva.orderCode;
    await order.save();

    return {
      success: true,
      data: {
        orderNumber,
        checkoutUrl: viva.checkoutUrl,
      },
    };
  } catch (error) {
    console.error("startCheckout Viva error:", error);
    order.paymentStatus = "failed";
    order.status = "cancelled";
    order.internalNotes = `Viva payment order creation failed: ${
      error instanceof Error ? error.message : String(error)
    }`;
    await order.save();

    return {
      success: false,
      error: "Could not start payment with Viva.com. Please try again or book an appointment.",
      status: 502,
    };
  }
}

export async function markOrderPaidFromViva(input: {
  orderCode: string;
  transactionId: string;
}): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
  await connectDB();

  const order = await Order.findOne({ vivaOrderCode: String(input.orderCode) });
  if (!order) {
    return { success: false, error: "Order not found for Viva order code." };
  }

  if (order.paymentStatus === "paid") {
    const shipStatus = order.dhlShipment?.status;
    if (
      !order.trackingNumber &&
      (shipStatus === "pending" || shipStatus === "failed" || !shipStatus)
    ) {
      await tryCreateShipmentAfterPayment(order.orderNumber);
    }
    return { success: true, orderNumber: order.orderNumber };
  }

  const transaction = await retrieveVivaTransaction(input.transactionId);

  if (String(transaction.orderCode) !== String(input.orderCode)) {
    return { success: false, error: "Transaction order code mismatch." };
  }

  if (!isSuccessfulVivaStatus(transaction.statusId)) {
    return {
      success: false,
      error: `Transaction status is not successful (${transaction.statusId}).`,
    };
  }

  const expectedCents = Math.round(order.total * 100);
  if (transaction.amountCents !== expectedCents) {
    return {
      success: false,
      error: `Amount mismatch: expected ${expectedCents}, got ${transaction.amountCents}.`,
    };
  }

  order.paymentStatus = "paid";
  order.status = "paid";
  order.vivaTransactionId = transaction.transactionId;
  await order.save();

  // Create DHL label/AWB after payment (best-effort; admin can retry).
  await tryCreateShipmentAfterPayment(order.orderNumber);

  return { success: true, orderNumber: order.orderNumber };
}

export async function markOrderFailedFromViva(orderCode: string): Promise<void> {
  await connectDB();
  const order = await Order.findOne({ vivaOrderCode: String(orderCode) });
  if (!order || order.paymentStatus === "paid") return;

  order.paymentStatus = "failed";
  await order.save();
}

export async function getOrderByVivaOrderCode(orderCode: string): Promise<{
  orderNumber: string;
  paymentStatus: string;
} | null> {
  await connectDB();
  const order = await Order.findOne({ vivaOrderCode: String(orderCode) })
    .select("orderNumber paymentStatus")
    .lean<{ orderNumber: string; paymentStatus: string } | null>();
  return order;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<{
  orderNumber: string;
  paymentStatus: string;
} | null> {
  await connectDB();
  const order = await Order.findOne({ orderNumber })
    .select("orderNumber paymentStatus")
    .lean<{ orderNumber: string; paymentStatus: string } | null>();
  return order;
}
