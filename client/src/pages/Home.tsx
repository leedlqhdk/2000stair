import { HomeMotion } from "@/components/HomeMotion";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Navbar from "@/components/Navbar";
import Services from "@/pages/Services";
import BlogReviews from "@/components/BlogReviews";
import HomeWorkLogTimeline from "@/components/HomeWorkLogTimeline";
import MobileHome from "@/components/MobileHome";
import IntroLoader, { shouldShowIntro } from "@/components/IntroLoader";
import CustomerConcernsSection from "@/components/CustomerConcernsSection";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import HomeFinalCta from "@/components/HomeFinalCta";
import HomeFaq from "@/components/HomeFaq";
import HomeSectionNavigator from "@/components/HomeSectionNavigator";

export default function Home() {
  const [intro, setIntro] = useState<"loading" | "reveal" | "done">(() =>
    shouldShowIntro() ? "loading" : "done"
  );

  useEffect(() => {
    document.documentElement.classList.add("home-pc-scroll-snap");
    return () => document.documentElement.classList.remove("home-pc-scroll-snap");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {intro !== "done" && (
        <IntroLoader
          onReveal={() => setIntro((state) => (state === "loading" ? "reveal" : state))}
          onDone={() => setIntro("done")}
        />
      )}

      {/* PC 홈은 첫 화면 사진 위로 상단 바를 투명하게 띄운다 */}
      <Navbar overlay />

      {intro !== "loading" && (
        <main className="flex-1">
          <MobileHome />

          <HomeMotion>
          <div className="home-motion hidden md:block">
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
            <div id="home-reviews" className="scroll-mt-20">
              <div className="container max-w-6xl py-16 md:py-24">
                <BlogReviews />
              </div>
            </div>
            <div id="home-work-log" className="scroll-mt-20">
              <HomeWorkLogTimeline />
            </div>
            <div id="home-faq" className="scroll-mt-20">
              <HomeFaq />
            </div>
            <div id="home-contact" className="scroll-mt-20">
              <HomeFinalCta />
            </div>
          </div>
          </HomeMotion>
        </main>
      )}
    </div>
  );
}
