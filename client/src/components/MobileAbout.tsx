import { useLocation } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  MessageCircle,
  Phone,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackConversion } from "@/lib/analytics";
import CountUp from "@/components/CountUp";

const floatTransition = { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const };

const stats = [
  { value: "5년+", label: "청소 경력" },
  { value: "5.0", label: "리뷰 평균" },
  { value: "21,600+", label: "누적 관리 세대" },
  { value: "90%", label: "계약률" },
];

const husbandRole = {
  badge: "남편 · 현장",
  items: ["상담·견적", "정기 청소", "장비 관리", "품질 체크"],
};

const wifeRole = {
  badge: "아내 · 운영",
  items: ["마케팅", "홈페이지 운영", "블로그·SNS", "디자인"],
};

const principles = [
  { icon: UserCheck, title: "대표 직접관리", text: "하청 없이 부부가 직접 관리합니다." },
  { icon: Camera, title: "전후사진 제공", text: "작업 전후 사진을 투명하게 드립니다." },
  { icon: MessageCircle, title: "비대면 소통", text: "전화·카톡으로 편하게 소통합니다." },
  { icon: BadgeCheck, title: "정직한 가격", text: "필요한 서비스만 정직하게 안내합니다." },
];

const processSteps = [
  { step: "01", title: "방문 견적", text: "건물 상태를 직접 확인하고 맞춤 견적을 안내합니다." },
  { step: "02", title: "계약", text: "관리 범위와 주기를 정리해 계약을 진행합니다." },
  { step: "03", title: "초벌 관리", text: "묵은 오염을 집중 정리해 기본 상태를 만듭니다." },
  { step: "04", title: "정기 관리", text: "체계적인 주기 관리로 깨끗함을 유지합니다." },
  { step: "05", title: "작업 보고", text: "전후 사진과 함께 결과를 보고드립니다." },
];

