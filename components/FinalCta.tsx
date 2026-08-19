import { finalCta } from "@/content/site";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="depth-dark grid-lines-dark relative overflow-hidden py-24 text-white md:py-28">
      <div className="relative mx-auto max-w-[760px] px-5 text-center md:px-8">
        <Reveal as="h2" className="text-[28px] font-extrabold leading-[1.4] tracking-tight text-white sm:text-[34px] md:text-[40px]">
          {finalCta.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>

        <Reveal delayMs={100} className="mt-9 space-y-1 text-[16px] leading-[1.75] text-white/65 md:text-lg">
          {finalCta.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="pt-3 font-medium text-white">{finalCta.bodyClosing}</p>
        </Reveal>

        <Reveal delayMs={200} className="mt-10 flex flex-col items-center gap-3">
          <a
            href="#diagnosis"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-accent-strong transition-colors hover:bg-accent-soft"
          >
            {finalCta.primaryCta}
          </a>
          <span className="text-xs text-white/50">{finalCta.duration}</span>
        </Reveal>

        <Reveal delayMs={260} className="mt-8 text-sm leading-relaxed text-white/50">
          {finalCta.microCopy}
        </Reveal>
      </div>
    </section>
  );
}
