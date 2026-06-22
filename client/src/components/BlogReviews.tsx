import { Star, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import BlogPostCards from "@/components/BlogPostCards";

const reviewCards = [
  {
    platform: "네이버 리뷰",
    mark: "N",
    bgColor: "bg-[#35b957]",
    score: "4.9",
    scoreColor: "text-[#35b957]",
    scoreBg: "bg-[#35b957]/10",
    quote: "정기관리 맡기고 나서 계단이 훨씬 안정적으로 깔끔해졌어요.",
    buttonColor: "border-[#35b957] text-[#35b957] hover:bg-[#35b957]/5",
    url: "https://naver.me/xmB4q3oq",
    buttonLabel: "네이버 리뷰 전체보기",
  },
  {
    platform: "숨고 리뷰",
    mark: "S",
    bgColor: "bg-[#6b4eff]",
    score: "5.0",
    scoreColor: "text-[#6b4eff]",
    scoreBg: "bg-[#6b4eff]/10",
    quote: "오래된 빌라 청소도 결과물 완성도가 높았어요.",
    buttonColor: "border-[#6b4eff] text-[#6b4eff] hover:bg-[#6b4eff]/5",
    url: "https://soomgo.com/profile/users/3729049",
    buttonLabel: "숨고 후기 전체보기",
  },
  {
    platform: "당근 후기",
    mark: "d",
    bgColor: "bg-[#f47a22]",
    score: "5.0",
    scoreColor: "text-[#f47a22]",
    scoreBg: "bg-[#f47a22]/10",
    quote: "사진 보내고 바로 상담돼서 편했고 응대도 부담 없이 빨랐어요.",
    buttonColor: "border-[#f47a22] text-[#f47a22] hover:bg-[#f47a22]/5",
    url: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
    buttonLabel: "당근 후기 전체보기",
  },
];

type BlogReviewsProps = {
  variant?: "light" | "dark";
};

export default function BlogReviews({ variant = "light" }: BlogReviewsProps) {
  const isDark = variant === "dark";

  const titleClass = isDark ? "text-white" : "text-foreground";
  const descriptionClass = isDark ? "text-white/68" : "text-muted-foreground";
  const cardClass = isDark
    ? "border-white/15 bg-white/[0.08] backdrop-blur-xl"
    : "border-gray-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]";
  const quoteClass = isDark ? "text-white/85" : "text-gray-700";
  const platformTextClass = isDark ? "text-white/80" : "text-gray-700";
  const footerClass = isDark ? "text-white/38" : "text-gray-400";

  return (
    <div id="blog-reviews" className="space-y-14 md:space-y-20">
      <motion.div
        className="mx-auto max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-extrabold tracking-[0.28em] text-primary">
            REAL REVIEW
          </p>
          <h3 className={`text-2xl font-extrabold leading-tight md:text-3xl ${titleClass}`}>
            고객이 먼저 추천하는{" "}
            <span className="text-primary">이천계단지기</span>
          </h3>
          <div className="mt-4 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
            <span className={`ml-2 text-2xl font-extrabold ${titleClass}`}>5.0</span>
          </div>
          <p className={`mt-1.5 text-sm ${descriptionClass}`}>
            네이버 · 숨고 · 당근 실제 고객 후기
          </p>
        </div>

        {/* Review Cards */}
        <div className="space-y-3">
          {reviewCards.map((review, i) => (
            <motion.div
              key={review.platform}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`rounded-2xl border p-5 transition-all duration-200 ${cardClass}`}>
                {/* Platform row */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-sm ${review.bgColor}`}
                    >
                      {review.mark}
                    </span>
                    <span className={`text-sm font-bold ${platformTextClass}`}>
                      {review.platform}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-sm font-extrabold ${review.scoreColor} ${review.scoreBg}`}
                  >
                    {review.score}
                  </span>
                </div>

                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className={`mb-4 text-sm font-semibold leading-relaxed ${quoteClass}`}>
                  "{review.quote}"
                </p>

                {/* Button */}
                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full items-center justify-center gap-1 rounded-xl border py-2.5 text-sm font-bold transition-all duration-200 ${review.buttonColor}`}
                >
                  {review.buttonLabel}
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust footer */}
        <p className={`mt-4 flex items-center justify-center gap-1.5 text-xs ${footerClass}`}>
          <ShieldCheck className="h-3.5 w-3.5" />
          실제 플랫폼에 등록된 고객 후기만 보여드립니다.
        </p>
      </motion.div>

      {/* Field Archive */}
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-primary">
            FIELD ARCHIVE
          </p>
          <h2 className={`mb-4 text-3xl font-bold md:text-4xl ${titleClass}`}>
            실제 작업 기록
          </h2>
          <p className={`text-base leading-relaxed md:text-lg ${descriptionClass}`}>
            이천계단지기의 현장 기록은 네이버 블로그에 꾸준히 남기고 있습니다.
          </p>
        </div>

        <BlogPostCards />
      </motion.div>
    </div>
  );
}
