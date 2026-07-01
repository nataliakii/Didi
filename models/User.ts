import { USER_ROLES } from "@/constants/order-status";
import { Schema, model, models, type InferSchemaType } from "mongoose";

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
    role: { type: String, enum: USER_ROLES, default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const User = models.User || model("User", userSchema);
