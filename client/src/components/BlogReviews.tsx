import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import BlogPostCards from "@/components/BlogPostCards";

const reviewCards = [
  {
    platform: "네이버 리뷰",
    mark: "N",
    logoClass: "rounded-md bg-[#35b957] text-white",
    quote: "정기관리 맡기고 나서 계단이 훨씬 안정적으로 깔끔해졌어요.",
    detail: "신둔면 · 네이버 플레이스",
    url: "https://naver.me/xmB4q3oq",
  },
  {
    platform: "숨고 리뷰",
    mark: "S",
    logoClass: "rounded-md bg-[#6b4eff] text-white",
    quote: "오래된 빌라 청소도 결과물 완성도가 높았어요.",
    detail: "마장면 · 숨고",
    url: "https://soomgo.com/profile/users/3729049",
  },
  {
    platform: "당근 후기",
    mark: "d",
    logoClass: "rounded-md bg-[#f47a22] text-white",
    quote: "사진 보내고 바로 상담돼서 편했고 응대도 부담 없이 빨랐어요.",
    detail: "동네 주민 후기 · 당근",
    url: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
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
    ? "border-white/18 bg-white/[0.13] shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl hover:bg-white/[0.18] hover:shadow-[0_26px_70px_rgba(15,23,42,0.24)]"
    : "border-blue-100 bg-white shadow-[0_18px_45px_rgba(15,76,169,0.08)] hover:shadow-[0_24px_60px_rgba(15,76,169,0.13)]";
  const platformClass = isDark ? "text-white/55" : "text-muted-foreground";
  const scoreClass = isDark ? "text-white/90" : "text-foreground/70";
  const quoteClass = isDark ? "text-white" : "text-foreground";
  const detailClass = isDark ? "text-white/55" : "text-muted-foreground";

  return (
    <div id="blog-reviews" className="space-y-14 md:space-y-20">
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-extrabold tracking-[0.28em] text-primary">
            REAL REVIEWS
          </p>
          <h3 className={`text-2xl font-extrabold leading-tight md:text-3xl ${titleClass}`}>
            고객님들의 실제 후기
          </h3>
          <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed md:text-base ${descriptionClass}`}>
            실제 고객님들이 남겨주신 후기를 한곳에 모았습니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reviewCards.map((review) => (
            <a
              key={review.platform}
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full"
              aria-label={review.platform}
            >
              <Card className={`h-full rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-1 ${cardClass}`}>
                <CardContent className="flex h-full flex-col p-3 md:p-6">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center text-sm font-black leading-none shadow-[0_10px_18px_rgba(15,23,42,0.18)] ring-1 ring-white/60 ${review.logoClass}`}
                    >
                      {review.mark}
                    </span>
                    <span className={`text-xs font-bold ${platformClass}`}>
                      {review.platform}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center gap-1.5 text-yellow-400">
                    <span className={`mr-1 text-xs font-bold ${scoreClass}`}>5.0</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>

                  <p className={`flex-1 text-sm font-bold leading-snug md:text-base ${quoteClass}`}>
                    {review.quote}
                  </p>

                  <p className={`mt-2 text-xs font-medium ${detailClass}`}>
                    {review.detail}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </motion.div>

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
