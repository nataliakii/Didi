import {
  isDhlConfigured,
  isFallbackDhlProductCode,
} from "@/constants/dhl";
import { connectDB } from "@/lib/db";
import { createDhlExpressShipment } from "@/lib/dhl";
import { Order } from "@/models/Order";

export async function createShipmentForOrder(
  orderIdOrNumber: string,
  options?: { force?: boolean },
): Promise<
  | {
      success: true;
      trackingNumber: string;
      trackingUrl?: string;
      skipped?: boolean;
      reason?: string;
    }
  | { success: false; error: string }
> {
  await connectDB();

  const order = await Order.findOne({
    $or: [
      { orderNumber: orderIdOrNumber },
      ...(orderIdOrNumber.match(/^[a-f\d]{24}$/i)
        ? [{ _id: orderIdOrNumber }]
        : []),
    ],
  });

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  if (order.paymentStatus !== "paid") {
    return { success: false, error: "Order must be paid before creating a shipment." };
  }

  if (order.trackingNumber && order.dhlShipment?.status === "created" && !options?.force) {
    return {
      success: true,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.dhlShipment.trackingUrl,
      skipped: true,
      reason: "Shipment already created.",
    };
  }

  const productCode = order.shippingMethod?.productCode;
  if (!productCode) {
    order.dhlShipment = {
      status: "skipped",
      lastError: "No shipping product selected on order.",
      createdAt: new Date(),
    };
    await order.save();
    return {
      success: true,
      trackingNumber: "",
      skipped: true,
      reason: "No shipping product on order.",
    };
  }

  if (!isDhlConfigured() || isFallbackDhlProductCode(productCode)) {
    order.dhlShipment = {
      status: "skipped",
      lastError: isDhlConfigured()
        ? "Estimated/fallback rate was used — create the DHL shipment manually after configuring live rates."
        : "DHL API credentials are not configured.",
      createdAt: new Date(),
    };
    await order.save();
    return {
      success: true,
      trackingNumber: "",
      skipped: true,
      reason: order.dhlShipment.lastError,
    };
  }

  if (!order.shippingAddress || !order.customer) {
    return { success: false, error: "Order is missing customer or shipping address." };
  }

  const items = order.items as Array<{
    quantity?: number;
    unitPrice: number;
    snapshot?: { name?: string };
  }>;
  const itemCount = items.reduce(
    (sum: number, item) => sum + (item.quantity || 1),
    0,
  );
  const extraWeightKg = Math.max(0, itemCount - 1) * 0.1;

  try {
    const result = await createDhlExpressShipment({
      productCode,
      localProductCode: order.shippingMethod?.localProductCode || undefined,
      orderNumber: order.orderNumber,
      receiver: {
        name: order.customer.name,
        phone: order.customer.phone || "+30000000000",
        email: order.customer.email,
        line1: order.shippingAddress.line1,
        line2: order.shippingAddress.line2 || undefined,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        countryCode: order.shippingAddress.country,
        state: order.shippingAddress.state || undefined,
      },
      lineItems: items.map((item) => ({
        description: item.snapshot?.name || "Jewellery item",
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice,
      })),
      declaredValue: order.subtotal,
      currencyCode: order.currency || "EUR",
      extraWeightKg,
    });

    order.trackingNumber = result.trackingNumber;
    order.dhlShipment = {
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
      dispatchConfirmationNumber: result.dispatchConfirmationNumber,
      createdAt: new Date(),
      status: "created",
      lastError: undefined,
      documents: result.documents.map((doc) => ({
        typeCode: doc.typeCode,
        imageFormat: doc.imageFormat,
        contentBase64: doc.contentBase64,
      })),
    };

    if (order.status === "paid" || order.status === "new") {
      order.status = "ready_for_pickup";
    }

    await order.save();

    return {
      success: true,
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("createShipmentForOrder error:", message);

    order.set("dhlShipment", {
      trackingNumber: order.dhlShipment?.trackingNumber,
      trackingUrl: order.dhlShipment?.trackingUrl,
      dispatchConfirmationNumber: order.dhlShipment?.dispatchConfirmationNumber,
      documents: order.dhlShipment?.documents ?? [],
      status: "failed",
      lastError: message,
      createdAt: new Date(),
    });
    await order.save();

    return { success: false, error: message };
  }
}

/** Best-effort auto-create after payment — never throws. */
export async function tryCreateShipmentAfterPayment(
  orderNumber: string,
): Promise<void> {
  try {
    const result = await createShipmentForOrder(orderNumber);
    if (!result.success) {
      console.error(
        `Auto DHL shipment failed for ${orderNumber}:`,
        result.error,
      );
    } else if (result.skipped) {
      console.info(
        `Auto DHL shipment skipped for ${orderNumber}:`,
        result.reason,
      );
    } else {
      console.info(
        `Auto DHL shipment created for ${orderNumber}:`,
        result.trackingNumber,
      );
    }
  } catch (error) {
    console.error(`Auto DHL shipment unexpected error for ${orderNumber}:`, error);
  }
}

export async function getOrderLabelDocument(
  orderIdOrNumber: string,
  typeCode: "label" | "invoice" = "label",
): Promise<
  | { success: true; imageFormat: string; contentBase64: string; orderNumber: string }
  | { success: false; error: string; status: number }
> {
  await connectDB();

  const order = await Order.findOne({
    $or: [
      { orderNumber: orderIdOrNumber },
      ...(orderIdOrNumber.match(/^[a-f\d]{24}$/i)
        ? [{ _id: orderIdOrNumber }]
        : []),
    ],
  })
    .select("orderNumber dhlShipment")
    .lean<{
      orderNumber: string;
      dhlShipment?: {
        documents?: Array<{
          typeCode?: string;
          imageFormat?: string;
          contentBase64?: string;
        }>;
      };
    } | null>();

  if (!order) {
    return { success: false, error: "Order not found.", status: 404 };
  }

  const documents = order.dhlShipment?.documents ?? [];
  const doc =
    documents.find((d) => d.typeCode === typeCode && d.contentBase64) ??
    documents.find((d) => d.typeCode === "label" && d.contentBase64);

  if (!doc?.contentBase64) {
    return {
      success: false,
      error: "No shipping label stored for this order yet.",
      status: 404,
    };
  }

  return {
    success: true,
    imageFormat: doc.imageFormat || "PDF",
    contentBase64: doc.contentBase64,
    orderNumber: order.orderNumber,
  };
}
