import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sparkles, MessageCircle, Building2 } from "lucide-react";
import { useParams } from "wouter";

const locationData: Record<string, {
  name: string;
  title: string;
  description: string;
}> = {
  "icheon-stair-cleaning": {
    name: "이천",
    title: "이천 계단청소 · 빌라청소 정기관리",
    description: "이천 전 지역 빌라, 원룸, 상가 공용공간을 부부가 직접 관리합니다.",
  },
  "sindun-stair-cleaning": {
    name: "신둔면",
    title: "신둔면 계단청소 · 빌라 공용공간 관리",
    description: "신둔면 빌라와 원룸 계단, 공동현관, 유리청소를 정기적으로 관리합니다.",
  },
  "majang-stair-cleaning": {
    name: "마장면",
    title: "마장면 계단청소 · 상가 건물 관리",
    description: "마장면 빌라, 상가, 소형 건물 공용공간 청소를 꼼꼼하게 관리합니다.",
  },
  "bubal-stair-cleaning": {
    name: "부발읍",
    title: "부발읍 계단청소 · 원룸 빌라 정기관리",
    description: "부발읍 원룸, 빌라, 상가 공용계단과 현관을 정기적으로 관리합니다.",
  },
  hobeop: {
    name: "호법면",
    title: "호법면 계단청소 · 상가·빌라 공용공간 관리",
    description: "호법면 빌라, 상가, 소형 건물 공용계단과 공동현관, 유리를 정기적으로 관리합니다.",
  },
};

export default function LocationLanding() {
  const params = useParams();
  const slug = params.slug ?? "icheon-stair-cleaning";
  const data = locationData[slug] ?? locationData["icheon-stair-cleaning"];

  const openKakao = () => {
    window.open("https://pf.kakao.com/_IiNfn", "_blank");
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="py-24 md:py-32 bg-gradient-to-b from-blue-50/60 to-white">
        <div className="container max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            <MapPin className="w-4 h-4" />
            {data.name} 지역 밀착 관리
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground mb-6">
            {data.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
            {data.description} 하청 없이 부부가 직접 방문해 계단, 복도, 공동현관, 유리 등 공용공간을 관리합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={openKakao} className="text-base px-8">
              <MessageCircle className="w-4 h-4 mr-2" />
              카톡으로 상담하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = "/#pricing"}
              className="text-base px-8"
            >
              요금 안내 보기
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {data.name} 건물주님들이 많이 문의하는 관리 범위
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <Building2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">빌라·원룸 계단</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  층수와 오염 상태에 맞춰 계단, 복도, 난간을 정기적으로 관리합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">공동현관·유리</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  손자국, 물때, 먼지로 지저분해 보이는 공동현관 첫인상을 관리합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <MessageCircle className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">카톡 빠른 상담</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  건물 사진을 보내주시면 대략적인 관리 범위와 상담이 가능합니다.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={openKakao}>
              {data.name} 계단청소 문의하기
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
