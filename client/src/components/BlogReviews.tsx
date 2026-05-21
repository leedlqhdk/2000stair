import { ChevronRight, ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const reviewCards = [
  {
    platform: "네이버 리뷰",
    mark: "N",
    logoClass: "rounded-lg bg-[#35b957] text-white",
    quote: "꼼꼼하게 해주셔서 감사해요.",
    detail: "신둔면 · 네이버 플레이스",
    button: "리뷰 보러가기",
    url: "https://naver.me/xmB4q3oq",
  },
  {
    platform: "숨고 리뷰",
    mark: "S",
    logoClass: "rounded-xl bg-[#6b4eff] text-white",
    quote: "오랜 빌라 청소도 결과물 완성도가 높았어요.",
    detail: "마장면 · 숨고",
    button: "리뷰 보러가기",
    url: "https://soomgo.com/",
  },
  {
    platform: "당근 후기",
    mark: "d",
    logoClass: "rounded-full bg-[#f47a22] text-white",
    quote: "너무 꼼꼼하게 해주셨습니다.",
    detail: "동네 주민 후기 · 당근",
    button: "후기 보러가기",
    url: "https://www.daangn.com/",
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
          className="group block max-w-6xl mx-auto mb-14 rounded-[1.5rem] overflow-hidden border border-blue-100 bg-blue-50/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden">
            <img
              src="/images/blog-banner-main.png"
              alt="이천계단지기 실제 작업 기록 보러가기"
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.015]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
          </div>
        </motion.a>

        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-foreground flex items-center gap-2">
              고객님들의 실제 후기
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              네이버 플레이스·숨고·당근에 남겨주신 실제 후기를 바탕으로 정리했습니다.
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
              >
                <Card className="h-full rounded-2xl border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <CardContent className="p-5 md:p-6 h-full flex flex-col">
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center text-sm font-black leading-none shadow-sm ${review.logoClass}`}
                      >
                        {review.mark}
                      </span>
                      <p className="text-base md:text-lg font-extrabold text-foreground">
                        {review.platform}
                      </p>
                    </div>

                    <div className="mb-5 flex items-center gap-1.5 text-yellow-400">
                      <span className="mr-1 text-sm font-bold text-foreground">
                        5.0
                      </span>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-base md:text-lg font-bold leading-relaxed text-foreground flex-1">
                      “{review.quote}”
                    </p>

                    <p className="mt-5 text-sm text-muted-foreground">
                      {review.detail}
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm font-bold text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                      {review.button}
                      <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <a
            href="https://blog.naver.com/icheonstair"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
          >
            네이버 블로그에서 더 보기
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
