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

export default function ShortsSection() {
  return (
    <section id="shorts" className="py-24 md:py-32 bg-black text-white">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-5">
            <PlayCircle className="w-4 h-4" />
            실제 작업 영상
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold mb-5">
            이천계단지기 숏츠
          </h2>

          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            실제 이천 지역 계단청소 현장을 영상으로 기록하고 있습니다.
            작업 과정과 청소 전/후 차이를 직접 확인해보세요.
          </p>
        </div>

        {/* Shorts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {shorts.map((short, index) => (
            <a
              key={index}
              href={short.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 hover:-translate-y-2 transition-all duration-300">
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
                      <PlayCircle className="w-8 h-8 text-black fill-black" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {short.title}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed mb-4">
                    실제 작업 영상을 통해 청소 전/후 차이를 확인해보세요.
                  </p>

                  <div className="flex items-center gap-1 text-sm text-primary font-medium">
                    유튜브에서 보기
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="text-base px-8"
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
