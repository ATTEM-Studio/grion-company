"use client";

import { useGrowth } from "@/lib/growth-context";
import { formatRate, formatWon } from "@/lib/growth";
import { calculator as copy } from "@/content/site";
import { cn } from "@/lib/utils";
import { NumberField } from "./NumberField";

/**
 * The hero's centerpiece. Every number here is either typed by the visitor
 * or computed from what they typed.
 *
 * Two things this panel is careful about:
 * - Only 방문 · 객단가 · 목표 are required. 노출/유입/재방문 are marked
 *   optional, because most owners don't have them to hand, and a blank
 *   field must never render as "0%" — that reads as a diagnosis.
 * - While the example values are still in place, the bottleneck callout
 *   says so explicitly, so a first-time visitor can't mistake the demo
 *   for a reading of their own business.
 */
export function GrowthCalculator() {
  const { inputs, setInput, reset, result, touched } = useGrowth();
  const { stages, weakestStage, currentRevenue, gap, goalReached, canCompute } = result;

  return (
    <div className="edge-in w-full rounded-2xl border border-line bg-surface panel-lift">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="text-[11px] font-bold tracking-[0.18em] text-ink-soft">
            GROWTH CALCULATOR
          </span>
        </div>
        {touched ? (
          <button
            type="button"
            onClick={reset}
            className="focus-ring rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-ink-faint transition-colors hover:text-ink"
          >
            {copy.resetLabel}
          </button>
        ) : (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent-strong">
            {copy.exampleBadge}
          </span>
        )}
      </div>

      {/* snapshot — dimmed until the required numbers are actually present */}
      <div
        className={cn(
          "grid grid-cols-2 gap-px border-b border-line bg-line transition-opacity",
          !canCompute && "opacity-45"
        )}
      >
        <div className="bg-surface px-5 py-4 sm:px-6">
          <p className="text-[11px] font-semibold text-ink-faint">현재 월매출</p>
          <p className="tnum mt-1 text-xl font-extrabold text-ink sm:text-2xl">
            {canCompute ? formatWon(currentRevenue) : "—"}
          </p>
          <p className="mt-1 text-[11px] text-ink-faint">방문 × 객단가</p>
        </div>
        <div className={cn("px-5 py-4 sm:px-6", goalReached ? "bg-signal-ok" : "bg-accent")}>
          <p className="text-[11px] font-semibold text-white/70">
            {goalReached ? "목표 달성" : "목표까지"}
          </p>
          <p className="tnum mt-1 text-xl font-extrabold text-white sm:text-2xl">
            {!canCompute ? "—" : goalReached ? "충족" : `+${formatWon(gap)}`}
          </p>
          <p className="mt-1 text-[11px] text-white/70">목표 − 현재</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-line bg-bg-alt px-5 py-2.5 sm:px-6">
        <span className="shrink-0 text-[11px] font-semibold text-ink-soft">목표 월매출</span>
        <NumberField
          value={inputs.goalRevenue}
          onChange={(v) => setInput("goalRevenue", v)}
          ariaLabel="목표 월매출"
          className="min-w-0 flex-1"
          inputClassName="py-1 text-[13px]"
          suffix="원"
        />
      </div>

      {!canCompute && (
        <div className="border-b border-line bg-bg-alt px-5 py-3 text-[12px] leading-relaxed text-ink-soft sm:px-6">
          {copy.needRequired}
        </div>
      )}

      {canCompute && weakestStage && (
        <div className="flex gap-3 border-b border-line bg-accent-soft px-5 py-3.5 sm:px-6">
          <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
            !
          </span>
          <div>
            <p className="text-[13px] font-bold text-accent-strong">
              {!touched && <span className="text-accent-strong/60">예시 기준 — </span>}
              {weakestStage.label} 구간에서 가장 많이 빠지고 있습니다
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-accent-strong/70">
              {touched ? copy.bottleneckNote : copy.bottleneckNoteExample}
            </p>
          </div>
        </div>
      )}

      <div className="px-5 py-4 sm:px-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-[0.18em] text-ink-faint">
            GROWTH FLOW
          </span>
          <span className="text-[11px] text-ink-faint">전환율</span>
        </div>

        <ul>
          {stages.map((stage) => {
            const isWeakest = canCompute && weakestStage?.key === stage.key;
            const isPercent = stage.unit === "%";
            const inputKey =
              stage.key === "impressions"
                ? "impressions"
                : stage.key === "visits"
                  ? "visits"
                  : stage.key === "customers"
                    ? "customers"
                    : stage.key === "aov"
                      ? "aov"
                      : "repeatRate";

            return (
              <li
                key={stage.key}
                className={cn(
                  "-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors",
                  isWeakest && "bg-accent-soft/70"
                )}
              >
                <span className="tnum w-5 shrink-0 text-[11px] font-bold text-ink-faint">
                  {stage.no}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "flex items-center gap-1.5 text-[15px] font-bold leading-tight",
                      isWeakest ? "text-accent-strong" : "text-ink"
                    )}
                  >
                    {stage.label}
                    {stage.optional && (
                      <span className="rounded bg-bg-alt px-1 py-px text-[9px] font-semibold text-ink-faint">
                        선택
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[11px] text-ink-faint">{stage.question}</p>
                </div>

                <NumberField
                  value={inputs[inputKey]}
                  onChange={(v) => setInput(inputKey, v)}
                  ariaLabel={`${stage.label} 입력`}
                  suffix={stage.unit}
                  max={isPercent ? 100 : undefined}
                  className="w-[104px] shrink-0 sm:w-[148px]"
                />

                <span
                  className={cn(
                    "tnum w-10 shrink-0 text-right text-[12px] font-bold sm:w-14",
                    stage.rate === null
                      ? "text-ink-faint"
                      : isWeakest
                        ? "text-accent"
                        : "text-ink-soft"
                  )}
                >
                  {stage.rate === null ? "—" : formatRate(stage.rate)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-line px-5 py-3 sm:px-6">
        <p className="text-[11px] leading-relaxed text-ink-faint">{copy.optionalHint}</p>
      </div>
    </div>
  );
}
