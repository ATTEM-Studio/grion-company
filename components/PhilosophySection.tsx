import { philosophy } from "@/content/site";
import { Reveal } from "./Reveal";

export function PhilosophySection() {
  return (
    <section id="philosophy" className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg py-24 md:py-32">
      <div className="relative mx-auto max-w-[760px] px-5 text-center md:px-8">
        <Reveal as="span" className="text-xs font-bold tracking-[0.25em] text-accent">
          {philosophy.eyebrow}
        </Reveal>

        <Reveal as="h2" delayMs={80} className="mt-6 text-[28px] font-extrabold leading-[1.4] tracking-tight text-ink sm:text-[34px] md:text-[40px]">
          {philosophy.headline}
        </Reveal>

        <div className="mt-10 space-y-6">
          {philosophy.body.map((p, i) => (
            <Reveal
              key={p}
              delayMs={160 + i * 90}
              as="p"
              className="whitespace-pre-line text-[16px] leading-[1.9] text-ink-soft md:text-lg"
            >
              {p}
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={480} className="mt-14 border-t border-line pt-10">
          <p className="text-xl font-bold leading-[1.7] text-ink-soft sm:text-2xl">
            {philosophy.closing[0]}
            <br />
            <span className="font-extrabold text-accent">{philosophy.closing[1]}</span>
          </p>
          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-ink-faint">
            {philosophy.brand}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
