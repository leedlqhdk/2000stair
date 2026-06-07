import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <HeroSection isAuthenticated={false} />
        <HowItWorks />
        <BeforeAfterGallery />
        <PricingSection isAuthenticated={false} />
      </main>

      <Footer />
    </div>
  );
}
