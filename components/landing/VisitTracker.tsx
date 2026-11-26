"use client";

import { useEffect } from "react";
import { SCROLL_STEPS, TEST_KEY, type RecEvent } from "@/lib/visits";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

// 한 방문의 행동을 모았다가 페이지를 떠날 때(또는 마지막 버튼을 누를 때) 한 번에 보냅니다.
// 이미 보낸 행동은 다시 보내지 않고, 전송이 실패해도 페이지에는 영향이 없습니다.
export function VisitTracker() {
  useEffect(() => {
    const sent = new Set<RecEvent>();
    const pending = new Set<RecEvent>(["open"]);
    let actedSent = false;
    let fbqReady = false;

    let src = "direct";
    let test = false;
    try {
      src = new URLSearchParams(location.search).get("utm_source") || "direct";
      test = localStorage.getItem(TEST_KEY) === "1";
    } catch {
      // 저장소를 못 읽어도 계속 진행
    }

    const flush = () => {
      const ev = [...pending].filter((e) => !sent.has(e));
      if (ev.length === 0) return;
      const fa = !actedSent && ev.some((e) => e !== "open");
      const body = JSON.stringify({ src, test, ev, fa });
      try {
        const ok = navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }));
        if (!ok) void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
      } catch {
        return;
      }
      ev.forEach((e) => sent.add(e));
      pending.clear();
      if (fa) actedSent = true;
    };

    let raf = 0;
    const checkScroll = () => {
      raf = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight;
      if (!total) return;
      const pct = ((window.scrollY + window.innerHeight) / total) * 100;
      for (const s of SCROLL_STEPS) if (pct >= s - 0.5) pending.add(`s${s}` as RecEvent);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(checkScroll);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('[data-track="last-cta"]')) return;
      pending.add("click");
      flush();
      // 메타 픽셀이 켜져 있으면 '마지막 버튼 클릭'으로만 보냅니다. 구매 완료로 보내지 않습니다.
      const fbq = (window as unknown as { fbq?: Fbq }).fbq;
      if (fbqReady && fbq) fbq("trackCustom", "LastButtonClick");
    };
    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", flush);
    checkScroll();

    // 관리자 화면에 메타 픽셀 ID가 저장돼 있을 때만 기본 코드(PageView)를 넣습니다.
    void fetch("/api/pixel")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { id?: string } | null) => {
        const id = j?.id;
        if (!id || !/^\d{5,20}$/.test(id) || (window as unknown as { fbq?: Fbq }).fbq) return;
        const w = window as unknown as { fbq: Fbq; _fbq?: Fbq };
        const n: Fbq = function (...args: unknown[]) {
          if (n.callMethod) (n.callMethod as (...a: unknown[]) => void)(...args);
          else (n.queue as unknown[]).push(args);
        };
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        w.fbq = n;
        w._fbq = n;
        const s = document.createElement("script");
        s.async = true;
        s.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(s);
        n("init", id);
        n("track", "PageView");
        fbqReady = true;
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", flush);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
