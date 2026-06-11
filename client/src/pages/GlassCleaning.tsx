import ServicePageLayout from "@/components/ServicePageLayout";

export default function GlassCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "glass-cleaning",
        heroBgImage: "/images/services/glass-cleaning/glass-page01.webp",
        heroVideo: "/images/services/glass-cleaning/glass-cleaning-video.mov",
        heroTitle: "깨끗한 유리,\n건물 첫인상을 바꿉니다",
        heroSubtitle: "이천 유리청소 전문업체 | 상가 유리·공동현관 유리·건물 유리관리",
        seoTitle: "이천 유리청소 전문업체 | 상가·건물 유리관리 – 이천계단지기",

        features: [
          {
            title: "이천 상가 유리청소",
            description: "출입문과 전면 유리는 손자국과 먼지가 쉽게 쌓여 매장 첫인상에 영향을 줍니다.",
          },
          {
            title: "공동현관 유리 관리",
            description: "빌라·원룸 공동현관 유리는 계단청소 정기관리와 함께 관리하면 효율적입니다.",
          },
          {
            title: "얼룩·석회자국 관리",
            description: "비, 먼지 생긴 오래된 유리 오염을 전용 도구와 세제로 깔끔하게 없애줍니다.",
          },
          {
            title: "대표 직접 방문",
            description: "외주 없이 대표가 직접 현장을 확인하고 작업 가능 범위를 안내드립니다.",
          },
        ],

      

        scopeItems: [
          "상가 출입문 유리 청소",
          "공동현관 유리 청소",
          "매장 유리창 세정 및 코팅",
          "빌라·원룸 현관 유리 관리",
          "얼룩·물때·석회자국 제거",
          "오래된 스티커·시트지 제거",
        ],

        infoSections: [
          {
            title: "유리청소는 건물 첫인상 관리입니다",
            body: "상가 출입문, 빌라 공동현관, 복도 유리는 방문자가 가장 먼저 보는 부분입니다. 유리에 손자국과 먼지, 빗물 자국이 남아 있으면 건물 전체가 관리되지 않는 인상을 줄 수 있습니다.",
            image: "/images/services/glass-cleaning/glass-page01.webp",
          },
          {
            title: "공동현관 유리는 정기관리와 함께하면 효율적입니다",
            body: "공동현관 유리청소는 계단청소 정기관리와 함께 진행하면 이동비와 작업 동선이 줄어 합리적으로 관리할 수 있습니다. 단독 일회성 작업도 가능하지만 현장 규모에 따라 견적이 달라집니다.",
            image: "/images/services/glass-cleaning/glass-page02.webp",
          },
          {
            title: "유리 전용 세제로 깔끔한 마감을 추구합니다",
  body: "유리는 먼지를 닦는 것보다 자국 없이 마무리하는 과정이 중요합니다. 이천계단지기는 유리 전용 수입 세제와 전문 장비를 활용해 얼룩을 최소화하고 건물의 첫인상을 더욱 깔끔하게 유지할 수 있도록 관리합니다.",
  image: "/images/services/glass-cleaning/glass-page03.webp",
          },
        ],

        pricingTiers: [
          {
            badge: "공동현관 유리",
            price: "30,000원~",
            note: "출입문 유리 · 고정창 기준",
          },
          {
            badge: "상가 유리청소",
            price: "50,000원~",
            note: "소형 상가 · 전면 유리 기준",
            highlight: true,
          },
          {
            badge: "일회성 청소",
            price: "별도 견적",
            note: "묵은 오염이 심해 강도 높은 청소가 필요한 경우",
          },
        ],

        faq: [
          {
            q: "외부 유리도 가능한가요?",
            a: "1~2층 외부 유리는 대부분 작업 가능합니다. 고층 외창은 현장 확인 후 작업 가능 여부를 안내드립니다.",
          },
        
          {
            q: "정기관리도 가능한가요?",
            a: "네, 계단청소 정기관리와 함께 묶어서 진행하거나 유리청소만 단독으로 정기계약도 가능합니다.",
          },
          {
            q: "유리 물때 제거도 가능한가요?",
            a: "네, 유리 물때와 얼룩은 전용 세정 도구와 약품으로 제거합니다. 오염 정도에 따라 작업 시간이 달라질 수 있습니다.",
          },
          {
            q: "상가 출입문 유리도 포함되나요?",
            a: "네, 상가 출입문 유리는 기본 작업 범위에 포함됩니다. 전면 유리창 전체 세정도 가능합니다.",
          },
        ],

        showReviews: true,
      }}
    />
  );
}
