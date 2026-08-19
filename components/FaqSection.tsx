"use client";

import { useState } from "react";
import { faq } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg py-24 md:py-32">
      <div className="relative mx-auto max-w-[760px] px-5 md:px-8">
        <Reveal as="h2" className="text-[26px] font-extrabold leading-[1.4] tracking-tight text-ink sm:text-[32px] md:text-[38px]">
          {faq.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>

        <div className="mt-12 border-t border-line">
          {faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal as="div" key={item.q} delayMs={i * 60} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="focus-ring flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-[16px] font-bold text-ink sm:text-lg">{item.q}</span>
                  <span
                    className={cn(
                      "flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line text-sm text-ink-faint transition-transform duration-300",
                      isOpen && "rotate-45 border-accent text-accent"
                    )}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows] duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0">
                    <p className="pb-6 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
