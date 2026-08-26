import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Link } from "wouter";
import { trackConversion } from "@/lib/analytics";
import { AboutCarePhilosophy, AboutGreeting, wifeCharacterSrc } from "@/components/AboutDetailHighlights";

const husbandRole = {
  badge: "남편 · 현장",
  items: ["상담·견적", "정기 청소", "장비 관리", "품질 체크"],
};

const wifeRole = {
  badge: "아내 · 운영",
  items: ["마케팅", "홈페이지 운영", "블로그·SNS", "디자인"],
};

const processSteps = [
  { step: "01", title: "방문 견적", text: "건물 상태를 직접 확인하고 맞춤 견적을 안내합니다." },
  { step: "02", title: "계약", text: "관리 범위와 주기를 정리해 계약을 진행합니다." },
  { step: "03", title: "초벌 관리", text: "묵은 오염을 집중 정리해 기본 상태를 만듭니다." },
  { step: "04", title: "정기 관리", text: "체계적인 주기 관리로 깨끗함을 유지합니다." },
  { step: "05", title: "사진제공", text: "초도청소 후 청소 전후 사진으로 결과를 보고드립니다." },
];

const processSequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.08 } },
};

const processStepMotion: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

function CoupleRoles() {
  return (
    <section className="px-5 pb-12 pt-3 md:pb-20 md:pt-5">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)_170px_minmax(0,1fr)] items-center gap-3 md:grid-cols-[minmax(0,1fr)_340px_minmax(0,1fr)] md:gap-12">
          <div className="flex flex-col items-end">
            <span className="whitespace-nowrap rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold text-primary md:px-4 md:py-2 md:text-[15px]">
              {husbandRole.badge}
            </span>
            <ul className="mt-4 space-y-3 md:mt-6 md:space-y-5">
              {husbandRole.items.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-center justify-end gap-1.5 whitespace-nowrap text-[13px] font-bold leading-tight text-slate-700 md:gap-2.5 md:text-xl"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item}
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary md:h-5 md:w-5" strokeWidth={3.2} />
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.img
            src="/booboo.webp"
            alt="이천계단지기 부부 캐릭터"
            className="w-[170px] shrink-0 object-contain md:w-[340px]"
            loading="lazy"
          />

          <div className="flex flex-col items-start">
            <span className="whitespace-nowrap rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold text-primary md:px-4 md:py-2 md:text-[15px]">
              {wifeRole.badge}
            </span>
            <ul className="mt-4 space-y-3 md:mt-6 md:space-y-5">
              {wifeRole.items.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-bold leading-tight text-slate-700 md:gap-2.5 md:text-xl"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary md:h-5 md:w-5" strokeWidth={3.2} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function MobileAbout() {
  return (
    <div className="about-page mx-auto max-w-5xl md:px-6">
      {/* HERO */}
      <section className="px-5 pb-0 pt-7 md:pb-0 md:pt-12">
        <AboutGreeting />
      </section>

      <CoupleRoles />

      {/* 시작한 이유와 관리 철학 */}
      <motion.section
        className="px-5 py-7 md:px-10 md:py-14"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 md:p-10">
          <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_150px] md:gap-8">
            <div className="min-w-0">
              <motion.h2
                className="break-keep font-['GmarketSans'] text-xl font-extrabold leading-tight text-foreground md:text-3xl"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                우리가 <span className="text-primary">시작한 이유</span>
              </motion.h2>
              <motion.p
                className="mt-3 break-keep text-sm font-medium leading-relaxed text-gray-700 md:mt-4 md:text-base md:leading-8"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                우리가 살던 빌라도 청소 상태가 좋지 않았습니다. 늘 지저분한 계단을 오르며 생각했습니다.
              </motion.p>
              <motion.p
                className="mt-3 break-keep font-['GmarketSans'] text-base font-extrabold text-primary md:mt-4 md:text-xl"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.55, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              >
                "왜 계단청소는 항상 아쉬울까?"
              </motion.p>
              <motion.p
                className="mt-3 break-keep text-sm font-medium leading-relaxed text-gray-700 md:text-base md:leading-8"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.55, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
              >
                그래서 직접 시작했습니다. 계단청소는 한 번보다 꾸준함이 중요하기에, 처음 확인한 건물 상태를
                기억하고 이어서 관리합니다.
              </motion.p>
            </div>

            <motion.img
              src={wifeCharacterSrc}
              alt="이천계단지기가 시작한 이유를 소개하는 아내 단이 캐릭터"
              className="mx-auto w-[110px] object-contain mix-blend-multiply md:w-[150px]"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
              }}
            />
          </div>
        </div>

        <AboutCarePhilosophy />
      </motion.section>

      {/* 관리 프로세스 */}
      <section className="my-8 px-5 py-8 md:my-14 md:py-10">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground md:mb-8 md:text-center md:text-2xl">관리 프로세스</h2>
        <motion.div
          className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-blue-100 md:hidden"
          variants={processSequence}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {processSteps.map((step) => (
            <motion.div
              key={step.step}
              className="relative flex items-start gap-3.5"
              variants={processStepMotion}
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
        </motion.div>

        {/* PC: 가로 5단계 */}
        <motion.div
          className="relative hidden md:block"
          variants={processSequence}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="absolute left-[10%] right-[10%] top-[18px] h-px bg-blue-100" />
          <div className="relative grid grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center"
                variants={processStepMotion}
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
        </motion.div>
      </section>

      {/* 사진 제공 */}
      <section className="px-5 py-7">
        <div className="mb-5 flex items-center justify-between gap-4 md:mx-auto md:mb-8 md:max-w-3xl">
          <h2 className="font-['GmarketSans'] text-lg font-extrabold text-foreground md:text-2xl">사진 제공</h2>
          <Link
            href="/before-after"
            onClick={() =>
              trackConversion("cta_click", {
                location: "mobile_about_before_after",
                label: "청소 전후 더보기",
              })
            }
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-muted-foreground transition active:text-primary md:hover:text-primary"
          >
            더보기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
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

      {/* CTA — 소개 페이지 마무리 (모바일·PC 공통) */}
      <section className="px-5 pb-10 pt-2 md:mx-auto md:max-w-5xl md:px-6 md:pb-20 md:pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-800 p-6 text-center text-white md:rounded-[2rem] md:p-12">
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
