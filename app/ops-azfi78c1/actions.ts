"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { rpc, type ApplicationStatus } from "@/lib/supabase";

const ADMIN_PATH = "/ops-azfi78c1";
const STATUSES: ApplicationStatus[] = ["new", "contacted", "consulting", "started", "closed"];

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");

  // 오답 5번이면 15분간 로그인을 막습니다. (비밀번호가 짧아도 무작위 대입이 어렵도록 DB에서 셉니다)
  try {
    if (await rpc<boolean>("landing_login_locked", {})) {
      return { error: "시도가 너무 많습니다. 15분 뒤에 다시 해 주세요." };
    }
  } catch {
    return { error: "지금은 로그인할 수 없습니다. 잠시 후 다시 시도해 주세요." };
  }

  const ok = checkPassword(password);
  try {
    await rpc("landing_login_record", { p_ok: ok });
  } catch {
    // 기록에 실패해도 로그인 판정은 그대로 따릅니다.
  }

  if (!ok) {
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "비밀번호가 맞지 않습니다." };
  }
  await startSession();
  redirect(ADMIN_PATH);
}

export async function logout() {
  await endSession();
  redirect(ADMIN_PATH);
}

export async function updateApplication(formData: FormData) {
  if (!(await isAdmin())) redirect(ADMIN_PATH);
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;
  const memo = String(formData.get("memo") ?? "").slice(0, 2000);
  if (!/^[0-9a-f-]{36}$/.test(id) || !STATUSES.includes(status)) return;
  await rpc("admin_update_application", {
    p_secret: process.env.ADMIN_DB_SECRET,
    p_id: id,
    p_status: status,
    p_memo: memo,
  });
  revalidatePath(ADMIN_PATH);
}
