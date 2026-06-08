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
          { badge: "월 2회", price: "월 44,000원~", note: "빌라 2-3층 기준" },
          { badge: "월 4회", price: "월 66,000원~", note: "상가·층별 등 추가 조정", highlight: true },
          { badge: "고층건물", price: "별도 견적", note: "현장 확인 후 안내" },
        ],
        infoContent: {
          title: "이천 계단청소, 왜 정기관리가 필요한가요?",
             body: `이천 빌라, 원룸, 상가 건물의 계단과 공동현관은 건물 입주자와 방문객이 매일 오가는 공간입니다. 바닥 먼지와 흙, 난간 손자국, 공동현관 유리의 오염이 쌓이면 외관상 청결하지 못한 인상을 주게 됩니다.

특히 빌라나 원룸 건물의 경우 계단청소를 건물주가 직접 관리하거나 입주자에게 맡기는 경우가 많지만, 정기적인 전문 관리를 받지 않으면 오염이 누적되어 나중에 더 많은 비용과 시간이 필요합니다.

이천 계단청소 전문업체 '이천계단지기'는 이천 지역 빌라, 원룸, 상가 건물의 계단 정기관리를 전문으로 합니다. 계단 바닥 약품 세척, 난간·손잡이 오염 제거, 공동현관 유리 청소, 거미줄 제거까지 한 번에 처리합니다.

월 2회 또는 4회 정기관리를 통해 건물이 항상 깔끔하게 유지됩니다. 상가 건물의 경우 방문 고객에게 청결한 첫인상을 주는 것이 입점 업체 매출에도 영향을 줄 수 있습니다. 부부가 직접 담당하기 때문에 일관된 품질을 유지할 수 있으며, 매회 작업 전후 사진을 전달해드려 건물주가 직접 확인하실 수 있습니다.`,
        },
        faq: [
          {
            q: "계단청소 비용은 얼마인가요?",
            a: "빌라 2~3층 기준 월 2회 44,000원~부터 시작합니다. 건물 층수, 면적, 관리 횟수에 따라 달라지며 현장 확인 후 정확한 견적을 안내드립니다.",
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
            a: "현재는 이천 시내(관고동, 창전동 등)뿐만 아니라 신둔면, 마장면, 대월면, 부발읍, 백사면 등 이천 북부 지역만 방문이 가능합니다.",
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
