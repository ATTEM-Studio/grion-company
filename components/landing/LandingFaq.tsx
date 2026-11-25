"use client";

import { useState } from "react";
import { landingFaq } from "@/content/landing";
import { cn } from "@/lib/utils";

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-b border-line bg-bg-alt py-14 md:py-20">
      <div className="mx-auto max-w-[880px] px-5 md:px-8">
        <h2 className="text-[24px] font-extrabold tracking-tight text-ink sm:text-[30px]">{landingFaq.title}</h2>
        <div className="mt-7 border-t border-line">
          {landingFaq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`lfaq-${i}`}
                  className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[16px] font-bold text-ink">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line text-sm text-ink-faint transition-transform",
                      isOpen && "rotate-45 border-accent text-accent"
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`lfaq-${i}`}
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows] duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0">
                    <p className="pb-5 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
