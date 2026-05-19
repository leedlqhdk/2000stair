import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import AreaCoverage from "@/components/AreaCoverage";
import OwnerStory from "@/components/OwnerStory";
import BoxPreview from "@/components/BoxPreview";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import ShortsSection from "@/components/ShortsSection";
import PricingSection from "@/components/PricingSection";
import LatestPosts from "@/components/LatestPosts";
import BlogReviews from "@/components/BlogReviews";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <HeroSection isAuthenticated={false} />
        <HowItWorks />
        <AreaCoverage />
        <OwnerStory />
        <BoxPreview />
        <BeforeAfterGallery />
        <ShortsSection />
        <PricingSection isAuthenticated={false} />
        <LatestPosts />
        <BlogReviews />
      </main>

      <Footer />
    </div>
  );
}
