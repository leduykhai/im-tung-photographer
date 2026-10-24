"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/components/ui/icons";
import { track } from "@/lib/analytics";

/**
 * Nút về đầu trang nổi dành riêng cho mobile.
 * Nổi phía trên thanh hành động đáy (safe area) khi cuộn xuống > 350px.
 * Tự ẩn khi ở đầu trang, khi mở lightbox hoặc khi mở bàn phím.
 */
export function ScrollToTopMobile() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 350);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    track("click_scroll_to_top", { location: "mobile-float" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Về đầu trang"
      className={`scroll-to-top-btn fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/95 text-ink shadow-[0_4px_16px_rgb(37_37_37/0.12)] backdrop-blur transition-all duration-300 active:scale-90 md:hidden hover:border-accent hover:text-accent ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUpIcon width={20} height={20} />
    </button>
  );
}
