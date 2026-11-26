// 로고 10번 연속 터치(이스터에그)로만 호출되는 문입니다. 관리자 숨김 주소를 화면 코드에 적어 두지 않으려고
// 서버에서 돌려줍니다. 주소를 알아도 비밀번호 로그인이 있어야 들어갈 수 있습니다.
export async function POST() {
  return Response.json({ path: "/ops-azfi78c1" }, { headers: { "Cache-Control": "no-store" } });
}
