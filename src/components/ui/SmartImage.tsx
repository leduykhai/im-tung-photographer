"use client";

import Image from "next/image";
import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** object-position, ví dụ "50% 30%". */
  position?: string;
  quality?: 75 | 85;
}

/**
 * Ảnh lấp đầy khung cha (cha cần `relative` + tỷ lệ cố định để không nhảy bố cục).
 * - Nền placeholder do khung cha đảm nhiệm (class img-skeleton).
 * - Khi ảnh lỗi: hiển thị trạng thái "Không tải được ảnh" kèm nút thử lại.
 */
export function SmartImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  position,
  quality = 75,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (không tải được ảnh)`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-line p-3 text-center text-sm text-muted"
      >
        <span>Không tải được ảnh</span>
        <button
          type="button"
          className="min-h-9 border border-muted px-3 text-ink hover:bg-ink hover:text-white"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setFailed(false);
            setAttempt((n) => n + 1);
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <Image
      key={attempt}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      style={position ? { objectPosition: position } : undefined}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
