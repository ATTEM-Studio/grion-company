"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type NumberFieldProps = {
  label?: string;
  value: number;
  onChange: (next: number) => void;
  /** Rendered after the input, e.g. "명" · "원" · "%". */
  suffix?: string;
  max?: number;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
  tone?: "light" | "dark";
};

/**
 * Digit-only field that shows thousands separators while staying easy to
 * type into: the visitor sees "30,000" but every keystroke is parsed back
 * to a plain number. inputMode="numeric" gets the numeric keypad on
 * mobile, which matters because most of these values get entered on a
 * phone.
 */
export function NumberField({
  label,
  value,
  onChange,
  suffix,
  max,
  className,
  inputClassName,
  ariaLabel,
  tone = "light",
}: NumberFieldProps) {
  const id = useId();

  const handle = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    if (digits === "") {
      onChange(0);
      return;
    }
    let next = Number.parseInt(digits, 10);
    if (!Number.isFinite(next)) next = 0;
    if (max !== undefined) next = Math.min(next, max);
    onChange(next);
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={ariaLabel ?? label}
        value={value === 0 ? "" : value.toLocaleString("ko-KR")}
        placeholder="0"
        onChange={(e) => handle(e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        className={cn(
          "tnum focus-ring w-full rounded-md border px-2.5 py-1.5 text-right text-[15px] font-bold transition-colors",
          tone === "dark"
            ? "border-white/15 bg-white/10 text-white placeholder:text-white/40 hover:border-white/30 focus:border-white/50"
            : "border-line bg-white text-ink placeholder:text-ink-faint hover:border-accent-line focus:border-accent",
          inputClassName
        )}
      />
      {suffix && (
        <span
          className={cn(
            "shrink-0 text-xs font-medium",
            tone === "dark" ? "text-white/55" : "text-ink-faint"
          )}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
