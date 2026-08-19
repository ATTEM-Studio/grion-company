"use client";

import { useGrowth } from "@/lib/growth-context";
import { formatLeverValue, formatWon } from "@/lib/growth";
import { levers as copy } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * Turns the goal into the four numbers that could actually produce it.
 *
 * Because 매출 = 노출 × 유입률 × 방문률 × 객단가 is an exact identity,
 * "what would this lever alone have to become?" is just `lever × (goal /
 * current)`. When a rate would have to exceed 100% we say so plainly —
 * that impossibility is often the most useful thing on the page.
 */
export function LeverSection() {
  const { result } = useGrowth();
  const { levers, goalRevenue, currentRevenue, multiplier, goalReached, canCompute } = result;

  return (
    <section
      id="levers"
      className="depth-dark grid-lines-dark relative scroll-mt-20 overflow-hidden py-24 text-white md:py-32"
    >
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent-line">
          {copy.eyebrow}
        </Reveal>

        <Reveal
          as="h2"
          delayMs={60}
          className="mt-5 text-[28px] font-extrabold leading-[1.32] tracking-tight text-white sm:text-[36px] md:text-[42px]"
        >
          <span className="block">{copy.headline[0]}</span>
          <span className="block text-accent-line">{copy.headline[1]}</span>
        </Reveal>

        {!canCompute ? (
          <Reveal delayMs={120} className="mt-8 max-w-xl text-[16px] leading-relaxed text-white/60">
            {copy.emptyState}
          </Reveal>
        ) : goalReached ? (
          <Reveal delayMs={120} className="mt-8 max-w-xl text-[16px] leading-relaxed text-white/60">
            입력하신 숫자 기준으로는 이미 목표({formatWon(goalRevenue)})를 넘고 있습니다.
            목표를 더 높여서 다음 성장 지점을 확인해보세요.
          </Reveal>
        ) : (
          <>
            <Reveal delayMs={120} className="mt-8 max-w-2xl">
              <p className="text-[16px] leading-[1.8] text-white/70 md:text-[17px]">
                지금 {formatWon(currentRevenue)}에서 {formatWon(goalRevenue)}까지 가려면
                전체가 <span className="font-bold text-white">{multiplier.toFixed(2)}배</span>가
                되어야 합니다. 이 지표 하나만으로 목표에 도달한다고 가정하면, 각각 이만큼이
                되어야 합니다.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
              {levers.map((lever, i) => (
                <Reveal
                  key={lever.key}
                  delayMs={160 + i * 70}
                  className={cn(
                    "bg-navy p-6 sm:p-7",
                    lever.impossible && "bg-navy-soft"
                  )}
                >
                  <p className="text-[13px] font-semibold text-white/50">{lever.label}</p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="tnum text-[15px] font-medium text-white/45 line-through decoration-white/25">
                      {formatLeverValue(lever.current, lever.unit)}
                    </span>
                    <span className="text-white/30" aria-hidden="true">
                      →
                    </span>
                  </div>

                  {lever.impossible ? (
                    <>
                      <p className="mt-1 text-[22px] font-extrabold leading-tight text-white/85">
                        {copy.impossibleTitle}
                      </p>
                      <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                        {copy.impossibleBody}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="tnum mt-1 text-[30px] font-extrabold leading-tight text-accent-line sm:text-[34px]">
                        {formatLeverValue(lever.required ?? 0, lever.unit)}
                      </p>
                      {lever.strained && lever.plainRestatement && (
                        <p className="mt-2 text-[12px] leading-relaxed text-white/55">
                          {copy.strainedPrefix}
                          {lever.plainRestatement}
                          {copy.strainedSuffix}
                        </p>
                      )}
                    </>
                  )}
                </Reveal>
              ))}
            </div>

            <Reveal delayMs={460} className="mt-12 border-t border-white/12 pt-10">
              <p className="max-w-2xl text-[17px] font-bold leading-[1.75] text-white sm:text-xl">
                {copy.closingTitle}
              </p>
              <p className="mt-3 max-w-2xl text-[15px] leading-[1.8] text-white/60">
                {copy.closingBody}
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
