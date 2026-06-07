import ServicePageLayout from "@/components/ServicePageLayout";

export default function GlassCleaning() {
  return (
    <ServicePageLayout data={{
      serviceFolder: "glass-cleaning",
      heroBgImage: "/images/services/glass-cleaning/icheon-glass-cleaning-main.webp",
      heroTitle: "깨끗한 유리,\n건물 첫인상을 바꿉니다",
      heroSubtitle: "이천 유리청소 전문 – 대표가 직접 관리",
      features: [
        { icon: "shield", title: "전문 장비 사용", description: "스퀴지·순수물 세정 방식으로 얼룩 없이 깨끗하게 마감합니다." },
        { icon: "clock", title: "정기 계약 관리", description: "월 1~4회 정기 방문으로 항상 투명한 유리를 유지합니다." },
        { icon: "star", title: "대표 직접 방문", description: "외주·하청 없이 대표가 직접 방문하여 품질을 보장합니다." },
        { icon: "camera", title: "전후사진 제공", description: "매 방문마다 청소 전·후 사진을 카카오톡으로 전달해드립니다." },
      ],
      scopeItems: [
        "외부 유리창 세정",
        "내부 유리창 세정",
        "창틀·레일 청소",
        "출입문 유리 청소",
        "로비·복도 유리 청소",
        "고층 유리 (별도 견적)",
      ],
      pricingTiers: [
        { badge: "월 1회", price: "별도 견적", note: "건물 규모에 따라 안내" },
        { badge: "월 2회", price: "별도 견적", note: "가장 인기 있는 플랜", highlight: true },
        { badge: "월 4회 이상", price: "별도 견적", note: "대형 건물·다중이용시설" },
      ],
    }} />
  );
}
