import HeroSection from "@/components/HeroSection";
import SeoIntroSection from "@/components/SeoIntroSection";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import PricingSection from "@/components/PricingSection";
import BlogReviews from "@/components/BlogReviews";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <HeroSection isAuthenticated={false} />
        <SeoIntroSection />
        <HusbandProfileStats />
        <HowItWorks />
        <BeforeAfterGallery />
        <PricingSection isAuthenticated={false} />
        <BlogReviews />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
