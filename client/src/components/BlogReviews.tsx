import { ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const reviewQuotes = [
  "공동현관 냄새가 덜 난다고 세입자분들이 좋아하시네요.",
  "작업 후 사진을 보내주셔서 건물 상태 확인이 편했습니다.",
  "담당자가 바뀌지 않으니 매번 설명하지 않아도 돼서 좋습니다.",
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
          className="group block max-w-6xl mx-auto mb-12 rounded-[1.5rem] overflow-hidden border border-blue-100 bg-blue-50/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
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
          className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {reviewQuotes.map((quote, index) => (
            <Card key={index} className="border-primary/10 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-foreground">
                  “{quote}”
                </p>
              </CardContent>
            </Card>
          ))}
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
