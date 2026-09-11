import {
  buildOpenAIProductFeedItems,
  toOpenAIProductFeedJsonl,
} from "@/lib/openai-product-feed";
import { getPublishedProductsForFeed } from "@/services/product.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * OpenAI Agentic Commerce (ACP) product discovery feed.
 * JSONL by default (one product/variant per line). Use ?format=json for an array.
 *
 * Submit this URL during OpenAI merchant onboarding:
 *   https://<your-domain>/feeds/openai-products
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "json" ? "json" : "jsonl";

  const products = await getPublishedProductsForFeed();
  const items = buildOpenAIProductFeedItems(products);

  if (format === "json") {
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
        "X-Product-Count": String(items.length),
      },
    });
  }

  return new NextResponse(toOpenAIProductFeedJsonl(items), {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      "X-Product-Count": String(items.length),
      "Content-Disposition":
        'inline; filename="asteria-openai-products.jsonl"',
    },
  });
}
