import {
  previewOrderPaidEmailHtml,
  previewOrderUpdateEmailHtml,
} from "@/lib/order-emails";

const sampleOrder = {
  orderNumber: "ORD-DEMO-001",
  customer: {
    name: "Elena Papadopoulos",
    email: "elena@example.com",
  },
  items: [
    {
      quantity: 1,
      totalPrice: 1290,
      snapshot: { name: "Oval Solitaire Diamond Ring" },
    },
    {
      quantity: 1,
      totalPrice: 12,
      snapshot: { name: "DHL Express (domestic)" },
    },
  ],
  subtotal: 1290,
  shippingTotal: 12,
  total: 1302,
  currency: "EUR",
  status: "in_production",
  trackingNumber: "",
  promisedDeliveryDate: "2026-09-28",
  productionEta: "2026-09-20",
  timelineNotes: "Custom sizing adds about one week.",
  shippingMethod: {
    productName: "DHL Express (estimated domestic)",
    estimatedDelivery: "2–4 working days after dispatch",
  },
};

export default function AdminEmailPreviewsPage() {
  const paidHtml = previewOrderPaidEmailHtml({
    ...sampleOrder,
    status: "paid",
    items: [
      {
        quantity: 1,
        totalPrice: 1290,
        snapshot: { name: "Oval Solitaire Diamond Ring" },
      },
    ],
    shippingTotal: 12,
    total: 1302,
  });

  const updateHtml = previewOrderUpdateEmailHtml({
    ...sampleOrder,
    trackingNumber: "JD014600005234567890",
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Email previews</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          These are the branded customer emails Asteria sends after payment and
          when you update an order in admin. Sample data only — nothing is sent
          from this page.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide text-stone-500 uppercase">
          Order confirmed (after payment)
        </h3>
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
          <iframe
            title="Order confirmed email preview"
            srcDoc={paidHtml}
            className="h-[720px] w-full bg-white"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium tracking-wide text-stone-500 uppercase">
          Order update (status / delivery dates / tracking)
        </h3>
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
          <iframe
            title="Order update email preview"
            srcDoc={updateHtml}
            className="h-[640px] w-full bg-white"
          />
        </div>
      </section>
    </div>
  );
}
