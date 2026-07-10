import { Fragment } from "react";
import { Link, useLocation } from "wouter";
import {
  AppWindow,
  ArrowRight,
  Bath,
  Briefcase,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Home as HomeIcon,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackConversion } from "@/lib/analytics";
import ChannelLinks from "@/components/ChannelLinks";
import VisitorCounter from "@/components/VisitorCounter";
import Reveal from "@/components/Reveal";
import LatestBlogPosts from "@/components/LatestBlogPosts";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

const processSteps = [
  { icon: MessageCircle, title: "문의하기" },
  { icon: HomeIcon, title: "방문 견적" },
  { icon: Sparkles, title: "정기 관리" },
  { icon: Camera, title: "사진 공유" },
];

const popularServices = [
  { title: "계단 청소", subtitle: "빌라/상가 건물", icon: Building2, free: false, href: "/services/stair" },
  { title: "사무실 청소", subtitle: "정기 방문관리", icon: Briefcase, free: false, href: "/services/office" },
  { title: "유리창 청소", subtitle: "무료 방문 견적", icon: AppWindow, free: true, href: "/services/glass" },
  { title: "화장실 청소", subtitle: "친환경 약품 사용", icon: Bath, free: false, href: "/services/bathroom" },
];

const reviews = [
  {
    source: "숨고 후기",
    text: "정말 꼼꼼하게 청소해주셔서 너무 만족합니다!",
    href: "https://soomgo.com/profile/users/3729049",
  },
  {
    source: "당근 후기",
    text: "약속 시간 잘 지켜주시고 작업도 깔끔해요!",
    href: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
  },
  {
    source: "블로그 후기",
    text: "사진으로 보니 더 깔끔하고 믿음이 가네요 :)",
    href: "https://map.naver.com/p/entry/place/2097250452?placePath=%2Fhome",
  },
];

const areaChips = [
  { label: "신둔면", href: "/area/sindun" },
  { label: "증포동", href: "/area/jeungpo" },
  { label: "창전동", href: "/area/changjeon" },
  { label: "관고동", href: "/area/gwango" },
  { label: "중리동", href: "/area/jungni" },
  { label: "부발읍", href: "/area/bubal" },
  { label: "마장면", href: "/area/majang" },
  { label: "대월면", href: "/area/daewol" },
];

