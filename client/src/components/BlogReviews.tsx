import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
    <section id="blog-reviews" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-4">
            FIELD ARCHIVE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            실제 작업 기록
          </h2>

          <p className="text-muted-foreground text-lg">
            이천계단지기의 현장 기록은 네이버 블로그에 꾸준히 남기고 있습니다.
          </p>
        </motion.div>

        <motion.a
          href="https://blog.naver.com/icheonstair"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="이천계단지기 네이버 블로그에서 실제 작업 기록 보기"
          className="group block max-w-6xl mx-auto mb-14 rounded-xl transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src="/images/blog-banner-main.png"
              alt="이천계단지기 실제 작업 기록 보러가기"
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/8" />
          </div>
        </motion.a>

        <motion.div
          className="mx-auto max-w-6xl rounded-2xl border border-blue-50 bg-white/70 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-5 lg:grid-cols-[0.22fr_0.78fr] lg:items-start">
            <div className="flex h-full flex-col items-start justify-start py-1 lg:pt-1">
              <h3 className="text-xl font-extrabold leading-tight text-foreground md:text-2xl">
                고객님들의 실제 후기
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                실제 고객님들이 남겨주신 후기를 만나보세요.
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
                          className={`flex h-8 w-8 shrink-0 items-center justify-center text-xs font-black leading-none shadow-sm ${review.logoClass}`}
                        >
                          {review.mark}
                        </span>
                      </div>

                      <div className="mb-3 flex items-center gap-1.5 text-yellow-400">
                        <span className="mr-1 text-xs font-bold text-foreground">
                          5.0
                        </span>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>

                      <p className="flex-1 text-sm font-bold leading-relaxed text-foreground md:text-base">
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
      </div>
    </section>
  );
}
