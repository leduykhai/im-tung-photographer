"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/ui/icons";
import type { AlbumImage } from "@/types/album";

interface AlbumLightboxProps {
  images: AlbumImage[];
  index: number;
  albumTitle: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_MIN_PX = 40;

export function AlbumLightbox({
  images,
  index,
  albumTitle,
  onIndexChange,
  onClose,
}: AlbumLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const total = images.length;
  const current = images[index];

  // Khởi tạo sau khi mount ở client
  useEffect(() => {
    setMounted(true);
  }, []);

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + total) % total);
    },
    [index, total, onIndexChange],
  );

  // Khoá cuộn trang web khi mở lightbox
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-lightbox-open", "");
    document.documentElement.setAttribute("data-scroll-lock", "");

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.removeAttribute("data-lightbox-open");
      document.documentElement.removeAttribute("data-scroll-lock");
    };
  }, []);

  // Điều hướng bằng bàn phím (Mũi tên trái/phải và phím Escape)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [go, onClose]);

  // Tải trước ảnh trước và sau để chuyển ảnh tức thì
  useEffect(() => {
    if (total < 2) return;
    for (const offset of [1, -1, 2]) {
      const neighbour = images[(index + offset + total) % total];
      if (neighbour?.src) {
        const preload = new window.Image();
        preload.src = neighbour.src;
      }
    }
  }, [index, images, total]);

  // Cuộn thumbnail đang chọn vào giữa tầm nhìn
  useEffect(() => {
    const activeThumb = thumbnailRefs.current[index];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [index]);

  // Xử lý vuốt cảm ứng (Touch / Pointer Swipe)
  function onPointerDown(event: React.PointerEvent) {
    pointer.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: React.PointerEvent) {
    const start = pointer.current;
    pointer.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.3) {
      go(dx < 0 ? 1 : -1);
    }
  }

  if (!mounted || !current) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ảnh album ${albumTitle}`}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 text-white backdrop-blur-md animate-fade-in select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (pointer.current = null)}
    >
      {/* Thanh tiêu đề & nút điều khiển trên cùng */}
      <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-serif text-base font-medium text-white/90 sm:text-lg">
            {albumTitle}
          </span>
          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-white/90">
            {index + 1} / {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-white/50 sm:inline-block">
            Dùng phím ← → hoặc vuốt để chuyển ảnh
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng xem ảnh (phím Esc)"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white hover:rotate-90 active:scale-95"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Khu vực hiển thị ảnh chính */}
      <main
        className="relative flex flex-1 items-center justify-center overflow-hidden px-2 py-4 sm:px-16"
        onClick={(e) => {
          // Bấm ra vùng đen ngoài ảnh để đóng
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Nút sang ảnh trước */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Ảnh trước (Mũi tên trái)"
            className="group absolute left-2 sm:left-4 z-20 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-accent hover:bg-accent hover:scale-110 active:scale-95 shadow-xl"
          >
            <ChevronLeftIcon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Khung ảnh trung tâm */}
        <div
          className="relative flex max-h-[calc(100vh-13rem)] max-w-full items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            draggable={false}
            className="max-h-[calc(100vh-13rem)] max-w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-9rem)] rounded-sm object-contain shadow-2xl transition-opacity duration-300 animate-fade-in select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Nút sang ảnh tiếp theo */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Ảnh tiếp theo (Mũi tên phải)"
            className="group absolute right-2 sm:right-4 z-20 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-accent hover:bg-accent hover:scale-110 active:scale-95 shadow-xl"
          >
            <ChevronRightIcon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </main>

      {/* Dải thumbnail thu nhỏ dưới đáy (Bottom Thumbnail Strip) */}
      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-black/60 px-3 py-2.5 backdrop-blur-md sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
          {images.map((img, i) => {
            const isSelected = i === index;
            return (
              <button
                key={`${img.src}-${i}`}
                ref={(el) => {
                  thumbnailRefs.current[i] = el;
                }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(i);
                }}
                aria-label={`Chuyển đến ảnh ${i + 1}`}
                className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded transition-all duration-200 select-none ${
                  isSelected
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-black scale-105 opacity-100 shadow-lg"
                    : "opacity-45 hover:opacity-90 hover:scale-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );

  return createPortal(content, document.body);
}
