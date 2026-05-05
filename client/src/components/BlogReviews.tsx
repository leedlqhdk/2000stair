import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star } from "lucide-react";

interface BlogPost {
  title: string;
  url: string;
  date: string;
  summary: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "빌라 계단청소, 이천에서 깔끔하게 해결하는 법",
    url: "https://blog.naver.com/icheonstair/224028543970",
    date: "2025.10.03",
    summary: "빌라 계단청소 비용과 효율적 관리법, 이천계단지기의 전문 서비스를 소개합니다.",
    category: "서비스 소개",
  },
  {
    title: "계단청소 구독 견적표",
    url: "https://blog.naver.com/icheonstair/224035739944",
    date: "2025.10.09",
    summary: "층수별 맞춤 견적과 정기 구독 서비스의 합리적인 가격을 확인하세요.",
    category: "견적 안내",
  },
  {
    title: "무쏘EV 출고 후기 - 청소업체 차량으로 적합할까?",
    url: "https://blog.naver.com/icheonstair/224219555417",
    date: "2026.03.17",
    summary: "소음 없고 매연 없는 전기 픽업트럭으로 더 쾌적한 청소 서비스를 제공합니다.",
    category: "업체 소식",
  },
];

export default function BlogReviews() {
  return (
    <section id="blog-reviews" className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이천계단지기 블로그
          </h2>
          <p className="text-muted-foreground text-lg">
            청소 현장 이야기와 서비스 안내를 블로그에서 만나보세요.
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
        </div>

        {/* Blog Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {blogPosts.map((post, index) => (
            <a
              key={index}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/40 group-hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-3">
                    {post.summary}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-primary font-medium">
                    자세히 보기
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-1 text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            당근마켓, 숨고에서 높은 평점을 받고 있는 이천계단지기입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
