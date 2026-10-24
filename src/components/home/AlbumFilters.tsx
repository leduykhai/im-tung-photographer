"use client";

import { categoryLabels } from "@/lib/categories";
import type { AlbumCategory } from "@/types/album";

export type CategoryFilter = "all" | AlbumCategory;

interface AlbumFiltersProps {
  categories: AlbumCategory[];
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

/** Bộ lọc danh mục — chỉ hiển thị danh mục có dữ liệu (do cha truyền vào). */
export function AlbumFilters({ categories, value, onChange }: AlbumFiltersProps) {
  const items: Array<{ value: CategoryFilter; label: string }> = [
    { value: "all", label: "Tất cả" },
    ...categories.map((c) => ({ value: c as CategoryFilter, label: categoryLabels[c] })),
  ];

  // Chỉ có một danh mục thì bộ lọc không có tác dụng — ẩn đi.
  if (categories.length < 2) return null;

  return (
    <div
      role="group"
      aria-label="Lọc album theo loại"
      className="-mx-4 flex gap-x-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.value)}
            className={`min-h-11 shrink-0 border-b-2 px-3 text-[0.9375rem] font-medium tracking-wide transition-all duration-300 sm:px-4 ${
              active
                ? "border-accent text-ink font-semibold"
                : "border-transparent text-muted hover:text-ink hover:border-line"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
