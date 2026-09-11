import { BRAND_NAME } from "@/constants/brand";
import { BRAND_CONTACT } from "@/constants/contact";
import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/constants/order-status";
import {
  emailDetailsTable,
  escapeEmailHtml,
  renderBrandedEmailHtml,
} from "@/lib/email-layout";
import { getNotifyEmail, isEmailConfigured, sendMail } from "@/lib/email";
import { formatPrice } from "@/lib/utils";

export type OrderEmailItem = {
  name: string;
  quantity: number;
  totalPrice: number;
};

export type OrderEmailPayload = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingTotal: number;
  total: number;
  currency?: string;
  status: string;
  trackingNumber?: string;
  promisedDeliveryDate?: Date | string | null;
  productionEta?: Date | string | null;
  timelineNotes?: string | null;
  shippingSummary?: string | null;
};

function formatLongDate(value?: Date | string | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toDateInputValue(value?: Date | string | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function toOrderEmailDateInput(value?: Date | string | null): string {
  return toDateInputValue(value);
}

function money(amount: number, currency = "EUR"): string {
  return formatPrice(amount, currency, "en-GB");
}

function statusLabel(status: string): string {
  if (status in ORDER_STATUS_LABELS) {
    return ORDER_STATUS_LABELS[status as OrderStatus];
  }
  return status;
}

function itemsHtml(items: OrderEmailItem[], currency: string): string {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #EEE7DB;font-size:14px;">${escapeEmailHtml(item.name)}${item.quantity > 1 ? ` × ${item.quantity}` : ""}</td>
          <td style="padding:10px 0;border-bottom:1px solid #EEE7DB;font-size:14px;text-align:right;">${escapeEmailHtml(money(item.totalPrice, currency))}</td>
        </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;border-collapse:collapse;">${rows}</table>`;
}

function itemsText(items: OrderEmailItem[], currency: string): string {
  return items
    .map(
      (item) =>
        `• ${item.name}${item.quantity > 1 ? ` × ${item.quantity}` : ""} — ${money(item.totalPrice, currency)}`,
    )
    .join("\n");
}

function timelineRows(order: OrderEmailPayload): Array<{ label: string; value: string }> {
  return [
    {
      label: "Promised delivery",
      value: formatLongDate(order.promisedDeliveryDate),
    },
    {
      label: "Production ready by",
      value: formatLongDate(order.productionEta),
    },
    {
      label: "Timeline note",
      value: order.timelineNotes?.trim() || "",
    },
    {
      label: "Shipping",
      value: order.shippingSummary?.trim() || "",
    },
    {
      label: "Tracking",
      value: order.trackingNumber?.trim() || "",
    },
  ];
}

function buildOrderEmailPayloadFromLean(order: {
  orderNumber: string;
  customer: { name: string; email: string };
  items?: Array<{
    quantity: number;
    totalPrice: number;
    snapshot?: { name?: string } | null;
  }>;
  subtotal: number;
  shippingTotal?: number;
  total: number;
  currency?: string;
  status: string;
  trackingNumber?: string;
  promisedDeliveryDate?: Date | string | null;
  productionEta?: Date | string | null;
  timelineNotes?: string | null;
  shippingMethod?: { productName?: string; estimatedDelivery?: string } | null;
}): OrderEmailPayload {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    items: (order.items ?? []).map((item) => ({
      name: item.snapshot?.name || "Item",
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    })),
    subtotal: order.subtotal,
    shippingTotal: order.shippingTotal ?? 0,
    total: order.total,
    currency: order.currency || "EUR",
    status: order.status,
    trackingNumber: order.trackingNumber,
    promisedDeliveryDate: order.promisedDeliveryDate,
    productionEta: order.productionEta,
    timelineNotes: order.timelineNotes,
    shippingSummary: order.shippingMethod?.productName
      ? `${order.shippingMethod.productName}${
          order.shippingMethod.estimatedDelivery
            ? ` · ${order.shippingMethod.estimatedDelivery}`
            : ""
        }`
      : order.shippingMethod?.estimatedDelivery || null,
  };
}

export async function sendOrderPaidEmails(order: Parameters<
  typeof buildOrderEmailPayloadFromLean
>[0]): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(
      "[order-email] Skipped paid confirmation — SMTP not configured:",
      order.orderNumber,
    );
    return;
  }

  const payload = buildOrderEmailPayloadFromLean(order);
  const currency = payload.currency || "EUR";
  const notifyTo = getNotifyEmail();

  const customerBodyHtml = `
    <p style="margin:0 0 16px;">Dear ${escapeEmailHtml(payload.customerName)},</p>
    <p style="margin:0 0 16px;">Thank you for your order with ${escapeEmailHtml(BRAND_NAME)}. Payment has been received and your piece is now with our atelier team.</p>
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5C6B7A;">Order ${escapeEmailHtml(payload.orderNumber)}</p>
    ${itemsHtml(payload.items, currency)}
    ${emailDetailsTable([
      { label: "Subtotal", value: money(payload.subtotal, currency) },
      { label: "Shipping", value: money(payload.shippingTotal, currency) },
      { label: "Total paid", value: money(payload.total, currency) },
      ...timelineRows(payload),
    ])}
    <p style="margin:0;">We will write again when your order moves into production or ships. If you have any questions, simply reply to this email.</p>
  `;

  const customerText = [
    `Dear ${payload.customerName},`,
    "",
    `Thank you for your order with ${BRAND_NAME}. Payment has been received.`,
    "",
    `Order ${payload.orderNumber}`,
    itemsText(payload.items, currency),
    "",
    `Subtotal: ${money(payload.subtotal, currency)}`,
    `Shipping: ${money(payload.shippingTotal, currency)}`,
    `Total paid: ${money(payload.total, currency)}`,
    formatLongDate(payload.promisedDeliveryDate)
      ? `Promised delivery: ${formatLongDate(payload.promisedDeliveryDate)}`
      : null,
    formatLongDate(payload.productionEta)
      ? `Production ready by: ${formatLongDate(payload.productionEta)}`
      : null,
    "",
    "With care,",
    BRAND_NAME,
    BRAND_CONTACT.email,
  ]
    .filter(Boolean)
    .join("\n");

  const houseText = [
    `Order paid: ${payload.orderNumber}`,
    `Customer: ${payload.customerName} <${payload.customerEmail}>`,
    `Total: ${money(payload.total, currency)}`,
    "",
    itemsText(payload.items, currency),
  ].join("\n");

  const [customerResult, houseResult] = await Promise.all([
    sendMail({
      to: payload.customerEmail,
      subject: `Order confirmed — ${payload.orderNumber} | ${BRAND_NAME}`,
      text: customerText,
      html: renderBrandedEmailHtml({
        preheader: `Payment received for order ${payload.orderNumber}.`,
        title: "Your order is confirmed",
        bodyHtml: customerBodyHtml,
      }),
      replyTo: notifyTo,
    }),
    sendMail({
      to: notifyTo,
      subject: `Paid order ${payload.orderNumber} — ${payload.customerName}`,
      text: houseText,
      replyTo: payload.customerEmail,
    }),
  ]);

  if (!customerResult.sent) {
    console.error("[order-email] Paid customer email failed:", customerResult.reason);
  }
  if (!houseResult.sent) {
    console.error("[order-email] Paid house email failed:", houseResult.reason);
  }
}

