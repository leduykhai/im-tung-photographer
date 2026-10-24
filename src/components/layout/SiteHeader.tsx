"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useConsultation } from "@/components/consult/ConsultationDialog";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { navItems } from "@/config/site";
import { Wordmark } from "./Wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openConsultation } = useConsultation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu mobile khi đổi trang (theo pattern chuẩn của React: adjust state on prop change)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  // Trong suốt trên hero (chỉ trang chủ), chuyển nền trắng ngà khi cuộn hoặc mở menu.
  const overlay = isHome && !scrolled && !menuOpen;

  const headerClass = overlay
    ? "text-white bg-gradient-to-b from-black/45 via-black/15 to-transparent on-dark"
    : "bg-ivory/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur";

  function openForm() {
    setMenuOpen(false);
    openConsultation({ location: "dialog-header" });
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${headerClass}`}
    >
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <Wordmark tone={overlay ? "light" : "dark"} />

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-[0.9375rem] font-medium tracking-wide transition-all duration-300 ${
                overlay ? "hover:text-white/75 hover:-translate-y-0.5" : "hover:text-accent hover:-translate-y-0.5"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openForm}
            className={`btn ml-3 min-h-11! px-5! ${overlay ? "btn-light" : "btn-primary"}`}
          >
            Nhận tư vấn
          </button>
        </nav>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon width={26} height={26} /> : <MenuIcon width={26} height={26} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Điều hướng chính (di động)"
          className="animate-fade-in border-t border-line bg-ivory text-ink md:hidden"
        >
          <ul className="container-site py-2">
            {navItems.map((item) => (
              <li key={item.href} className="border-b border-line last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-14 items-center text-lg font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-4">
              <button type="button" onClick={openForm} className="btn btn-primary w-full">
                Nhận tư vấn
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
