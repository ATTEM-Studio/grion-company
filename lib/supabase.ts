// Supabase REST(RPC) 호출 도우미. 서버에서만 씁니다. (브라우저에 키가 나가지 않음)
// 테이블은 RLS로 잠겨 있고, 신청 저장과 관리자 조회는 DB 함수(RPC)로만 열려 있습니다.

export type ApplicationStatus = "new" | "contacted" | "consulting" | "started" | "closed";

export type ApplicationRow = {
  id: string;
  created_at: string;
  name: string;
  company: string;
  contact: string;
  concern: string | null;
  placeurl: string | null;
  competitors: string | null;
  source: string | null;
  extra: Record<string, string>;
  status: ApplicationStatus;
  memo: string | null;
};

export const statusLabels: Record<ApplicationStatus, string> = {
  new: "신규",
  contacted: "연락 완료",
  consulting: "상담 중",
  started: "관리 시작",
  closed: "종료",
};

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("supabase_not_configured");

  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    // sb_publishable_ 키는 JWT가 아니라서 apikey 헤더로만 보냅니다. (예전 anon JWT 키면 Authorization도 함께)
    headers: {
      apikey: key,
      ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`supabase_${fn}_${res.status}:${text.slice(0, 200)}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
