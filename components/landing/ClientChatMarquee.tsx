"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { clientChats } from "@/content/landing";

// 실제 클라이언트 카톡을 옆으로 계속 흘려 보여줍니다.
// 마우스를 올리거나 손가락으로 누르면 멈추고, 누르면 크게 볼 수 있습니다.
// '동작 줄이기' 설정 사용자는 자동으로 흐르지 않고 손으로 넘겨 봅니다.
export function ClientChatMarquee() {
  const [open, setOpen] = useState<number | null>(null);
  const items = clientChats.items;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const card = (it: (typeof items)[number], i: number, hidden: boolean) => (
    <li key={`${hidden ? "b" : "a"}-${i}`} className="flex-none" aria-hidden={hidden || undefined}>
      <button
        type="button"
        tabIndex={hidden ? -1 : 0}
        onClick={() => setOpen(i)}
        className="focus-ring group block overflow-hidden rounded-2xl bg-black shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]"
        aria-label={`${it.label} 카톡 크게 보기`}
      >
        <Image
          src={it.src}
          alt={hidden ? "" : `클라이언트 카톡: ${it.label}`}
          width={it.w}
          height={it.h}
          sizes="(min-width: 768px) 420px, 320px"
          className="h-[300px] w-auto transition-transform duration-300 group-hover:scale-[1.02] md:h-[380px]"
        />
      </button>
      <p className="mt-2 px-1 text-[13px] font-semibold text-ink-soft">{it.label}</p>
    </li>
  );

  return (
    <div className="mt-12">
      <div className="mx-auto max-w-[880px] px-5 md:px-8">
        <p className="text-[18px] font-extrabold text-ink md:text-[20px]">{clientChats.title}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">{clientChats.note}</p>
      </div>

      <div className="chat-marquee group/marquee relative mt-6 overflow-hidden">
        {/* 양 끝 흐림 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent md:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent md:w-20" />
        <ul className="chat-marquee-track flex w-max gap-4 px-5 pb-2">
          {items.map((it, i) => card(it, i, false))}
          {items.map((it, i) => card(it, i, true))}
        </ul>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${items[open].label} 카톡`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(null)}
        >
          <Image
            src={items[open].src}
            alt={`클라이언트 카톡: ${items[open].label}`}
            width={items[open].w}
            height={items[open].h}
            sizes="100vw"
            className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="focus-ring absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white"
            autoFocus
          >
            닫기 ✕
          </button>
        </div>
      )}
    </div>
  );
}
