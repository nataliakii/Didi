import { createColoredLandingPage } from "@/lib/seo-landing-pages";

const page = createColoredLandingPage("colored");
export const generateMetadata = page.generateMetadata;
export default page.Page;
