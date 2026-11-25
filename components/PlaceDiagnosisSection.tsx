import { placeDiagnosis as p } from "@/content/site";
import { Reveal } from "./Reveal";

// 무료 네이버 플레이스 진단 소개 — 리포트 구성, 조건, 가격, 신뢰 근거.
// 문구는 content/site.ts 의 placeDiagnosis 에서 수정합니다.
export function PlaceDiagnosisSection() {
  return (
    <section
      id="place-diagnosis"
      className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg-alt py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-[1000px] px-5 md:px-8">
        <Reveal as="span" className="text-[11px] font-bold tracking-[0.2em] text-accent">
          {p.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          delayMs={60}
          className="mt-5 text-[28px] font-extrabold leading-[1.32] tracking-tight text-ink sm:text-[36px] md:text-[42px]"
        >
          {p.headline.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </Reveal>
        <Reveal as="p" delayMs={120} className="mt-5 max-w-xl text-[16px] leading-[1.75] text-ink-soft md:text-[17px]">
          {p.lead}
        </Reveal>

        {/* 리포트 3가지 */}
        <Reveal as="p" delayMs={140} className="mt-14 text-sm font-bold text-ink">
          {p.reportTitle}
        </Reveal>
        <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {p.report.map((r, i) => (
            <Reveal
              as="li"
              key={r.title}
              delayMs={160 + i * 70}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <span className="text-[11px] font-bold tracking-[0.14em] text-accent">{r.no}</span>
              <p className="mt-2 text-lg font-extrabold text-ink">{r.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{r.body}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delayMs={200} className="mt-4 rounded-2xl border-l-4 border-accent bg-surface px-6 py-5">
          <p className="text-[15px] font-bold text-ink">{p.basis}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-ink-soft">
            {p.flow.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                )}
                {step}
              </span>
            ))}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          {/* 진행 방식과 조건 */}
          <Reveal delayMs={120}>
            <p className="text-sm font-bold text-ink">{p.termsTitle}</p>
            <dl className="mt-4 border-t border-line">
              {p.terms.map((t) => (
                <div key={t.k} className="grid grid-cols-[56px_1fr] gap-3 border-b border-line py-4">
                  <dt className="text-[15px] font-extrabold text-accent">{t.k}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink">{t.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* 가격과 혜택 */}
          <Reveal delayMs={180}>
            <p className="text-sm font-bold text-ink">{p.offerTitle}</p>
            <div className="mt-4 space-y-3">
              {p.offers.map((o) => (
                <div key={o.k} className="rounded-2xl bg-navy p-6 text-white">
                  <p className="text-[13px] text-white/60">{o.k}</p>
                  <p className="mt-1 text-[28px] font-extrabold tracking-tight">
                    {o.strike && (
                      <s className="mr-2 text-lg font-medium text-white/40">{o.strike}</s>
                    )}
                    {o.v}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{o.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* 신뢰 근거 */}
        <Reveal delayMs={120} className="mt-14">
          <p className="text-sm font-bold text-ink">{p.trustTitle}</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {p.trust.map((t) => (
              <li key={t.big} className="rounded-2xl border border-line bg-surface px-6 py-5">
                <span className="block text-[28px] font-extrabold tracking-tight text-accent">{t.big}</span>
                <span className="mt-1 block text-[15px] text-ink-soft">{t.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delayMs={160} className="mt-12 flex justify-center">
          <a
            href="#diagnosis"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            {p.cta}
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
