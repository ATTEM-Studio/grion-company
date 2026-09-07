import { revenueValve } from "@/content/revenueValve";
import { Reveal } from "./Reveal";

export function GrowthFlow() {
  return (
    <section
      id="growth-flow"
      className="depth-light grid-lines relative scroll-mt-20 overflow-hidden border-b border-line bg-bg py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {revenueValve.eyebrow}
        </Reveal>

        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-12">
          <Reveal
            as="h2"
            delayMs={60}
            className="text-[28px] font-extrabold leading-[1.32] tracking-tight text-ink sm:text-[36px] md:text-[42px]"
          >
            <span className="block">{revenueValve.headline[0]}</span>
            <span className="block text-accent">{revenueValve.headline[1]}</span>
          </Reveal>
          <Reveal
            as="p"
            delayMs={140}
            className="text-[15px] leading-[1.8] text-ink-soft md:pb-2"
          >
            {revenueValve.lead}
          </Reveal>
        </div>

        <Reveal delayMs={180} className="mt-10">
          <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:gap-3 sm:px-5">
            <span className="mr-1 text-[11px] font-extrabold text-ink">
              {revenueValve.formulaLabel}
            </span>
            {revenueValve.formula.map((item, index) => (
              <span key={item} className="contents">
                <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[11px] font-extrabold text-accent">
                  {item}
                </span>
                {index < revenueValve.formula.length - 1 ? (
                  <span aria-hidden="true" className="text-[12px] font-bold text-ink-faint">→</span>
                ) : null}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="relative mt-16 md:mt-20">
          <div
            aria-hidden="true"
            className="absolute left-[9%] right-[9%] top-[-18px] hidden h-2 rounded-full bg-line md:block"
          >
            <div className="h-full w-full rounded-full bg-gradient-to-r from-accent via-accent/75 to-accent/30" />
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-3">
            {revenueValve.valves.map((valve, index) => (
              <Reveal
                key={valve.no}
                delayMs={index * 90}
                className="relative flex flex-col rounded-2xl border border-line bg-surface px-5 pb-6 pt-11 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[7px] border-ink bg-surface shadow-[0_8px_22px_rgba(15,23,42,0.14)]"
                >
                  <span className="absolute h-1.5 w-10 rounded-full bg-accent" />
                  <span className="absolute h-10 w-1.5 rounded-full bg-accent" />
                  <span className="relative z-10 h-3 w-3 rounded-full bg-ink" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="tnum flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-[10px] font-extrabold text-accent">
                    {valve.no}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.12em] text-ink-faint">
                    VALVE
                  </span>
                </div>

                <h3 className="mt-5 text-[24px] font-extrabold tracking-tight text-ink">
                  {valve.title}
                </h3>
                <p className="mt-2 min-h-[46px] text-[13px] font-bold leading-[1.6] text-ink">
                  {valve.question}
                </p>
                <p className="mt-3 flex-1 text-[12.5px] leading-[1.75] text-ink-soft">
                  {valve.body}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {valve.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-bg-alt px-2.5 py-1 text-[10px] text-ink-soft"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <p className="mt-4 border-l-2 border-accent pl-3 text-[11px] font-semibold leading-[1.6] text-ink-soft">
                  {valve.principle}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delayMs={360} className="mt-6 md:mt-8">
          <div className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-[24px] bg-ink p-6 text-white sm:p-8 md:grid-cols-[180px_1fr] md:gap-9">
            <div className="relative mx-auto flex h-[150px] w-[150px] items-center justify-center">
              <svg
                viewBox="0 0 160 160"
                role="img"
                aria-label="객단가를 나타내는 수압 게이지"
                className="h-full w-full"
              >
                <circle cx="80" cy="80" r="58" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" />
                <path
                  d="M 39 121 A 58 58 0 1 1 121 121"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="text-accent"
                />
                <line x1="80" y1="82" x2="116" y2="57" stroke="white" strokeWidth="5" strokeLinecap="round" />
                <circle cx="80" cy="82" r="8" fill="white" />
              </svg>
              <span className="absolute bottom-2 text-[9px] font-extrabold tracking-[0.18em] text-white/50">
                PRESSURE
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold tracking-[0.16em] text-accent">
                {revenueValve.pressure.eyebrow}
              </span>
              <h3 className="mt-2 text-[28px] font-extrabold tracking-tight text-white sm:text-[32px]">
                {revenueValve.pressure.title}
              </h3>
              <p className="mt-1 text-[15px] font-bold text-white">
                {revenueValve.pressure.question}
              </p>
              <p className="mt-3 max-w-[720px] text-[13px] leading-[1.8] text-white/65">
                {revenueValve.pressure.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {revenueValve.pressure.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {revenueValve.rules.map((rule, index) => (
            <Reveal key={rule.title} delayMs={400 + index * 70} className="bg-surface p-5 md:p-6">
              <span className="tnum text-[10px] font-extrabold text-accent">0{index + 1}</span>
              <h3 className="mt-3 text-[15px] font-extrabold text-ink">{rule.title}</h3>
              <p className="mt-2 text-[12px] leading-[1.7] text-ink-soft">{rule.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={620} className="mt-12 text-center md:mt-14">
          <p className="text-[15px] font-semibold text-ink-soft">{revenueValve.closing.lead}</p>
          <p className="mt-1 text-[22px] font-extrabold leading-[1.45] tracking-tight text-ink sm:text-[26px]">
            {revenueValve.closing.emphasis}
          </p>
          <p className="mt-3 text-[14px] font-bold text-accent">{revenueValve.closing.action}</p>
        </Reveal>
      </div>
    </section>
  );
}
