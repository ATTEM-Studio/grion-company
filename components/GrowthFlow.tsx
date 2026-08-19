import { growthFlow } from "@/content/site";
import { Reveal } from "./Reveal";

export function GrowthFlow() {
  return (
    <section
      id="growth-flow"
      className="depth-light grid-lines relative scroll-mt-20 overflow-hidden border-b border-line bg-bg py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {growthFlow.eyebrow}
        </Reveal>

        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-12">
          <Reveal
            as="h2"
            delayMs={60}
            className="text-[28px] font-extrabold leading-[1.32] tracking-tight text-ink sm:text-[36px] md:text-[42px]"
          >
            <span className="block">{growthFlow.headline[0]}</span>
            <span className="block text-accent">{growthFlow.headline[1]}</span>
          </Reveal>
          <Reveal
            as="p"
            delayMs={140}
            className="text-[15px] leading-[1.8] text-ink-soft md:pb-2"
          >
            {growthFlow.lead}
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {growthFlow.stages.map((stage, i) => (
            <Reveal
              key={stage.no}
              delayMs={i * 80}
              className="flex flex-col bg-surface p-6 lg:p-5"
            >
              <div className="flex items-baseline justify-between">
                <span className="tnum text-[11px] font-bold text-accent">{stage.no}</span>
                <span className="text-[11px] text-ink-faint">{stage.question}</span>
              </div>
              <p className="mt-4 text-[20px] font-extrabold text-ink lg:text-[22px]">
                {stage.title}
              </p>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink-soft">
                {stage.body}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {stage.items.slice(0, 5).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-bg-alt px-2.5 py-1 text-[11px] text-ink-soft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={200} className="mt-14 text-center">
          <p className="text-[19px] font-bold leading-[1.7] text-ink-soft sm:text-[22px]">
            {growthFlow.closing[0]}
            <br />
            {growthFlow.closing[1]}
            <br />
            <span className="font-extrabold text-accent">{growthFlow.closing[2]}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
