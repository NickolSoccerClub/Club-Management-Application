import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { LiveScores } from "@/components/landing/live-scores";
import { Sponsors } from "@/components/landing/sponsors";
import { NewsPreview } from "@/components/landing/news-preview";
import { ClubValues } from "@/components/landing/club-values";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <LiveScores />
      <Sponsors />
      <NewsPreview />
      <ClubValues />
      <CTASection />
      <Footer />
    </main>
  );
}
