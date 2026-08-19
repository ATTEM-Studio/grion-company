import { hero } from "@/content/site";
import { Reveal } from "./Reveal";
import { GrowthCalculator } from "./GrowthCalculator";

export function Hero() {
  return (
    <section
      id="top"
      className="depth-light grid-lines relative overflow-hidden border-b border-line pt-8 pb-20 md:pt-16 md:pb-28"
    >
      {/*
        Three grid items instead of two. On mobile they stack in DOM order —
        copy, calculator, trust — which lifts the calculator ~200px up the
        page so its interactivity is discoverable without scrolling. On lg
        the trust block tucks back under the copy in column 1 while the
        calculator spans both rows in column 2, restoring the intended
        two-column composition.
      */}
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-5 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-x-14 lg:gap-y-0">
        <div className="flex flex-col justify-center lg:col-start-1 lg:row-start-1">
          <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
            {hero.eyebrow}
          </Reveal>

          <h1 className="mt-5 text-[36px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[52px] md:text-[58px]">
            {hero.headline.map((line, i) => (
              <Reveal
                as="span"
                key={line}
                delayMs={i * 90}
                className={i === hero.headlineAccentLine ? "block text-accent" : "block"}
              >
                {line}
              </Reveal>
            ))}
          </h1>

          <div className="mt-6 max-w-lg space-y-1.5 text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            {hero.sub.map((line, i) => (
              <Reveal as="p" key={line} delayMs={300 + i * 70}>
                {line}
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={470} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={hero.primaryCtaHref}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-strong sm:text-base"
            >
              {hero.primaryCta}
              <span aria-hidden="true">→</span>
            </a>
            <a
              href={hero.secondaryCtaHref}
              className="focus-ring inline-flex items-center justify-center px-2 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink sm:text-base"
            >
              {hero.secondaryCta}
            </a>
          </Reveal>

        </div>

        <div className="flex flex-col items-stretch lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <GrowthCalculator />
          <Reveal delayMs={200} className="mt-3 text-center text-[12px] text-ink-faint">
            {hero.calcHint}
          </Reveal>
        </div>

        <Reveal
          delayMs={560}
          className="border-t border-line pt-6 lg:col-start-1 lg:row-start-2 lg:mt-9"
        >
          <p className="text-[13px] leading-relaxed text-ink-faint">{hero.trustMicro}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-faint">
            {hero.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-2">
                {i > 0 && <span className="text-line-strong">·</span>}
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
