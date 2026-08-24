import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Navbar from "@/components/Navbar";
import Services from "@/pages/Services";
import BlogReviews from "@/components/BlogReviews";
import MobileHome from "@/components/MobileHome";
import IntroLoader, { shouldShowIntro } from "@/components/IntroLoader";
import CustomerConcernsSection from "@/components/CustomerConcernsSection";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import HomeAreaMapSection from "@/components/HomeAreaMapSection";
import HomeFinalCta from "@/components/HomeFinalCta";
import HomeSectionNavigator from "@/components/HomeSectionNavigator";

export default function Home() {
  const [intro, setIntro] = useState<"loading" | "reveal" | "done">(() =>
    shouldShowIntro() ? "loading" : "done"
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {intro !== "done" && (
        <IntroLoader
          onReveal={() => setIntro((state) => (state === "loading" ? "reveal" : state))}
          onDone={() => setIntro("done")}
        />
      )}

      <Navbar />

      {intro !== "loading" && (
        <main className="flex-1">
          <MobileHome />

          <div className="hidden md:block">
            <HomeSectionNavigator />
            <div id="home-hero" className="home-scroll-section">
              <HeroSection isAuthenticated={false} />
            </div>
            <div id="home-concerns" className="home-scroll-section">
              <CustomerConcernsSection />
            </div>
            <div id="home-representative" className="home-scroll-section">
              <HusbandProfileStats />
            </div>
            <div id="home-process" className="home-scroll-section">
              <HowItWorks />
            </div>
            <div id="home-services" className="home-scroll-section">
              <Services />
            </div>
            <div id="home-before-after" className="home-scroll-section">
              <BeforeAfterGallery />
            </div>
            <div id="home-areas" className="home-scroll-section">
              <HomeAreaMapSection />
            </div>
            <div id="home-reviews" className="scroll-mt-20">
              <div className="container max-w-6xl py-16 md:py-24">
                <BlogReviews />
              </div>
            </div>
            <div id="home-contact" className="scroll-mt-20">
              <HomeFinalCta />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
