"use client";

import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { categoryLabels } from "@/lib/categories";
import type { AlbumCategory, AlbumImage } from "@/types/album";

/** Chỉ các trường card cần — giảm dữ liệu truyền sang client. */
export interface AlbumCardData {
  slug: string;
  title: string;
  category: AlbumCategory;
  location?: string;
  coverImage: AlbumImage;
}

interface AlbumCardProps {
  album: AlbumCardData;
  /** Ưu tiên tải ảnh (cho hàng đầu tiên). */
  priority?: boolean;
  onNavigate?: () => void;
}

export function AlbumCard({ album, priority = false, onNavigate }: AlbumCardProps) {
  const meta = [categoryLabels[album.category], album.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1">
      <Link
        href={`/album/${album.slug}`}
        onClick={onNavigate}
        className="group block focus-visible:outline-offset-4"
      >
        <div className="img-skeleton relative aspect-[2/3] overflow-hidden shadow-sm transition-shadow duration-500 group-hover:shadow-[0_16px_36px_-12px_rgba(37,37,37,0.14)]">
          <SmartImage
            src={album.coverImage.src}
            alt={album.coverImage.alt}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            priority={priority}
            className="transition-transform duration-850 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 translate-y-2.5 scale-95 group-hover:scale-100"
          >
            <span className="backdrop-blur-md bg-white/95 px-5 py-2 text-sm font-semibold tracking-wide text-ink shadow-md border border-line/60">
              Xem album
            </span>
          </span>
        </div>
        <h3 className="mt-3.5 font-serif text-[1.3rem] font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-2xl">
          <span className="animated-underline">{album.title}</span>
        </h3>
        <p className="mt-1 text-sm leading-snug text-muted transition-colors duration-300 group-hover:text-muted/80">{meta}</p>
      </Link>
    </article>
  );
}
