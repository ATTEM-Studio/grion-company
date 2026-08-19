import { qualification } from "@/content/site";
import { Reveal } from "./Reveal";

export function QualificationSection() {
  return (
    <section id="qualification" className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg-alt py-24 md:py-32">
      <div className="relative mx-auto max-w-[900px] px-5 md:px-8">
        <Reveal as="h2" className="text-[26px] font-extrabold leading-[1.4] tracking-tight text-ink sm:text-[32px] md:text-[38px]">
          {qualification.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>
        <Reveal delayMs={80} className="mt-3 text-sm text-ink-faint">
          {qualification.fitFrame}
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <Reveal className="text-sm font-bold text-accent">잘 맞는 경우</Reveal>
            <ul className="mt-5 space-y-4">
              {qualification.good.map((item, i) => (
                <Reveal
                  as="li"
                  key={item}
                  delayMs={i * 60}
                  className="flex gap-3 text-[15px] leading-relaxed text-ink-soft"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal delayMs={120} className="text-sm font-bold text-ink-faint">
              {qualification.notGoodLead}
            </Reveal>
            <ul className="mt-5 space-y-4">
              {qualification.notGood.map((item, i) => (
                <Reveal
                  as="li"
                  key={item}
                  delayMs={120 + i * 60}
                  className="flex gap-3 text-[15px] leading-relaxed text-ink-faint"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-line" />
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
