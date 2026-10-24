import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { AlbumBrowser } from "@/components/home/AlbumBrowser";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { siteConfig } from "@/config/site";
import { getAllAlbums, getAvailableCategories } from "@/lib/albums";
import { jsonLdScript } from "@/lib/json-ld";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  description: siteConfig.defaultDescription,
  alternates: siteConfig.siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: siteConfig.siteUrl ? "/" : undefined,
    images: [{ url: "/hero/hong-mai-hero.webp", width: 1920, height: 1280, alt: siteConfig.name }],
  },
};

export default function HomePage() {
  const albums = getAllAlbums();
  const categories = getAvailableCategories(albums);
  const cards = albums.map(({ slug, title, category, location, coverImage }) => ({
    slug,
    title,
    category,
    location,
    coverImage,
  }));
  const hasDemo = albums.some((album) => album.isDemo);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.defaultDescription,
    telephone: "+84352942502",
    email: siteConfig.contact.email,
    sameAs: [siteConfig.contact.facebookHref],
    ...(siteConfig.siteUrl ? { url: siteConfig.siteUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData) }}
      />
      <HeroSection />
      <IntroSection />

      <section
        id="albums"
        aria-labelledby="albums-title"
        className="scroll-mt-(--header-h) pb-16 lg:pb-24"
      >
        <div className="container-site">
          <ScrollReveal className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
            <h2 id="albums-title" className="text-[2rem] sm:text-4xl lg:text-5xl">
              Những câu chuyện ngày cưới
            </h2>
            <p className="mt-4 text-base leading-[1.8] text-muted sm:text-lg">
              Mỗi cặp đôi, một câu chuyện. Khám phá những khoảnh khắc được lưu giữ qua góc
              nhìn của Tùng.
            </p>
            {hasDemo && (
              <p className="mt-3 text-sm text-muted">
                Album mẫu để xem giao diện — ảnh và tên cặp đôi chỉ mang tính minh hoạ.
              </p>
            )}
          </ScrollReveal>
          <AlbumBrowser albums={cards} categories={categories} />
        </div>
      </section>

      <AboutSection />
      <ConsultationSection />
    </>
  );
}
