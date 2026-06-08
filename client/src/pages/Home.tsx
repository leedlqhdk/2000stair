import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import Navbar from "@/components/Navbar";
import Services from "@/pages/Services";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <HeroSection isAuthenticated={false} />

        {/* 제공 서비스 */}
        <Services />

        {/* 왜 이천계단지기인가 */}
        <HowItWorks />

        {/* 대표 직접관리 */}
        <HusbandProfileStats />

        {/* 실제 작업 결과 */}
        <BeforeAfterGallery />
      </main>
    </div>
  );
}
