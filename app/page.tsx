import { GrowthProvider } from "@/lib/growth-context";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { GrowthFlow } from "@/components/GrowthFlow";
import { LeverSection } from "@/components/LeverSection";
import { BudgetSection } from "@/components/BudgetSection";
import { GrionProcess } from "@/components/GrionProcess";
import { BottleneckSelector } from "@/components/BottleneckSelector";
import { SolutionsSection } from "@/components/SolutionsSection";
import { NotDoingSection } from "@/components/NotDoingSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { QualificationSection } from "@/components/QualificationSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import { DiagnosisForm } from "@/components/DiagnosisForm";
import { Footer } from "@/components/Footer";
import { MobileStickyCta } from "@/components/MobileStickyCta";

export default function Home() {
  return (
    // The visitor's numbers live at the page level so the hero calculator,
    // the lever math, and the diagnosis form all share one source of truth.
    <GrowthProvider>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <GrowthFlow />
        <LeverSection />
        <BudgetSection />
        <GrionProcess />
        <BottleneckSelector />
        <SolutionsSection />
        <NotDoingSection />
        <PhilosophySection />
        <QualificationSection />
        <FaqSection />
        <FinalCta />
        <DiagnosisForm />
      </main>
      <Footer />
      <MobileStickyCta />
    </GrowthProvider>
  );
}
