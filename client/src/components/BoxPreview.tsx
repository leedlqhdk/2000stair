import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const boxItems = [
  {
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663628169660/BuDLHDfm5bfYXthRJ4c8ks/carousel-1-5XrF88oJpffK6enUVHSP9x.webp",
    title: "친환경 세정제 세트",
    description:
      "식물 유래 성분으로 만든 다목적 세정제. 강력한 세정력과 은은한 향기를 동시에.",
  },
  {
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663628169660/BuDLHDfm5bfYXthRJ4c8ks/carousel-2-2JpEEArmeyb42SSZECn5WJ.webp",
    title: "프리미엄 극세사 타올",
    description:
      "초극세사 원단으로 먼지와 물기를 완벽하게 흡수. 세탁 후에도 부드러움 유지.",
  },
  {
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663628169660/BuDLHDfm5bfYXthRJ4c8ks/carousel-3-STo2j3CHkqEj9EiLsBEBi7.webp",
    title: "청소 도구 세트",
    description:
      "천연 소재 브러시, 항균 스펀지, 내구성 고무장갑까지. 청소에 필요한 모든 도구.",
  },
  {
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663628169660/BuDLHDfm5bfYXthRJ4c8ks/carousel-4-mgR7WEfM7HKXA6gHeL94y3.webp",
    title: "프리미엄 방향제",
    description:
      "천연 에센셜 오일 기반 디퓨저와 룸스프레이. 청소 후 상쾌한 공간을 완성하세요.",
  },
];

export default function BoxPreview() {
  return (
    <section id="box-preview" className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이번 달 박스 미리보기
          </h2>
          <p className="text-muted-foreground text-lg">
            매달 엄선된 프리미엄 청소 용품을 만나보세요
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {boxItems.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
}
