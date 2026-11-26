"use client";

import { useSyncExternalStore } from "react";
import { firstVisitKey, offerWindowDays } from "@/content/thanks";

const subscribe = () => () => {};

// 처음 본 날(YYYY-MM-DD, 이 기기 기준)을 한 번만 저장하고 계속 같은 값을 돌려줍니다.
function readFirstVisit(): string {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  try {
    const saved = localStorage.getItem(firstVisitKey);
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved;
    localStorage.setItem(firstVisitKey, iso);
  } catch {
    // 저장이 막힌 브라우저에서는 오늘 기준으로만 보여 줍니다.
  }
  return iso;
}

function deadlineLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const end = new Date(y, m - 1, d + offerWindowDays);
  return `${end.getFullYear()}년 ${end.getMonth() + 1}월 ${end.getDate()}일까지`;
}

export function OfferDeadline() {
  const first = useSyncExternalStore(subscribe, readFirstVisit, () => "");
  if (!offerWindowDays || !first) return null;
  return (
    <div className="grid grid-cols-[104px_1fr] gap-3 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[120px_1fr]">
      <dt className="text-[14px] text-ink-faint">신청 기한</dt>
      <dd className="text-[15px] font-semibold text-ink">
        {deadlineLabel(first)}
        <span className="mt-0.5 block text-[12px] font-normal text-ink-faint">이 페이지를 처음 보신 날부터 3주</span>
      </dd>
    </div>
  );
}
