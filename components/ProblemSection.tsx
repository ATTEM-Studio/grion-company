import { problem } from "@/content/site";
import { Reveal } from "./Reveal";

export function ProblemSection() {
  return (
    <section className="depth-light relative overflow-hidden border-b border-line bg-bg-alt py-24 md:py-32">
      <div className="relative mx-auto max-w-[860px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {problem.eyebrow}
        </Reveal>
        <Reveal as="h2" delayMs={60} className="mt-5 text-[26px] font-extrabold leading-[1.4] tracking-tight text-ink sm:text-[32px] md:text-[38px]">
          {problem.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>

        <ul className="mt-14 space-y-0 border-t border-line">
          {problem.items.map((item, i) => (
            <Reveal as="li" key={item} delayMs={i * 70} className="flex gap-5 border-b border-line py-6">
              <span className="mt-0.5 flex-none text-sm font-bold text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[17px] leading-[1.7] text-ink-soft md:text-lg">{item}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal delayMs={200} className="mt-16 text-center">
          <p className="text-2xl font-extrabold leading-[1.5] text-ink sm:text-[28px]">
            {problem.emphasis[0]}
            <br />
            <span className="text-accent">{problem.emphasis[1]}</span>
          </p>
        </Reveal>

        <Reveal delayMs={280} className="mt-14 rounded-2xl border border-line bg-surface px-7 py-8 text-center sm:px-10">
          <p className="text-[15px] text-ink-faint">{problem.closing.lead}</p>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft sm:text-xl">
            {problem.closing.from}
            <br />
            <span className="font-bold text-ink">{problem.closing.to}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
