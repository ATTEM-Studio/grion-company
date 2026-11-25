import { formHref, landingCta, landingHero as h, reportSection } from "@/content/landing";
import { ReportPreview } from "./ReportPreview";
import { Rich } from "./Rich";

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
              <span key={line} className="block">
                {i === h.headlineAccentLine ? (
                  <span className="box-decoration-clone text-accent [background:linear-gradient(transparent_70%,var(--accent-soft)_70%)]">
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-xl text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
            <Rich text={h.sub} />
          </p>

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

          {/* 가격 강조 카드 */}
          <div className="mt-6 rounded-2xl border-2 border-accent bg-surface p-5 shadow-[0_16px_40px_-24px_rgba(43,63,234,0.6)]">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-extrabold text-ink">{h.priceLabel}</span>
              <span className="rounded-full bg-accent px-3 py-1 text-[12px] font-extrabold text-white">무료</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-3">
              <s className="text-xl font-semibold text-ink-faint decoration-2">{h.priceFrom}</s>
              <span aria-hidden="true" className="text-xl font-bold text-ink-faint">→</span>
              <span className="text-[48px] font-black leading-none tracking-tight text-accent">{h.priceTo}</span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {h.chips.map((c, i) => (
                <li
                  key={c}
                  className={
                    i === 0
                      ? "rounded-full bg-signal-warn-soft px-3 py-1 text-[13px] font-extrabold text-signal-warn"
                      : "rounded-full bg-accent-soft px-3 py-1 text-[13px] font-bold text-accent-strong"
                  }
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={formHref}
            className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(43,63,234,0.7)] transition-colors hover:bg-accent-strong sm:w-auto sm:inline-flex"
          >
            {landingCta}
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-3 text-[14px] text-ink-soft">
            <Rich text={h.microCopy} />
          </p>
        </div>

        <ReportPreview caption={reportSection.previewCaption} />
      </div>
    </section>
  );
}
