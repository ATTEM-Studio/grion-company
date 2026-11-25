// 리포트 구성 예시 화면. 실제 수치나 매장명은 넣지 않고 구성만 보여줍니다.
export function ReportPreview({ caption }: { caption: string }) {
  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-28px_rgba(16,18,43,0.35)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="text-[13px] font-extrabold tracking-tight text-ink">우리 업장 정밀진단 리포트</span>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent-strong">
            예시
          </span>
        </div>

        <div className="space-y-4 p-5">
          {/* 01 경쟁집 비교 */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-accent">01 경쟁집 비교</p>
            <div className="mt-2.5 space-y-2" aria-hidden="true">
              {[
                { label: "우리 매장", w: "w-[42%]", me: true },
                { label: "경쟁집 A", w: "w-[78%]" },
                { label: "경쟁집 B", w: "w-[64%]" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className={`w-16 flex-none text-[11px] ${r.me ? "font-bold text-ink" : "text-ink-faint"}`}>
                    {r.label}
                  </span>
                  <span className="h-2.5 flex-1 rounded-full bg-bg-alt">
                    <span className={`block h-2.5 rounded-full ${r.w} ${r.me ? "bg-accent" : "bg-line-strong"}`} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 02 리뷰·키워드 */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-accent">02 리뷰·키워드 분석</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5" aria-hidden="true">
              {["w-14", "w-20", "w-12", "w-16", "w-10"].map((w, i) => (
                <span
                  key={i}
                  className={`h-6 ${w} rounded-full ${i < 2 ? "bg-accent-soft" : "bg-bg-alt"}`}
                />
              ))}
            </div>
          </div>

          {/* 03 우선 개선 3가지 */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-accent">03 우선 개선 3가지</p>
            <ol className="mt-2.5 space-y-2" aria-hidden="true">
              {["w-[70%]", "w-[58%]", "w-[64%]"].map((w, i) => (
                <li key={i} className="flex items-center gap-2.5 rounded-lg bg-bg px-3 py-2">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className={`h-2.5 ${w} rounded-full bg-line-strong`} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <figcaption className="mt-2.5 text-center text-[12px] text-ink-faint">{caption}</figcaption>
    </figure>
  );
}
