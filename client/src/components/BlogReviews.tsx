import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";

// DB에 후기가 없을 때 사용하는 기본 후기 (관리자 페이지 /admin/reviews 에서 관리)
const fallbackReviews = [
  {
    platform: "네이버 리뷰",
    dotColor: "#35b957",
    score: "4.9",
    quote: "정기관리 맡기고 나서 계단이 훨씬 안정적으로 깔끔해졌어요.",
    detail: "신둔면",
    url: "https://naver.me/xmB4q3oq",
  },
  {
    platform: "숨고 리뷰",
    dotColor: "#6b4eff",
    score: "5.0",
    quote: "오래된 빌라 청소도 결과물 완성도가 높았어요.",
    detail: "마장면",
    url: "https://soomgo.com/profile/users/3729049",
  },
  {
    platform: "당근 후기",
    dotColor: "#f47a22",
    score: "5.0",
    quote: "사진 보내고 바로 상담돼서 편했고 빠르게 답변드려요 :)",
    detail: "동네 주민 후기",
    url: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
  },
];

type BlogReviewsProps = {
  variant?: "light" | "dark";
};

export default function BlogReviews({ variant = "light" }: BlogReviewsProps) {
  const isDark = variant === "dark";

  const { data: dbReviews } = trpc.reviews.list.useQuery(undefined, {
    staleTime: 5 * 60_000,
    retry: 1,
  });
  const reviewCards = dbReviews && dbReviews.length > 0 ? dbReviews : fallbackReviews;

  const titleClass = isDark ? "text-white" : "text-foreground";
  const descriptionClass = isDark ? "text-white/68" : "text-muted-foreground";
  const cardClass = isDark
    ? "border-white/15 bg-white/[0.08] backdrop-blur-xl"
    : "border-gray-100 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]";
  const quoteClass = isDark ? "text-white/85" : "text-slate-800";
  const platformTextClass = isDark ? "text-white/80" : "text-gray-700";
  const detailClass = isDark ? "text-white/45" : "text-muted-foreground";
  const footerClass = isDark ? "text-white/38" : "text-gray-400";

  return (
    <div id="blog-reviews" className="space-y-14 md:space-y-20">
      <motion.div
        className="mx-auto max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-extrabold tracking-[0.28em] text-primary">
            REAL REVIEW
          </p>
          <h3 className={`text-2xl font-extrabold leading-tight md:text-3xl ${titleClass}`}>
            고객이 <span className="text-primary">먼저 추천하는</span> 이유
          </h3>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-primary text-primary" />
            ))}
            <span className={`ml-2 text-2xl font-extrabold ${titleClass}`}>5.0</span>
          </div>
          <p className={`mt-1.5 text-sm ${descriptionClass}`}>
            네이버 · 숨고 · 당근 실제 고객 후기
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {reviewCards.map((review, i) => (
            <div
              key={`${review.platform}-${i}`}
              className="flex w-[80%] shrink-0 snap-center flex-col md:w-auto md:shrink"
            >
              <div className={`flex flex-1 flex-col rounded-[1.5rem] border p-6 transition-all duration-200 md:p-7 ${cardClass}`}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: review.dotColor }}
                    />
                    <span className={`text-[15px] font-extrabold ${platformTextClass}`}>
                      {review.platform}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[15px] font-extrabold text-primary">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {review.score}
                  </span>
                </div>

                <p className={`mb-5 flex-1 text-[16.5px] font-bold leading-relaxed ${quoteClass}`}>
                  “{review.quote}”
                </p>

                <div className="mb-6 flex items-center gap-2.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className={`text-[13px] font-semibold ${detailClass}`}>{review.detail}</span>
                </div>

                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex w-full items-center justify-center gap-1.5 rounded-full border py-3.5 text-[15px] font-bold transition-all duration-200 ${
                    isDark
                      ? "border-white/25 text-white hover:bg-white/10"
                      : "border-slate-200 text-primary hover:bg-blue-50"
                  }`}
                >
                  전체보기
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className={`mt-4 flex items-center justify-center gap-1.5 text-xs ${footerClass}`}>
          <ShieldCheck className="h-3.5 w-3.5" />
          실제 플랫폼에 등록된 고객 후기만 보여드립니다.
        </p>
      </motion.div>
    </div>
  );
}
