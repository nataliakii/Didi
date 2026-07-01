import {
  AVAILABILITY_STATUSES,
  DIAMOND_CLARITY,
  DIAMOND_COLORS,
  DIAMOND_CUTS,
  DIAMOND_SHAPES,
  DIAMOND_TYPES,
} from "@/constants/jewellery";
import { CERTIFICATION_LABS } from "@/constants/certification";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const diamondImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const certificationSchema = new Schema(
  {
    lab: { type: String, enum: CERTIFICATION_LABS },
    reportNumber: { type: String, trim: true },
    reportUrl: { type: String },
    certificateFileUrl: { type: String },
  },
  { _id: false },
);

const diamondSchema = new Schema(
  {
    diamondType: { type: String, enum: DIAMOND_TYPES, required: true },
    shape: { type: String, enum: DIAMOND_SHAPES, required: true },
    carat: { type: Number, required: true, min: 0 },
    cut: { type: String, enum: DIAMOND_CUTS, required: true },
    color: { type: String, enum: DIAMOND_COLORS, required: true },
    clarity: { type: String, enum: DIAMOND_CLARITY, required: true },
    polish: { type: String },
    symmetry: { type: String },
    fluorescence: { type: String },
    certification: { type: certificationSchema, default: () => ({}) },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    images: [diamondImageSchema],
    availabilityStatus: {
      type: String,
      enum: AVAILABILITY_STATUSES,
      default: "in-stock",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

diamondSchema.index({ diamondType: 1 });
diamondSchema.index({ shape: 1 });
diamondSchema.index({ carat: 1 });
diamondSchema.index({ price: 1 });
diamondSchema.index({ color: 1 });
diamondSchema.index({ clarity: 1 });
diamondSchema.index({ cut: 1 });
diamondSchema.index({ isActive: 1 });
diamondSchema.index({ "certification.lab": 1 });

export type DiamondDocument = InferSchemaType<typeof diamondSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Diamond = models.Diamond || model("Diamond", diamondSchema);
