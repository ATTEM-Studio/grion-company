import { readPixelId } from "@/lib/visits";

// 랜딩이 메타 픽셀 ID를 읽어 가는 공개 주소입니다. (숫자 ID만 돌려줌)
export async function GET() {
  const id = await readPixelId();
  return Response.json({ id }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
