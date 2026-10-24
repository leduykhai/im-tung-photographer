"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Năm hiện tại, luôn đúng theo thời điểm người xem (kể cả với trang đã build tĩnh). */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => new Date().getFullYear(),
  );
  return <span suppressHydrationWarning>{year}</span>;
}
