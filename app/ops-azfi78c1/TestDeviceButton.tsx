"use client";

import { useSyncExternalStore } from "react";
import { TEST_KEY } from "@/lib/visits";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const read = () => {
  try {
    return localStorage.getItem(TEST_KEY) === "1";
  } catch {
    return false;
  }
};

// 이 브라우저에서 한 방문은 실제 숫자에서 빼고 '테스트 기록'으로 따로 셉니다.
export function TestDeviceButton() {
  const on = useSyncExternalStore(subscribe, read, () => false);
  const toggle = () => {
    try {
      if (on) localStorage.removeItem(TEST_KEY);
      else localStorage.setItem(TEST_KEY, "1");
    } catch {
      return;
    }
    listeners.forEach((l) => l());
  };
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={toggle} className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
        {on ? "테스트 기기 등록 해제" : "이 브라우저를 테스트 기기로 등록"}
      </button>
      <span className="text-[13px] text-ink-soft">{on ? "이 브라우저는 테스트 기기로 등록되어 있어요." : "아직 등록하지 않았어요."}</span>
    </div>
  );
}
