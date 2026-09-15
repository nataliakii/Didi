import { config as loadEnv } from "dotenv";
import mongoose from "mongoose";

const envFile = process.argv[2] === "--env" ? process.argv[3] : ".env.local";
loadEnv({ path: envFile });
if (envFile !== ".env") {
  loadEnv();
}

import { connectDB } from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { Diamond } from "@/models/Diamond";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

const NON_IGI_LAB = {
  $exists: true,
  $type: "string",
  $nin: ["IGI", ""],
} as const;

function hostFromUri(uri?: string): string {
  if (!uri) return "(none)";
  try {
    return (
      new URL(
        uri.replace(/^mongodb\+srv:/i, "http:").replace(/^mongodb:/i, "http:"),
      ).hostname || "(unknown)"
    );
  } catch {
    return "(unknown)";
  }
}

async function labCounts(
  collection: mongoose.Collection,
  field: string,
): Promise<Record<string, number>> {
  const rows = await collection
    .aggregate<{ _id: string | null; count: number }>([
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray();

  return Object.fromEntries(
    rows.map((row) => [row._id ?? "(none)", row.count]),
  );
}

async function run() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log(
    `Host: ${hostFromUri(process.env.MONGODB_URI)} / ${process.env.MONGODB_DB || "di-di-jewellery"}`,
  );

  console.log("Diamonds labs before:", await labCounts(Diamond.collection, "certification.lab"));
  console.log(
    "Products labs before:",
    await labCounts(Product.collection, "attributes.certification.lab"),
  );

  const diamonds = await Diamond.collection.updateMany(
    { "certification.lab": NON_IGI_LAB },
    { $set: { "certification.lab": "IGI" } },
  );
  const products = await Product.collection.updateMany(
    { "attributes.certification.lab": NON_IGI_LAB },
    { $set: { "attributes.certification.lab": "IGI" } },
  );
  const appointments = await Appointment.collection.updateMany(
    { "diamondSnapshot.certification.lab": NON_IGI_LAB },
    { $set: { "diamondSnapshot.certification.lab": "IGI" } },
  );
  const customRingAppointments = await Appointment.collection.updateMany(
    { "customRingSnapshot.diamond.certification.lab": NON_IGI_LAB },
    { $set: { "customRingSnapshot.diamond.certification.lab": "IGI" } },
  );
  const orders = await Order.collection.updateMany(
    { "items.snapshot.diamondDetails.gradingReport.lab": NON_IGI_LAB },
    { $set: { "items.$[item].snapshot.diamondDetails.gradingReport.lab": "IGI" } },
    {
      arrayFilters: [
        { "item.snapshot.diamondDetails.gradingReport.lab": NON_IGI_LAB },
      ],
    },
  );

  console.log(`Diamonds updated: ${diamonds.modifiedCount}`);
  console.log(`Products updated: ${products.modifiedCount}`);
  console.log(`Appointment diamond snapshots updated: ${appointments.modifiedCount}`);
  console.log(
    `Appointment custom-ring snapshots updated: ${customRingAppointments.modifiedCount}`,
  );
  console.log(`Orders updated: ${orders.modifiedCount}`);

  console.log("Diamonds labs after:", await labCounts(Diamond.collection, "certification.lab"));
  console.log(
    "Products labs after:",
    await labCounts(Product.collection, "attributes.certification.lab"),
  );

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
