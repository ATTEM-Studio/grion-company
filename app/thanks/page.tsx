import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingSections";
import {
  KakaoFloat,
  ThanksHeader,
  ThanksHero,
  ThanksOffer,
  ThanksProcess,
  ThanksValue,
} from "@/components/landing/ThanksPage";

export const metadata: Metadata = {
  title: "신청이 접수되었습니다",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thanks" },
};

export default function ThanksPage() {
  return (
    <>
      <ThanksHeader />
      <main>
        <ThanksHero />
        <ThanksProcess />
        <ThanksValue />
        <ThanksOffer />
      </main>
      <LandingFooter />
      <KakaoFloat />
    </>
  );
}
