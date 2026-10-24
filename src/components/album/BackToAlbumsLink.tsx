"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasBrowseState } from "@/lib/browse-state";

/**
 * Nút "Quay lại tất cả album".
 * Nếu khách đi từ danh sách → về trang chủ và khôi phục bộ lọc + vị trí cuộn.
 * Nếu mở thẳng URL album (không có trạng thái) → về mục #albums.
 */
export function BackToAlbumsLink({ className = "btn btn-outline" }: { className?: string }) {
  const router = useRouter();
  return (
    <Link
      href="/#albums"
      className={className}
      onClick={(event) => {
        if (hasBrowseState()) {
          event.preventDefault();
          router.push("/");
        }
      }}
    >
      Quay lại tất cả album
    </Link>
  );
}
