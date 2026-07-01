import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|fr|de|es|it|nl|pt|pl|el|uk)/:path*",
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};
