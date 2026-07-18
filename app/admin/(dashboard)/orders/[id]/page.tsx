import { CreateShipmentButton } from "@/components/admin/CreateShipmentButton";
import { OrderAdminForm } from "@/components/admin/OrderAdminForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getOrderById } from "@/services/order.service";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const shippingMethod = order.shippingMethod;
  const dhlShipment = order.dhlShipment;

  const hasLabel = Boolean(
    dhlShipment?.documents?.some((d) => d.typeCode === "label"),
  );
  const hasInvoice = Boolean(
    dhlShipment?.documents?.some((d) => d.typeCode === "invoice"),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-stone-500 hover:text-stone-800"
          >
            ← Orders
          </Link>
          <h2 className="mt-2 text-2xl font-medium text-stone-900">
            {order.orderNumber}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-wider text-stone-400 uppercase">Total</p>
          <p className="mt-1 text-xl font-medium text-stone-900">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">Customer</h3>
          <dl className="mt-3 space-y-2 text-sm text-stone-600">
            <div>
              <dt className="text-xs text-stone-400">Name</dt>
              <dd>{order.customer.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Email</dt>
              <dd>{order.customer.email}</dd>
            </div>
            {order.customer.phone && (
              <div>
                <dt className="text-xs text-stone-400">Phone</dt>
                <dd>{order.customer.phone}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">Shipping address</h3>
          {order.shippingAddress ? (
            <address className="mt-3 text-sm text-stone-600 not-italic">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              ) : null}
              <br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
              <br />
              {order.shippingAddress.country}
            </address>
          ) : (
            <p className="mt-3 text-sm text-stone-500">No address on file.</p>
          )}
        </section>
      </div>

      <section className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="text-sm font-medium text-stone-900">Items</h3>
        <ul className="mt-3 divide-y divide-stone-100">
          {order.items.map((item, index) => (
            <li
              key={`${item.snapshot?.name ?? "item"}-${index}`}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-stone-700">
                {item.snapshot?.name ?? "Item"}
                {item.quantity > 1 ? ` × ${item.quantity}` : ""}
              </span>
              <span className="text-stone-900">
                {formatPrice(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Shipping</span>
            <span>{formatPrice(order.shippingTotal ?? 0)}</span>
          </div>
          <div className="flex justify-between font-medium text-stone-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="text-sm font-medium text-stone-900">Order management</h3>
        <div className="mt-4">
          <OrderAdminForm
            orderId={String(order._id)}
            status={order.status}
            paymentStatus={order.paymentStatus}
            trackingNumber={order.trackingNumber}
            internalNotes={order.internalNotes}
          />
        </div>
      </section>

      <section className="rounded-sm border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-stone-900">DHL Express</h3>
            <p className="mt-1 text-xs text-stone-500">
              Labels are created automatically after payment when live DHL
              credentials and a real product code are available.
            </p>
          </div>
          {order.paymentStatus === "paid" && (
            <CreateShipmentButton
              orderId={String(order._id)}
              label={
                dhlShipment?.status === "created"
                  ? "Recreate shipment"
                  : "Create DHL shipment"
              }
              force={dhlShipment?.status === "created"}
            />
          )}
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-stone-400">Method</dt>
            <dd className="text-stone-700">
              {shippingMethod?.productName || "—"}
              {shippingMethod?.productCode
                ? ` (${shippingMethod.productCode})`
                : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-stone-400">Rate source</dt>
            <dd className="text-stone-700">{shippingMethod?.source || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-400">Shipment status</dt>
            <dd className="text-stone-700">
              {dhlShipment?.status ? (
                <StatusBadge status={dhlShipment.status} />
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-stone-400">Tracking</dt>
            <dd className="text-stone-700">
              {order.trackingNumber || dhlShipment?.trackingNumber || "—"}
              {dhlShipment?.trackingUrl && (
                <>
                  {" · "}
                  <a
                    href={dhlShipment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    Track
                  </a>
                </>
              )}
            </dd>
          </div>
        </dl>

        {dhlShipment?.lastError && (
          <p className="mt-4 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {dhlShipment.lastError}
          </p>
        )}

        {(hasLabel || hasInvoice) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {hasLabel && (
              <a
                href={`/api/admin/orders/${order._id}/label?type=label`}
                className="rounded-sm border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-800 hover:border-stone-500"
              >
                Download label PDF
              </a>
            )}
            {hasInvoice && (
              <a
                href={`/api/admin/orders/${order._id}/label?type=invoice`}
                className="rounded-sm border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-800 hover:border-stone-500"
              >
                Download invoice PDF
              </a>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
