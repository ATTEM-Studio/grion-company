"use client";

import { useGrowth } from "@/lib/growth-context";
import { formatNumber, formatWon, GRION_STANDARDS } from "@/lib/growth";
import { budget as copy } from "@/content/site";
import { cn } from "@/lib/utils";
import { NumberField } from "./NumberField";
import { Reveal } from "./Reveal";

/**
 * Checks the goal against GRION's own operating standards:
 *
 *   월세 + 마케팅비 ≤ 목표 매출의 10%
 *   신규 고객 1명당 비용(CAC) ≤ 객단가의 25%
 *   재방문율 기준은 객단가 구간별로 다름
 *
 * These are GRION's criteria, not industry statistics, and the copy says
 * so on screen. The payoff is that the arithmetic often lands on GRION's
 * central claim by itself: when the affordable number of new customers
 * falls short of the goal, spending more on ads is not the answer —
 * which is exactly what the brand has been asserting in words.
 */
export function BudgetSection() {
  const { inputs, setInput, result } = useGrowth();
  const { standards, canCompute, goalReached } = result;

  return (
    <section
      id="budget"
      className="depth-light grid-lines relative scroll-mt-20 overflow-hidden border-b border-line bg-bg py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {copy.eyebrow}
        </Reveal>

        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-12">
          <Reveal
            as="h2"
            delayMs={60}
            className="text-[28px] font-extrabold leading-[1.32] tracking-tight text-ink sm:text-[36px] md:text-[42px]"
          >
            <span className="block">{copy.headline[0]}</span>
            <span className="block text-accent">{copy.headline[1]}</span>
          </Reveal>
          <Reveal as="p" delayMs={140} className="text-[15px] leading-[1.8] text-ink-soft md:pb-2">
            {copy.lead}
          </Reveal>
        </div>

        {/* rent input — the one number every owner knows cold */}
        <Reveal delayMs={180} className="mt-12 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4">
          <span className="text-[13px] font-bold text-ink">{copy.rentLabel}</span>
          <NumberField
            value={inputs.rent}
            onChange={(v) => setInput("rent", v)}
            ariaLabel="월세 입력"
            suffix="원"
            className="w-[190px]"
          />
          <span className="text-[12px] text-ink-faint">{copy.rentHint}</span>
        </Reveal>

        {!canCompute ? (
          <Reveal delayMs={220} className="mt-8 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            {copy.emptyState}
          </Reveal>
        ) : (
          standards && (
            <>
              <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                <Reveal delayMs={220} className="bg-surface p-6">
                  <p className="text-[12px] font-semibold text-ink-faint">{copy.ceilingLabel}</p>
                  <p className="tnum mt-2 text-[26px] font-extrabold text-ink">
                    {formatWon(standards.fixedCostCeiling)}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                    목표 매출의 {Math.round(GRION_STANDARDS.fixedCostRatio * 100)}%
                  </p>
                </Reveal>

                <Reveal delayMs={280} className="bg-surface p-6">
                  <p className="text-[12px] font-semibold text-ink-faint">{copy.budgetLabel}</p>
                  <p
                    className={cn(
                      "tnum mt-2 text-[26px] font-extrabold",
                      standards.budgetOverrun ? "text-signal-warn" : "text-accent"
                    )}
                  >
                    {standards.budgetOverrun ? "여력 없음" : formatWon(standards.marketingBudget)}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                    상한 − 월세 {formatWon(standards.rent)}
                  </p>
                </Reveal>

                <Reveal delayMs={340} className="bg-surface p-6">
                  <p className="text-[12px] font-semibold text-ink-faint">{copy.cacLabel}</p>
                  <p className="tnum mt-2 text-[26px] font-extrabold text-ink">
                    {formatWon(standards.targetCac)}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                    객단가의 {Math.round(GRION_STANDARDS.cacRatio * 100)}%
                  </p>
                </Reveal>

                <Reveal delayMs={400} className="bg-surface p-6">
                  <p className="text-[12px] font-semibold text-ink-faint">{copy.repeatLabel}</p>
                  <p className="tnum mt-2 text-[26px] font-extrabold text-ink">
                    {standards.targetRepeatRate}%
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                    {copy.repeatBandNote}
                  </p>
                </Reveal>
              </div>

              {/* the verdict — where the arithmetic meets the brand thesis */}
              {!goalReached && (
                <Reveal
                  delayMs={460}
                  className={cn(
                    "mt-8 rounded-2xl border p-7 sm:p-9",
                    standards.reachableByAcquisition
                      ? "border-accent-line bg-accent-soft"
                      : "border-line bg-surface"
                  )}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
                    <div>
                      <p className="text-[12px] font-semibold text-ink-faint">
                        {copy.neededLabel}
                      </p>
                      <p className="tnum mt-1.5 text-[28px] font-extrabold text-ink">
                        {formatNumber(standards.neededExtraCustomers)}명
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-ink-faint">
                        {copy.affordableLabel}
                      </p>
                      <p
                        className={cn(
                          "tnum mt-1.5 text-[28px] font-extrabold",
                          standards.reachableByAcquisition ? "text-accent" : "text-signal-warn"
                        )}
                      >
                        {formatNumber(standards.affordableNewCustomers)}명
                      </p>
                    </div>
                  </div>

                  <p className="mt-7 border-t border-line pt-6 text-[16px] font-bold leading-[1.7] text-ink sm:text-[17px]">
                    {standards.budgetOverrun
                      ? copy.verdictOverrun
                      : standards.reachableByAcquisition
                        ? copy.verdictReachable
                        : copy.verdictShort}
                  </p>

                  {!standards.reachableByAcquisition && standards.repeatShortfall !== null && standards.repeatShortfall > 0 && (
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                      지금 재방문율은 {inputs.repeatRate}%로, 이 객단가 구간의 그리온 기준
                      {" "}{standards.targetRepeatRate}%보다 {standards.repeatShortfall}%p 낮습니다.
                      {" "}{copy.repeatAdvice}
                    </p>
                  )}
                </Reveal>
              )}
            </>
          )
        )}

        <Reveal delayMs={520} className="mt-8 text-[12px] leading-relaxed text-ink-faint">
          {copy.disclaimer}
        </Reveal>
      </div>
    </section>
  );
}
