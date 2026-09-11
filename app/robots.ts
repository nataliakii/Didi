import { getBaseUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/feeds/", "/feeds/openai-products"],
        disallow: ["/admin", "/admin/", "/api", "/api/", "/*/cart"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: ["/", "/feeds/", "/feeds/openai-products"],
        disallow: ["/admin", "/admin/", "/api", "/api/", "/*/cart"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/feeds/", "/feeds/openai-products"],
        disallow: ["/admin", "/admin/", "/api", "/api/", "/*/cart"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/feeds/", "/feeds/openai-products"],
        disallow: ["/admin", "/admin/", "/api", "/api/", "/*/cart"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
