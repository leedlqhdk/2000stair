import { Building2, ClipboardCheck, Home, Store } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

export default function StairCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "stair-cleaning",
        heroStyle: "fullscreenVideo",
        heroBgImage: "/images/services/stair-cleaning/icheon-stair-cleaning-service-main.webp",
        heroVideo: "/images/services/stair-cleaning/2000stair-youtube.mp4",
        heroTitle: "매일 오르는 계단,\n누가 관리하고 있나요?",
        heroSubtitle: "이천 계단청소 전문업체 | 빌라·상가·원룸 정기관리",
        seoTitle: "이천 계단청소 전문업체 | 빌라·상가 정기관리 – 이천계단지기",
        features: [
          { title: "부부 직접 관리", description: "처음부터 끝까지 부부가 직접 관리합니다." },
          { title: "대표 직접 담당", description: "대표가 직접 방문해 건물 상태에 맞춰 관리합니다." },
          { title: "전후 사진 제공", description: "요청시 작업 후 전후 사진을 카톡으로 전달해드립니다." },
          { title: "친환경 수입세제", description: "고가의 친환경 수입세제로 꼼꼼히 관리해드립니다." },
        ],
        scopeItems: [
          "계단 바닥 약품 청소",
          "계단 난간·손잡이 오염 제거",
          "방향제 사용 및 냄새 관리",
          "공동현관 유리 및 출입문 청소",
          "거미줄·천장 먼지 제거",
          "건물 입구 낙엽·흙먼지 정리",
        ],
        gallery: [
          {
            before: "/images/services/stair-cleaning/icheon-stair-cleaning-before-01.webp",
            after: "/images/services/stair-cleaning/icheon-stair-cleaning-after-01.webp",
            label: "이천 빌라 계단 사례 – 논슬립 오염 제거·난간 청소·공동현관 유리 관리",
          },
          {
            before: "/images/services/stair-cleaning/icheon-villa-stair-before-02.webp",
            after: "/images/services/stair-cleaning/icheon-villa-stair-after-02.webp",
            label: "이천 빌라 계단 사례 – 계단 바닥 약품 세척·손잡이 오염 제거",
          },
        ],
        pricingTiers: [
          { badge: "2-3층", price: "70,000원", note: "월 4회 기준" },
          { badge: "4층", price: "80,000원", note: "월 4회 기준", highlight: true },
          { badge: "5-6층", price: "90,000원", note: "월 4회 기준" },
        ],
        infoContent: {
          title: "이천 계단청소, 왜 정기관리가 필요한가요?",
          body: `이천 빌라, 원룸, 상가 건물의 계단과 공동현관은 건물 입주자와 방문객이 매일 오가는 공간입니다. 바닥 먼지와 흙, 난간 손자국, 공동현관 유리의 오염이 쌓이면 외관상 청결하지 못한 인상을 주게 됩니다.

특히 빌라나 원룸 건물의 경우 계단청소를 건물주가 직접 관리하거나 입주자에게 맡기는 경우가 많지만, 정기적인 전문 관리를 받지 않으면 오염이 누적되어 나중에 더 많은 비용과 시간이 필요합니다.

이천 계단청소 전문업체 '이천계단지기'는 이천 지역 빌라, 원룸, 상가 건물의 계단 정기관리를 전문으로 합니다. 계단 바닥 약품 세척, 난간·손잡이 오염 제거, 공동현관 유리 청소, 거미줄 제거까지 한 번에 처리합니다.

월 2회 또는 4회 정기관리를 통해 건물이 항상 깔끔하게 유지됩니다. 상가 건물의 경우 방문 고객에게 청결한 첫인상을 주는 것이 입점 업체 매출에도 영향을 줄 수 있습니다. 부부가 직접 담당하기 때문에 일관된 품질을 유지할 수 있으며, 매회 작업 전후 사진을 전달해드려 건물주가 직접 확인하실 수 있습니다.`,
        },
        needSection: {
          title: "이천 계단청소,\n어떤 건물에 필요할까요?",
          subtitle: "다음 중 하나라도 해당된다면 정기적인 계단관리를 추천드립니다.",
          cards: [
            {
              icon: Home,
              title: "빌라·원룸 민원이 잦은 건물",
              text: "계단은 입주민 모두가 매일 사용하는 공간입니다. 먼지, 머리카락, 흙자국이 쌓이면 건물 전체 관리 상태가 나빠 보일 수 있습니다.",
            },
            {
              icon: Building2,
              title: "공동현관 출입이 많은 다세대주택",
              text: "택배 기사, 배달 기사, 방문객의 출입이 많은 건물은 오염 속도가 빠릅니다. 공동현관과 계단 모서리는 관리 여부가 바로 눈에 띕니다.",
            },
            {
              icon: Store,
              title: "상가·사무실 건물",
              text: "고객이 처음 마주하는 공간이 계단과 출입구입니다. 깨끗한 공용공간은 건물 이미지와 입점 업체의 신뢰도에도 영향을 줍니다.",
            },
            {
              icon: ClipboardCheck,
              title: "관리업체가 없거나 직접 관리하기 어려운 건물",
              text: "건물주가 직접 청소하기 어렵거나 기존 관리 품질이 아쉬운 경우, 정기적인 계단청소만으로도 건물 상태를 크게 개선할 수 있습니다.",
            },
          ],
        },
        faq: [
          {
            q: "계단청소 비용은 얼마인가요?",
            a: "2-3층 기준 월 2회 40,000원~, 월 4회 70,000원~입니다. 4층은 50,000~80,000원, 5-6층은 60,000~90,000원이며 현장 확인 후 정확한 견적을 안내드립니다.",
          },
          {
            q: "월 2회와 4회의 차이는 무엇인가요?",
            a: "월 2회는 2주에 한 번 방문하는 기본 정기관리입니다. 월 4회는 매주 방문으로, 유동인구가 많은 상가나 다세대 건물에 적합합니다.",
          },
          {
            q: "공동현관 유리도 포함되나요?",
            a: "네, 계단청소 정기관리 시 공동현관 유리와 출입문 청소가 기본으로 포함됩니다.",
          },
          {
            q: "이천 전지역 방문 가능한가요?",
            a: "이천 전 지역은 아니며, 현재는 신둔면, 마장면, 부발읍, 증포동, 중리동, 관고동, 대월면을 중심으로 주소와 사진 확인 후 방문 가능 여부를 안내드립니다.",
          },
          {
            q: "엘리베이터 건물도 가능한가요?",
            a: "네, 엘리베이터가 있는 건물도 가능합니다. 엘리베이터 내부 청소는 별도 상담 후 진행합니다.",
          },
        ],
        showReviews: true,
      }}
    />
  );
}
