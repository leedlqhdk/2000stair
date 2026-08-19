import { Link } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { areaDetails } from "@/components/AreaLocalDetails";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const EASE = [0.22, 1, 0.36, 1] as const;

// 전 지역 공통 — 상담 전 확인 4줄 (지역별로 다르게 쓰지 않음)
const CHECKS = [
  "주소와 사진으로 방문 가능 여부 확인",
  "초도청소 후 작업 전후 사진 제공",
  "세금계산서 · 현금영수증 발행",
  "관리 범위와 주기 기준 계약 안내",
];

type AreaIntroProps = {
  headline: string;
  description: string;
  focus?: string;
  areaSlug?: string;
};

export default function AreaIntro({ headline, description, areaSlug }: AreaIntroProps) {
  const reduce = useReducedMotion();
  const zones = (areaSlug ? areaDetails[areaSlug]?.zones : undefined) ?? [];

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <div className="relative mb-12 md:mb-16">
      {/* ① 헤더 밴드 */}
      <motion.div
        className="rounded-[1.5rem] bg-[#1b2f57] px-5 pb-20 pt-5 md:rounded-[1.75rem] md:px-14 md:pb-28 md:pt-8"
        {...rise(0)}
      >
        <Link href="/areas">
          <a className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9db8ec]">
            <ArrowLeft className="h-4 w-4" />
            관리지역으로 돌아가기
          </a>
        </Link>

        <p className="mt-6 text-[11px] font-extrabold tracking-[0.28em] text-[#9db8ec] md:mt-7">
          AREA ARCHIVE
        </p>

        <h1 className="mt-3 font-['GmarketSans'] text-[1.6rem] font-bold leading-[1.25] text-white md:text-[2.5rem]">
          {headline}
        </h1>

        <p className="mt-4 max-w-[520px] break-keep text-[15px] leading-7 text-white/75 md:mt-5 md:text-base md:leading-8">
          {description}
        </p>
      </motion.div>

      {/* ② 요약 카드 (밴드 위에 겹침) */}
      <motion.div
        className="relative z-10 mx-3 -mt-14 rounded-[1.25rem] border border-[#e4ecfb] bg-white p-5 shadow-[0_16px_42px_rgba(15,76,169,0.08)] md:mx-10 md:-mt-20 md:rounded-3xl md:p-9"
        {...rise(0.08)}
      >
        <div className="grid gap-5 md:grid-cols-2 md:gap-9">
          {/* ②-좌 : 상담 전 확인할 내용 */}
          <div>
            <p className="text-xs font-bold text-muted-foreground">상담 전 확인할 내용</p>
            <ul className="mt-3 space-y-2 md:mt-4 md:space-y-[13px]">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13.5px] font-medium leading-[1.45] text-foreground md:gap-2.5 md:text-sm md:leading-6">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" strokeWidth={2.5} />
                  <span className="break-keep">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ②-우 : 주요 상담 구역 + CTA */}
          <div className="border-t border-[#e4ecfb] pt-5 md:border-l md:border-t-0 md:pl-9 md:pt-0">
            <p className="text-xs font-bold text-muted-foreground">주요 상담 구역</p>
            <div className="mt-3 flex flex-wrap gap-1.5 md:mt-3.5 md:gap-2">
              {zones.map((zone) => (
                <span
                  key={zone}
                  className="rounded-full border border-[#e4ecfb] bg-[#f4f8ff] px-3 py-1.5 text-xs font-bold text-primary"
                >
                  {zone}
                </span>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 md:mt-6 md:flex md:gap-2.5">
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-3 text-[13px] font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] md:px-5 md:text-sm"
              >
                카톡으로 요금 문의
              </a>
              <Link href="/quote">
                <a className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-full border border-[#e4ecfb] bg-white px-3 text-[13px] font-extrabold text-primary transition hover:-translate-y-0.5 hover:bg-[#f4f8ff] active:scale-[0.98] md:w-auto md:px-5 md:text-sm">
                  무료 방문 견적
                </a>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
