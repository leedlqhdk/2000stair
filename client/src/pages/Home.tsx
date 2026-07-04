import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import HusbandProfileStats from "@/components/HusbandProfileStats";
import Navbar from "@/components/Navbar";
import Services from "@/pages/Services";
import PricingOverview from "@/components/PricingOverview";
import BlogReviews from "@/components/BlogReviews";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import FaqSection from "@/components/FaqSection";
import MobileHome from "@/components/MobileHome";

export default function Home() {
return (
<div className="min-h-screen flex flex-col bg-background">
<Navbar />

<main className="flex-1">
<MobileHome />

<div className="hidden lg:block">
<HeroSection isAuthenticated={false} />

{/* 제공 서비스 */}
<Services />

{/* 왜 이천계단지기인가 */}
<HowItWorks />

{/* 대표 직접관리 */}
<HusbandProfileStats />

{/* 실제 작업 결과 */}
<BeforeAfterGallery />

{/* 실제 후기 요약 */}
<div className="container max-w-6xl py-16 md:py-24">
<BlogReviews />
</div>

{/* 블로그 최신 소식 (타임라인) */}
<LatestBlogPosts variant="timeline" />

{/* 정기관리 요금 안내 */}
<PricingOverview />

<FaqSection />
</div>
</main>
</div>
);
}
