import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumCta } from "@/components/album/AlbumCta";
import { AlbumGallery } from "@/components/album/AlbumGallery";
import { AlbumNav } from "@/components/album/AlbumNav";
import { AlbumPageEffects } from "@/components/album/AlbumPageEffects";
import { BackToAlbumsLink } from "@/components/album/BackToAlbumsLink";
import { AlbumCard } from "@/components/home/AlbumCard";
import { AlbumGrid } from "@/components/home/AlbumGrid";
import { siteConfig } from "@/config/site";
import {
  categoryLabels,
  getAllAlbums,
  getAlbumBySlug,
  getPrevNextAlbums,
  getRelatedAlbums,
} from "@/lib/albums";
import { jsonLdScript } from "@/lib/json-ld";

export function generateStaticParams() {
  return getAllAlbums().map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/album/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) {
    return { title: "Không tìm thấy album", robots: { index: false, follow: false } };
  }
  const path = `/album/${album.slug}`;
  return {
    title: album.seoTitle,
    description: album.seoDescription,
    alternates: siteConfig.siteUrl ? { canonical: path } : undefined,
    openGraph: {
      type: "article",
      title: album.seoTitle,
      description: album.seoDescription,
      url: siteConfig.siteUrl ? path : undefined,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      images: [
        {
          url: album.heroImage.src,
          width: album.heroImage.width,
          height: album.heroImage.height,
          alt: album.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: album.seoTitle,
      description: album.seoDescription,
      images: [album.heroImage.src],
    },
  };
}

export default async function AlbumPage({ params }: PageProps<"/album/[slug]">) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const { prev, next } = getPrevNextAlbums(album.slug);
  const related = getRelatedAlbums(album.slug, 4);
  const meta = [categoryLabels[album.category], album.location].filter(Boolean).join(" · ");

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.siteUrl ?? "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Album cưới",
        item: `${siteConfig.siteUrl ?? ""}/#albums`,
      },
      { "@type": "ListItem", position: 3, name: album.title },
    ],
  };

  return (
    <article className="pt-(--header-h)">
      <AlbumPageEffects slug={album.slug} title={album.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }}
      />

      <header className="container-site pb-8 pt-6 lg:pb-12 lg:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted lg:mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="inline-flex min-h-8 items-center hover:text-accent hover:underline">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#albums" className="inline-flex min-h-8 items-center hover:text-accent hover:underline">
                Album cưới
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">
              {album.title}
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">{meta}</p>
            <h1 className="mt-3 text-[2.5rem] sm:text-5xl lg:text-[3.5rem]">{album.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-[1.8] text-muted sm:text-lg">
              {album.description}
            </p>
            {album.isDemo && (
              <p className="mt-4 text-sm text-muted">
                Album mẫu — ảnh và tên cặp đôi chỉ mang tính minh hoạ.
              </p>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="img-skeleton relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={album.heroImage.src}
                alt={album.heroImage.alt}
                fill
                priority
                quality={85}
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="gallery-title" className="container-site pb-16 lg:pb-24">
        <h2 id="gallery-title" className="sr-only">
          Thư viện ảnh album {album.title}
        </h2>
        <AlbumGallery images={album.images} albumTitle={album.title} />
      </section>

      <AlbumCta albumTitle={album.title} />

      <div className="container-site py-12 lg:py-16">
        <AlbumNav prev={prev} next={next} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-site pb-14 lg:pb-20">
          <h2 id="related-title" className="mb-8 text-[1.9rem] sm:text-4xl">
            Album liên quan
          </h2>
          <AlbumGrid>
            {related.map((item) => (
              <AlbumCard
                key={item.slug}
                album={{
                  slug: item.slug,
                  title: item.title,
                  category: item.category,
                  location: item.location,
                  coverImage: item.coverImage,
                }}
              />
            ))}
          </AlbumGrid>
        </section>
      )}

      <div className="container-site pb-16 text-center lg:pb-24">
        <BackToAlbumsLink />
      </div>
    </article>
  );
}
