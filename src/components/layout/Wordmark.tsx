import Link from "next/link";
import { siteConfig } from "@/config/site";

interface WordmarkProps {
  tone?: "dark" | "light";
  className?: string;
  /** Có bọc trong liên kết về trang chủ hay không. */
  asLink?: boolean;
  size?: "md" | "lg";
}

/** Wordmark dạng chữ (chưa có logo): "I'm Tung" + "PHOTOGRAPHER". */
export function Wordmark({ tone = "dark", className = "", asLink = true, size = "md" }: WordmarkProps) {
  const color = tone === "light" ? "text-white" : "text-ink";
  const primarySize = size === "lg" ? "text-4xl sm:text-5xl" : "text-[1.7rem] sm:text-3xl";
  const content = (
    <span className={`inline-flex flex-col leading-none ${color} ${className}`}>
      <span className={`font-serif font-semibold tracking-tight ${primarySize}`}>
        {siteConfig.wordmark.primary}
      </span>
      <span className="mt-1 text-[0.625rem] font-semibold tracking-[0.42em] sm:text-[0.6875rem]">
        {siteConfig.wordmark.secondary}
      </span>
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href="/" aria-label={`${siteConfig.name} — về trang chủ`} className="inline-block">
      {content}
    </Link>
  );
}
