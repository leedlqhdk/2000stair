import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import Navbar from "@/components/Navbar";
import Services from "@/pages/Services";
import BlogReviews from "@/components/BlogReviews";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import FaqSection from "@/components/FaqSection";
import MobileHome from "@/components/MobileHome";
import IntroLoader, { shouldShowIntro } from "@/components/IntroLoader";

export default function Home() {
  const [intro, setIntro] = useState<"loading" | "reveal" | "done">(() =>
    shouldShowIntro() ? "loading" : "done"
  );
  const [desktopConcernsDone, setDesktopConcernsDone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("home-pc-snap");

    return () => {
      document.documentElement.classList.remove("home-pc-snap");
    };
  }, []);

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
            <div className="home-snap-section home-snap-hero">
              <HeroSection
                isAuthenticated={false}
                onConcernsComplete={() => setDesktopConcernsDone(true)}
              />
            </div>

            <div
              className={`grid transition-[grid-template-rows,opacity] delay-300 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                desktopConcernsDone ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div
                className="overflow-hidden"
                key={desktopConcernsDone ? "desktop-home-revealed" : "desktop-home-hidden"}
              >
                {/* 대표 직접관리 */}
                <div className="home-snap-section home-snap-profile md:flex md:items-center md:bg-white">
                  <HusbandProfileStats />
                </div>

                {/* 왜 이천계단지기인가 */}
                <div className="home-snap-section home-snap-process md:flex md:items-center md:bg-white">
                  <HowItWorks />
                </div>

                {/* 제공 서비스 */}
                <div className="md:snap-none">
                  <Services />
                </div>

                {/* 실제 작업 결과 */}
                <div className="md:snap-none">
                  <BeforeAfterGallery />
                </div>

                {/* 실제 후기 요약 */}
                <div className="container max-w-6xl py-16 md:snap-none md:py-24">
                  <BlogReviews />
                </div>

                {/* 블로그 최신 소식 (타임라인) */}
                <div className="md:snap-none">
                  <LatestBlogPosts variant="timeline" />
                </div>

                <div className="md:snap-none">
                  <FaqSection />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
