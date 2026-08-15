import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Storefront chrome isolated so Coming Soon layout can skip Header/Cart entirely. */
export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
