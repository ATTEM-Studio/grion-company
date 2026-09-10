"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useGrowth } from "@/lib/growth-context";
import { parsePlannerValue, formatPlanMoney, paymentPlan, combinedPlan } from "@/lib/growth-planner";
import styles from "./GrowthCalculator.module.css";

type Step = 1 | 2 | 3;
type Mode = "volume" | "ticket" | "both";
type FieldKey = "current" | "goal" | "ticket" | "days" | "extra" | "newTicket";
type Values = Record<FieldKey, string>;
type FieldErrors = Partial<Record<FieldKey, string>>;
const cls = (name: string) => styles["gg-" + name];
const count = (value: number) => value.toLocaleString("ko-KR");
const advice: Record<Mode, string> = {
  volume: "계산한 추가 결제를 현재 인력과 운영시간으로 받을 수 있는지 먼저 확인해 주세요. 받을 여력이 있다면 최근 문의·예약·결제가 어느 단계에서 줄었는지 살펴보세요.",
  ticket: "필요한 평균 결제금액을 고객이 받아들일 수 있는지 확인해 주세요. 세트 구성이나 추가 선택 상품을 작게 시험하고, 평균 결제금액과 결제 건수의 변화를 함께 보세요.",
  both: "두 숫자 중 부담이 적은 변화부터 작게 시험해 보세요. 같은 기간의 결제 건수와 평균 결제금액을 확인하고, 추가 비용을 빼도 이익이 남는지 함께 살펴보세요.",
};

function PlannerField({
  id, label, unit, value, onChange, hint, error, integer = false,
}: {
  id: string; label: string; unit: string; value: string;
  onChange: (value: string) => void; hint?: string; error?: string; integer?: boolean;
}) {
  const amount = unit === "원" ? parsePlannerValue(value, true) : null;
  const hasHint = Boolean(hint || unit === "원");
  const displayHint = amount !== null ? `입력한 금액: ${formatPlanMoney(amount)}` : hint;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className={cls("input-wrap")}>
        <input
          id={id} type="text" inputMode={integer ? "numeric" : "decimal"}
          autoComplete="off" maxLength={15} value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hasHint && id + "-hint", error && id + "-error"].filter(Boolean).join(" ") || undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => { if (value.includes(",")) onChange(value.replaceAll(",", "")); }}
          onBlur={() => {
            const parsed = parsePlannerValue(value, integer);
            if (parsed !== null) onChange(parsed.toLocaleString("ko-KR", { maximumFractionDigits: 2 }));
          }}
        />
        <span className={cls("unit")}>{unit}</span>
      </div>
      {hasHint && <p className={cls("hint")} id={id + "-hint"} aria-live={unit === "원" ? "polite" : undefined}>{displayHint}</p>}
      {error && <p className={cls("error")} id={id + "-error"} role="alert">{error}</p>}
    </div>
  );
}

