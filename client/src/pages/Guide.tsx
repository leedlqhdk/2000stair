import Navbar from "@/components/Navbar";
import CareGuideSection from "@/components/CareGuideSection";

export default function Guide() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <CareGuideSection />
      </main>
    </div>
  );
}
