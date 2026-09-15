import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DEFAULT_THEME } from "@/constants/brand";
import { Cinzel, EB_Garamond, Geist_Mono, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "greek-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

const themeInitScript = `(function(){document.documentElement.setAttribute("data-theme",${JSON.stringify(DEFAULT_THEME)});try{localStorage.removeItem("asteria-theme");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${geistMono.variable} ${playfair.variable} ${cinzel.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-brand-bg text-brand-text">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
