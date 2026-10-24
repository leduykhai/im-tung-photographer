"use client";

import { useEffect } from "react";
import { useConsultation } from "@/components/consult/ConsultationDialog";
import { siteConfig } from "@/config/site";

const EDITABLE = "input, textarea, select, [contenteditable='true']";

/**
 * Thanh liên hệ cố định phía dưới cho mobile.
 * - Có safe-area (notch/home indicator).
 * - Tự ẩn khi bàn phím mobile xuất hiện để không che ô nhập/nút gửi.
 * - Ẩn khi lightbox mở (xem globals.css).
 */
export function MobileContactBar() {
  const { openConsultation } = useConsultation();
  const { contact } = siteConfig;

  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;

    const setOpen = (open: boolean) => {
      if (open) root.setAttribute("data-keyboard-open", "");
      else root.removeAttribute("data-keyboard-open");
    };
    const isEditable = (el: Element | null) => !!el && el.matches(EDITABLE);

    const onFocusIn = (event: FocusEvent) => {
      if (isEditable(event.target as Element)) setOpen(true);
    };
    const onFocusOut = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!isEditable(document.activeElement)) setOpen(false);
      }, 120);
    };
    // Dự phòng: viewport bị thu nhỏ đáng kể (bàn phím ảo).
    const vv = window.visualViewport;
    const onViewport = () => {
      if (!vv) return;
      if (window.innerHeight - vv.height > 160 && isEditable(document.activeElement)) {
        setOpen(true);
      }
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    vv?.addEventListener("resize", onViewport);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      vv?.removeEventListener("resize", onViewport);
      setOpen(false);
    };
  }, []);

  const itemClass =
    "flex min-h-14 flex-1 items-center justify-center text-[0.9375rem] font-semibold tracking-wide";

  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="mobile-contact-bar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="flex">
        <a
          href={contact.phoneHref}
          className={`${itemClass} text-ink`}
          data-track="click_phone"
          data-track-location="mobile-bar"
        >
          Gọi ngay
        </a>
        <a
          href={contact.zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} border-x border-line text-ink`}
          aria-label="Zalo (mở trong tab mới)"
          data-track="click_zalo"
          data-track-location="mobile-bar"
        >
          Zalo
        </a>
        <button
          type="button"
          className={`${itemClass} bg-accent text-white`}
          onClick={() => openConsultation({ location: "dialog-mobile-bar" })}
        >
          Tư vấn
        </button>
      </div>
    </nav>
  );
}
