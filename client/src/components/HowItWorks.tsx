import { useHomeMotion } from "@/components/HomeMotion";
import { motion } from "framer-motion";
import { ClipboardCheck, Home, MessageCircle, MessageSquareMore, Sparkles } from "lucide-react";
import HomeAreaMap from "@/components/HomeAreaMap";

const steps = [
  { number: "01", icon: MessageCircle, title: "문의하기", text: "카카오톡으로 건물 사진과 주소를 보내주시면 상담을 시작합니다." },
  { number: "02", icon: Home, title: "무료 방문 견적", text: "현장 상황과 오염 상태를 확인해 관리 범위와 주기를 안내드립니다." },
  { number: "03", icon: ClipboardCheck, title: "관리 계획 안내", text: "방문 견적 후 관리 범위와 주기를 정리한 견적서를 제공해드립니다. 고객님 편의에 따라 대면 또는 비대면 계약이 가능합니다." },
  { number: "04", icon: Sparkles, title: "정기 관리 시작", text: "약속한 일정에 맞춰 부부가 직접 방문해 꾸준히 관리합니다." },
  { number: "05", icon: MessageSquareMore, title: "원활한 피드백", text: "초도청소 후 청소 전후 사진 제공과 함께 요청사항과 건의사항을 빠르게 반영해드립니다." },
];

// PC 홈 전용: 왼쪽 관리 지역 지도 + 오른쪽 진행 단계(박스 없이 세로선으로 잇는 목록)
export default function HowItWorks() {
  const { home, reveal } = useHomeMotion();
  return (
    <section id="how-it-works" className="bg-white py-10 md:py-20">
      <div className="container max-w-4xl lg:max-w-6xl">
        <motion.div className="mx-auto mb-8 max-w-2xl text-center md:mb-10" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="mb-2 text-xs font-bold tracking-[0.25em] text-primary md:mb-4 md:text-sm">PROCESS</p>
          <h2 className="font-['GmarketSans'] mb-2 text-2xl font-extrabold leading-[1.14] text-foreground md:mb-4 md:text-4xl">이렇게 진행됩니다</h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground md:text-lg">복잡한 신청서 없이 카카오톡으로 문의하고, 건물 상태에 맞는 관리 범위를 안내드립니다.</p>
        </motion.div>

        {/* 1024px 이상: 왼쪽 관리 지역 지도, 오른쪽 진행 단계 */}
        <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <motion.div
            className="mx-auto mb-8 max-w-md lg:mx-0 lg:mb-0 lg:max-w-none"
            {...(home ? reveal(0.05, 24) : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.65 } })}
          >
            <HomeAreaMap />
          </motion.div>

          <ol className="mx-auto max-w-2xl lg:max-w-none">
            {steps.map((step, index) => (
              <motion.li
                key={step.number}
                className="relative flex gap-4 py-3"
                {...(home ? reveal(0.06 + index * 0.05, 18) : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: index * 0.08 } })}
              >
                {/* 다음 단계 아이콘까지 잇는 세로선 */}
                {index < steps.length - 1 && (
                  <span aria-hidden="true" className="absolute -bottom-3 left-[23.5px] top-[60px] w-px bg-blue-100" />
                )}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary ring-1 ring-blue-100">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 pt-1">
                  <h3 className="flex items-baseline gap-2 text-lg font-extrabold text-foreground">
                    <span className="text-sm font-extrabold text-primary">{step.number}</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 break-keep text-base leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
