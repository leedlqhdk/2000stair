import { useAuth } from "@/_core/hooks/useAuth";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BoxPreview from "@/components/BoxPreview";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import ShortsSection from "@/components/ShortsSection";
import OwnerStory from "@/components/OwnerStory";
import PricingSection from "@/components/PricingSection";
import BlogReviews from "@/components/BlogReviews";
import LatestPosts from "@/components/LatestPosts";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
      />
      <main className="flex-1">
        <HeroSection isAuthenticated={isAuthenticated} />
        <HowItWorks />
        <BoxPreview />
        <BeforeAfterGallery />
        <OwnerStory />
        <PricingSection isAuthenticated={isAuthenticated} />
        <LatestPosts />
        <BlogReviews />
      </main>
      <Footer />
    </div>
  );
}
