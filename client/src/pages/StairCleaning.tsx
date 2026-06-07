import ServicePageLayout from "@/components/ServicePageLayout";

export default function StairCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "stair-cleaning",
        heroBgImage: "/images/services/stair-cleaning/hero.webp",
        heroTitle: "매일 오르는 계단,\n누가 관리하고 있나요?",
        heroSubtitle: "부부가 직접 관리하는 이천 계단청소 전문업체",
        features: [
          { title: "부부 직접 관리", description: "처음부터 끝까지 부부가 직접 관리합니다." },
          { title: "하청 없이", description: "100% 직접 담당으로 관리합니다." },
          { title: "전후 사진 제공", description: "매회 작업 후 전후 사진을 전달해드립니다." },
          { title: "장기 관리 가능", description: "월 2회/4회 등 장기 정기 관리가 가능합니다." },
        ],
        scopeItems: [
          "계단 바닥 청소",
          "난간 및 손잡이 청소",
          "벽면·몰딩·탕관 청소",
          "공동현관 청소",
          "거미줄 및 먼지 제거",
          "쓰레기 분리 및 정리",
        ],
        pricingTiers: [
          { badge: "월 2회", price: "월 66,000원~", note: "빌라 8층 기준" },
          { badge: "월 4회", price: "월 110,000원~", note: "상가·층별 등 추가 조정", highlight: true },
          { badge: "월 8회 이상", price: "별도 견적", note: "대형 건물·다중이용시설" },
        ],
      }}
    />
  );
}
