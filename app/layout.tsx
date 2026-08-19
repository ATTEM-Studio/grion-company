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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grion-company-live-choi18.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "그리온컴퍼니 | 광고를 팔지 않습니다, 성장의 순서를 설계합니다",
    template: "%s | 그리온컴퍼니",
  },
  description:
    "그리온컴퍼니는 사업의 현재와 목표 사이의 차이를 분석하고, 성장을 막고 있는 병목을 찾아 무엇부터 바꿔야 하는지 설계하는 성장 파트너입니다. 광고를 팔기 전에 막힌 곳부터 진단합니다.",
  keywords: [
    "그리온컴퍼니",
    "그리온",
    "GRION COMPANY",
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
    title: "그리온컴퍼니 | 광고를 팔지 않습니다, 성장의 순서를 설계합니다",
    description:
      "고객이 부족한지, 선택받지 못하는지, 행동으로 이어지지 않는지. 그리온은 사업의 구조를 먼저 진단합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "그리온컴퍼니 | 광고보다 먼저 막힌 곳부터 찾습니다",
    description:
      "사업의 현재와 목표 사이의 차이를 분석하고, 무엇부터 바꿔야 하는지 설계하는 성장 파트너.",
  },
  robots: {
    index: true,
    follow: true,
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
