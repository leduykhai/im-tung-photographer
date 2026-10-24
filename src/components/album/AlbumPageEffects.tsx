"use client";

import { useEffect } from "react";
import { CurrentAlbumRegistrar } from "@/components/consult/ConsultationDialog";
import { track } from "@/lib/analytics";

/**
 * - Đăng ký album hiện tại để mọi form tư vấn tự gắn album.
 * - Gửi sự kiện view_album (chỉ slug, không dữ liệu cá nhân).
 */
export function AlbumPageEffects({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    track("view_album", { album_slug: slug });
  }, [slug]);
  return <CurrentAlbumRegistrar album={{ slug, title }} />;
}
