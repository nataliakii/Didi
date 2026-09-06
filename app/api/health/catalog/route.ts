import { isDbConfigured, safeConnectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function mongoHostFromUri(uri?: string): string | null {
  if (!uri?.trim()) return null;
  try {
    const normalized = uri
      .trim()
      .replace(/^mongodb\+srv:/i, "http:")
      .replace(/^mongodb:/i, "http:");
    return new URL(normalized).hostname || null;
  } catch {
    const match = uri.match(/@([^/?]+)/);
    return match?.[1] ?? null;
  }
}

/**
 * Lightweight catalog/DB probe for production debugging.
 * Does not expose credentials or document contents.
 */
export async function GET() {
  const configured = isDbConfigured();
  const host = mongoHostFromUri(process.env.MONGODB_URI);
  const configuredDbName = process.env.MONGODB_DB || "di-di-jewellery";

  if (!configured) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        connected: false,
        host,
        dbName: configuredDbName,
        productCount: 0,
        publishedCount: 0,
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
        host,
        dbName: configuredDbName,
        productCount: 0,
        publishedCount: 0,
        error: "Could not connect to MongoDB.",
      },
      { status: 503 },
    );
  }

  try {
    const native = db.connection.db;
    const [productCount, publishedCount, nativePublished] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ status: "published" }),
      native
        ? native.collection("products").countDocuments({ status: "published" })
        : Promise.resolve(0),
    ]);

    let siblingDatabases: Array<{ db: string; published: number }> = [];
    try {
      if (native) {
        const { databases } = await native.admin().listDatabases();
        siblingDatabases = [];
        for (const entry of databases) {
          if (entry.name === "admin" || entry.name === "local") continue;
          const sibling = db.connection.getClient().db(entry.name);
          const published = await sibling
            .collection("products")
            .countDocuments({ status: "published" })
            .catch(() => 0);
          siblingDatabases.push({ db: entry.name, published });
        }
        siblingDatabases.sort((a, b) => a.db.localeCompare(b.db));
      }
    } catch {
      siblingDatabases = [];
    }

    return NextResponse.json({
      ok: publishedCount > 0,
      configured: true,
      connected: true,
      host,
      dbName: db.connection.name,
      productCount,
      publishedCount,
      nativePublished,
      siblingDatabases,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        connected: true,
        host,
        dbName: db.connection.name,
        productCount: 0,
        publishedCount: 0,
        error: error instanceof Error ? error.message : "Query failed.",
      },
      { status: 500 },
    );
  }
}
