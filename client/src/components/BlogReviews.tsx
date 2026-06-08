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
    button: "리뷰 보러가기",
    url: "https://naver.me/xmB4q3oq",
    gradientClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(196,255,214,0.9),_transparent_34%),linear-gradient(180deg,_#f8fff9,_#eefaf2)]",
    ringClass: "border-emerald-100/80 hover:border-emerald-200",
  },
  {
    platform: "숨고 리뷰",
    mark: "S",
    logoClass: "rounded-md bg-[#6b4eff] text-white",
    quote: "오래된 빌라 청소도 결과물 완성도가 높았어요.",
    detail: "마장면 · 숨고",
    button: "리뷰 보러가기",
    url: "https://soomgo.com/profile/users/3729049",
    gradientClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(218,210,255,0.92),_transparent_34%),linear-gradient(180deg,_#fbfaff,_#f2efff)]",
    ringClass: "border-indigo-100/80 hover:border-indigo-200",
  },
  {
    platform: "당근 후기",
    mark: "d",
    logoClass: "rounded-md bg-[#f47a22] text-white",
    quote: "사진 보내고 바로 상담돼서 편했고 응대도 부담 없이 빨랐어요.",
    detail: "동네 주민 후기 · 당근",
    button: "후기 보러가기",
    url: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
    gradientClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(255,224,194,0.92),_transparent_34%),linear-gradient(180deg,_#fffaf4,_#fff1e5)]",
    ringClass: "border-orange-100/80 hover:border-orange-200",
  },
];

export default function BlogReviews() {
  return (
    <div id="blog-reviews" className="space-y-14 md:space-y-20">
      <motion.div
        className="mx-auto max-w-6xl rounded-[2rem] border border-white/25 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid gap-6 lg:grid-cols-[0.25fr_0.75fr] lg:items-start">
          <div className="flex h-full flex-col items-start justify-start py-1 lg:pt-1">
            <p className="mb-3 text-xs font-extrabold tracking-[0.28em] text-primary">
              REAL REVIEWS
            </p>
            <h3 className="text-xl font-extrabold leading-tight text-[#0f172a] md:text-2xl">
              고객님들의 실제 후기
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
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
                <Card
                  className={`h-full rounded-[1.4rem] border shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] ${review.gradientClass} ${review.ringClass}`}
                >
                  <CardContent className="flex h-full flex-col p-5 md:p-6">
                    <div className="mb-3 flex items-center">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center text-sm font-black leading-none shadow-[0_10px_18px_rgba(15,23,42,0.12)] ring-1 ring-white/80 ${review.logoClass}`}
                      >
                        {review.mark}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-1.5 text-yellow-400">
                      <span className="mr-1 text-xs font-bold text-[#0f172a]">
                        5.0
                      </span>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>

                    <p className="flex-1 text-sm font-bold leading-relaxed text-[#0f172a] md:text-base">
                      {review.quote}
                    </p>

                    <p className="mt-5 text-xs font-medium text-slate-500">
                      {review.detail}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
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
          <p className="mb-3 text-sm font-bold tracking-[0.35em] text-primary">
            FIELD ARCHIVE
          </p>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            실제 작업 기록
          </h2>
          <p className="text-base leading-relaxed text-white/70 md:text-lg">
            이천계단지기의 현장 기록은 네이버 블로그에 꾸준히 남기고 있습니다.
          </p>
        </div>

        <BlogPostCards />
      </motion.div>
    </div>
  );
}
