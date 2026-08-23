import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.documentElement.classList.add("home-pc-scroll-snap");
    return () => document.documentElement.classList.remove("home-pc-scroll-snap");
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isAnimating = false;
    let animationFrame = 0;
    let unlockTimer = 0;

    const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

    const animateTo = (target: number) => {
      const start = window.scrollY;
      const distance = target - start;
      const duration = 700;
      const startedAt = performance.now();

      isAnimating = true;

      const step = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        window.scrollTo(0, start + distance * easeOutCubic(progress));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
          return;
        }

        window.clearTimeout(unlockTimer);
        unlockTimer = window.setTimeout(() => {
          isAnimating = false;
        }, 60);
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    const handleWheel = (event: WheelEvent) => {
      if (!desktopQuery.matches || reducedMotionQuery.matches || event.ctrlKey) return;

      const sections = Array.from(document.querySelectorAll<HTMLElement>(".home-scroll-section"));
      if (sections.length === 0 || Math.abs(event.deltaY) < 8) return;

      const viewportAnchor = window.scrollY + window.innerHeight * 0.45;
      const lastSection = sections[sections.length - 1];
      const lastSectionAnchor = lastSection.offsetTop + lastSection.offsetHeight * 0.45;

      if (
        (event.deltaY > 0 && viewportAnchor >= lastSectionAnchor) ||
        (event.deltaY < 0 && window.scrollY > lastSection.offsetTop + lastSection.offsetHeight)
      ) {
        return;
      }

      const currentIndex = sections.reduce((closestIndex, section, index) => {
        const closest = sections[closestIndex];
        const sectionCenter = section.offsetTop + section.offsetHeight / 2;
        const closestCenter = closest.offsetTop + closest.offsetHeight / 2;
        return Math.abs(sectionCenter - viewportAnchor) < Math.abs(closestCenter - viewportAnchor)
          ? index
          : closestIndex;
      }, 0);
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(Math.max(currentIndex + direction, 0), sections.length - 1);

      if (nextIndex === currentIndex) return;

      event.preventDefault();
      if (isAnimating) return;

      const headerOffset = 80;
      animateTo(Math.max(sections[nextIndex].offsetTop - headerOffset, 0));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(unlockTimer);
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
            <div id="home-reviews">
              <div className="container max-w-6xl py-16 md:py-24">
                <BlogReviews />
              </div>
            </div>
            <div id="home-contact">
              <HomeFinalCta />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
