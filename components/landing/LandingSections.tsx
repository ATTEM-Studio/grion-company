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
import { ClientChatMarquee } from "./ClientChatMarquee";

const wrap = "relative mx-auto max-w-[880px] px-5 md:px-8";
const h2 = "text-[24px] font-extrabold leading-[1.35] tracking-tight text-ink sm:text-[30px]";

export function PainsSection() {
  return (
    <section className="border-b border-line bg-bg py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>
          <Rich text={pains.title} />
        </h2>
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
        <p className="mt-3 text-[15px] text-ink-soft md:text-base">
          <Rich text={reportSection.lead} />
        </p>
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
              className={`flex gap-4 rounded-2xl bg-surface p-5 md:block ${
                s.no === "3" ? "border-2 border-accent" : "border border-line"
              }`}
            >
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {s.no}
              </span>
              <div className="md:mt-3">
                <p className="text-[17px] font-extrabold text-ink">{s.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                  <Rich text={s.body} />
                </p>
              </div>
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
        <p className="text-[12px] font-bold tracking-[0.18em] text-accent">{trust.eyebrow}</p>
        <h2 className={`${h2} mt-2`}>{trust.title}</h2>

        {/* 회사 카드 */}
        <div className="depth-dark relative mt-7 overflow-hidden rounded-2xl bg-navy p-6 text-white md:p-8">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-line" aria-hidden="true" />
            <p className="text-[15px] font-extrabold tracking-wide">{trust.company}</p>
          </div>
          <p className="mt-3 text-[17px] font-bold leading-relaxed text-white/90 md:text-[19px]">{trust.positioning}</p>
          <ul className="mt-6 grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-3">
            {trust.items.map((t, i) => (
              <li
                key={t.big}
                className={`flex items-center gap-4 rounded-xl px-4 py-4 md:block ${
                  i === 0 ? "bg-accent" : "bg-white/[0.07] ring-1 ring-white/10"
                }`}
              >
                <span className="w-[92px] flex-none text-[34px] font-black leading-none tracking-tight text-white md:block md:w-auto md:text-[40px]">
                  {t.big}
                </span>
                <span className="block md:mt-2">
                  <span className="block text-[15px] font-semibold text-white/90 md:text-[14px]">{t.label}</span>
                  {"sub" in t && t.sub && <span className="mt-0.5 block text-[12px] text-white/55">{t.sub}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 진단 기준 5단계 */}
        <div className="mt-10">
          <p className="text-[18px] font-extrabold leading-snug text-ink md:text-[20px]">
            <Rich text={trust.methodTitle} />
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            <Rich text={trust.methodLead} />
          </p>
          <ol className="relative mt-6 grid grid-cols-1 gap-2.5 md:grid-cols-5 md:gap-3">
            {trust.steps.map((st) => (
              <li
                key={st.no}
                className="flex gap-4 rounded-2xl border border-line bg-surface p-4 md:flex-col md:gap-3 md:p-5"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent text-[13px] font-black text-white">
                  {st.no}
                </span>
                <div>
                  <p className="text-[16px] font-extrabold text-ink">{st.plain}</p>
                  <span className="mt-1 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent-strong">
                    {st.name}
                  </span>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{st.check}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-right text-[12px] font-semibold text-ink-faint">{trust.methodName}</p>
        </div>

        {/* 약속 */}
        <ul className="mt-8 space-y-2.5 rounded-2xl border border-line bg-surface p-5 md:p-6">
          {trust.promises.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] text-ink">
              <span
                className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent text-[11px] text-white"
                aria-hidden="true"
              >
                ✓
              </span>
              <span>
                <Rich text={p} />
              </span>
            </li>
          ))}
        </ul>

        <a
          href="#client-messages"
          className="focus-ring mt-6 inline-flex items-center gap-1.5 text-[15px] font-bold text-accent hover:text-accent-strong"
        >
          {trust.proofLink}
          <span aria-hidden="true">↓</span>
        </a>
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
            <div key={r.k} className="grid grid-cols-[104px_1fr] gap-3 sm:grid-cols-[120px_1fr] border-b border-line px-5 py-3.5 last:border-b-0">
              <dt className="text-[14px] text-ink-faint">{r.k}</dt>
              <dd className="text-[15px] font-semibold text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <ClientChatMarquee />
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
        <p className="mt-4 text-[13px] text-white/60">
          <Rich text={finalCtaCopy.note} tone="dark" />
        </p>
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
