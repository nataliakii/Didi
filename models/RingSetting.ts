import {
  DIAMOND_SHAPES,
  METALS,
  PRODUCT_STATUSES,
  RING_STYLES,
} from "@/constants/jewellery";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const ringSettingImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const ringSettingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    style: { type: String, enum: RING_STYLES, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    description: { type: String },
    images: [ringSettingImageSchema],
    availableMetals: [{ type: String, enum: METALS }],
    compatibleDiamondShapes: [{ type: String, enum: DIAMOND_SHAPES }],
    minRingSize: { type: String, default: "3" },
    maxRingSize: { type: String, default: "11" },
    productionTime: { type: String },
    status: { type: String, enum: PRODUCT_STATUSES, default: "draft" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ringSettingSchema.index({ style: 1 });
ringSettingSchema.index({ status: 1 });
ringSettingSchema.index({ compatibleDiamondShapes: 1 });
ringSettingSchema.index({ isFeatured: 1 });

export type RingSettingDocument = InferSchemaType<typeof ringSettingSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const RingSetting =
  models.RingSetting || model("RingSetting", ringSettingSchema);
