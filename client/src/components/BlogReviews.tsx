import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star } from "lucide-react";

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
    thumbnail: "https://postfiles.pstatic.net/MjAyNTEwMDFfMTM4/MDAxNzU5MzAwMjEyODA4.y3lIm_GLjoXcgoyLTp7JYQg0DyA67EaNBGMk2gzhwy0g.qJwO9CruC127nTuLnlnlvVi81Kr6_0ZsX6MfFkJAYkog.PNG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._(4).png?type=w96",
  },
  {
    title: "계단청소 비용 산정 기준",
    url: "https://blog.naver.com/icheonstair/224025741702",
    date: "2025.10.09",
    summary: "층수별 맞춤 견적과 정기 구독 서비스의 합리적인 가격을 확인하세요.",
    category: "견적 안내",
    thumbnail: "https://postfiles.pstatic.net/MjAyNTA5MjlfMzAg/MDAxNzU5MTIxOTQ5ODgz._qph3Q0zlJfGp_WfW5jTXRxh6-77UTNxiNo2RKuNw1Yg.TDzvuxM68eZZzD2MPVrwnYs1W5mU_U3wRw-ambjS8iog.PNG/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94._(3).png?type=w966",
  },
  {
    title: "걸레 한 장으로 지키는 교차오염 방지 원칙",
    url: "https://blog.naver.com/icheonstair/224235666728",
    date: "2026.03.17",
    summary: "빌라 한 동 한 걸레 원칙으로 교차오염 없는 위생 청소를 실천합니다.",
    category: "작업 일지",
    thumbnail: "https://postfiles.pstatic.net/MjAyNjAzMzFfMTk3/MDAxNzc0OTMyOTUyMTM3.pfZQ7KlHEDu4ZFBG2Gciffi16bGUldzdByEwheFIX2og.XDhBnMAy1h6YAXsxcgC5ZunMZv9VqXXOwh7i_yRmLF4g.PNG/%EA%B3%84%EB%8B%A8%EC%B2%AD%EC%86%8C_%EC%8D%B8%EB%84%A4%EC%9D%BC_(4).png?type=w966",
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
                    <span className="text-xs text-muted-foreground">{post.date}</span>
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
