"use client";

import { useActionState } from "react";
import { savePixel } from "./actions";

export function PixelForm({ current }: { current: string }) {
  const [state, action, pending] = useActionState(savePixel, undefined);
  const shown = state?.saved ?? current;
  return (
    <form action={action} className="mt-3 flex flex-wrap items-center gap-2">
      <input
        name="pixelId"
        inputMode="numeric"
        defaultValue={current}
        placeholder="숫자만 (비워 두면 꺼짐)"
        className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
      />
      <button disabled={pending} className="rounded-lg bg-navy px-3 py-2 text-sm font-bold text-white disabled:opacity-60">
        {pending ? "저장 중…" : "저장"}
      </button>
      <p className="w-full text-[13px] text-ink-soft" role="status">
        {state?.error ? <span className="font-semibold text-red-600">{state.error}</span> : `저장된 값: ${shown || "없음 (픽셀 꺼짐)"}`}
      </p>
    </form>
  );
}
