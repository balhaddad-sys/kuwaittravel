import type { Metadata, Viewport } from "next";
import { Tajawal, Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kuwait Travel | حجز رحلات زيارية",
    template: "%s | Kuwait Travel",
  },
  description:
    "منصة حجز الرحلات الزيارية الأولى في الكويت - احجز رحلات الحج والعمرة والزيارات بكل سهولة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kuwait Travel",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
      <body
        className={`${tajawal.variable} ${inter.variable} font-arabic antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
