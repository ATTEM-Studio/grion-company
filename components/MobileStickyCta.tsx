"use client";

import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const passedHero = window.scrollY > window.innerHeight * 0.7;
      const nearBottom =
        window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 200;
      const calculator = document.getElementById("growth-calculator")?.getBoundingClientRect();
      const calculatorVisible = calculator && calculator.top < window.innerHeight && calculator.bottom > 0;
      const editing = document.activeElement instanceof HTMLElement &&
        document.activeElement.matches("input, textarea, select, [contenteditable=true]");
      setVisible(passedHero && !nearBottom && !calculatorVisible && !editing);
    };
    let focusFrame = 0;
    const onFocusChange = () => {
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(onScroll);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("focusin", onFocusChange);
    document.addEventListener("focusout", onFocusChange);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("focusin", onFocusChange);
      document.removeEventListener("focusout", onFocusChange);
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
        href={nav.ctaHref}
        className="focus-ring flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-white"
      >
        {nav.cta}
      </a>
    </div>
  );
}
