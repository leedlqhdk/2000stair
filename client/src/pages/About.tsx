import Navbar from "@/components/Navbar";
import MobileAbout from "@/components/MobileAbout";
import SeoIntroSection from "@/components/SeoIntroSection";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <MobileAbout />

        <div className="hidden md:block">
          <SeoIntroSection />
        </div>
      </main>
    </div>
  );
}
