import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|el|de|fr|it|es|ru)/:path*",
    "/((?!api|admin|feeds|_next|_vercel|icon|apple-icon|favicon|.*\\..*).*)",
  ],
};
