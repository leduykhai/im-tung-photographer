import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { Album } from "@/types/album";

function NavLink({ album, direction }: { album: Album; direction: "prev" | "next" }) {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/album/${album.slug}`}
      rel={isPrev ? "prev" : "next"}
      className={`group flex items-center gap-4 border border-line bg-surface p-3 transition-colors hover:border-accent sm:gap-5 sm:p-4 ${
        isPrev ? "" : "flex-row-reverse text-right"
      }`}
    >
      <span className="img-skeleton relative block aspect-[2/3] w-14 shrink-0 overflow-hidden sm:w-16">
        <Image
          src={album.coverImage.src}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-accent group-hover:underline">
          {isPrev && <ArrowLeftIcon width={16} height={16} />}
          {isPrev ? "Album trước" : "Album tiếp theo"}
          {!isPrev && <ArrowRightIcon width={16} height={16} />}
        </span>
        <span
          className={`mt-1 block font-serif text-xl font-semibold leading-tight text-ink sm:text-2xl ${
            isPrev ? "" : "ml-auto"
          }`}
        >
          {album.title}
        </span>
      </span>
    </Link>
  );
}

export function AlbumNav({ prev, next }: { prev: Album | null; next: Album | null }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Chuyển album" className="grid gap-3 sm:grid-cols-2 sm:gap-5">
      {prev ? <NavLink album={prev} direction="prev" /> : <span />}
      {next ? <NavLink album={next} direction="next" /> : <span />}
    </nav>
  );
}
