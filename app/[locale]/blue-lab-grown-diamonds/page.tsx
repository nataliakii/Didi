import { createColoredLandingPage } from "@/lib/seo-landing-pages";

const page = createColoredLandingPage("blue");
export const generateMetadata = page.generateMetadata;
export default page.Page;
