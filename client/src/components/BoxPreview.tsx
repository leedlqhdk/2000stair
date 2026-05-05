import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Sparkles, Camera, ShieldCheck } from "lucide-react";

const serviceHighlights = [
  {
    icon: Building2,
    image: "/manus-storage/stair-clean3_7d8b7d17.jpg",
    title: "빌라 · 상가 계단 청소",
    description:
      "4~6층 빌라, 상가 건물의 계단과 복도를 전문적으로 관리합니다. 층수와 면적에 맞춘 맞춤 서비스를 제공합니다.",
  },
  {
    icon: Sparkles,
    image: "/manus-storage/eco-truck_c63bcfce.jpg",
    title: "친환경 세정제 사용",
    description:
      "입주민의 건강을 생각하여 친환경 세정제만 사용합니다. 냄새 없이 깨끗하게, 환경까지 생각하는 청소입니다.",
  },

  {
    icon: ShieldCheck,
    image: "/manus-storage/glass-clean_454b0f7d.jpg",
    title: "하청 없는 직접 관리",
    description:
      "외부 하청 없이 이천계단지기 부부가 직접 관리합니다. 일관된 품질과 책임감 있는 서비스를 보장합니다.",
  },
];

export default function BoxPreview() {
  return (
    <section id="box-preview" className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            서비스 특징
          </h2>
          <p className="text-muted-foreground text-lg">
            이천계단지기만의 차별화된 청소 서비스를 확인하세요
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
            {serviceHighlights.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
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