export async function sendOrderUpdateEmail(
  order: Parameters<typeof buildOrderEmailPayloadFromLean>[0],
  options?: { reason?: string },
): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(
      "[order-email] Skipped update — SMTP not configured:",
      order.orderNumber,
    );
    return;
  }

  const payload = buildOrderEmailPayloadFromLean(order);
  const currency = payload.currency || "EUR";
  const notifyTo = getNotifyEmail();
  const reason = options?.reason?.trim();

  const customerBodyHtml = `
    <p style="margin:0 0 16px;">Dear ${escapeEmailHtml(payload.customerName)},</p>
    <p style="margin:0 0 16px;">We have an update on your ${escapeEmailHtml(BRAND_NAME)} order <strong>${escapeEmailHtml(payload.orderNumber)}</strong>.</p>
    ${reason ? `<p style="margin:0 0 16px;">${escapeEmailHtml(reason)}</p>` : ""}
    ${emailDetailsTable([
      { label: "Status", value: statusLabel(payload.status) },
      { label: "Total", value: money(payload.total, currency) },
      ...timelineRows(payload),
    ])}
    <p style="margin:0;">Reply to this email anytime — we are here to help.</p>
  `;

  const customerText = [
    `Dear ${payload.customerName},`,
    "",
    `Update on order ${payload.orderNumber}.`,
    reason || null,
    `Status: ${statusLabel(payload.status)}`,
    formatLongDate(payload.promisedDeliveryDate)
      ? `Promised delivery: ${formatLongDate(payload.promisedDeliveryDate)}`
      : null,
    formatLongDate(payload.productionEta)
      ? `Production ready by: ${formatLongDate(payload.productionEta)}`
      : null,
    payload.trackingNumber ? `Tracking: ${payload.trackingNumber}` : null,
    payload.timelineNotes ? `Note: ${payload.timelineNotes}` : null,
    "",
    "With care,",
    BRAND_NAME,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendMail({
    to: payload.customerEmail,
    subject: `Order update — ${payload.orderNumber} | ${BRAND_NAME}`,
    text: customerText,
    html: renderBrandedEmailHtml({
      preheader: `Order ${payload.orderNumber} is now ${statusLabel(payload.status)}.`,
      title: "Order update",
      bodyHtml: customerBodyHtml,
    }),
    replyTo: notifyTo,
  });

  if (!result.sent) {
    console.error("[order-email] Update email failed:", result.reason);
  }
}

