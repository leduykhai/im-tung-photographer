"use client";

import { useCallback, useRef, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import type { AlbumImage } from "@/types/album";
import { AlbumLightbox } from "./AlbumLightbox";

interface AlbumGalleryProps {
  images: AlbumImage[];
  albumTitle: string;
}

/**
 * Gallery "justified" bằng CSS thuần (flex-grow theo tỷ lệ ảnh):
 *  - Giữ đúng tỷ lệ gốc, không crop; kích thước biết trước → không nhảy bố cục.
 *  - Hàng cuối không bị kéo giãn.
 *  - Thứ tự đọc theo dữ liệu (thứ tự kể chuyện).
 */
export function AlbumGallery({ images, albumTitle }: AlbumGalleryProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastIndex = useRef(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const handleIndexChange = useCallback((next: number) => {
    lastIndex.current = next;
    setOpenIndex(next);
  }, []);

  const handleClose = useCallback(() => {
    setOpenIndex(null);
    // Trả focus về đúng ảnh đang xem khi đóng.
    const target = buttons.current[lastIndex.current];
    requestAnimationFrame(() => target?.focus({ preventScroll: false }));
  }, []);

  if (sorted.length === 0) {
    return (
      <div className="border border-line bg-surface px-6 py-14 text-center">
        <p className="font-serif text-2xl">Ảnh của album đang được cập nhật</p>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Tùng đang hoàn thiện những khung hình của album này. Bạn vui lòng quay lại sau
          hoặc liên hệ để xem trước.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex list-none flex-wrap gap-2 [--row-h:9.5rem] after:grow-[100000] after:content-[''] sm:gap-3 sm:[--row-h:13rem] lg:gap-3 lg:[--row-h:17.5rem]">
        {sorted.map((image, i) => {
          const ratio = image.width / image.height;
          return (
            <li
              key={`${image.src}-${i}`}
              className="max-w-full"
              style={{
                width: `calc(var(--row-h) * ${ratio.toFixed(4)})`,
                flexGrow: Math.round(ratio * 100),
              }}
            >
              <button
                type="button"
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                onClick={() => {
                  lastIndex.current = i;
                  setOpenIndex(i);
                }}
                aria-label={`Xem ảnh ${i + 1} trên ${sorted.length}: ${image.alt}`}
                aria-haspopup="dialog"
                className="group relative block w-full cursor-zoom-in overflow-hidden"
              >
                <div
                  className="img-skeleton relative w-full"
                  style={{ paddingBottom: `${(image.height / image.width) * 100}%` }}
                >
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    sizes={`(min-width: 1024px) ${Math.round(280 * ratio * 1.3)}px, (min-width: 640px) ${Math.round(208 * ratio * 1.3)}px, 100vw`}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {openIndex !== null && (
        <AlbumLightbox
          images={sorted}
          index={openIndex}
          albumTitle={albumTitle}
          onIndexChange={handleIndexChange}
          onClose={handleClose}
        />
      )}
    </>
  );
}
