"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-3">
      <label className="block text-sm font-semibold text-ink" htmlFor="password">
        관리자 비밀번호
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none focus:border-accent"
      />
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="remember" className="h-4 w-4" />
        이 기기에서 로그인 유지(90일)
      </label>
      {state?.error && <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-navy px-4 py-3 text-base font-bold text-white disabled:opacity-60"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