/** Preview helpers for admin (HTML only). */
export function previewOrderPaidEmailHtml(
  order: Parameters<typeof buildOrderEmailPayloadFromLean>[0],
): string {
  const payload = buildOrderEmailPayloadFromLean(order);
  const currency = payload.currency || "EUR";
  return renderBrandedEmailHtml({
    preheader: `Payment received for order ${payload.orderNumber}.`,
    title: "Your order is confirmed",
    bodyHtml: `
      <p style="margin:0 0 16px;">Dear ${escapeEmailHtml(payload.customerName)},</p>
      <p style="margin:0 0 16px;">Thank you for your order with ${escapeEmailHtml(BRAND_NAME)}. Payment has been received and your piece is now with our atelier team.</p>
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5C6B7A;">Order ${escapeEmailHtml(payload.orderNumber)}</p>
      ${itemsHtml(payload.items, currency)}
      ${emailDetailsTable([
        { label: "Subtotal", value: money(payload.subtotal, currency) },
        { label: "Shipping", value: money(payload.shippingTotal, currency) },
        { label: "Total paid", value: money(payload.total, currency) },
        ...timelineRows(payload),
      ])}
      <p style="margin:0;">We will write again when your order moves into production or ships.</p>
    `,
  });
}

export function previewOrderUpdateEmailHtml(
  order: Parameters<typeof buildOrderEmailPayloadFromLean>[0],
): string {
  const payload = buildOrderEmailPayloadFromLean(order);
  const currency = payload.currency || "EUR";
  return renderBrandedEmailHtml({
    preheader: `Order ${payload.orderNumber} is now ${statusLabel(payload.status)}.`,
    title: "Order update",
    bodyHtml: `
      <p style="margin:0 0 16px;">Dear ${escapeEmailHtml(payload.customerName)},</p>
      <p style="margin:0 0 16px;">We have an update on your order <strong>${escapeEmailHtml(payload.orderNumber)}</strong>.</p>
      ${emailDetailsTable([
        { label: "Status", value: statusLabel(payload.status) },
        { label: "Total", value: money(payload.total, currency) },
        ...timelineRows(payload),
      ])}
    `,
  });
}
