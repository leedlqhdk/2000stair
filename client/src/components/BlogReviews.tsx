import { ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const reviewCards = [
  {
    platform: "네이버 리뷰",
    mark: "N",
    accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
    quote: "꼼꼼하게 해주셔서 감사해요.",
    detail: "신둔면 · 네이버 플레이스",
    button: "리뷰 보러가기",
    url: "https://naver.me/xmB4q3oq",
  },
  {
    platform: "숨고 리뷰",
    mark: "S",
    accent: "text-teal-600 bg-teal-50 border-teal-100",
    quote: "오랜 빌라 청소도 결과물 완성도가 높았어요.",
    detail: "마장면 · 숨고",
    button: "리뷰 보러가기",
    url: "https://soomgo.com/",
  },
  {
    platform: "당근 후기",
    mark: "D",
    accent: "text-orange-600 bg-orange-50 border-orange-100",
    quote: "너무 꼼꼼하게 해주셨습니다.",
    detail: "동네 주민 후기 · 당근",
    button: "후기 보러가기",
    url: "https://www.daangn.com/",
  },
];

export default function BlogReviews() {
  return (
    <section id="blog-reviews" className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
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
          className="group block max-w-6xl mx-auto mb-16 rounded-[1.5rem] overflow-hidden border border-blue-100 bg-blue-50/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
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
          <div className="mb-7">
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-2">
              고객님들의 실제 후기
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              네이버 플레이스·숨고·당근에 남겨주신 실제 후기를 바탕으로 정리했습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {reviewCards.map((review, index) => (
              <a
                key={review.platform}
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <Card className="h-full border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                  <CardContent className="p-6 md:p-7 h-full flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base font-extrabold ${review.accent}`}
                        >
                          {review.mark}
                        </span>
                        <div>
                          <p className="font-extrabold text-lg text-foreground">
                            {review.platform}
                          </p>
                          <div className="flex items-center gap-1 text-yellow-400 mt-1">
                            <span className="text-sm font-bold text-muted-foreground mr-1">
                              5.0
                            </span>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="text-lg md:text-xl font-bold leading-relaxed text-foreground flex-1">
                      “{review.quote}”
                    </p>

                    <p className="mt-6 text-sm text-muted-foreground">
                      {review.detail}
                    </p>

                    <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm font-bold text-primary flex items-center justify-between transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                      {review.button}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
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
