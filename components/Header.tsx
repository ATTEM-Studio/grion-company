"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "bg-bg/90 backdrop-blur border-b border-line"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#top"
          className="focus-ring inline-flex items-center"
          aria-label="그리온 홈"
        >
          <Image
            src="/grion-logo.png"
            alt={nav.logo}
            width={128}
            height={27}
            priority
            className="h-auto w-[112px] md:w-[128px]"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={nav.ctaHref}
            className="focus-ring inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            {nav.cta}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="focus-ring flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <span
            className={cn(
              "block h-[1.5px] w-6 bg-ink transition-transform duration-300",
              menuOpen && "translate-y-[6.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] w-6 bg-ink transition-opacity duration-300",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] w-6 bg-ink transition-transform duration-300",
              menuOpen && "-translate-y-[6.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-[64px] z-40 flex flex-col gap-1 bg-bg px-5 pb-8 pt-2 shadow-lg transition-[max-height,opacity] duration-300 md:hidden",
          menuOpen
            ? "max-h-[80vh] opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden opacity-0"
        )}
      >
        {nav.items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="focus-ring border-b border-line py-4 text-base font-medium text-ink"
          >
            {item.label}
          </a>
        ))}
        <a
          href={nav.ctaHref}
          onClick={() => setMenuOpen(false)}
          className="focus-ring mt-4 inline-flex items-center justify-center rounded-full bg-accent px-5 py-3.5 text-base font-semibold text-white"
        >
          {nav.cta}
        </a>
      </div>
    </header>
  );
}
