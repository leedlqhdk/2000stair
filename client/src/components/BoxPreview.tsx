import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Sparkles, Camera, ShieldCheck, MessageCircle } from "lucide-react";

const serviceHighlights = [
  {
    icon: Building2,
    image: "/manus-storage/stair-clean3_7d8b7d17.jpg",
    title: "빌라·상가 공용공간 전문",
    description:
      "이천 지역 빌라, 원룸, 상가의 계단·복도·공동현관을 중심으로 관리합니다. 건물 규모와 오염 상태에 맞춰 청소 범위를 조정합니다.",
  },
  {
    icon: Sparkles,
    image: "/manus-storage/eco-truck_c63bcfce.jpg",
    title: "냄새 부담 적은 관리",
    description:
      "입주민이 오가는 공용공간인 만큼 강한 냄새보다 깔끔한 마무리를 중요하게 봅니다. 현장에 맞는 세정 방식으로 관리합니다.",
  },
  {
    icon: ShieldCheck,
    image: "/manus-storage/glass-clean_454b0f7d.jpg",
    title: "하청 없는 부부직영",
    description:
      "외부 인력에게 맡기지 않고 부부가 직접 방문합니다. 담당자가 바뀌지 않아 건물 상태를 꾸준히 기억하고 관리할 수 있습니다.",
  },
  {
    icon: MessageCircle,
    image: "/manus-storage/kakao-feedback_fe490a3d.png",
    title: "카카오톡 빠른 소통",
    description:
      "청소 요청사항이나 피드백은 카카오톡으로 빠르게 확인합니다. 필요한 경우 작업 후 사진으로 상태를 공유해드립니다.",
  },
];

export default function BoxPreview() {
  return (
    <section id="box-preview" className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            이천계단지기가 다르게 관리하는 이유
          </h2>
          <p className="text-muted-foreground text-lg">
            건물주님,입주민분들이 신경 덜 쓰도록, 현장 기준으로 꾸준히 관리합니다
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
