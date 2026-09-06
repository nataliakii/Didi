import { createColoredLandingPage } from "@/lib/seo-landing-pages";

export const revalidate = 60;

const page = createColoredLandingPage("pink");
export const generateMetadata = page.generateMetadata;
export default page.Page;
