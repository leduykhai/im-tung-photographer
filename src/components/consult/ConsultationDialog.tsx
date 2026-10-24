"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { track } from "@/lib/analytics";
import { CloseIcon } from "@/components/ui/icons";
import { ConsultationForm, type ConsultationAlbumRef } from "./ConsultationForm";

interface OpenOptions {
  /** Vị trí kích hoạt: header, hero, about, mobile-bar, album... */
  location: string;
  album?: ConsultationAlbumRef | null;
}

interface ConsultationContextValue {
  openConsultation: (options: OpenOptions) => void;
  /** Trang album gọi hàm này để mọi lần mở form đều gắn album đang xem. */
  setCurrentAlbum: (album: ConsultationAlbumRef | null) => void;
  currentAlbum: ConsultationAlbumRef | null;
}

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function useConsultation(): ConsultationContextValue {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation phải nằm trong ConsultationProvider");
  return ctx;
}

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [currentAlbum, setCurrentAlbum] = useState<ConsultationAlbumRef | null>(null);
  const [dialog, setDialog] = useState<{
    open: boolean;
    location: string;
    album: ConsultationAlbumRef | null;
  }>({ open: false, location: "dialog-other", album: null });
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openConsultation = useCallback(
    ({ location, album }: OpenOptions) => {
      const resolved = album ?? currentAlbum;
      track("open_consultation_form", {
        form_location: location,
        album_slug: resolved?.slug,
      });
      setDialog({ open: true, location, album: resolved });
    },
    [currentAlbum],
  );

  // Đồng bộ trạng thái React với <dialog> gốc.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (dialog.open && !el.open) {
      el.showModal();
      document.documentElement.setAttribute("data-scroll-lock", "");
    }
    if (!dialog.open && el.open) {
      el.close();
    }
    if (!dialog.open) {
      document.documentElement.removeAttribute("data-scroll-lock");
    }
  }, [dialog.open]);

  useEffect(() => {
    return () => document.documentElement.removeAttribute("data-scroll-lock");
  }, []);

  const close = useCallback(() => setDialog((d) => ({ ...d, open: false })), []);

  const value = useMemo(
    () => ({ openConsultation, setCurrentAlbum, currentAlbum }),
    [openConsultation, currentAlbum],
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="consultation-dialog-title"
        onClose={close}
        onClick={(event) => {
          // Bấm vào vùng nền (backdrop) để đóng.
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto flex max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2rem)] max-w-2xl flex-col rounded-2xl bg-ivory p-0 text-ink shadow-[0_30px_70px_-15px_rgba(28,24,21,0.45)] outline-none overflow-hidden"
      >
        {/* Chỉ gắn form khi mở để mỗi lần mở có trạng thái sạch sau khi gửi thành công. */}
        {dialog.open && (
          <div className="flex max-h-[calc(100dvh-2.5rem)] flex-1 flex-col overflow-hidden">
            {/* Dải gradient trang trí thanh lịch ở đỉnh modal */}
            <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />

            {/* Header cố định của modal */}
            <div className="relative shrink-0 border-b border-line/60 bg-ivory/95 px-5 pb-4 pt-5 backdrop-blur-sm sm:px-8 sm:pb-5 sm:pt-6">
              <button
                type="button"
                onClick={close}
                aria-label="Đóng form tư vấn"
                className="group absolute right-3.5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-line/80 bg-surface/80 text-muted backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-surface hover:text-ink hover:rotate-90 active:scale-95"
              >
                <CloseIcon className="h-4 w-4 transition-colors" />
              </button>

              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <p className="eyebrow">Tư vấn miễn phí</p>
              </div>

              <h2
                id="consultation-dialog-title"
                className="mt-1.5 pr-10 text-2xl font-medium sm:text-3xl leading-tight"
              >
                Kể Tùng nghe về ngày cưới của bạn
              </h2>

              <p className="mt-1.5 text-xs text-muted sm:text-sm leading-relaxed">
                Để lại thông tin bên dưới, Tùng sẽ liên hệ sớm nhất để trao đổi về phong cách và báo giá phù hợp.
              </p>
            </div>

            {/* Khu vực nội dung cuộn mượt mà */}
            <div className="custom-scrollbar flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
              <ConsultationForm
                location={dialog.location}
                album={dialog.album}
                onClose={close}
              />
            </div>
          </div>
        )}
      </dialog>
    </ConsultationContext.Provider>
  );
}

/** Đăng ký album hiện tại cho provider (đặt trong trang chi tiết album). */
export function CurrentAlbumRegistrar({ album }: { album: ConsultationAlbumRef }) {
  const { setCurrentAlbum } = useConsultation();
  const { slug, title } = album;
  useEffect(() => {
    setCurrentAlbum({ slug, title });
    return () => setCurrentAlbum(null);
  }, [slug, title, setCurrentAlbum]);
  return null;
}
