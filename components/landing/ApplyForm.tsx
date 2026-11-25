"use client";

import { useState, type FormEvent } from "react";
import { applyForm as f } from "@/content/landing";
import { cn } from "@/lib/utils";
import { Rich } from "./Rich";

type Field = "name" | "company" | "placeUrl" | "contact";
const fieldOrder: Field[] = ["name", "company", "placeUrl", "contact"];

function validate(key: Field, raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return "필수 입력 항목입니다.";
  if (key === "placeUrl" && !/naver\./i.test(v)) {
    return "네이버 지도에서 복사한 링크(naver.me 또는 map.naver.com)를 붙여 주세요.";
  }
  if (key === "contact" && !v.includes("@") && v.replace(/\D/g, "").length < 9) {
    return "휴대폰 번호나 이메일을 정확히 적어 주세요.";
  }
  return undefined;
}

/** 광고 유입 경로를 시트에서 구분할 수 있도록 utm 값을 함께 보냅니다. */
function sourceLabel(): string {
  if (typeof window === "undefined") return "랜딩";
  const params = new URLSearchParams(window.location.search);
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((k) => (params.get(k) ? `${k.replace("utm_", "")}=${params.get(k)}` : ""))
    .filter(Boolean)
    .join(" ");
  return `랜딩 ${window.location.host}${utm ? ` (${utm})` : ""}`;
}

export function ApplyForm() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", company: "", placeUrl: "", contact: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [concerns, setConcerns] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const toggle = (c: string) =>
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    for (const k of fieldOrder) {
      const err = validate(k, values[k]);
      if (err) next[k] = err;
    }
    setErrors(next);
    setConsentError(!consent);
    const firstBad = fieldOrder.find((k) => next[k]);
    if (firstBad) {
      document.getElementById(`apply-${firstBad}`)?.focus();
      return;
    }
    if (!consent) return;

    setState("sending");
    const concern = [concerns.join(", "), memo.trim()].filter(Boolean).join(" / ");
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          placeUrl: values.placeUrl.trim(),
          contact: values.contact.trim(),
          concern,
          source: sourceLabel(),
          website,
        }),
      });
      if (!res.ok) throw new Error(`request failed: ${res.status}`);
      setState("done");
    } catch (err) {
      console.error("[ApplyForm] submission failed", err);
      setState("error");
    }
  };

  return (
    <section id="apply" className="scroll-mt-16 border-b border-line bg-navy py-14 md:py-20">
      <div className="mx-auto max-w-[560px] px-5 md:px-8">
        <div className="text-center text-white">
          <h2 className="text-[26px] font-extrabold tracking-tight sm:text-[30px]">{f.title}</h2>
          <div className="mt-3 flex items-baseline justify-center gap-3">
            <s className="text-lg font-semibold text-white/45 decoration-2">{f.priceFrom}</s>
            <span aria-hidden="true" className="text-lg text-white/45">→</span>
            <span className="text-[40px] font-black leading-none tracking-tight text-white">{f.priceTo}</span>
          </div>
          <p className="mt-3 text-[15px] text-white/75">
            <Rich text={f.sub} tone="dark" />
          </p>
          <p className="mt-3 inline-flex rounded-full bg-signal-warn-soft px-3.5 py-1.5 text-[13px] font-extrabold text-signal-warn">
            {f.scarcity}
          </p>
        </div>

        <div className="mt-7 rounded-2xl bg-surface p-5 sm:p-7">
          {state === "done" ? (
            <div className="py-6 text-center" role="status">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">✓</div>
              <p className="mt-4 text-lg font-extrabold text-ink">{f.successTitle}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.successBody}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="apply-website">웹사이트</label>
                <input
                  id="apply-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {fieldOrder.map((key) => {
                const field = f.fields[key];
                const err = errors[key];
                const help = "help" in field ? field.help : undefined;
                return (
                  <div key={key}>
                    <label htmlFor={`apply-${key}`} className="text-sm font-semibold text-ink">
                      {field.label} <span className="text-accent">*</span>
                    </label>
                    <input
                      id={`apply-${key}`}
                      type={key === "placeUrl" ? "url" : "text"}
                      inputMode={key === "placeUrl" ? "url" : undefined}
                      autoComplete={key === "name" ? "name" : key === "placeUrl" ? "url" : undefined}
                      value={values[key]}
                      onChange={(e) => {
                        setValues((p) => ({ ...p, [key]: e.target.value }));
                        if (err) setErrors((p) => ({ ...p, [key]: undefined }));
                      }}
                      placeholder={field.placeholder}
                      aria-invalid={Boolean(err)}
                      aria-describedby={[help ? `apply-${key}-help` : "", err ? `apply-${key}-err` : ""].filter(Boolean).join(" ") || undefined}
                      className={cn(
                        "focus-ring mt-2 w-full rounded-lg border bg-bg px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-faint",
                        err ? "border-red-400" : "border-line"
                      )}
                    />
                    {help && (
                      <p id={`apply-${key}-help`} className="mt-1.5 text-[12px] leading-relaxed text-ink-faint">
                        <Rich text={help} />
                      </p>
                    )}
                    {err && (
                      <p id={`apply-${key}-err`} className="mt-1.5 text-xs text-red-500">
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}

              <fieldset>
                <legend className="text-sm font-semibold text-ink">{f.concernLabel}</legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {f.concernOptions.map((c) => {
                    const on = concerns.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        aria-pressed={on}
                        onClick={() => toggle(c)}
                        className={cn(
                          "focus-ring rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                          on ? "border-accent bg-accent text-white" : "border-line bg-bg text-ink-soft hover:text-ink"
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                <input
                  aria-label="고민 한 줄 메모"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder={f.concernMemoPlaceholder}
                  className="focus-ring mt-3 w-full rounded-lg border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint"
                />
              </fieldset>

              <div>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (e.target.checked) setConsentError(false);
                    }}
                    className="focus-ring mt-0.5 h-5 w-5 flex-none accent-[var(--accent)]"
                  />
                  <span>
                    <span className="font-medium text-ink">{f.privacyLabel}</span>
                    <span className="mt-1 block whitespace-pre-line text-xs leading-relaxed text-ink-faint">{f.privacyDetail}</span>
                  </span>
                </label>
                {consentError && <p className="mt-2 text-xs text-red-500">동의 후 신청할 수 있습니다.</p>}
              </div>

              {state === "error" && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-600" role="alert">
                  {f.errorBody}
                </p>
              )}

              <button
                type="submit"
                disabled={state === "sending"}
                className="focus-ring w-full rounded-full bg-accent px-6 py-4 text-base font-bold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
              >
                {state === "sending" ? f.submitting : f.submit}
              </button>
              <p className="text-center text-[14px] text-ink-soft">
                <Rich text={f.reassurance} />
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
