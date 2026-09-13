import { USER_ROLES } from "@/constants/order-status";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const addressSchema = new Schema(
  {
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, uppercase: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: "customer" },
    isActive: { type: Boolean, default: true },
    phone: { type: String, trim: true },
    shippingAddress: { type: addressSchema },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const User = models.User || model("User", userSchema);
