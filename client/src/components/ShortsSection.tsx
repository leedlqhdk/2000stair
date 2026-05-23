import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, ExternalLink } from "lucide-react";

const shorts = [
  {
    title: "빌라 계단 물청소 현장",
    url: "https://youtube.com/shorts/EL1N3Eqpc5M?si=tMsgcN2vwurIvRod",
    thumbnail: "https://i.ytimg.com/vi/EL1N3Eqpc5M/hqdefault.jpg",
  },
  {
    title: "공동현관 청소 전후",
    url: "https://youtube.com/shorts/mYX0JryfB6k?si=3EQvqTH472_HNX9_",
    thumbnail: "https://i.ytimg.com/vi/mYX0JryfB6k/hqdefault.jpg",
  },
  {
    title: "계단 오염 제거 작업",
    url: "https://youtube.com/shorts/4KDaAWaM4u8?si=3ow0pw0r6f-aFZWG",
    thumbnail: "https://i.ytimg.com/vi/4KDaAWaM4u8/hqdefault.jpg",
  },
];

function ShortsCard({ short }: { short: (typeof shorts)[0] }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={short.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div className="h-full rounded-3xl overflow-hidden bg-white border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-[9/16] overflow-hidden bg-blue-50">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100" />
          )}

          <img
            src={short.thumbnail}
            alt={short.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8 text-primary fill-primary" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {short.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            실제 작업 과정을 짧은 영상으로 확인해보세요.
          </p>

          <div className="flex items-center gap-1 text-sm text-primary font-medium">
            숏츠 보기
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function ShortsSection() {
  return (
    <section
      id="shorts"
      className="py-24 md:py-32 bg-gradient-to-b from-white to-blue-50/40"
    >
      <div className="container max-w-6xl">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <PlayCircle className="w-4 h-4" />
            실제 작업 영상
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
            영상으로 보는 이천계단지기
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            계단청소, 공동현관 관리, 오염 제거 과정을 짧은 영상으로 기록합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {shorts.map(short => (
            <ShortsCard key={short.url} short={short} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 bg-white"
            onClick={() =>
              window.open(
                "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU",
                "_blank"
              )
            }
          >
            유튜브 채널 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
