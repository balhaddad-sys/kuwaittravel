import type { Metadata, Viewport } from "next";
import { Tajawal, Space_Grotesk, Amiri } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-arabic-ui",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-numeric-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-display-ui",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
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
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1222" },
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
        className={`${tajawal.variable} ${spaceGrotesk.variable} ${amiri.variable} font-arabic antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
