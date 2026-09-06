import { createJewelryCategoryPage } from "@/lib/seo-landing-pages";

/** Keep catalog landings fresh after seed / admin publishes. */
export const dynamic = "force-dynamic";
export const revalidate = 60;

const page = createJewelryCategoryPage("rings");
export const generateMetadata = page.generateMetadata;
export default page.Page;
