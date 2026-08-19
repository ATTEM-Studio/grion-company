"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { diagnosisForm as f } from "@/content/site";
import { cn } from "@/lib/utils";
import { BOTTLENECK_SELECTED_EVENT, type BottleneckSelectedDetail } from "@/lib/events";
import { useGrowth } from "@/lib/growth-context";
import { formatNumber, formatWon } from "@/lib/growth";
import { Reveal } from "./Reveal";

type RequiredField = "name" | "company" | "industry" | "region" | "contact" | "concern";
type OptionalField =
  | "revenueCurrent"
  | "revenueGoal"
  | "channels"
  | "adBudget"
  | "acquisition"
  | "volume"
  | "repeat";

type FormState = Record<RequiredField | OptionalField, string>;

const requiredFields: RequiredField[] = [
  "name",
  "company",
  "industry",
  "region",
  "contact",
  "concern",
];

const optionalFields: OptionalField[] = [
  "revenueCurrent",
  "revenueGoal",
  "channels",
  "adBudget",
  "acquisition",
  "volume",
  "repeat",
];

const emptyState: FormState = {
  name: "",
  company: "",
  industry: "",
  region: "",
  contact: "",
  concern: "",
  revenueCurrent: "",
  revenueGoal: "",
  channels: "",
  adBudget: "",
  acquisition: "",
  volume: "",
  repeat: "",
};

type Step = 1 | 2 | "success";

