import type { ReactNode } from "react";

/** Lưới album: 4 cột desktop · 3 cột tablet · 2 cột mobile (1 cột trên màn hình rất nhỏ). */
export function AlbumGrid({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className="grid grid-cols-2 gap-x-4 gap-y-7 max-[22rem]:grid-cols-1 md:grid-cols-3 md:gap-y-9 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10"
    >
      {children}
    </div>
  );
}
