import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic, Manrope } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic-ui",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-latin-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const initUiScript = `
(() => {
  try {
    const language = localStorage.getItem("language") || "ar";
    const resolvedDir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.dir = resolvedDir;

    const theme = localStorage.getItem("theme") || "system";
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }
})();
`;

export const metadata: Metadata = {
  title: {
    default: "رحال | حجز رحلات زيارية",
    template: "%s | رحال",
  },
  description:
    "رحال — منصة حجز الرحلات الزيارية الأولى في الكويت. احجز رحلات الحج والعمرة والزيارات بكل سهولة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "رحال",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B2A4A" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initUiScript }} />
      </head>
      <body
        className={`${notoSansArabic.variable} ${manrope.variable} font-arabic antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
