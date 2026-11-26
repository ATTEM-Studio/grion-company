import { LogoDoor } from "./LogoDoor";
import { formHref, landingCta } from "@/content/landing";

// 광고 랜딩용 헤더: 다른 구간으로 빠지는 메뉴 없이 로고와 신청 버튼만 둡니다.
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-3 md:px-8">
        <LogoDoor />
        <a
          href={formHref}
          className="focus-ring hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong md:inline-flex"
        >
          {landingCta}
        </a>
      </div>
    </header>
  );
}
