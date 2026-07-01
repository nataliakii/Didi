import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
} from "@/constants/order-status";
import { METALS } from "@/constants/jewellery";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const productSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    productType: { type: String },
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    image: { type: String },
  },
  { _id: false },
);

const settingSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    style: { type: String },
    basePrice: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false },
);

const diamondSnapshotSchema = new Schema(
  {
    id: { type: String, required: true },
    diamondType: { type: String },
    shape: { type: String, required: true },
    carat: { type: Number, required: true },
    cut: { type: String },
    color: { type: String },
    clarity: { type: String },
    price: { type: Number, required: true },
    certification: {
      lab: { type: String },
      reportNumber: { type: String },
      reportUrl: { type: String },
      certificateFileUrl: { type: String },
    },
  },
  { _id: false },
);

const customRingSnapshotSchema = new Schema(
  {
    settingId: { type: String, required: true },
    diamondId: { type: String, required: true },
    selectedMetal: { type: String, required: true },
    ringSize: { type: String, required: true },
    estimatedPrice: { type: Number, required: true },
    setting: { type: settingSnapshotSchema, required: true },
    diamond: { type: diamondSnapshotSchema, required: true },
  },
  { _id: false },
);

const appointmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    appointmentType: { type: String, enum: APPOINTMENT_TYPES, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    budget: { type: String },
    message: { type: String },
    status: { type: String, enum: APPOINTMENT_STATUSES, default: "requested" },
    locale: { type: String, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    settingId: { type: Schema.Types.ObjectId, ref: "RingSetting" },
    diamondId: { type: Schema.Types.ObjectId, ref: "Diamond" },
    selectedMetal: { type: String, enum: METALS },
    ringSize: { type: String },
    estimatedPrice: { type: Number },
    productSnapshot: { type: productSnapshotSchema },
    settingSnapshot: { type: settingSnapshotSchema },
    diamondSnapshot: { type: diamondSnapshotSchema },
    customRingSnapshot: { type: customRingSnapshotSchema },
    internalNotes: { type: String },
  },
  { timestamps: true },
);

appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentType: 1 });
appointmentSchema.index({ preferredDate: 1 });
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ createdAt: -1 });

export type AppointmentDocument = InferSchemaType<typeof appointmentSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Appointment =
  models.Appointment || model("Appointment", appointmentSchema);