export default function MobileAbout() {
  const [, setLocation] = useLocation();

  return (
    <div className="mx-auto max-w-5xl md:px-6">
      {/* HERO */}
      <section className="px-5 pb-4 pt-7 md:pb-8 md:pt-14">
        <div className="flex items-center gap-4 md:gap-12">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold tracking-[0.25em] text-primary md:text-sm">ABOUT US</p>
            <h1 className="mt-3 break-keep font-['GmarketSans'] text-[1.55rem] font-extrabold leading-[1.25] text-foreground md:mt-5 md:text-[2.7rem] md:leading-[1.2]">
              우리는
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-primary to-blue-400 bg-clip-text text-transparent">
                계단을 지키는
              </span>
              <br />
              부부입니다.
            </h1>
            <p className="mt-3 break-keep text-[13px] font-semibold leading-relaxed text-gray-700 md:mt-5 md:max-w-md md:text-lg md:leading-8">
              깨끗한 계단은 건물의 첫인상입니다. 이천에서 하청 없이 직접 관리합니다.
            </p>
          </div>
          <motion.img
            src="/images/couple-profile.jpg"
            alt="이천계단지기 부부"
            className="w-[148px] shrink-0 rounded-3xl object-cover ring-4 ring-blue-50 shadow-[0_8px_24px_rgba(15,23,42,0.12)] md:w-[320px] md:rounded-[2rem]"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
            transition={{ opacity: { duration: 0.6 }, scale: { duration: 0.6 }, y: floatTransition }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            trackConversion("quote_form_view", { location: "mobile_about_hero", label: "무료 방문견적 문의하기" });
            setLocation("/quote");
          }}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-primary/25 md:mt-7 md:h-[52px] md:w-auto md:px-8 md:text-base"
        >
          무료 방문견적 문의하기
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* 우리가 시작한 이유 */}
      <section className="px-5 py-7">
        <motion.div
          className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 md:p-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-['GmarketSans'] text-lg font-extrabold text-foreground md:text-2xl">우리가 시작한 이유</h2>
          <p className="mt-3 break-keep text-sm font-medium leading-relaxed text-gray-700 md:mt-4 md:text-base md:leading-8">
            우리가 살던 빌라도 청소 상태가 좋지 않았습니다. 늘 지저분한 계단을 오르며 생각했습니다.
          </p>
          <p className="mt-3 break-keep font-['GmarketSans'] text-[15px] font-extrabold text-primary md:mt-4 md:text-xl">
            "왜 계단청소는 항상 아쉬울까?"
          </p>
          <p className="mt-3 break-keep text-sm font-medium leading-relaxed text-gray-700">
            그래서 직접 시작했습니다. 계단청소는 한 번보다 꾸준함이 중요하기에, 처음 확인한 건물 상태를
            기억하고 이어서 관리합니다.
          </p>
        </motion.div>

        {/* 통계 */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 md:mt-5 md:grid-cols-4 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)] md:p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <CountUp value={stat.value} className="font-['GmarketSans'] text-xl font-extrabold text-primary md:text-3xl" />
              <p className="mt-1 text-xs font-bold text-muted-foreground md:mt-2 md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 부부 소개 */}
      <section className="px-5 py-7">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 md:mx-auto md:w-fit md:grid-cols-[auto_auto_auto] md:gap-12">
            <div className="flex flex-col items-end">
              <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-[10.5px] font-extrabold text-primary md:px-3 md:text-xs">
                {husbandRole.badge}
              </span>
              <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
                {husbandRole.items.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center justify-end gap-1.5 whitespace-nowrap text-[12px] font-bold leading-tight text-slate-700 md:gap-2 md:text-[15px]"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {item}
                    <Check className="h-3 w-3 shrink-0 text-primary" strokeWidth={3.2} />
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.img
              src="/booboo.webp"
              alt="이천계단지기 부부 캐릭터"
              className="w-[150px] shrink-0 object-contain md:w-[230px]"
              loading="lazy"
              animate={{ y: [0, -8, 0] }}
              transition={floatTransition}
            />

            <div className="flex flex-col items-start">
              <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-[10.5px] font-extrabold text-primary md:px-3 md:text-xs">
                {wifeRole.badge}
              </span>
              <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
                {wifeRole.items.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-bold leading-tight text-slate-700 md:gap-2 md:text-[15px]"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Check className="h-3 w-3 shrink-0 text-primary" strokeWidth={3.2} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4가지 원칙 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground md:mb-8 md:text-center md:text-2xl">
          이천계단지기의 4가지 원칙
        </h2>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-colors hover:border-primary/40 md:p-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-primary md:h-12 md:w-12">
                <principle.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-2.5 text-[13.5px] font-extrabold text-foreground md:mt-3.5 md:text-base">{principle.title}</h3>
              <p className="mt-1 break-keep text-[11.5px] font-medium leading-relaxed text-muted-foreground md:mt-1.5 md:text-[13px] md:leading-6">
                {principle.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 관리 프로세스 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground md:mb-8 md:text-center md:text-2xl">관리 프로세스</h2>
        <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-blue-100 md:hidden">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative flex items-start gap-3.5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-white ring-4 ring-blue-50">
                {step.step}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <h3 className="text-[13.5px] font-extrabold text-foreground">{step.title}</h3>
                <p className="mt-0.5 break-keep text-xs font-medium leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* PC: 가로 5단계 */}
        <div className="relative hidden md:block">
          <div className="absolute left-[10%] right-[10%] top-[18px] h-px bg-blue-100" />
          <div className="relative grid grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[12px] font-extrabold text-white ring-4 ring-blue-50">
                  {step.step}
                </span>
                <h3 className="mt-3.5 text-[15px] font-extrabold text-foreground">{step.title}</h3>
                <p className="mt-1.5 break-keep text-[12.5px] font-medium leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 작업 전후 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground md:mb-8 md:text-center md:text-2xl">작업 전후 사진</h2>
        <div className="grid grid-cols-2 gap-2.5 md:mx-auto md:max-w-3xl md:gap-4">
          {[
            { src: "/images/before-after/majang-villa-stair-rust-removal-before.webp", label: "BEFORE" },
            { src: "/images/before-after/majang-villa-stair-rust-removal-after.webp", label: "AFTER" },
          ].map((photo) => (
            <div key={photo.label} className="relative overflow-hidden rounded-2xl border border-blue-100">
              <img src={photo.src} alt={`계단 관리 ${photo.label}`} className="aspect-[4/5] w-full object-cover" loading="lazy" />
              <span
                className={`absolute bottom-2.5 left-2.5 rounded-lg px-2.5 py-1 text-[10.5px] font-extrabold ${
                  photo.label === "AFTER" ? "bg-primary text-white" : "bg-black/60 text-white"
                }`}
              >
                {photo.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA (모바일 전용 — PC는 푸터가 대신함) */}
      <section className="px-5 pb-10 pt-2 md:hidden">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-800 p-6 text-center text-white">
          <p className="break-keep font-['GmarketSans'] text-[16px] font-extrabold leading-snug md:text-2xl">
            계단청소는 단순한 청소가 아닙니다.
            <br />
            건물의 첫인상을 관리하는 일입니다.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2.5 md:mx-auto md:mt-7 md:max-w-md md:gap-3">
            <a
              href="tel:01084381887"
              onClick={() => trackConversion("phone_click", { location: "mobile_about_cta", label: "전화문의" })}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-primary"
            >
              <Phone className="h-4 w-4" />
              전화문의
            </a>
            <a
              href="https://pf.kakao.com/_IiNfn/chat"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion("kakao_click", { location: "mobile_about_cta", label: "카카오톡 상담" })}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-extrabold text-[#3a2929]"
            >
              <MessageCircle className="h-4 w-4" />
              카카오톡 상담
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
