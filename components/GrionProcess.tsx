"use client";

import { useEffect, useRef, useState } from "react";
import { process } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function GrionProcess() {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target as HTMLLIElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg-alt py-24 md:py-32">
      <div className="relative mx-auto max-w-[900px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {process.eyebrow}
        </Reveal>
        <Reveal as="h2" delayMs={60} className="mt-5 text-[28px] font-extrabold tracking-tight text-ink sm:text-[36px] md:text-[42px]">
          {process.headline}
        </Reveal>

        <ol className="relative mt-16">
          <span
            className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-line sm:block"
            aria-hidden="true"
          />
          {process.steps.map((step, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <li
                key={step.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="relative flex items-start gap-5 pb-10 last:pb-0 sm:gap-7"
              >
                <span
                  className={cn(
                    "relative z-10 mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full border text-xs font-bold transition-all duration-300",
                    isActive
                      ? "scale-110 border-accent bg-accent text-white"
                      : isPast
                        ? "border-accent-line bg-accent-soft text-accent-strong"
                        : "border-line bg-surface text-ink-faint"
                  )}
                >
                  {i + 1}
                </span>
                <div
                  className={cn(
                    "flex-1 border-b border-line pb-8 transition-opacity duration-300 sm:border-none sm:pb-0",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-bold tracking-[0.15em]",
                      isActive ? "text-accent" : "text-ink-faint"
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-lg font-bold sm:text-xl",
                      isActive ? "text-ink" : "text-ink-soft"
                    )}
                  >
                    {step.caption}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <Reveal delayMs={160} className="mt-16 text-center">
          <p className="text-lg font-bold tracking-tight text-ink sm:text-xl">
            {process.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
