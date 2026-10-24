"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Độ trễ (ms) để tạo hiệu ứng so le (stagger) */
  delay?: number;
  /** Hướng chuyển động: "up" (trồi lên), "fade" (mờ dần), "left", "right" */
  direction?: "up" | "fade" | "left" | "right";
  /** Ngưỡng nhìn thấy trong viewport (0 - 1) */
  threshold?: number;
  /** Khoảng đệm viewport */
  rootMargin?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
  as: Component = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Nếu người dùng bật giảm chuyển động, hiển thị ngay
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const directionClasses = {
    up: "translate-y-7",
    fade: "translate-y-0",
    left: "translate-x-7",
    right: "-translate-x-7",
  }[direction];

  return (
    <Component
      // @ts-expect-error Polymorphic element ref
      ref={ref}
      style={{
        transitionDuration: "850ms",
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transition-all ${
        isRevealed
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${directionClasses} pointer-events-none`
      } ${className}`}
    >
      {children}
    </Component>
  );
}
