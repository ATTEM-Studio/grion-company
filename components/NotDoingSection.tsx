import { notDoing } from "@/content/site";
import { Reveal } from "./Reveal";

export function NotDoingSection() {
  return (
    <section id="standard" className="depth-dark grid-lines-dark relative scroll-mt-20 overflow-hidden py-24 text-white md:py-32">
      <div className="relative mx-auto max-w-[860px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent-line">
          {notDoing.eyebrow}
        </Reveal>
        <Reveal as="h2" delayMs={60} className="mt-5 text-[28px] font-extrabold leading-[1.32] tracking-tight text-white sm:text-[36px] md:text-[42px]">
          {notDoing.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>

        <ul className="mt-14 border-t border-white/12">
          {notDoing.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.claim}
              delayMs={i * 70}
              className="flex flex-col gap-1.5 border-b border-white/12 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <p className="text-[17px] font-bold text-white md:text-lg">{item.claim}</p>
              <p className="text-sm text-white/50 sm:text-right">{item.reason}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delayMs={200} className="mt-16 text-center">
          <p className="text-xl font-bold leading-[1.75] text-white/70 sm:text-2xl">
            {notDoing.closing[0]}
            <br />
            <span className="font-extrabold text-white">{notDoing.closing[1]}</span>
            <br />
            {notDoing.closing[2]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
