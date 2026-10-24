import type { CategoryFilter } from "@/components/home/AlbumFilters";

/**
 * Lưu bộ lọc, số album đã hiển thị và vị trí cuộn của danh sách album
 * để khôi phục khi khách quay lại từ trang chi tiết.
 * Dùng sessionStorage (chỉ trạng thái giao diện — không chứa dữ liệu cá nhân).
 */
const KEY = "imtung:albums-browse";
const MAX_AGE_MS = 30 * 60 * 1000;

export interface BrowseState {
  category: CategoryFilter;
  count: number;
  scrollY: number;
  ts: number;
  /** true khi khách vừa rời danh sách để mở album → lần tới vào trang chủ sẽ khôi phục. */
  returning: boolean;
}

export function saveBrowseState(state: Omit<BrowseState, "ts" | "returning">): void {
  try {
    const value: BrowseState = { ...state, ts: Date.now(), returning: true };
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // sessionStorage có thể bị chặn — bỏ qua, chỉ mất tính năng khôi phục.
  }
}

/** Đọc và xoá trạng thái nếu đang ở chế độ "quay lại". */
export function consumeBrowseState(): BrowseState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as BrowseState;
    sessionStorage.removeItem(KEY);
    if (!state.returning || Date.now() - state.ts > MAX_AGE_MS) return null;
    return state;
  } catch {
    return null;
  }
}

/** Có trạng thái đã lưu để khôi phục không (dùng cho nút "Quay lại tất cả album"). */
export function hasBrowseState(): boolean {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return false;
    const state = JSON.parse(raw) as BrowseState;
    return state.returning && Date.now() - state.ts <= MAX_AGE_MS;
  } catch {
    return false;
  }
}
