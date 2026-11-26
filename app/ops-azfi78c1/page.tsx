import type { Metadata } from "next";
import { connection } from "next/server";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { rpc, statusLabels, type ApplicationRow, type ApplicationStatus } from "@/lib/supabase";
import { LoginForm } from "./LoginForm";
import { logout, updateApplication } from "./actions";

// 링크로 연결하지 않는 관리자 화면입니다. 검색에 잡히지 않게 막습니다.
export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false, nocache: true },
};

const ADMIN_PATH = "/ops-azfi78c1";
const STATUSES = Object.keys(statusLabels) as ApplicationStatus[];

const kst = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

const kstDay = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

type Search = Promise<{ q?: string; status?: string }>;

export default async function AdminPage({ searchParams }: { searchParams: Search }) {
  // 빌드 때 미리 만들어 두지 않고, 요청마다 로그인 여부를 확인합니다.
  await connection();
  if (!adminConfigured()) {
    return (
      <Shell>
        <p className="text-sm text-ink-soft">관리자 설정이 아직 끝나지 않았습니다.</p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <h1 className="text-xl font-extrabold text-ink">관리자 로그인</h1>
        <LoginForm />
      </Shell>
    );
  }

  const { q = "", status = "" } = await searchParams;
  let rows: ApplicationRow[] = [];
  let loadError = "";
  try {
    rows = (await rpc<ApplicationRow[]>("admin_list_applications", { p_secret: process.env.ADMIN_DB_SECRET })) ?? [];
  } catch {
    loadError = "신청 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  const stats = computeStats(rows);
  const remain = Math.max(0, 30 - rows.length);

  const needle = q.trim().toLowerCase();
  const shown = rows.filter((r) => {
    if (status && r.status !== status) return false;
    if (!needle) return true;
    return [r.name, r.company, r.contact, r.concern, r.competitors].some((v) => (v ?? "").toLowerCase().includes(needle));
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-ink">신청자 현황</h1>
        <div className="flex items-center gap-2">
          <a href={`${ADMIN_PATH}/export`} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink">
            CSV 받기
          </a>
          <form action={logout}>
            <button className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-soft">로그아웃</button>
          </form>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white p-4">
            <dt className="text-[13px] text-ink-faint">{s.label}</dt>
            <dd className="mt-1 text-2xl font-black text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[13px] text-ink-soft">
        30팀 한정 기준으로 저장된 신청 {rows.length}건 · 남은 자리 {remain}팀 (테스트로 넣은 행이 있으면 함께 셉니다)
      </p>

      <form method="get" className="mt-5 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="이름·매장명·연락처·고민 검색"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm"
        />
        <select name="status" defaultValue={status} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
          <option value="">전체 상태</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white">찾기</button>
      </form>

      {loadError && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{loadError}</p>}
      {!loadError && shown.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-soft">{rows.length === 0 ? "아직 들어온 신청이 없습니다." : "조건에 맞는 신청이 없습니다."}</p>
      )}

      <ul className="mt-4 space-y-3">
        {shown.map((r) => (
          <li key={r.id} className="rounded-xl border border-line bg-white p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-extrabold text-ink">
                {r.company} <span className="text-sm font-semibold text-ink-soft">· {r.name}</span>
              </p>
              <p className="text-[13px] text-ink-faint">{kst(r.created_at)}</p>
            </div>
            <p className="mt-1 text-[15px]">
              <a href={`tel:${r.contact.replace(/[^\d]/g, "")}`} className="font-bold text-accent">{r.contact}</a>
            </p>
            <dl className="mt-2 space-y-1 text-[14px] text-ink">
              {r.concern && <Line k="고민" v={r.concern} />}
              {r.competitors && <Line k="경쟁 매장" v={r.competitors} />}
              {r.placeurl && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-ink-faint">플레이스</dt>
                  <dd className="min-w-0 break-all">
                    <a href={/^https?:\/\//.test(r.placeurl) ? r.placeurl : undefined} target="_blank" rel="noopener noreferrer" className="underline">{r.placeurl}</a>
                  </dd>
                </div>
              )}
              {r.source && <Line k="유입" v={r.source} />}
            </dl>
            <form action={updateApplication} className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <input type="hidden" name="id" value={r.id} />
              <select name="status" defaultValue={r.status} className="rounded-lg border border-line bg-white px-2 py-2 text-sm">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
              <input name="memo" defaultValue={r.memo ?? ""} maxLength={2000} placeholder="메모 (상담 내용 등)" className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
              <button className="rounded-lg bg-navy px-3 py-2 text-sm font-bold text-white">저장</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}

function computeStats(rows: ApplicationRow[]) {
  const today = kstDay(new Date().toISOString());
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  return [
    { label: "전체 신청", value: rows.length },
    { label: "오늘", value: rows.filter((r) => kstDay(r.created_at) === today).length },
    { label: "최근 7일", value: rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length },
    { label: "신규(미처리)", value: rows.filter((r) => r.status === "new").length },
  ];
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 text-ink-faint">{k}</dt>
      <dd className="min-w-0 whitespace-pre-wrap break-words">{v}</dd>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-sm px-4 py-16">{children}</main>;
}
