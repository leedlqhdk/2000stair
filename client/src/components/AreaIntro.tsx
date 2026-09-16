import { Link } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { areaDetails } from "@/components/AreaLocalDetails";
import { getAreaSeoContent } from "@/data/areaSeoContent";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const EASE = [0.22, 1, 0.36, 1] as const;

const COMMON_CHECKS = [
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

export default function AreaIntro({ headline, description, focus, areaSlug }: AreaIntroProps) {
  const reduce = useReducedMotion();
  const zones = (areaSlug ? areaDetails[areaSlug]?.zones : undefined) ?? [];
  const seoContent = getAreaSeoContent(areaSlug);
  const checks = seoContent
    ? [seoContent.points[0], ...COMMON_CHECKS.slice(1)]
    : COMMON_CHECKS;

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
      <div className="mx-[calc(50%-50vw)] -mt-16 bg-[#1b2f57] md:-mt-24">
        <motion.div
          className="mx-auto max-w-6xl px-5 pb-20 pt-24 md:px-8 md:pb-28 md:pt-36 lg:px-10"
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

          <p className="mt-4 max-w-[560px] break-keep text-[15px] leading-7 text-white/75 md:mt-5 md:text-base md:leading-8">
            {description}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mx-3 -mt-14 rounded-[1.25rem] border border-[#e4ecfb] bg-white p-5 shadow-[0_16px_42px_rgba(15,76,169,0.08)] md:mx-10 md:-mt-20 md:rounded-3xl md:p-9"
        {...rise(0.08)}
      >
        <div className="grid gap-5 md:grid-cols-2 md:gap-9">
          <div>
            <p className="text-xs font-bold text-muted-foreground">이 지역에서 먼저 확인하는 부분</p>
            <p className="mt-3 break-keep text-sm font-medium leading-6 text-foreground">
              {seoContent?.summary ?? focus ?? "건물 주소와 사진을 기준으로 공용공간의 관리 범위를 확인합니다."}
            </p>
            <ul className="mt-4 space-y-2 md:space-y-[13px]">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13.5px] font-medium leading-[1.45] text-foreground md:gap-2.5 md:text-sm md:leading-6">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" strokeWidth={2.5} />
                  <span className="break-keep">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-[#e4ecfb] md:pl-9">
            <p className="text-xs font-bold text-muted-foreground">주요 상담 구역</p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {zones.map((zone) => (
                <span
                  key={zone}
                  className="rounded-full border border-[#e4ecfb] bg-[#f4f8ff] px-3 py-1.5 text-xs font-bold text-primary"
                >
                  {zone}
                </span>
              ))}
            </div>

            {seoContent && (
              <div className="mt-5 rounded-2xl bg-[#f4f8ff] p-4">
                <p className="text-xs font-bold text-primary">현장별 관리 포인트</p>
                <ul className="mt-2 space-y-1.5">
                  {seoContent.points.slice(1).map((point) => (
                    <li key={point} className="break-keep text-sm leading-6 text-foreground">
                      · {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex gap-2.5">
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98]"
              >
                카톡으로 요금 문의
              </a>
              <a
                href="tel:01084381887"
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-[#e4ecfb] bg-white px-5 text-sm font-extrabold text-primary transition hover:-translate-y-0.5 hover:bg-[#f4f8ff] active:scale-[0.98]"
              >
                전화문의
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {seoContent?.questions && (
        <section className="mx-3 mt-6 rounded-[1.25rem] border border-[#e4ecfb] bg-white p-5 shadow-sm md:mx-10 md:mt-8 md:rounded-3xl md:p-8" aria-labelledby="area-faq-title">
          <p className="text-xs font-bold tracking-wide text-primary">빠른 답변</p>
          <h2 id="area-faq-title" className="mt-2 text-xl font-extrabold text-foreground md:text-2xl">
            {areaSlug ? `${areaDetails[areaSlug]?.name ?? ""} 계단청소 자주 묻는 질문` : "계단청소 자주 묻는 질문"}
          </h2>
          <dl className="mt-5 space-y-4">
            {seoContent.questions.map(({ question, answer }) => (
              <div key={question} className="border-b border-[#e4ecfb] pb-4 last:border-0 last:pb-0">
                <dt className="break-keep text-sm font-extrabold leading-6 text-foreground">Q. {question}</dt>
                <dd className="mt-1 break-keep text-sm leading-6 text-muted-foreground">A. {answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
