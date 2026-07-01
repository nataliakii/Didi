import { Schema, model, models, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "Category" },
    seoTitle: { type: String },
    seoDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.index({ isActive: 1 });
categorySchema.index({ parentId: 1 });

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Category = models.Category || model("Category", categorySchema);
