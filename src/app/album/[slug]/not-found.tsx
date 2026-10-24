import Link from "next/link";

export default function AlbumNotFound() {
  return (
    <section className="container-site flex min-h-[70svh] flex-col items-center justify-center pb-16 pt-[calc(var(--header-h)+3rem)] text-center">
      <p className="eyebrow">Album</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Không tìm thấy album</h1>
      <p className="mx-auto mt-5 max-w-md text-base text-muted sm:text-lg">
        Album này không tồn tại hoặc đã được gỡ. Bạn có thể xem những câu chuyện ngày cưới
        khác của Tùng.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/#albums" className="btn btn-primary">
          Xem tất cả album
        </Link>
        <Link href="/" className="btn btn-outline">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
