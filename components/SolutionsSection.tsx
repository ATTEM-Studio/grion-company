import { solutions } from "@/content/site";
import { Reveal } from "./Reveal";

export function SolutionsSection() {
  return (
    <section id="solutions" className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg-alt py-24 md:py-32">
      <div className="relative mx-auto max-w-[1000px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {solutions.eyebrow}
        </Reveal>
        <Reveal as="h2" delayMs={60} className="mt-5 text-[28px] font-extrabold leading-[1.32] tracking-tight text-ink sm:text-[36px] md:text-[42px]">
          {solutions.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>

        <div className="mt-16">
          {solutions.groups.map((group, i) => (
            <Reveal
              key={group.title}
              delayMs={i * 70}
              as="div"
              className="grid grid-cols-1 gap-3 border-t border-line py-8 first:border-t md:grid-cols-[1fr_1.3fr] md:gap-10 md:py-10"
            >
              <div>
                <p className="text-sm text-ink-faint">{group.condition}</p>
                <p className="mt-1.5 text-xl font-extrabold text-ink sm:text-2xl">
                  {group.title}
                </p>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-soft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>

        <Reveal delayMs={200} className="mt-16 rounded-2xl border border-accent-line bg-accent-soft px-7 py-8 text-center sm:px-10">
          <p className="text-[17px] leading-[1.8] text-accent-strong sm:text-lg">
            {solutions.closing[0]}
            <br />
            <span className="font-extrabold">{solutions.closing[1]}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
