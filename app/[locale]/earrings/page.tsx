import { createJewelryCategoryPage } from "@/lib/seo-landing-pages";

const page = createJewelryCategoryPage("earrings");
export const generateMetadata = page.generateMetadata;
export default page.Page;
