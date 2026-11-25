import {
  afterDiagnosis,
  finalCtaCopy,
  formHref,
  landingCta,
  pains,
  reportSection,
  steps,
  trust,
} from "@/content/landing";
import { Rich } from "./Rich";

const wrap = "relative mx-auto max-w-[880px] px-5 md:px-8";
const h2 = "text-[24px] font-extrabold leading-[1.35] tracking-tight text-ink sm:text-[30px]";

export function PainsSection() {
  return (
    <section className="border-b border-line bg-bg py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>{pains.title}</h2>
        <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {pains.items.map((p) => (
            <li
              key={p}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-4 text-[15px] font-semibold text-ink"
            >
              <span className="h-4 w-4 flex-none rounded border-2 border-accent" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ReportSection() {
  return (
    <section className="border-b border-line bg-bg-alt py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>{reportSection.title}</h2>
        <p className="mt-3 text-[15px] text-ink-soft md:text-base">{reportSection.lead}</p>
        <ol className="mt-8 space-y-3">
          {reportSection.items.map((r) => (
            <li key={r.no} className="rounded-2xl border border-line bg-surface p-5 md:p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-bold text-accent">{r.no}</span>
                <p className="text-lg font-extrabold text-ink">{r.title}</p>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{r.body}</p>
              <p className="mt-3 rounded-lg border-l-4 border-accent bg-accent-soft px-4 py-3 text-[15px] font-semibold text-ink">
                <span className="mr-1 font-black text-accent" aria-hidden="true">→</span>
                <Rich text={r.answer} />
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-2xl bg-navy px-6 py-5 text-[18px] font-bold leading-relaxed text-white/85 md:text-[20px]">
          <Rich text={reportSection.basis} tone="dark" />
        </p>
      </div>
    </section>
  );
}

export function StepsSection() {
  return (
    <section className="border-b border-line bg-bg py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>{steps.title}</h2>
        <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {steps.items.map((s) => (
            <li
              key={s.no}
              className={s.no === "3" ? "rounded-2xl border-2 border-accent bg-surface p-5" : "rounded-2xl border border-line bg-surface p-5"}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {s.no}
              </span>
              <p className="mt-3 text-[17px] font-extrabold text-ink">{s.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                <Rich text={s.body} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="border-b border-line bg-bg-alt py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>{trust.title}</h2>
        <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {trust.items.map((t) => (
            <li key={t.big} className="rounded-2xl border border-line bg-surface px-5 py-5">
              <span className="block text-[30px] font-extrabold tracking-tight text-accent">{t.big}</span>
              <span className="mt-1 block text-[15px] text-ink-soft">{t.label}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 space-y-2">
          {trust.promises.map((p) => (
            <li key={p} className="flex gap-2.5 text-[15px] font-semibold text-ink">
              <span className="text-accent" aria-hidden="true">✓</span>
              <span>
                <Rich text={p} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AfterDiagnosisSection() {
  return (
    <section className="border-b border-line bg-bg py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>{afterDiagnosis.title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-base">
          <Rich text={afterDiagnosis.lead} />
        </p>
        <dl className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
          {afterDiagnosis.rows.map((r) => (
            <div key={r.k} className="grid grid-cols-[120px_1fr] gap-3 border-b border-line px-5 py-3.5 last:border-b-0">
              <dt className="text-[14px] text-ink-faint">{r.k}</dt>
              <dd className="text-[15px] font-semibold text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function LandingFinalCta() {
  return (
    <section className="depth-dark grid-lines-dark relative overflow-hidden py-16 text-white md:py-20">
      <div className="relative mx-auto max-w-[760px] px-5 text-center md:px-8">
        <h2 className="text-[24px] font-extrabold leading-[1.4] tracking-tight sm:text-[32px]">
          {finalCtaCopy.title.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </h2>
        <a
          href={formHref}
          className="focus-ring mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-accent-strong transition-colors hover:bg-accent-soft"
        >
          {landingCta}
          <span aria-hidden="true">→</span>
        </a>
        <p className="mt-4 text-[13px] text-white/60">{finalCtaCopy.note}</p>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-navy-deep py-10 text-[13px] text-white/50">
      <div className="mx-auto max-w-[1120px] space-y-1 px-5 md:px-8">
        <p className="font-bold text-white/80">그리온컴퍼니 (GRION COMPANY)</p>
        <p>문의 hello@grioncompany.com</p>
        <p>© {new Date().getFullYear()} GRION COMPANY</p>
      </div>
    </footer>
  );
}
