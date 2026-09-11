import { Schema, model, models, type InferSchemaType } from "mongoose";

const siteVisitSchema = new Schema(
  {
    ip: { type: String, required: true, trim: true, index: true },
    locale: { type: String, required: true, trim: true, lowercase: true, index: true },
    path: { type: String, required: true, trim: true, index: true },
    referer: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    country: { type: String, trim: true, uppercase: true },
    visitorId: { type: String, trim: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

siteVisitSchema.index({ createdAt: -1 });
/** Keep visit history for ~180 days. */
siteVisitSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 180 },
);

export type SiteVisitDocument = InferSchemaType<typeof siteVisitSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
};

export const SiteVisit =
  models.SiteVisit || model("SiteVisit", siteVisitSchema);
