import {
  REVIEW_PRODUCT_TYPES,
  REVIEW_STATUSES,
} from "@/constants/reviews";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    locale: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, required: true, trim: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    productType: { type: String, enum: REVIEW_PRODUCT_TYPES },
    status: {
      type: String,
      enum: REVIEW_STATUSES,
      default: "pending",
      required: true,
    },
    verifiedPurchase: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

reviewSchema.index({ status: 1, publishedAt: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ customerId: 1 });
reviewSchema.index({ orderId: 1 });

export type ReviewDocument = InferSchemaType<typeof reviewSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Review = models.Review || model("Review", reviewSchema);
