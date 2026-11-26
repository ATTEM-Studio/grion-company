import { isAdmin } from "@/lib/admin-auth";
import { kstMonth, loadVisitStats } from "@/lib/visits";

// 관리자만: 아직 더하지 않은 기록을 월 요약에 더하고 고른 달의 숫자를 돌려줍니다.
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Not found", { status: 404 });
  const m = new URL(request.url).searchParams.get("month") ?? "";
  const month = /^\d{4}-\d{2}$/.test(m) ? m : kstMonth();
  const view = await loadVisitStats(month);
  return Response.json(view ?? { error: "load_failed" }, { status: view ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
