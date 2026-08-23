import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Navbar from "@/components/Navbar";
import Services from "@/pages/Services";
import BlogReviews from "@/components/BlogReviews";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import MobileHome from "@/components/MobileHome";
import IntroLoader, { shouldShowIntro } from "@/components/IntroLoader";
import CustomerConcernsSection from "@/components/CustomerConcernsSection";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import HomeAreaMapSection from "@/components/HomeAreaMapSection";
import HomeFinalCta from "@/components/HomeFinalCta";

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
            <HeroSection isAuthenticated={false} />
            <CustomerConcernsSection />
            <HusbandProfileStats />
            <HowItWorks />
            <Services />
            <BeforeAfterGallery />
            <LatestBlogPosts variant="timeline" />
            <div className="container max-w-6xl py-16 md:py-24">
              <BlogReviews />
            </div>
            <HomeAreaMapSection />
            <HomeFinalCta />
          </div>
        </main>
      )}
    </div>
  );
}
