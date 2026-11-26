import { isAdmin } from "@/lib/admin-auth";
import { rpc, statusLabels, type ApplicationRow } from "@/lib/supabase";

// 신청자 목록 CSV (엑셀에서 한글이 깨지지 않도록 BOM 포함). 로그인한 관리자만 받을 수 있습니다.
export async function GET() {
  if (!(await isAdmin())) return new Response("Not found", { status: 404 });

  const rows = (await rpc<ApplicationRow[]>("admin_list_applications", { p_secret: process.env.ADMIN_DB_SECRET })) ?? [];
  // 엑셀 수식으로 실행되지 않도록 = + - @ 로 시작하는 값 앞에 ' 를 붙입니다.
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const head = ["신청일시(KST)", "성함", "매장명", "연락처", "고민", "경쟁 매장", "플레이스 링크", "유입 경로", "상태", "메모"];
  const lines = rows.map((r) =>
    [
      new Date(r.created_at).toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }),
      r.name, r.company, r.contact, r.concern, r.competitors, r.placeurl, r.source, statusLabels[r.status], r.memo,
    ].map(cell).join(",")
  );
  const csv = "﻿" + [head.map(cell).join(","), ...lines].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
