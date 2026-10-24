"use client";

import { useEffect } from "react";
import { track, type AnalyticsEventName } from "@/lib/analytics";

const allowed: AnalyticsEventName[] = [
  "click_phone",
  "click_zalo",
  "click_facebook",
];

/**
 * Lắng nghe click toàn trang cho các liên kết có `data-track`.
 * Chỉ gửi tên sự kiện + vị trí nút — không bao giờ gửi dữ liệu cá nhân.
 */
export function AnalyticsListener() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const name = el.dataset.track as AnalyticsEventName | undefined;
      if (name && allowed.includes(name)) {
        track(name, { location: el.dataset.trackLocation });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
