import type { Metadata } from "next";
import "./globals.css";

// Note: intentionally using a native Korean system-font stack (defined in
// globals.css as --font-base) instead of next/font/google. This avoids a
// runtime dependency on fonts.googleapis.com/fonts.gstatic.com — keeping
// first paint fast and the build resilient in network-restricted
// environments — while still rendering Korean text crisply via each OS's
// own Pretendard/Apple SD Gothic Neo/Malgun Gothic fonts.

// Reads from an env var first so this doesn't have to be hand-edited again
// when a custom domain is connected — just set NEXT_PUBLIC_SITE_URL in
// Vercel (Project → Settings → Environment Variables) and redeploy. Falls
// back to the current live deployment URL so OG/canonical tags are correct
// even before that's set.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grion-place-diagnosis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "무료 네이버 플레이스 진단 | 그리온컴퍼니",
    template: "%s | 그리온컴퍼니",
  },
  description:
    "네이버 플레이스를 운영하는 매장이라면 무료로 진단받으세요. 매장명과 플레이스 링크만 주시면 경쟁집 비교·리뷰 분석·우선 개선 3가지를 영업일 기준 3일 안에 보내드립니다. 그리온컴퍼니는 광고를 팔기 전에 막힌 곳부터 진단합니다.",
  keywords: [
    "그리온컴퍼니",
    "그리온",
    "GRION COMPANY",
    "네이버 플레이스 진단",
    "무료 플레이스 진단",
    "사업 성장 진단",
    "마케팅 전략",
    "마케팅 컨설팅",
    "자영업 마케팅",
    "지역 사업 마케팅",
    "성장 진단",
  ],
  authors: [{ name: "GRION COMPANY" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "GRION COMPANY",
    title: "옆집보다 손님이 적은 이유, 무료로 알려드립니다 | 그리온컴퍼니",
    description:
      "정밀진단 39,000원 → 무료. 경쟁집 비교·리뷰 분석·우선 개선 3가지를 영업일 기준 3일 안에 보내드립니다. 30팀 선착순.",
  },
  twitter: {
    card: "summary_large_image",
    title: "옆집보다 손님이 적은 이유, 무료로 알려드립니다 | 그리온컴퍼니",
    description:
      "정밀진단 39,000원 → 무료. 경쟁집 비교·리뷰 분석·우선 개선 3가지를 3일 안에 보내드립니다.",
  },
  // 광고 유입 전용 페이지라 검색 노출은 홈페이지에 맡깁니다.
  robots: {
    index: false,
    follow: false,
  },
};

// `LayoutProps<"/">` is a global Next.js generates into `.next/types` during
// a build, so relying on it makes a clean `tsc --noEmit` (CI, fresh clone)
// fail before anything has been built. The explicit prop type is equivalent
// and works standalone.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
