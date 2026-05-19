import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  title: string;
  url: string;
  date: string;
  summary: string;
  category: string;
  thumbnail: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "이천계단청소, 이천에서 깔끔하게 해결하는 법",
    url: "https://blog.naver.com/icheonstair/224028543970",
    date: "2025.10.03",
    summary: "이천계단청소 비용과 효율적 관리법, 이천계단지기의 전문 서비스를 소개합니다.",
    category: "서비스 소개",
    thumbnail: "/manus-storage/blog-thumbnail-2_eae12a62.png",
  },
  {
    title: "계단청소 비용 산정 기준",
    url: "https://blog.naver.com/icheonstair/224025741702",
    date: "2025.10.09",
    summary: "층수별 맞춤 견적과 정기 관리 기준을 확인하세요.",
    category: "견적 안내",
    thumbnail: "/manus-storage/blog-thumbnail-3_7e8ea4dc.png",
  },
  {
    title: "걸레 한 장으로 지키는 교차오염 방지 원칙",
    url: "https://blog.naver.com/icheonstair/224235666728",
    date: "2026.03.17",
    summary: "빌라 한 동 한 걸레 원칙으로 공용공간 위생을 관리합니다.",
    category: "작업 일지",
    thumbnail: "/manus-storage/blog-thumbnail-1_478b13c6.png",
  },
];

const reviewQuotes = [
  "공동현관 냄새가 덜 난다고 세입자분들이 좋아하시네요.",
  "작업 후 사진을 보내주셔서 건물 상태 확인이 편했습니다.",
  "담당자가 바뀌지 않으니 매번 설명하지 않아도 돼서 좋습니다.",
];

export default function BlogReviews() {
  return (
    <section id="blog-reviews" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            현장 기록과 관리 후기
          </h2>

          <p className="text-muted-foreground text-lg">
            이천계단지기의 작업 기록과 실제 관리 포인트를 블로그에서 확인해보세요.
          </p>

          <a
            href="https://blog.naver.com/icheonstair"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline"
          >
            블로그 전체 보기
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* 후기 카드 */}
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

        {/* 블로그 카드 */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {blogPosts.map((post, index) => (
            <a
              key={index}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/40 group-hover:-translate-y-1 overflow-hidden">
                {/* Thumbnail */}
                <div className="w-full h-44 overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
                    {post.summary}
                  </p>

                  <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                    자세히 보기
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </motion.div>

        {/* 하단 신뢰 문구 */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm text-muted-foreground">
            블로그, 당근, 숨고 등에서 작업 기록과 고객 반응을 꾸준히 쌓고 있습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
