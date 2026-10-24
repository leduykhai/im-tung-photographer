"use client";

import type { ReactNode } from "react";
import { useConsultation } from "./ConsultationDialog";
import type { ConsultationAlbumRef } from "./ConsultationForm";

interface OpenConsultationButtonProps {
  location: string;
  className?: string;
  children: ReactNode;
  album?: ConsultationAlbumRef | null;
}

/** Nút mở form tư vấn — dùng được trong cả server component. */
export function OpenConsultationButton({
  location,
  className = "btn btn-primary",
  children,
  album,
}: OpenConsultationButtonProps) {
  const { openConsultation } = useConsultation();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openConsultation({ location, album })}
    >
      {children}
    </button>
  );
}
