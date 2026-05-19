import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const stats = [
  { label: "부부직영", value: "하청 NO" },
  { label: "관리 기준", value: "정기관리" },
  { label: "상담 방식", value: "카톡 상담" },
];

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const handleCTA = () => {
    window.open("https://pf.kakao.com/_IiNfn", "_blank");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="absolute top-0 right-0 w-[34rem] h-[34rem] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl" />

      <div className="container relative py-24 md:py-36">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-5">
              <p className="text-sm font-bold tracking-[0.35em] text-primary">
                ICHEON STAIR KEEPER
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-foreground">
                건물을
                <br />
                꾸준히 보는 관리
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                이천 빌라·원룸·상가 공용공간을 하청 없이 부부가 직접 관리합니다.
                계단, 공동현관, 유리, 화장실까지 건물 상태에 맞춰 안내드립니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="text-base px-8" onClick={handleCTA}>
                <MessageCircle className="w-4 h-4 mr-2" />
                카톡으로 상담하기
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 bg-white"
                onClick={() =>
                  document
                    .getElementById("gallery")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                작업사례 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xl pt-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="text-base md:text-lg font-extrabold text-primary">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden border border-blue-100 bg-white shadow-2xl">
              <img
                src="/manus-storage/work-vest_b3f4fbac.png"
                alt="이천계단청소 부부직영 정기관리 현장"
                className="w-full h-auto object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  실제 현장 기반 관리
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-8 rounded-3xl bg-white border border-blue-100 shadow-xl p-5">
              <p className="text-sm text-muted-foreground mb-1">
                DIRECT CARE
              </p>
              <p className="text-2xl font-extrabold text-foreground">
                부부가 직접
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
