"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site flex min-h-[70svh] flex-col items-center justify-center pb-16 pt-[calc(var(--header-h)+3rem)] text-center">
      <h1 className="text-4xl sm:text-5xl">Có lỗi xảy ra</h1>
      <p className="mx-auto mt-5 max-w-md text-base text-muted sm:text-lg">
        Trang chưa tải được như mong muốn. Bạn thử tải lại hoặc quay về trang chủ nhé.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn btn-primary" onClick={reset}>
          Thử lại
        </button>
        <Link href="/" className="btn btn-outline">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
