import { useLocation } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  MessageCircle,
  Phone,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackConversion } from "@/lib/analytics";

const stats = [
  { value: "5년+", label: "청소 경력" },
  { value: "5.0", label: "리뷰 평균" },
  { value: "21,600+", label: "누적 관리 세대" },
  { value: "90%", label: "계약률" },
];

const husbandRole = {
  badge: "남편 | 현장 담당",
  items: ["청소 경로 설계", "정기 청소 관리", "장비·세제 관리", "현장 품질 체크"],
};

const wifeRole = {
  badge: "아내 | 운영 담당",
  items: ["상담 및 견적", "스케줄 관리", "블로그·SNS 운영", "고객 관리"],
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
    <div className="md:hidden">
      {/* HERO */}
      <section className="px-5 pb-2 pt-7">
        <p className="text-[11px] font-extrabold tracking-[0.25em] text-primary">ABOUT US</p>
        <h1 className="mt-3 break-keep font-['GmarketSans'] text-[1.9rem] font-extrabold leading-[1.2] text-foreground">
          우리는
          <br />
          <span className="bg-gradient-to-r from-blue-700 via-primary to-blue-400 bg-clip-text text-transparent">
            계단을 지키는
          </span>
          <br />
          부부입니다.
        </h1>
        <p className="mt-3.5 break-keep text-sm font-semibold leading-relaxed text-gray-700">
          깨끗한 계단은 건물의 첫인상입니다.
          <br />
          이천에서 하청 없이 직접 관리합니다.
        </p>
        <button
          type="button"
          onClick={() => {
            trackConversion("quote_form_view", { location: "mobile_about_hero", label: "무료 방문견적 문의하기" });
            setLocation("/quote");
          }}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-extrabold text-white shadow-lg shadow-primary/25"
        >
          무료 방문견적 문의하기
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="mt-2 flex justify-center">
          <img src="/booboo.webp" alt="이천계단지기 부부 캐릭터" className="w-64" loading="lazy" />
        </div>
      </section>

      {/* 우리가 시작한 이유 */}
      <section className="px-5 py-7">
        <motion.div
          className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-['GmarketSans'] text-lg font-extrabold text-foreground">우리가 시작한 이유</h2>
          <p className="mt-3 break-keep text-sm font-medium leading-relaxed text-gray-700">
            우리가 살던 빌라도 청소 상태가 좋지 않았습니다. 늘 지저분한 계단을 오르며 생각했습니다.
          </p>
          <p className="mt-3 break-keep font-['GmarketSans'] text-[15px] font-extrabold text-primary">
            "왜 계단청소는 항상 아쉬울까?"
          </p>
          <p className="mt-3 break-keep text-sm font-medium leading-relaxed text-gray-700">
            그래서 직접 시작했습니다. 계단청소는 한 번보다 꾸준함이 중요하기에, 처음 확인한 건물 상태를
            기억하고 이어서 관리합니다.
          </p>
        </motion.div>

        {/* 통계 */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-blue-100 bg-white p-4 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <p className="font-['GmarketSans'] text-xl font-extrabold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs font-bold text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 부부 소개 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 text-center font-['GmarketSans'] text-lg font-extrabold text-foreground">
          부부 소개
        </h2>
        <motion.div
          className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-right">
            <p className="break-keep text-[12px] font-extrabold text-foreground">{husbandRole.badge}</p>
            <ul className="mt-2.5 space-y-2">
              {husbandRole.items.map((item) => (
                <li key={item} className="break-keep text-[11.5px] font-semibold text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <img
            src="/images/couple-profile.jpg"
            alt="이천계단지기 부부"
            className="w-[150px] rounded-3xl border border-blue-100 object-cover shadow-[0_8px_24px_rgba(15,23,42,0.1)]"
            loading="lazy"
          />

          <div>
            <p className="break-keep text-[12px] font-extrabold text-foreground">{wifeRole.badge}</p>
            <ul className="mt-2.5 space-y-2">
              {wifeRole.items.map((item) => (
                <li key={item} className="break-keep text-[11.5px] font-semibold text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* 4가지 원칙 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground">
          이천계단지기의 4가지 원칙
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-primary">
                <principle.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-2.5 text-[13.5px] font-extrabold text-foreground">{principle.title}</h3>
              <p className="mt-1 break-keep text-[11.5px] font-medium leading-relaxed text-muted-foreground">
                {principle.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 관리 프로세스 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground">관리 프로세스</h2>
        <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-blue-100">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative flex items-start gap-3.5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
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
      </section>

      {/* 작업 전후 */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground">작업 전후 사진</h2>
        <div className="grid grid-cols-2 gap-2.5">
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

      {/* CTA */}
      <section className="px-5 pb-10 pt-2">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-800 p-6 text-center text-white">
          <p className="break-keep font-['GmarketSans'] text-[16px] font-extrabold leading-snug">
            계단청소는 단순한 청소가 아닙니다.
            <br />
            건물의 첫인상을 관리하는 일입니다.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
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
