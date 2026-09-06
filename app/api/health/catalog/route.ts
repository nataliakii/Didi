import { isDbConfigured, safeConnectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Lightweight catalog/DB probe for production debugging.
 * Does not expose credentials or document contents.
 */
export async function GET() {
  const configured = isDbConfigured();
  if (!configured) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        connected: false,
        productCount: 0,
        error: "MONGODB_URI is not set.",
      },
      { status: 503 },
    );
  }

  const db = await safeConnectDB();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        connected: false,
        productCount: 0,
        dbName: process.env.MONGODB_DB || "di-di-jewellery",
        error: "Could not connect to MongoDB.",
      },
      { status: 503 },
    );
  }

  try {
    const [productCount, publishedCount] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ status: "published" }),
    ]);

    return NextResponse.json({
      ok: publishedCount > 0,
      configured: true,
      connected: true,
      dbName: db.connection.name,
      productCount,
      publishedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        connected: true,
        productCount: 0,
        error: error instanceof Error ? error.message : "Query failed.",
      },
      { status: 500 },
    );
  }
}
