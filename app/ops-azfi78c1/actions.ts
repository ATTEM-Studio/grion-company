"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { rpc, type ApplicationStatus } from "@/lib/supabase";

const ADMIN_PATH = "/ops-azfi78c1";
const STATUSES: ApplicationStatus[] = ["new", "contacted", "consulting", "started", "closed"];

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // 무작위 대입을 느리게 만듭니다.
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
