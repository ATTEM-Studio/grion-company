import Image from "next/image";
import { kakaoChannelUrl, thanksHero, thanksOffer, thanksProcess, thanksValue } from "@/content/thanks";
import { Rich } from "./Rich";

const wrap = "relative mx-auto max-w-[880px] px-5 md:px-8";
const h2 = "text-[24px] font-extrabold leading-[1.35] tracking-tight text-ink sm:text-[30px]";

export function ThanksHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center px-5 py-3 md:px-8">
        <Image src="/grion-logo.png" alt="GRION" width={128} height={27} priority className="h-auto w-[104px] md:w-[120px]" />
      </div>
    </header>
  );
}

export function ThanksHero() {
  return (
    <section className="depth-dark grid-lines-dark relative overflow-hidden py-14 text-white md:py-20">
      <div className="relative mx-auto max-w-[760px] px-5 text-center md:px-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-black text-accent-strong" aria-hidden="true">
          ✓
        </span>
        <p className="mt-4 text-[13px] font-extrabold tracking-wide text-white/70">{thanksHero.badge}</p>
        <h1 className="mt-2 text-[28px] font-extrabold leading-[1.35] tracking-tight sm:text-[38px]">
          <Rich text={thanksHero.title} tone="dark" />
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-white/85">
          <Rich text={thanksHero.sub} tone="dark" />
        </p>
        <p className="mt-5 text-[14px] leading-relaxed text-white/65">
          <Rich text={thanksHero.note} tone="dark" />
        </p>
      </div>
    </section>
  );
}

export function ThanksProcess() {
  return (
    <section className="border-b border-line bg-bg py-14 md:py-20">
      <div className={wrap}>
        <p className="text-[13px] font-extrabold tracking-wide text-accent">{thanksProcess.eyebrow}</p>
        <h2 className={`${h2} mt-2`}>{thanksProcess.title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-base">
          <Rich text={thanksProcess.lead} />
        </p>
        <ol className="mt-7 space-y-3">
          {thanksProcess.steps.map((s) => (
            <li key={s.no} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-[15px] font-extrabold text-white">
                {s.no}
              </span>
              <div>
                <p className="text-[17px] font-extrabold text-ink">{s.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ThanksValue() {
  return (
    <section className="border-b border-line bg-surface py-14 md:py-20">
      <div className={wrap}>
        <h2 className={h2}>
          <Rich text={thanksValue.title} />
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft md:text-base">
          <Rich text={thanksValue.lead} />
        </p>
        <dl className="mt-6 overflow-hidden rounded-2xl border border-line bg-bg">
          {thanksValue.items.map((r) => (
            <div key={r.k} className="grid grid-cols-[88px_1fr] gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[120px_1fr]">
              <dt className="text-[15px] font-extrabold text-accent">{r.k}</dt>
              <dd className="text-[15px] leading-relaxed text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">{thanksValue.caution}</p>
      </div>
    </section>
  );
}

export function ThanksOffer() {
  return (
    <section id="offer" className="bg-bg py-14 md:py-20">
      <div className="mx-auto max-w-[560px] px-5 md:px-8">
        <div className="rounded-3xl border-2 border-accent bg-surface p-6 text-center sm:p-8">
          <p className="inline-flex rounded-full bg-accent-soft px-3.5 py-1.5 text-[13px] font-extrabold text-accent-strong">
            {thanksOffer.badge}
          </p>
          <h2 className="mt-4 text-[24px] font-extrabold leading-[1.35] tracking-tight text-ink sm:text-[28px]">
            <Rich text={thanksOffer.title} />
          </h2>
          <div className="mt-5 flex items-baseline justify-center gap-3 whitespace-nowrap">
            <s className="text-lg font-semibold text-ink-faint decoration-2">60만 원</s>
            <span aria-hidden="true" className="text-lg text-ink-faint">→</span>
            <span className="text-[40px] font-black leading-none tracking-tight text-accent">30만 원</span>
          </div>
          <p className="mt-2 text-[13px] font-semibold text-ink-soft">시작하시는 첫 달 기준</p>
          <dl className="mt-6 overflow-hidden rounded-xl border border-line text-left">
            {thanksOffer.rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[104px_1fr] gap-3 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[120px_1fr]">
                <dt className="text-[14px] text-ink-faint">{r.k}</dt>
                <dd className="text-[15px] font-semibold text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
          {kakaoChannelUrl && (
            <a
              href={kakaoChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] px-6 py-4 text-base font-bold text-[#191919] transition-opacity hover:opacity-90"
            >
              {thanksOffer.ctaLabel}
            </a>
          )}
          <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">{thanksOffer.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}

// 화면 아래에 떠 있는 카카오톡 상담 버튼. 채널 주소가 있을 때만 나타납니다.
export function KakaoFloat() {
  if (!kakaoChannelUrl) return null;
  return (
    <a
      href={kakaoChannelUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3.5 text-[15px] font-extrabold text-[#191919] shadow-lg"
    >
      <span aria-hidden="true">💬</span>
      카톡 상담
    </a>
  );
}
