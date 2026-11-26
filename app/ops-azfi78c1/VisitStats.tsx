import { FREE_VISITS, SCROLL_STEPS, type Agg, type MonthView } from "@/lib/visits";
import { PixelForm } from "./PixelForm";
import { TestDeviceButton } from "./TestDeviceButton";

const PAID_NOTE =
  "실제 사용량과 요금제 조건을 확인해 주세요. Pro 기본료는 월 $20이며 추가 사용료와 세금이 붙을 수 있어요. 전환은 Settings › Billing › Upgrade에서 비용을 확인한 뒤 직접 선택하세요.";

const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 1000) / 10}%` : "-");
const fmt = (n: number) => n.toLocaleString("ko-KR");

const card = "rounded-xl border border-line bg-white p-4";

export function VisitStats({
  view,
  month,
  blobOk,
  passwordOk,
  pixelId,
}: {
  view: MonthView | null;
  month: string;
  blobOk: boolean;
  passwordOk: boolean;
  pixelId: string;
}) {
  const n = view?.thisMonthVisits ?? 0;
  const barPct = Math.min(100, (n / FREE_VISITS) * 100);
  const level = n >= FREE_VISITS ? "red" : n >= 700 ? "yellow" : "ok";
  const real: Agg | undefined = view?.sum.real;
  const test: Agg | undefined = view?.sum.test;
  const sources = real ? Object.entries(real.sources).sort((a, b) => b[1].visits - a[1].visits) : [];

  return (
    <section aria-label="방문 기록" className="mt-6">
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-semibold">
        <span className={blobOk ? "text-emerald-700" : "text-red-600"}>{blobOk ? "저장 공간 연결됨" : "저장 공간 연결 안 됨"}</span>
        <span className={passwordOk ? "text-emerald-700" : "text-red-600"}>{passwordOk ? "비밀번호 설정됨" : "비밀번호 설정 안 됨"}</span>
      </p>

      <div className={`${card} mt-3`}>
        <p className="text-[13px] text-ink-faint">이번 달 방문 (무료 기록 한도)</p>
        {view ? (
          <>
            <p className="mt-1 text-2xl font-black text-ink">
              {fmt(n)}회 <span className="text-base font-semibold text-ink-soft">/ 약 1,000회</span>
            </p>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-bg" role="img" aria-label={`이번 달 방문 ${n}회, 약 1,000회 기준`}>
              <div
                className={`h-full rounded-full ${level === "red" ? "bg-red-500" : level === "yellow" ? "bg-yellow-400" : "bg-accent"}`}
                style={{ width: `${barPct}%` }}
              />
            </div>
            <p
              className={`mt-2 text-[13px] leading-relaxed ${level === "red" ? "font-semibold text-red-600" : level === "yellow" ? "font-semibold text-yellow-700" : "text-ink-soft"}`}
            >
              {level === "ok" && "이 앱의 예상 무료 기록 범위는 한 달 약 1,000회 방문이에요. 실제 사용량도 확인해 주세요."}
              {level === "yellow" && `예상 무료 기록 한도에 가까워졌어요. Vercel의 실제 사용량을 확인해 주세요. ${PAID_NOTE}`}
              {level === "red" && `예상 무료 기록 한도(약 1,000회 방문)를 넘었어요. 실제 한도 초과 여부를 확인해 주세요. ${PAID_NOTE}`}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm font-semibold text-ink-soft">기록을 불러오지 못했어요. 저장 공간 연결·권한·사용량을 확인해 주세요.</p>
        )}
      </div>

      {view && real && test && (
        <>
          <form method="get" className="mt-4 flex items-center gap-2">
            <label htmlFor="month" className="text-sm font-semibold text-ink">기간</label>
            <select id="month" name="month" defaultValue={month} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
              {view.months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button className="rounded-lg bg-navy px-3 py-2 text-sm font-bold text-white">보기</button>
          </form>
          <p className="mt-2 text-[12px] text-ink-faint">방문 수에는 같은 사람의 재방문도 포함될 수 있어요. 고유 인원 수가 아니에요. 테스트 기기 방문은 아래 숫자에서 빠져 있어요.</p>

          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className={card}>
              <dt className="text-[13px] text-ink-faint">방문</dt>
              <dd className="mt-1 text-2xl font-black text-ink">{fmt(real.visits)}</dd>
            </div>
            <div className={card}>
              <dt className="text-[13px] text-ink-faint">마지막 버튼을 누른 방문</dt>
              <dd className="mt-1 text-2xl font-black text-ink">
                {fmt(real.click)} <span className="text-sm font-semibold text-ink-soft">({pct(real.click, real.visits)})</span>
              </dd>
              <dd className="text-[12px] text-ink-faint">방문 대비</dd>
            </div>
            <div className={card}>
              <dt className="text-[13px] text-ink-faint">아무 행동 없이 나간 방문</dt>
              <dd className="mt-1 text-2xl font-black text-ink">{fmt(Math.max(0, real.visits - real.acted))}</dd>
            </div>
            <div className={card}>
              <dt className="text-[13px] text-ink-faint">테스트 기기</dt>
              <dd className="mt-1 text-2xl font-black text-ink">{fmt(test.visits)}</dd>
              <dd className="text-[12px] text-ink-faint">테스트 기록 (마지막 버튼 {fmt(test.click)})</dd>
            </div>
          </dl>

          <div className={`${card} mt-3`}>
            <p className="text-[13px] text-ink-faint">스크롤 도달</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SCROLL_STEPS.map((s) => {
                const v = real[`s${s}` as "s25"];
                return (
                  <li key={s} className="rounded-lg bg-bg px-3 py-2 text-sm text-ink">
                    {s}% <strong className="ml-1">{fmt(v)}</strong> <span className="text-ink-soft">({pct(v, real.visits)})</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[12px] text-ink-faint">그 위치까지 화면을 내렸다는 뜻이에요. 읽었다는 뜻은 아니에요.</p>
          </div>

          <div className={`${card} mt-3`}>
            <p className="text-[13px] text-ink-faint">들어온 곳(utm_source)별</p>
            {sources.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft">이 달 기록이 아직 없어요.</p>
            ) : (
              <table className="mt-2 w-full text-left text-sm">
                <thead>
                  <tr className="text-[13px] text-ink-faint">
                    <th className="py-1 font-semibold">들어온 곳</th>
                    <th className="py-1 text-right font-semibold">방문</th>
                    <th className="py-1 text-right font-semibold">마지막 버튼</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map(([name, v]) => (
                    <tr key={name} className="border-t border-line">
                      <td className="py-1.5 break-all">{name}</td>
                      <td className="py-1.5 text-right">{fmt(v.visits)}</td>
                      <td className="py-1.5 text-right">{fmt(v.click)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      <div className={`${card} mt-3`}>
        <p className="text-[13px] text-ink-faint">테스트 기기</p>
        <TestDeviceButton />
      </div>

      <div className={`${card} mt-3`}>
        <p className="text-[13px] text-ink-faint">메타 픽셀 ID</p>
        <p className="mt-1 text-[12px] text-ink-faint">값이 있으면 랜딩이 이 ID로 PageView를 보내고, 마지막 버튼은 클릭으로만 보내요. 구매 완료로는 보내지 않아요.</p>
        {blobOk ? <PixelForm current={pixelId} /> : <p className="mt-2 text-sm text-ink-soft">저장 공간을 연결하면 입력할 수 있어요.</p>}
      </div>
    </section>
  );
}
