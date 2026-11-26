"use client";

import { useState } from "react";
import { breakEven as t } from "@/content/landing";
import { Rich } from "./Rich";

const num = (v: string) => Number(v.replace(/[^\d.]/g, ""));
const fmt = (n: number) => n.toLocaleString("ko-KR");

export function BreakEvenCalc() {
  const [aov, setAov] = useState("");
  const [margin, setMargin] = useState("");

  const aovN = num(aov);
  const marginN = num(margin);
  const marginOk = margin.trim() === "" || (marginN > 0 && marginN <= 100);
  const ready = aovN >= 1000 && marginOk;
  // 남는 비율을 적으면 '이익 기준', 비워 두면 '매출 기준'으로 계산합니다.
  const perOrder = margin.trim() === "" ? aovN : aovN * (marginN / 100);
  const orders = ready && perOrder > 0 ? Math.ceil(t.monthly / perOrder) : 0;
  const perDay = orders ? Math.ceil((orders / 30) * 10) / 10 : 0;

  const input =
    "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none focus:border-accent";

  return (
    <div className="mt-8 rounded-2xl border border-line bg-surface p-5 md:p-6">
      <p className="text-[18px] font-extrabold text-ink">{t.title}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{t.lead}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          {t.aovLabel}
          <input
            inputMode="numeric"
            value={aov}
            onChange={(e) => setAov(e.target.value)}
            placeholder={t.aovPlaceholder}
            className={input}
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          {t.marginLabel}
          <input
            inputMode="decimal"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            placeholder={t.marginPlaceholder}
            className={input}
          />
        </label>
      </div>
      <div aria-live="polite" className="mt-4 min-h-[56px] rounded-xl bg-bg px-4 py-3 text-[15px] leading-relaxed text-ink">
        {orders ? (
          <>
            한 달 약 <strong className="text-accent">{fmt(orders)}건</strong>
            <span className="text-ink-soft"> (하루 약 {perDay}건)</span>의 추가 {margin.trim() === "" ? "매출" : "이익"}이 있어야 월 60만 원을 되찾습니다.
          </>
        ) : (
          <span className="text-ink-faint">
            {aovN > 0 && !ready ? "객단가는 1,000원 이상, 남는 비율은 1~100 사이로 적어 주세요." : "객단가를 적으면 계산해 드립니다."}
          </span>
        )}
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-faint">
        <Rich text={t.note} />
      </p>
    </div>
  );
}
