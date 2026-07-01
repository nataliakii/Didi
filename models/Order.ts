import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/constants/order-status";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const orderItemSnapshotSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [
      {
        url: { type: String },
        alt: { type: String },
        isPrimary: { type: Boolean },
      },
    ],
    selectedOptions: { type: Map, of: String },
    diamondDetails: {
      shape: { type: String },
      carat: { type: Number },
      cut: { type: String },
      color: { type: String },
      clarity: { type: String },
      gradingReport: {
        lab: { type: String },
        reportNumber: { type: String },
      },
    },
    settingDetails: {
      name: { type: String },
      style: { type: String },
      metal: { type: String },
      ringSize: { type: String },
    },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    itemType: {
      type: String,
      enum: ["product", "diamond", "custom-ring"],
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    diamondId: { type: Schema.Types.ObjectId, ref: "Diamond" },
    customRingId: { type: Schema.Types.ObjectId, ref: "CustomRing" },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    snapshot: { type: orderItemSnapshotSchema, required: true },
  },
  { _id: false },
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false },
);

const addressSchema = new Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: customerSchema, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    shippingTotal: { type: Number, default: 0, min: 0 },
    taxTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ORDER_STATUSES, default: "new" },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending" },
    stripeCheckoutSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    internalNotes: { type: String },
    trackingNumber: { type: String },
  },
  { timestamps: true },
);

orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ "customer.email": 1 });
orderSchema.index({ createdAt: -1 });

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Order = models.Order || model("Order", orderSchema);
