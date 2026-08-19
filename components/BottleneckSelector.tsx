"use client";

import { useState } from "react";
import { bottleneckSelector } from "@/content/site";
import { cn } from "@/lib/utils";
import { BOTTLENECK_SELECTED_EVENT, type BottleneckSelectedDetail } from "@/lib/events";
import { Reveal } from "./Reveal";

function dispatchConcern(lead: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<BottleneckSelectedDetail>(BOTTLENECK_SELECTED_EVENT, {
      detail: { concern: `${lead} — 이 부분부터 확인하고 싶습니다.` },
    })
  );
}

export function BottleneckSelector() {
  const [activeKey, setActiveKey] = useState(bottleneckSelector.options[0].key);
  const active =
    bottleneckSelector.options.find((o) => o.key === activeKey) ??
    bottleneckSelector.options[0];

  return (
    <section className="depth-light relative overflow-hidden border-b border-line bg-bg py-24 md:py-32">
      <div className="relative mx-auto max-w-[1000px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {bottleneckSelector.eyebrow}
        </Reveal>
        <Reveal as="h2" delayMs={60} className="mt-5 text-[28px] font-extrabold leading-[1.32] tracking-tight text-ink sm:text-[36px] md:text-[42px]">
          {bottleneckSelector.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>

        <Reveal delayMs={120}>
          <div
            role="tablist"
            aria-label="성장 병목 유형 선택"
            className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {bottleneckSelector.options.map((option) => {
              const isActive = option.key === activeKey;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveKey(option.key);
                    dispatchConcern(option.lead);
                  }}
                  className={cn(
                    "focus-ring rounded-xl border px-4 py-4 text-left text-[15px] font-bold transition-colors sm:text-base",
                    isActive
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-surface text-ink-soft hover:border-accent-line hover:text-ink"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          key={active.key}
          role="tabpanel"
          className="reveal is-visible mt-8 rounded-2xl border border-line bg-surface p-7 sm:p-10"
        >
          <p className="text-lg font-bold leading-relaxed text-ink sm:text-xl">{active.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {active.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-accent-line bg-accent-soft px-3.5 py-1.5 text-[13px] font-medium text-accent-strong"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">{active.note}</p>
          <div className="mt-7 border-t border-line pt-6">
            <a
              href="#diagnosis"
              onClick={() => dispatchConcern(active.lead)}
              className="focus-ring inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent"
            >
              이 문제부터 확인하고 싶다면
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <Reveal delayMs={160} className="mt-14 text-center">
          <p className="text-2xl font-extrabold text-ink sm:text-[28px]">
            {bottleneckSelector.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
