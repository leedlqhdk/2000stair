import ServicePageLayout from "@/components/ServicePageLayout";

export default function StairCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "stair-cleaning",
        heroBgImage: "/images/services/stair-cleaning/icheon-stair-cleaning-service-main.webp",
        heroTitle: "이천 계단청소 전문\n부부가 직접 관리합니다",
        heroSubtitle: "빌라·원룸·상가 계단 정기관리 서비스",
        features: [
          { title: "부부 직접 관리", description: "대표가 직접 방문해 관리합니다." },
          { title: "정기관리 가능", description: "월 2회, 월 4회 관리가 가능합니다." },
          { title: "전후 사진 제공", description: "작업 후 사진을 전달해드립니다." },
          { title: "무료 견적", description: "건물 상태에 맞춰 안내드립니다." },
        ],
        scopeItems: [
          "계단 바닥 청소",
          "난간 및 손잡이 청소",
          "공동현관 유리 청소",
          "거미줄 제거",
          "건물 입구 정리",
          "먼지 및 오염 관리",
        ],
        pricingTiers: [
          { badge: "월 2회", price: "월 44,000원~", note: "빌라 2-3층 기준" },
          { badge: "월 4회", price: "월 66,000원~", note: "정기관리 추천", highlight: true },
          { badge: "고층건물", price: "별도 견적", note: "현장 확인 후 안내" },
        ],
      }}
    />
  );
}
