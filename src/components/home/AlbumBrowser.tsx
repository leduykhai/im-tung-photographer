"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { consumeBrowseState, saveBrowseState } from "@/lib/browse-state";
import { siteConfig } from "@/config/site";
import { useConsultation } from "@/components/consult/ConsultationDialog";
import type { AlbumCategory } from "@/types/album";
import { AlbumCard, type AlbumCardData } from "./AlbumCard";
import { AlbumFilters, type CategoryFilter } from "./AlbumFilters";
import { AlbumGrid } from "./AlbumGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface AlbumBrowserProps {
  albums: AlbumCardData[];
  categories: AlbumCategory[];
}

export function AlbumBrowser({ albums, categories }: AlbumBrowserProps) {
  const pageSize = siteConfig.albumsPageSize;
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [visible, setVisible] = useState(pageSize);
  const pendingScroll = useRef<number | null>(null);
  const [restoreTick, setRestoreTick] = useState(0);
  const { openConsultation } = useConsultation();

  const filtered = useMemo(
    () => (category === "all" ? albums : albums.filter((a) => a.category === category)),
    [albums, category],
  );
  const shown = filtered.slice(0, visible);

  // Khôi phục bộ lọc + vị trí cuộn khi quay lại từ trang chi tiết album.
  useEffect(() => {
    const state = consumeBrowseState();
    if (!state) return;
    const validCategory =
      state.category === "all" || categories.includes(state.category as AlbumCategory);
    const frame = requestAnimationFrame(() => {
      setCategory(validCategory ? state.category : "all");
      setVisible(Math.max(pageSize, state.count));
      pendingScroll.current = state.scrollY;
      setRestoreTick((n) => n + 1);
    });
    return () => cancelAnimationFrame(frame);
  }, [categories, pageSize]);

  useEffect(() => {
    if (pendingScroll.current === null) return;
    const y = pendingScroll.current;
    pendingScroll.current = null;
    // Next có thể cuộn lên đầu trang sau khi điều hướng — thử lại vài lần ngắn.
    const apply = () => window.scrollTo({ top: y, behavior: "instant" });
    apply();
    const t1 = window.setTimeout(apply, 60);
    const t2 = window.setTimeout(apply, 220);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [restoreTick]);

  const rememberPosition = useCallback(() => {
    saveBrowseState({ category, count: visible, scrollY: window.scrollY });
  }, [category, visible]);

  function handleFilter(next: CategoryFilter) {
    setCategory(next);
    setVisible(pageSize);
  }

  if (albums.length === 0) {
    return (
      <div className="border border-line bg-surface px-6 py-14 text-center">
        <p className="font-serif text-2xl">Album đang được cập nhật</p>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Những câu chuyện ngày cưới mới sẽ sớm xuất hiện ở đây. Bạn có thể liên hệ để
          Tùng gửi trực tiếp các album phù hợp.
        </p>
        <button
          type="button"
          className="btn btn-primary mt-6"
          onClick={() => openConsultation({ location: "dialog-other" })}
        >
          Nhận tư vấn
        </button>
      </div>
    );
  }

  return (
    <div>
      <AlbumFilters categories={categories} value={category} onChange={handleFilter} />

      <div className="mt-8 lg:mt-10">
        {shown.length === 0 ? (
          <div className="border border-line bg-surface px-6 py-14 text-center">
            <p className="font-serif text-2xl">Chưa có album trong mục này</p>
            <button
              type="button"
              className="btn btn-outline mt-6"
              onClick={() => handleFilter("all")}
            >
              Xem tất cả album
            </button>
          </div>
        ) : (
          <div key={category} className="animate-fade-in">
            <AlbumGrid id="album-grid">
              {shown.map((album, index) => (
                <ScrollReveal
                  key={album.slug}
                  delay={(index % 4) * 75}
                  direction="up"
                >
                  <AlbumCard
                    album={album}
                    priority={index < 4}
                    onNavigate={rememberPosition}
                  />
                </ScrollReveal>
              ))}
            </AlbumGrid>
          </div>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Đang hiển thị {shown.length} trên {filtered.length} album.
      </p>

      {filtered.length > visible && (
        <div className="mt-12 text-center">
          <button
            type="button"
            className="btn btn-outline min-w-56"
            onClick={() => setVisible((v) => v + pageSize)}
          >
            Xem thêm album
          </button>
        </div>
      )}
    </div>
  );
}
