import ServicePageLayout from "@/components/ServicePageLayout";

export default function BathroomCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "restroom-cleaning",
        heroStyle: "fullscreenVideo",
        heroBgImage: "/images/services/restroom-cleaning/icheon-restroom-cleaning-main.webp",
        heroVideo: "/images/services/restroom-cleaning/bathroom-cleaning-video.mov",
        heroTitle: "쾌적한 화장실,\n건물 첫인상을 바꿉니다",
        heroSubtitle: "이천 화장실청소 전문 – 대표가 직접 관리",
        features: [
          {
            title: "위생 전문 관리",
            description: "세균·악취 원인을 차단하는 전문 약품과 장비로 관리합니다.",
          },
          {
            title: "정기 계약 관리",
            description: "정기 방문으로 항상 청결한 상태를 유지합니다.",
          },
          {
            title: "대표 직접 방문",
            description: "외주·하청 없이 대표가 직접 방문하여 품질을 보장합니다.",
          },
          {
            title: "전후사진 제공",
            description: "매 방문마다 청소 전·후 사진을 카카오톡으로 전달해드립니다.",
          },
        ],
        scopeItems: [
          "변기 내·외부 세척 및 소독",
          "세면대·거울 물때 제거",
          "바닥 오염 및 배수구 관리",
          "벽면 타일 오염 제거",
          "환풍구·조명 주변 먼지 제거",
          "휴지통 처리 및 악취 관리",
        ],
        gallery: [
          {
            before: "/images/services/restroom-cleaning/bathroom-01-before.webp",
            after: "/images/services/restroom-cleaning/bathroom-01-after.webp",
            label: "화장실 청소 사례 1",
          },
          {
            before: "/images/services/restroom-cleaning/bathroom-02-before.webp",
            after: "/images/services/restroom-cleaning/bathroom-02-after.webp",
            label: "화장실 청소 사례 2",
          },
        ],
        pricingTiers: [
          { badge: "월 2회", price: "별도 견적", note: "소형 상가·공용화장실 기준" },
          { badge: "월 4회", price: "별도 견적", note: "가장 인기 있는 정기관리", highlight: true },
          { badge: "월 8회 이상", price: "별도 견적", note: "사용량 많은 건물·다중이용시설" },
        ],
      }}
    />
  );
}
