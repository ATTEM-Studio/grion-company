import { blobConnected, writeJson } from "@/lib/blob-store";
import { REC_EVENTS, cleanSource, kstMonth, kstStamp, type Rec, type RecEvent } from "@/lib/visits";

// 방문 기록 1건 = 기록 파일 1개. 저장에 실패해도 방문자 화면에는 영향이 없도록 늘 204를 돌려줍니다.
const done = () => new Response(null, { status: 204 });

export async function POST(request: Request) {
  try {
    if (!blobConnected()) return done();
    const text = await request.text();
    if (text.length > 1000) return done();
    const body = JSON.parse(text) as Record<string, unknown>;
    const ev = (Array.isArray(body.ev) ? body.ev : []).filter((e): e is RecEvent => REC_EVENTS.includes(e as RecEvent));
    if (ev.length === 0) return done();
    const rec: Rec = { src: cleanSource(body.src), test: body.test === true, ev: [...new Set(ev)], fa: body.fa === true };
    const rand = Math.random().toString(36).slice(2, 8);
    await writeJson(`rec/${kstMonth()}/${kstStamp()}-${rand}.json`, rec);
  } catch {
    // 기록 실패는 무시
  }
  return done();
}