export function GrowthCalculator() {
  const { inputs, updateInputs, result } = useGrowth();
  const [step, setStep] = useState<Step>(1);
  const [mode, setMode] = useState<Mode>("volume");
  const [values, setValues] = useState<Values>({
    current: "", goal: "", ticket: "", days: "", extra: "", newTicket: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const prefix = useId();
  const surfaceRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const didMount = useRef(false);
  const id = (key: FieldKey) => prefix + "-" + key;
  const edit = (key: FieldKey, value: string) => {
    setValues((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
  };

  // Keep the editable draft aligned only when another section changes the shared goal.
  const [sharedGoal, setSharedGoal] = useState(inputs.goalRevenue);
  if (!Object.is(sharedGoal, inputs.goalRevenue)) {
    setSharedGoal(inputs.goalRevenue);
    setValues(old => ({ ...old, goal: Number.isFinite(inputs.goalRevenue) ? String(inputs.goalRevenue) : "" }));
  }

  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    headingRef.current?.focus({ preventScroll: true });
    const top = surfaceRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 88) {
      surfaceRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  }, [step]);

  const reject = (key: FieldKey, message: string) => {
    setErrors({ [key]: message });
    document.getElementById(id(key))?.focus();
  };
  const submitRevenue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const current = parsePlannerValue(values.current, true);
    const goal = parsePlannerValue(values.goal, true);
    if (current === null) return reject("current", "현재 월매출을 원 단위 정수로 입력해 주세요. 매출이 없다면 0을 입력할 수 있어요.");
    if (goal === null || goal <= 0) return reject("goal", "목표 월매출은 0원보다 큰 정수로 입력해 주세요.");
    updateInputs({ currentRevenue: current, goalRevenue: goal });
    setErrors({});
    setStep(2);
  };
  const submitDaily = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ticket = parsePlannerValue(values.ticket, true);
    const days = parsePlannerValue(values.days, true);
    if (ticket === null || ticket <= 0) return reject("ticket", "평균 결제금액을 0원보다 큰 정수로 입력해 주세요.");
    if (days === null || days < 1 || days > 31) return reject("days", "영업일 수는 1일부터 31일 사이의 정수로 입력해 주세요.");
    updateInputs({ aov: ticket, operatingDays: days });
    setErrors({});
    setStep(3);
  };

  const plan = paymentPlan(result.currentRevenue, inputs.goalRevenue, inputs.aov, inputs.operatingDays ?? NaN);
  const extra = parsePlannerValue(values.extra, true);
  const newTicket = parsePlannerValue(values.newTicket, true);
  const combo = extra !== null && newTicket !== null
    ? combinedPlan(result.currentRevenue, inputs.goalRevenue, inputs.aov, inputs.operatingDays ?? NaN, extra, newTicket)
    : null;
  const comboError = values.extra.trim() !== "" && extra === null
    ? "추가 결제 건수는 0 이상의 정수로 입력해 주세요."
    : values.newTicket.trim() !== "" && (newTicket === null || newTicket <= 0)
      ? "평균 결제금액은 0원보다 큰 정수로 입력해 주세요." : "";
  const progress = result.canCompute ? Math.min(100, result.currentRevenue / inputs.goalRevenue * 100) : 0;
  const back = (next: Step) => { setErrors({}); setStep(next); };
  const field = (key: FieldKey, label: string, unit: string, hint?: string, integer = false) => (
    <PlannerField key={key} id={id(key)} label={label} unit={unit} hint={hint}
      value={values[key]} error={errors[key]} integer={integer}
      onChange={(value) => edit(key, value)} />
  );

  return (
    <section id="growth-calculator" ref={surfaceRef} className={styles.root} aria-label="그리온 목표 매출 계산기">
      <div className={cls("surface")}>
        <header className={cls("top")}>
          <div className={cls("brand")}>
            <span className={cls("wordmark")}>grion</span>
            <span className={cls("brand-label")}>내 사업 성장 계산기</span>
          </div>
          <span className={cls("counter")} aria-live="polite"><strong>0{step}</strong> / 03</span>
        </header>
        <div className={cls("main")}>
          {step === 1 && (
            <div>
              <p className={cls("eyebrow")}>내 숫자로 시작하는 성장 계획</p>
              <h2 ref={headingRef} tabIndex={-1}>목표 매출까지,<br />얼마나 더 팔아야 할까요?</h2>
              <p className={cls("description")}>현재 매출과 목표를 원 단위로 입력해 주세요.</p>
              <form onSubmit={submitRevenue} noValidate>
                <div className={cls("fields")}>
                  {field("current", "현재 월매출", "원", "지난 한 달의 매출", true)}
                  {field("goal", "목표 월매출", "원", "한 달에 만들고 싶은 매출", true)}
                </div>
                <button className={cls("primary")} type="submit">내 매출로 계산하기 <span aria-hidden="true">→</span></button>
              </form>
              <details className={cls("help")}>
                <summary>매출을 잘 모르겠어요</summary>
                <p>POS나 정산 화면에서 지난 한 달의 총매출을 확인해 주세요. 대략적인 금액으로도 계산할 수 있어요. 추정값을 넣으면 결과도 추정치로 봐주세요.</p>
              </details>
            </div>
          )}
          {step === 2 && (
            <div>
              <button className={cls("secondary") + " " + cls("back")} type="button" onClick={() => back(1)}><span aria-hidden="true">←</span> 매출 수정</button>
              <p className={cls("eyebrow")}>내 목표가 숫자로 보이기 시작했어요</p>
              <h2 ref={headingRef} tabIndex={-1} className={cls("result-caption")}>목표까지 한 달에 필요한 추가 매출</h2>
              <p className={cls("amount")} aria-live="polite">{formatPlanMoney(result.gap)}</p>
              <div className={cls("compare")}>
                <div><small>현재 월매출</small><strong>{formatPlanMoney(result.currentRevenue)}</strong></div>
                <div><small>목표 월매출</small><strong>{formatPlanMoney(inputs.goalRevenue)}</strong></div>
              </div>
              <div className={cls("bar")} role="progressbar" aria-label="목표 대비 현재 매출" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                <div className={cls("bar-fill")} style={{ width: progress + "%" }} />
              </div>
              {result.goalReached ? (
                <>
                  <p className={cls("description")}>현재 매출이 목표 이상이에요. 더 높은 목표를 정하면 필요한 변화량을 계산할 수 있어요.</p>
                  <button className={cls("primary")} type="button" onClick={() => back(1)}>목표 다시 정하기 <span aria-hidden="true">→</span></button>
                </>
              ) : (
                <>
                  <hr className={cls("divider")} />
                  <h3>하루에 몇 건이면 될까요?</h3>
                  <p className={cls("next-note")}>두 가지를 더 알려주시면 하루 목표로 나눠드릴게요.</p>
                  <form onSubmit={submitDaily} noValidate>
                    <div className={cls("fields")}>
                      {field("ticket", "한 번 결제할 때 평균 금액", "원", "현재 매출과 같은 기간 기준", true)}
                      {field("days", "한 달 영업일 수", "일", "목표 기간에 실제 영업할 날짜 수", true)}
                    </div>
                    <button className={cls("primary")} type="submit">하루에 필요한 결제 건수 보기 <span aria-hidden="true">→</span></button>
                  </form>
                  <details className={cls("help")}>
                    <summary>평균 결제금액은 어디서 보나요?</summary>
                    <p>POS의 평균 결제금액을 확인하거나, 같은 달의 총매출을 결제 건수로 나누면 됩니다. 방문 인원과 결제 건수는 다를 수 있어요. 숫자를 모르시면 지금 확인한 매출 차이까지만 활용하셔도 됩니다.</p>
                  </details>
                </>
              )}
            </div>
          )}
          {step === 3 && plan && (
            <div>
              <button className={cls("secondary") + " " + cls("back")} type="button" onClick={() => back(2)}><span aria-hidden="true">←</span> 결제금액·영업일 수정</button>
              <p className={cls("eyebrow")}>큰 목표를 하루의 변화로</p>
              <h2 ref={headingRef} tabIndex={-1}>어떤 숫자를<br />바꿔볼까요?</h2>
              <p className={cls("description")}>같은 목표도 도달하는 방법은 달라질 수 있어요.</p>
              <p className={cls("switch-label")}>확인하고 싶은 방법을 눌러보세요</p>
              <div className={cls("switches")} role="group" aria-label="성장 방법 선택">
                {([["volume", "결제 건수"], ["ticket", "결제금액"], ["both", "함께 바꾸기"]] as const).map(([key, label]) => (
                  <button key={key} type="button" className={cls("mode")} aria-pressed={mode === key} onClick={() => setMode(key)}>{label}</button>
                ))}
              </div>
              {mode !== "both" ? (
                <div className={cls("result-panel")} aria-live="polite">
                  {mode === "volume" ? (
                    <>
                      <p className={cls("result-caption")}>매일 같은 건수를 더 받는다면</p>
                      <p className={cls("amount")}>하루 +{count(plan.extraDaily)}건</p>
                      <p className={cls("result-detail")}>월 전체로는 추가 {count(plan.extraMonthly)}건이 필요해요.</p>
                      <p className={cls("result-assumption")}>평균 {formatPlanMoney(inputs.aov)} · 월 {inputs.operatingDays}일 영업 기준. 목표를 채우도록 건수를 올림했어요.</p>
                    </>
                  ) : plan.requiredAverage !== null ? (
                    <>
                      <p className={cls("result-caption")}>기존 결제 건수를 그대로 유지한다면</p>
                      <p className={cls("amount")}>결제당 +{formatPlanMoney(plan.extraAverage!)}</p>
                      <p className={cls("result-detail")}>평균 결제금액을 {formatPlanMoney(plan.requiredAverage)}으로 높여야 해요.</p>
                      <p className={cls("result-assumption")}>현재 {formatPlanMoney(inputs.aov)} 기준. 모든 결제의 평균이 바뀌고 결제 건수는 줄지 않는 조건이에요.</p>
                    </>
                  ) : (
                    <>
                      <p className={cls("result-caption")}>현재 매출이 없는 상태예요</p>
                      <p className={cls("result-detail")}>유지할 기존 결제 건수가 없어 평균 금액만으로는 목표를 계산할 수 없어요.</p>
                      <p className={cls("result-assumption")}>결제 건수 또는 함께 바꾸기를 선택해 주세요.</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className={cls("fields") + " " + cls("combo-fields")}>
                    {field("extra", "하루 추가 결제 건수", "건", undefined, true)}
                    {field("newTicket", "바꿔볼 평균 결제금액", "원", undefined, true)}
                  </div>
                  {comboError && <p className={cls("error")} role="alert">{comboError}</p>}
                  {combo ? (
                    <div className={cls("result-panel") + " " + cls("combo-output")} aria-live="polite">
                      <p className={cls("result-caption")}>입력한 조합으로 계산한 월매출</p>
                      <p className={cls("amount")}>{formatPlanMoney(combo.revenue)}</p>
                      <p className={cls("result-detail")}>{combo.remaining > 0
                        ? "목표까지 " + formatPlanMoney(combo.remaining) + "이 더 필요해요."
                        : combo.remaining === 0 ? "입력한 조건에서 목표 매출에 도달해요."
                          : "입력한 조건에서 목표보다 " + formatPlanMoney(-combo.remaining) + " 높아요."}</p>
                      <p className={cls("result-assumption")}>현재 결제 건수는 매출과 평균 결제금액으로 추정했어요. 바꾼 평균 금액이 모든 결제에 적용되는 조건이에요.</p>
                    </div>
                  ) : <p className={cls("combo-empty")}>원하는 두 숫자를 입력하면<br />목표와 얼마나 가까워지는지 보여드려요.</p>}
                </>
              )}
              <p className={cls("insight")}>입력값으로 계산한 필요 변화량이에요. 실제 실행 전에는 추가 결제를 받을 여력과 가격을 바꿀 수 있는지 함께 확인해 주세요.</p>
              <details className={cls("help")}>
                <summary>이제 무엇을 확인할까요?</summary>
                <p>{advice[mode]}</p>
              </details>
              <div className={cls("actions")}>
                <button className={cls("secondary")} type="button" onClick={() => back(1)}>매출 목표 수정하기</button>
                <a className={cls("secondary") + " " + cls("edit-blue")} href="#diagnosis">실행 방법 상담하기 <span aria-hidden="true">→</span></a>
              </div>
            </div>
          )}
        </div>
        <footer className={cls("footer")}>가입 없이 계산 · 입력값은 자동으로 전송되지 않아요.</footer>
      </div>
    </section>
  );
}
