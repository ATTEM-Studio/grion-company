import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// 관리자 로그인: 비밀번호를 맞게 입력하면 12시간짜리 서명 쿠키를 줍니다.
// 쿠키는 httpOnly라 화면 스크립트가 읽을 수 없고, 서명 키(ADMIN_SESSION_SECRET)는 서버에만 있습니다.
export const SESSION_COOKIE = "grion_admin";
const SESSION_SECONDS = 60 * 60 * 12;

const sign = (payload: string) =>
  createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(payload).digest("hex");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_DB_SECRET);
}

export function checkPassword(input: string): boolean {
  const real = process.env.ADMIN_PASSWORD ?? "";
  return real.length > 0 && safeEqual(input, real);
}

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const store = await cookies();
  store.set(SESSION_COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(exp));
}
