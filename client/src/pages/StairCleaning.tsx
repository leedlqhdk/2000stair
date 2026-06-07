import ServicePageLayout from "@/components/ServicePageLayout";

export default function StairCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "stair-cleaning",
        heroBgImage: "/images/services/stair-cleaning/icheon-stair-cleaning-service-main.webp",
      heroVideo: "/images/services/stair-cleaning/2000stair-youtube.mp4",
        heroTitle: "매일 오르는 계단,\n누가 관리하고 있나요?",
        heroSubtitle: "부부가 직접 관리하는 이천 계단청소 전문업체",
        features: [
          { title: "부부 직접 관리", description: "처음부터 끝까지 부부가 직접 관리합니다." },
          { title: "하청 없이", description: "100% 직접 담당으로 관리합니다." },
          { title: "전후 사진 제공", description: "매회 작업 후 전후 사진을 전달해드립니다." },
          { title: "장기 관리 가능", description: "월 2회/4회 등 장기 정기 관리가 가능합니다." },
        ],
        scopeItems: [
  "계단 바닥 약품 청소",
  "계단 난간·손잡이 오염 제거",
  "방향제 사용 및 악취관리",
  "공동현관 유리 및 출입문 청소",
  "거미줄·천장 먼지 제거",
  "건물 입구 낙엽·흙먼지 정리",
]
        gallery: [
          { before: "/images/services/stair-cleaning/icheon-stair-cleaning-before-01.webp", after: "/images/services/stair-cleaning/icheon-stair-cleaning-after-01.webp", label: "이천 계단 사례 1" },
          { before: "/images/services/stair-cleaning/icheon-villa-stair-before-02.webp", after: "/images/services/stair-cleaning/icheon-villa-stair-after-02.webp", label: "이천 빌라 계단 사례 2" },
          { before: "/images/services/stair-cleaning/icheon-apartment-stair-before-03.webp", after: "/images/services/stair-cleaning/icheon-apartment-stair-after-03.webp", label: "이천 아파트 계단 사례 3" },
        ],
        pricingTiers: [
          { badge: "월 2회", price: "월 44,000원~", note: "빌라 2-3층 기준" },
          { badge: "월 4회", price: "월 66,000원~", note: "상가·층별 등 추가 조정", highlight: true },
          { badge: "고층건물", price: "별도 견적", note: "카카오톡 문의" },
        ],
      }}
    />
  );
}
