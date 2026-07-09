import Navbar from "@/components/Navbar";
import MobileAbout from "@/components/MobileAbout";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <MobileAbout />
      </main>
    </div>
  );
}
