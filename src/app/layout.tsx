import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import { ConsultationProvider } from "@/components/consult/ConsultationDialog";
import { FloatingContact } from "@/components/contact/FloatingContact";
import { MobileContactBar } from "@/components/contact/MobileContactBar";
import { ScrollToTopMobile } from "@/components/layout/ScrollToTopMobile";
import { AnalyticsListener } from "@/components/layout/AnalyticsListener";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Domain thật chỉ dùng khi cấu hình NEXT_PUBLIC_SITE_URL; mặc định localhost để Next resolve URL tương đối khi dev.
  metadataBase: new URL(siteConfig.siteUrl ?? "http://localhost:3000"),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.name,
  robots: siteConfig.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${beVietnam.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Bỏ qua tới nội dung chính
        </a>
        <ConsultationProvider>
          <SiteHeader />
          {/* Chừa chỗ cho thanh liên hệ cố định ở mobile (kèm safe-area). */}
          <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
            <main id="main">{children}</main>
            <SiteFooter />
          </div>
          <FloatingContact />
          <MobileContactBar />
          <ScrollToTopMobile />
        </ConsultationProvider>
        <AnalyticsListener />
      </body>
    </html>
  );
}
