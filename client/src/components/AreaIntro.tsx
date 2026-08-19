import { Link } from "wouter";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";

const proofItems = [
  { label: "지역별 상담", text: "주소·사진 기준\n방문 가능 여부 확인" },
  { label: "기록 방식", text: "초도청소 후\n청소 전후 사진 제공" },
  { label: "사업자 증빙", text: "세금계산서\n현금영수증 발행" },
  { label: "계약 기준", text: "관리 범위·주기\n정리 후 계약" },
];

type AreaIntroProps = {
  headline: string;
  description: string;
  focus: string;
};

export default function AreaIntro({ headline, description, focus }: AreaIntroProps) {
  return (
    <motion.div
      className="mb-10 md:mb-14"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href="/areas">
        <a className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
          <ArrowLeft className="h-4 w-4" />
          관리지역으로 돌아가기
        </a>
      </Link>

      <p className="mb-4 text-xs font-extrabold tracking-[0.32em] text-primary md:text-sm">
        AREA ARCHIVE
      </p>

      <h1 className="text-[2rem] font-extrabold leading-[1.15] tracking-tight text-foreground md:text-[3.25rem] md:leading-[1.12]">
        {headline}
      </h1>

      <p className="mt-5 max-w-3xl break-keep text-base leading-8 text-muted-foreground md:mt-6 md:text-lg md:leading-9">
        {description} {focus}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-8">
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          카톡으로 요금 문의
        </a>
        <Link href="/services/stair">
          <a className="inline-flex items-center gap-1.5 text-sm font-extrabold text-primary transition hover:opacity-80">
            계단청소 범위
            <ArrowRight className="h-4 w-4" />
          </a>
        </Link>
      </div>

      <section className="mt-9 grid grid-cols-2 gap-y-6 border-t border-blue-100 pt-7 md:mt-12 md:grid-cols-4 md:gap-0 md:pt-8">
        {proofItems.map((item, i) => (
          <div
            key={item.label}
            className={`px-1 md:px-6 ${i % 2 === 1 ? "border-l border-blue-100 md:border-l" : "md:border-l md:border-blue-100"} ${i === 0 ? "md:border-l-0 md:pl-0" : ""}`}
          >
            <p className="text-xs font-bold text-muted-foreground/80 md:text-[13px]">{item.label}</p>
            <p className="mt-2 whitespace-pre-line text-[15px] font-bold leading-[1.5] text-foreground md:mt-2.5 md:text-base">
              {item.text}
            </p>
          </div>
        ))}
      </section>
    </motion.div>
  );
}
