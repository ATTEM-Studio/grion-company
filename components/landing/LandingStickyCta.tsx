"use client";

import { useEffect, useState } from "react";
import { formHref, landingCta } from "@/content/landing";
import { cn } from "@/lib/utils";

// 휴대폰 하단 고정 버튼. 첫 화면을 지나면 보이고, 신청 폼이 화면에 있거나 입력 중이면 숨깁니다.
export function LandingStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const passedHero = window.scrollY > window.innerHeight * 0.6;
      const form = document.getElementById("apply")?.getBoundingClientRect();
      const formVisible = form && form.top < window.innerHeight && form.bottom > 0;
      const editing =
        document.activeElement instanceof HTMLElement && document.activeElement.matches("input, textarea, select");
      setVisible(passedHero && !formVisible && !editing);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-5 py-3 backdrop-blur transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={formHref}
        className="focus-ring flex w-full flex-col items-center justify-center rounded-full bg-accent px-6 py-2.5 text-white"
      >
        <span className="text-[15px] font-bold">{landingCta}</span>
        <span className="text-[12px] text-white/85">
          <s className="text-white/60">39,000원</s> → <strong className="font-extrabold text-white">0원</strong> · 30팀 선착순
        </span>
      </a>
    </div>
  );
}
