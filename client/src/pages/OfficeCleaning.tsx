import ServicePageLayout from "@/components/ServicePageLayout";

export default function OfficeCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "office-cleaning",
        heroBgImage: "/images/main-service-office.webp",
        heroTitle: "깨끗한 사무실이\n업무 효율을 높입니다",
        heroSubtitle: "이천 소규모 사무실·상가 정기 청소 서비스",
        features: [
          { title: "부부 직접 관리", description: "처음부터 끝까지 부부가 직접 관리합니다." },
          { title: "하청 없이", description: "100% 직접 담당으로 관리합니다." },
          { title: "전후 사진 제공", description: "매회 작업 후 전후 사진을 전달해드립니다." },
          { title: "유연한 일정", description: "업무 시간 전후로 방문 시간을 조정합니다." },
        ],
        scopeItems: [
          "사무실 바닥 청소",
          "책상·집기 먼지 제거",
          "탕비실 관리",
          "휴지통 비움",
          "화장실 연계관리",
          "정기 방문",
        ],
        pricingTiers: [
          { badge: "1회 청소", price: "현장 방문 견적", note: "면적 · 공간 구성 · 작업 범위 확인 후 안내" },
          { badge: "정기 관리", price: "맞춤 관리 견적", note: "주 1회~5회 / 월별 관리 계획 제공", highlight: true },
        ],
        pricingMessage: [
          "사무실마다 구조와 관리 범위가 모두 다르기 때문에,",
          "현장 확인 후 가장 합리적인 견적을 안내드립니다.",
          "불필요한 비용 없이 필요한 작업만 제안하고, 매회 작업 전후 사진을 남겨 담당자분이 현장에 오지 않아도 관리 상태를 바로 확인하실 수 있습니다.",
        ],
      }}
    />
  );
}
