import ServicePageLayout from "@/components/ServicePageLayout";

export default function OfficeCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "office-cleaning",
        heroBgImage: "/images/services/office-cleaning/hero.webp",
        heroTitle: "깨끗한 사무실이\n업무 효율을 높입니다",
        heroSubtitle: "이천 소규모 사무실·상가 정기 청소 서비스",
        features: [
          { title: "부부 직접 관리", description: "처음부터 끝까지 부부가 직접 관리합니다." },
          { title: "하청 없이", description: "100% 직접 담당으로 관리합니다." },
          { title: "전후 사진 제공", description: "매회 작업 후 전후 사진을 전달해드립니다." },
          { title: "유연한 일정", description: "업무 시간 전후로 방문 시간을 조정합니다." },
        ],
        scopeItems: [
          "바닥 청소(스위핑·물걸레)",
          "책상·집기 먼지 제거",
          "화장실 청소 및 소독",
          "쓰레기 수거 및 분리배출",
          "창문·유리 청소",
          "주방·탕비실 청소",
        ],
        pricingTiers: [
          { badge: "1회 청소", price: "별도 견적", note: "면적·층수에 따라 산정" },
          { badge: "정기 관리", price: "월 별도 견적", note: "주 1회~월 2회 조정 가능", highlight: true },
        ],
      }}
    />
  );
}
