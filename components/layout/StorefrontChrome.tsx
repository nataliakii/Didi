import { CartProvider } from "@/components/cart/CartProvider";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { ContentProtection } from "@/components/security/ContentProtection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CONTENT_PROTECTION_ENABLED } from "@/constants/site";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

/** Storefront chrome isolated so Coming Soon layout can skip Header/Cart entirely. */
export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <VisitTracker />
        {CONTENT_PROTECTION_ENABLED ? <ContentProtection /> : null}
        <div
          className={cn(
            "flex min-h-full flex-col",
            CONTENT_PROTECTION_ENABLED && "storefront-protect",
          )}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CartProvider>
    </SessionProvider>
  );
}