export function DiagnosisForm() {
  const { inputs, result, touched } = useGrowth();
  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<FormState>(emptyState);
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [prefilledFromSelector, setPrefilledFromSelector] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — real visitors never see/fill this
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const concernEditedByUser = useRef(false);

  /**
   * Numbers the visitor already typed into the hero calculator, formatted
   * for the notification email. Sent only when they've actually used the
   * calculator and left the toggle on — we never quietly ship the example
   * defaults as if they were real figures.
   */
  const carriedNumbers =
    touched && result.canCompute
      ? {
          revenueCurrent: formatWon(result.currentRevenue),
          revenueGoal: formatWon(inputs.goalRevenue),
          volume: `노출 ${formatNumber(inputs.impressions)} · 유입 ${formatNumber(
            inputs.visits
          )} · 방문 ${formatNumber(inputs.customers)}`,
          aovEntered: `${formatNumber(inputs.aov)}원`,
          repeat: `재방문율 ${inputs.repeatRate}%`,
          bottleneck: result.weakestStage
            ? `${result.weakestStage.label} 구간 (계산기 기준)`
            : "",
        }
      : null;

  const update = (key: RequiredField | OptionalField, value: string) => {
    if (key === "concern") {
      concernEditedByUser.current = true;
      setPrefilledFromSelector(false);
    }
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // Picking a bottleneck type above (BottleneckSelector) carries that
  // choice into "현재 가장 큰 고민" here, so the self-diagnosis interaction
  // isn't disconnected from the contact ask. Stops once the visitor edits
  // the field themselves.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<BottleneckSelectedDetail>).detail;
      if (!detail || concernEditedByUser.current) return;
      setValues((prev) => ({ ...prev, concern: detail.concern }));
      setPrefilledFromSelector(true);
    };
    window.addEventListener(BOTTLENECK_SELECTED_EVENT, handler);
    return () => window.removeEventListener(BOTTLENECK_SELECTED_EVENT, handler);
  }, []);

  const validateStep1 = () => {
    const nextErrors: Partial<Record<RequiredField, string>> = {};
    for (const key of requiredFields) {
      if (!values[key].trim()) {
        nextErrors[key] = "필수 입력 항목입니다.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      requestAnimationFrame(() => {
        document.getElementById("diagnosis")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const finalize = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    setSubmitError(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          // Calculator values fill in any optional field the visitor left
          // blank; anything they typed themselves always wins.
          ...(includeNumbers && carriedNumbers
            ? Object.fromEntries(
                Object.entries(carriedNumbers).filter(
                  ([k, v]) => v && !values[k as keyof FormState]?.trim()
                )
              )
            : {}),
          website,
        }),
      });
      if (!res.ok) throw new Error(`request failed: ${res.status}`);
      setStep("success");
    } catch (err) {
      console.error("[DiagnosisForm] submission failed", err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="diagnosis" className="depth-light relative scroll-mt-20 overflow-hidden border-b border-line bg-bg-alt py-24 md:py-28">
      <div className="relative mx-auto max-w-[640px] px-5 md:px-8">
        <Reveal className="text-center">
          <p className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
            {f.title}
          </p>
          <p className="mt-3 text-[15px] text-ink-soft">{f.subtitle}</p>
        </Reveal>

        {step !== "success" && (
          <Reveal delayMs={80} className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-ink-faint">
            <span className={cn("rounded-full px-2.5 py-1", step === 1 ? "bg-accent text-white" : "bg-surface text-ink-faint")}>
              1. {f.step1Title}
            </span>
            <span className="text-line">—</span>
            <span className={cn("rounded-full px-2.5 py-1", step === 2 ? "bg-accent text-white" : "bg-surface text-ink-faint")}>
              2. {f.step2Title}
            </span>
          </Reveal>
        )}

        <Reveal delayMs={140} className="mt-6 rounded-2xl border border-line bg-surface p-6 sm:p-9">
          {step === 1 && (
            <form onSubmit={goNext} noValidate>
              <div className="space-y-5">
                {requiredFields.map((key) => {
                  const field = f.fields[key];
                  const isTextarea = key === "concern";
                  const error = errors[key];
                  return (
                    <div key={key}>
                      <label htmlFor={key} className="flex items-center gap-2 text-sm font-semibold text-ink">
                        {field.label}
                        <span className="text-accent">*</span>
                        {isTextarea && prefilledFromSelector && (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-strong">
                            앞에서 고른 내용을 반영했어요
                          </span>
                        )}
                      </label>
                      {isTextarea ? (
                        <textarea
                          id={key}
                          value={values[key]}
                          onChange={(e) => update(key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={3}
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? `${key}-error` : undefined}
                          className={cn(
                            "focus-ring mt-2 w-full resize-none rounded-lg border bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint",
                            error ? "border-red-400" : "border-line"
                          )}
                        />
                      ) : (
                        <input
                          id={key}
                          type={key === "contact" ? "tel" : "text"}
                          value={values[key]}
                          onChange={(e) => update(key, e.target.value)}
                          placeholder={field.placeholder}
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? `${key}-error` : undefined}
                          className={cn(
                            "focus-ring mt-2 w-full rounded-lg border bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint",
                            error ? "border-red-400" : "border-line"
                          )}
                        />
                      )}
                      {error && (
                        <p id={`${key}-error`} className="mt-1.5 text-xs text-red-500">
                          {error}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="focus-ring mt-8 w-full rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-strong"
              >
                {f.next}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={finalize} noValidate>
              {/* Honeypot field — hidden from real visitors via CSS + tabIndex,
                  but visible to most form-filling bots. Left blank by a
                  human; the API route silently drops submissions where
                  it's filled in. */}
              <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">웹사이트</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {carriedNumbers && (
                <div className="mb-6 rounded-xl border border-accent-line bg-accent-soft p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="focus-ring mt-0.5 h-4 w-4 flex-none accent-[var(--accent)]"
                    />
                    <span className="min-w-0">
                      <span className="text-[13px] font-bold text-accent-strong">
                        위에서 계산한 숫자를 함께 보냅니다
                      </span>
                      <span className="mt-1.5 block text-[12px] leading-relaxed text-accent-strong/75">
                        현재 {carriedNumbers.revenueCurrent} → 목표 {carriedNumbers.revenueGoal} ·{" "}
                        {carriedNumbers.volume}
                        {result.weakestStage && ` · 확인할 지점: ${result.weakestStage.label}`}
                      </span>
                      <span className="mt-1 block text-[11px] text-accent-strong/55">
                        아래에 직접 적으신 내용이 있으면 그쪽이 우선합니다.
                      </span>
                    </span>
                  </label>
                </div>
              )}

              <div className="space-y-5">
                {optionalFields.map((key) => {
                  const field = f.fields[key];
                  return (
                    <div key={key}>
                      <label htmlFor={key} className="block text-sm font-semibold text-ink">
                        {field.label}
                      </label>
                      <input
                        id={key}
                        type="text"
                        value={values[key]}
                        onChange={(e) => update(key, e.target.value)}
                        placeholder={field.placeholder}
                        className="focus-ring mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <label className="flex items-start gap-3 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (e.target.checked) setConsentError(false);
                    }}
                    className="focus-ring mt-0.5 h-4 w-4 flex-none accent-[var(--accent)]"
                  />
                  <span>
                    <span className="font-medium text-ink">{f.privacyLabel}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-faint">
                      {f.privacyDetail}
                    </span>
                  </span>
                </label>
                {consentError && (
                  <p className="mt-2 text-xs text-red-500">동의 후 제출할 수 있습니다.</p>
                )}
              </div>

              {submitError && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">
                  제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
                </p>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={submitting}
                  className="focus-ring flex-1 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
                >
                  {submitting ? "제출 중…" : f.submit}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="focus-ring rounded-full border border-line px-6 py-3.5 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  {f.back}
                </button>
              </div>
              <button
                type="button"
                onClick={() => finalize()}
                disabled={submitting}
                className="focus-ring mt-3 w-full text-center text-xs font-medium text-ink-faint underline-offset-2 hover:text-ink hover:underline"
              >
                {f.step2Skip}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
                ✓
              </div>
              <p className="mt-5 text-lg font-extrabold text-ink">{f.successTitle}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.successBody}</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