export default function MobileHome() {
  const [, setLocation] = useLocation();
  const goToQuote = () => setLocation("/quote");

  return (
    <div className="md:hidden">
      {/* HERO */}
      <section className="px-5 pb-7 pt-7">
        <h1 className="font-['GmarketSans'] text-[2rem] font-bold leading-[1.15] text-foreground">
          <span className="block bg-gradient-to-r from-blue-700 via-primary to-blue-400 bg-clip-text text-transparent">
            이천계단지기
          </span>
          건물 정기 청소관리 전문
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-gray-700">
          계단청소 · 사무실청소 · 화장실청소 · 유리청소
          <br />
          믿고 맡길 수 있는 <strong className="text-foreground">청소 파트너</strong>
        </p>
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              trackConversion("quote_form_view", { location: "mobile_hero", label: "무료 견적 문의" });
              goToQuote();
            }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-primary/25"
          >
            무료 견적 문의
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
            onClick={() => trackConversion("phone_click", { location: "mobile_hero", label: "전화 상담" })}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 text-sm font-extrabold text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" />
            전화 상담
          </a>
        </div>
        <div className="mt-4 flex justify-center">
          <VisitorCounter />
        </div>
      </section>

      {/* PROCESS FLOW */}
      <section className="px-5 py-7">
        <div className="flex items-start">
          {processSteps.map((step, index) => (
            <Fragment key={step.title}>
              {index > 0 && (
                <div className="flex h-11 w-5 shrink-0 items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5 text-primary/35 stroke-[2.6]" />
                </div>
              )}
              <motion.div
                className="flex flex-1 flex-col items-center gap-2"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="text-center text-[11.5px] font-bold leading-tight text-gray-700">
                  {step.title}
                </span>
              </motion.div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="px-5 py-7">
        <h2 className="mb-5 font-['GmarketSans'] text-lg font-extrabold text-foreground">
          요즘 많이 찾는 서비스
        </h2>
        <div className="flex flex-col gap-3">
          {popularServices.map((service, i) => (
            <Reveal key={service.title} index={i}>
              <Link
                href={service.href}
                className="flex items-center gap-3.5 rounded-2xl border border-blue-100 bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition active:scale-[0.99]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-primary">
                  <service.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-extrabold text-foreground">{service.title}</h3>
                  <p className={`mt-0.5 text-[12.5px] font-semibold ${service.free ? "text-primary" : "text-muted-foreground"}`}>
                    {service.subtitle}
                  </p>
                </span>
                <ChevronRight className="h-4.5 w-4.5 shrink-0 text-blue-300" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-7">
        <h2 className="mb-5 px-5 font-['GmarketSans'] text-lg font-extrabold text-foreground">
          작업 후기
        </h2>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviews.map((review) => (
            <a
              key={review.source}
              href={review.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion("review_click", { location: "mobile_reviews", label: review.source })}
              className="block w-[230px] shrink-0 rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide text-amber-500">★★★★★</span>
                <span className="text-[13px] font-extrabold text-foreground">5.0</span>
              </div>
              <p className="mt-2.5 text-[13.5px] font-semibold leading-relaxed text-foreground">{review.text}</p>
              <span className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                {review.source}
                <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* LATEST BLOG POSTS */}
      <LatestBlogPosts variant="mobile" />

      {/* AREAS */}
      <section className="px-5 py-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-['GmarketSans'] text-lg font-extrabold text-foreground">방문 지역</h2>
          <Link href="/areas" className="text-[13px] font-bold text-muted-foreground">
            전체보기 →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {areaChips.map((area, i) => (
            <Reveal key={area.label} index={i} y={14}>
              <Link
                href={area.href}
                className="block rounded-full border border-blue-200 bg-white px-4 py-2.5 text-[13.5px] font-bold text-gray-700 transition active:bg-primary active:text-white active:border-primary"
              >
                {area.label}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OFFICIAL CHANNELS */}
      <section className="px-5 py-7">
        <h2 className="mb-4 font-['GmarketSans'] text-lg font-extrabold text-foreground">공식 채널</h2>
        <ChannelLinks location="mobile_home_channels" />
      </section>

      {/* PROMO */}
      <section className="px-5 pb-9 pt-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-800 p-6 text-white">
          <h3 className="font-['GmarketSans'] text-lg font-extrabold leading-snug">
            지금 바로
            <br />
            무료 견적 받아보세요!
          </h3>
          <p className="mt-2 max-w-[190px] text-[13px] leading-relaxed text-white/85">
            빠른 상담으로 최적의 견적을 안내해드립니다.
          </p>
          <button
            type="button"
            onClick={() => {
              trackConversion("quote_form_view", { location: "mobile_promo", label: "견적 문의하기" });
              goToQuote();
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-primary shadow-lg"
          >
            견적 문의하기
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3.5 right-3.5 w-[78px] rounded-[10px] bg-white px-[11px] pt-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
            <div className="absolute -top-[7px] left-1/2 h-3 w-[34px] -translate-x-1/2 rounded-[5px] bg-blue-200" />
            <div className="mb-2 h-1.5 w-[70%] rounded-full bg-blue-100" />
            <div className="mb-2 h-1.5 w-[90%] rounded-full bg-blue-100" />
            <div className="mb-2 h-1.5 w-[55%] rounded-full bg-blue-100" />
            <div className="mb-3.5 flex items-center gap-1.5">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px] bg-primary">
                <Check className="h-2 w-2 text-white" strokeWidth={3.5} />
              </span>
              <div className="h-1.5 flex-1 rounded-full bg-blue-100" />
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM DOCK */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.7fr_1fr_1fr] border-t border-blue-100 bg-white shadow-[0_-6px_18px_rgba(15,40,80,0.06)]">
        <a
          href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
          onClick={() => trackConversion("phone_click", { location: "mobile_dock", label: "전화상담" })}
          className="flex flex-col items-start justify-center gap-0.5 py-2.5 pl-4"
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap text-[14px] font-extrabold text-primary">
            <Phone className="h-4 w-4 shrink-0" />
            {PHONE_NUMBER}
          </span>
          <span className="text-[10.5px] font-semibold text-muted-foreground">평일 09:00 - 18:00</span>
        </a>
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion("kakao_click", { location: "mobile_dock", label: "카카오톡" })}
          className="flex flex-col items-center justify-center gap-0.5 border-l border-blue-100 py-2.5"
        >
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-[11.5px] font-bold text-foreground">카카오톡</span>
        </a>
        <button
          type="button"
          onClick={() => {
            trackConversion("quote_form_view", { location: "mobile_dock", label: "문의하기" });
            goToQuote();
          }}
          className="flex flex-col items-center justify-center gap-0.5 border-l border-blue-100 py-2.5"
        >
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-[11.5px] font-bold text-foreground">문의하기</span>
        </button>
      </nav>

      {/* spacer so fixed dock doesn't cover content */}
      <div className="h-[68px]" />
    </div>
  );
}
