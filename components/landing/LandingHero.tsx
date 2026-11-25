import { formHref, landingCta, landingHero as h, reportSection } from "@/content/landing";
import { ReportPreview } from "./ReportPreview";

export function LandingHero() {
  return (
    <section id="top" className="depth-light grid-lines relative overflow-hidden border-b border-line pt-7 pb-14 md:pt-14 md:pb-20">
      <div className="relative mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-5 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div>
          <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-[12px] font-bold text-accent-strong">
            {h.badge}
          </span>

          <h1 className="mt-4 text-[30px] font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[42px] md:text-[48px]">
            {h.headline.map((line, i) => (
              <span key={line} className={i === h.headlineAccentLine ? "block text-accent" : "block"}>
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-ink-soft md:text-[17px]">{h.sub}</p>

          <ul className="mt-5 space-y-2">
            {h.gets.map((g) => (
              <li key={g} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent text-[11px] text-white" aria-hidden="true">
                  ✓
                </span>
                {g}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-baseline gap-2.5">
            <s className="text-lg font-medium text-ink-faint">{h.priceFrom}</s>
            <span className="text-[34px] font-extrabold leading-none tracking-tight text-ink">{h.priceTo}</span>
          </div>
          <p className="mt-1.5 text-[13px] font-medium text-ink-soft">{h.priceNote}</p>

          <a
            href={formHref}
            className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(43,63,234,0.7)] transition-colors hover:bg-accent-strong sm:w-auto sm:inline-flex"
          >
            {landingCta}
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-3 text-[13px] text-ink-faint">{h.microCopy}</p>
        </div>

        <ReportPreview caption={reportSection.previewCaption} />
      </div>
    </section>
  );
}
