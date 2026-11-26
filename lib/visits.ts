import { blobConnected, isConflict, listPaths, readJson, removeBlobs, writeJson } from "./blob-store";

// 방문 기록 구조
//  - 랜딩이 한 방문의 행동을 모아 /api/track 으로 보내면, 기록 파일 1개(rec/연-월/시각-임의값.json)만 저장합니다.
//  - 관리자 화면을 열 때 아직 더하지 않은 기록을 월 요약 파일(sum/연-월.json)에 더하고 기록 파일은 지웁니다.
//  - 같은 기록을 두 번 세지 않도록 요약 파일에 '이미 더한 기록 이름(seen)'을 남깁니다.
//  - 방문 수에는 같은 사람의 재방문도 포함됩니다. 고유 인원 수가 아닙니다.

export const TEST_KEY = "grion:test-device";
export const FREE_VISITS = 1000;
export const SCROLL_STEPS = [25, 50, 75, 100] as const;
export type RecEvent = "open" | "s25" | "s50" | "s75" | "s100" | "click";
export const REC_EVENTS: RecEvent[] = ["open", "s25", "s50", "s75", "s100", "click"];

export type Rec = { src: string; test: boolean; ev: RecEvent[]; fa: boolean };
export type Agg = {
  visits: number;
  click: number;
  acted: number; // 25% 이상 내렸거나 마지막 버튼을 누른 방문
  s25: number;
  s50: number;
  s75: number;
  s100: number;
  sources: Record<string, { visits: number; click: number }>;
};
export type Sum = { month: string; real: Agg; test: Agg; seen: string[] };

const emptyAgg = (): Agg => ({ visits: 0, click: 0, acted: 0, s25: 0, s50: 0, s75: 0, s100: 0, sources: {} });
const emptySum = (month: string): Sum => ({ month, real: emptyAgg(), test: emptyAgg(), seen: [] });

// 한국 시간 기준 연-월
export const kstMonth = (d = new Date()) => new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 7);
export const kstStamp = (d = new Date()) =>
  new Date(d.getTime() + 9 * 3600 * 1000).toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "");

export function cleanSource(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toLowerCase().replace(/[^a-z0-9가-힣_.\-]/g, "").slice(0, 40) : "";
  return s || "direct";
}

function addRec(sum: Sum, rec: Rec) {
  const agg = rec.test ? sum.test : sum.real;
  const src = (agg.sources[rec.src] ??= { visits: 0, click: 0 });
  if (rec.ev.includes("open")) {
    agg.visits++;
    src.visits++;
  }
  for (const s of SCROLL_STEPS) if (rec.ev.includes(`s${s}` as RecEvent)) agg[`s${s}` as "s25"]++;
  if (rec.ev.includes("click")) {
    agg.click++;
    src.click++;
  }
  if (rec.fa) agg.acted++;
}

const sumPath = (month: string) => `sum/${month}.json`;

export async function readSum(month: string): Promise<Sum | null> {
  const r = await readJson<Sum>(sumPath(month));
  return r ? r.data : emptySum(month);
}

export async function listMonths(): Promise<string[]> {
  const months = new Set<string>([kstMonth()]);
  for (const b of await listPaths("sum/", 200)) {
    const m = b.pathname.match(/^sum\/(\d{4}-\d{2})\.json$/);
    if (m) months.add(m[1]);
  }
  return [...months].sort().reverse();
}

// 아직 더하지 않은 기록 파일을 월 요약에 더합니다. 한 번에 최대 maxRecs개.
export async function foldRecords(maxRecs = 500): Promise<void> {
  const recs = (await listPaths("rec/", maxRecs)).filter((b) => /^rec\/\d{4}-\d{2}\//.test(b.pathname));
  const byMonth = new Map<string, typeof recs>();
  for (const b of recs) {
    const m = b.pathname.slice(4, 11);
    byMonth.set(m, [...(byMonth.get(m) ?? []), b]);
  }

  for (const [month, files] of byMonth) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const cur = await readJson<Sum>(sumPath(month));
      const sum = cur ? cur.data : emptySum(month);
      const seen = new Set(sum.seen);
      const fresh = files.filter((f) => !seen.has(f.pathname));

      for (let i = 0; i < fresh.length; i += 20) {
        const chunk = await Promise.all(
          fresh.slice(i, i + 20).map(async (f) => {
            const r = await readJson<Rec>(f.pathname).catch(() => null);
            return { f, rec: r?.data };
          })
        );
        for (const { f, rec } of chunk) {
          if (rec && Array.isArray(rec.ev)) addRec(sum, rec);
          seen.add(f.pathname); // 읽지 못한 파일도 다시 세지 않도록 표시
        }
      }
      // 이미 지워진 기록 이름은 목록에서 정리
      const present = new Set(files.map((f) => f.pathname));
      sum.seen = [...seen].filter((p) => present.has(p));

      try {
        await writeJson(sumPath(month), sum, cur?.etag);
      } catch (e) {
        if (isConflict(e)) continue; // 그 사이 다른 화면이 더함 → 다시 읽어서 처음부터
        throw e;
      }
      await removeBlobs(files.map((f) => f.url)).catch(() => {});
      break;
    }
  }
}

export type MonthView = { month: string; months: string[]; sum: Sum; thisMonthVisits: number };

// 관리자 화면용: 더하고, 고른 달과 이번 달 숫자를 읽어 옵니다. 읽기에 실패하면 null.
export async function loadVisitStats(month: string): Promise<MonthView | null> {
  if (!blobConnected()) return null;
  try {
    await foldRecords();
    const [months, sum, now] = await Promise.all([listMonths(), readSum(month), readSum(kstMonth())]);
    if (!sum || !now) return null;
    return { month, months, sum, thisMonthVisits: now.real.visits + now.test.visits };
  } catch {
    return null;
  }
}

// 메타 픽셀 ID (숫자만)
export async function readPixelId(): Promise<string> {
  if (!blobConnected()) return "";
  try {
    const r = await readJson<{ id?: string }>("config/pixel.json");
    return /^\d{5,20}$/.test(r?.data?.id ?? "") ? (r!.data.id as string) : "";
  } catch {
    return "";
  }
}

export async function savePixelId(id: string): Promise<void> {
  const cur = await readJson("config/pixel.json").catch(() => null);
  await writeJson("config/pixel.json", { id }, cur?.etag);
}
