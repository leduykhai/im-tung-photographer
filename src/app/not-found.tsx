import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70svh] flex-col items-center justify-center pb-16 pt-[calc(var(--header-h)+3rem)] text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Không tìm thấy trang</h1>
      <p className="mx-auto mt-5 max-w-md text-base text-muted sm:text-lg">
        Đường dẫn bạn mở không tồn tại hoặc đã được thay đổi. Hãy quay lại để xem các
        album cưới.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
        <Link href="/#albums" className="btn btn-outline">
          Xem album cưới
        </Link>
      </div>
    </section>
  );
}
