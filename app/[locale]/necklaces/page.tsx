import { createJewelryCategoryPage } from "@/lib/seo-landing-pages";

const page = createJewelryCategoryPage("necklaces");
export const generateMetadata = page.generateMetadata;
export default page.Page;
