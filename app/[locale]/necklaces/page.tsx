import { createJewelryCategoryPage } from "@/lib/seo-landing-pages";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const page = createJewelryCategoryPage("necklaces");
export const generateMetadata = page.generateMetadata;
export default page.Page;
