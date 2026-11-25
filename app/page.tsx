import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import {
  AfterDiagnosisSection,
  LandingFinalCta,
  LandingFooter,
  PainsSection,
  ReportSection,
  StepsSection,
  TrustSection,
} from "@/components/landing/LandingSections";
import { ApplyForm } from "@/components/landing/ApplyForm";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingStickyCta } from "@/components/landing/LandingStickyCta";

// 광고 유입용 랜딩페이지 (grion-place-diagnosis 프로젝트 전용 브랜치).
// 행동은 '무료 진단 신청' 하나만 둡니다. 홈페이지 구간(계산기·성장 구조 등)은
// main 의 홈페이지에서 그대로 유지됩니다.
export default function Landing() {
  return (
    <>
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <PainsSection />
        <ReportSection />
        <StepsSection />
        <ApplyForm />
        <TrustSection />
        <AfterDiagnosisSection />
        <LandingFaq />
        <LandingFinalCta />
      </main>
      <LandingFooter />
      <LandingStickyCta />
    </>
  );
}
