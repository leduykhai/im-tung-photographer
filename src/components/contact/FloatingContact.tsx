"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon, FacebookIcon, PhoneIcon, ZaloIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";

/** Nhóm nút liên hệ nổi cho desktop (từ md trở lên). Ẩn khi lightbox mở (xem globals.css). */
export function FloatingContact() {
  const { contact } = siteConfig;
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 350);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    track("click_scroll_to_top", { location: "desktop-float" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const itemClass =
    "group relative flex h-12 w-12 items-center justify-center border border-line bg-surface text-ink shadow-[0_4px_16px_rgb(37_37_37/0.08)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-x-1 hover:border-accent hover:bg-accent hover:text-white hover:shadow-[0_8px_24px_rgb(128_98_74/0.25)] active:scale-95";
  const tipClass =
    "pointer-events-none absolute right-full mr-3 whitespace-nowrap bg-ink px-3 py-1.5 text-sm font-medium text-white shadow-md opacity-0 translate-x-2 transition-all duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0";

  return (
    <div
      className="floating-contact fixed bottom-6 right-5 z-30 hidden flex-col gap-2 md:flex"
      role="group"
      aria-label="Liên hệ nhanh và tiện ích"
    >
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`${itemClass} animate-fade-in text-accent hover:border-accent hover:bg-accent hover:text-white`}
          aria-label="Về đầu trang"
        >
          <ArrowUpIcon width={22} height={22} />
          <span className={tipClass} aria-hidden="true">
            Về đầu trang
          </span>
        </button>
      )}
      <a
        href={contact.phoneHref}
        className={itemClass}
        aria-label={`Gọi điện ${contact.phoneDisplay}`}
        data-track="click_phone"
        data-track-location="floating"
      >
        <PhoneIcon />
        <span className={tipClass} aria-hidden="true">
          Gọi {contact.phoneDisplay}
        </span>
      </a>
      <a
        href={contact.zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        aria-label="Nhắn Zalo cho Tùng (mở trong tab mới)"
        data-track="click_zalo"
        data-track-location="floating"
      >
        <ZaloIcon />
        <span className={tipClass} aria-hidden="true">
          Nhắn Zalo
        </span>
      </a>
      <a
        href={contact.facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        aria-label="Facebook của Tùng (mở trong tab mới)"
        data-track="click_facebook"
        data-track-location="floating"
      >
        <FacebookIcon />
        <span className={tipClass} aria-hidden="true">
          Facebook
        </span>
      </a>
    </div>
  );
}
