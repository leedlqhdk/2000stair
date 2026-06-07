import ServicePageLayout from "@/components/ServicePageLayout";

export default function StairCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "stair-cleaning",
        heroBgImage: "/images/services/stair-cleaning/hero.webp",

        heroTitle: "매일 오르는 계단,\n누가 관리하고 있나요?",
        heroSubtitle:
          "이천 빌라·원룸·상가 계단청소를 부부가 직접 관리하는 정기청소 전문업체입니다.",

        descriptionTitle: "왜 계단청소가 필요할까요?",
        descriptionText:
          "계단은 입주민과 방문객이 매일 이용하는 공용공간입니다. 먼지, 흙, 거미줄, 생활오염이 쌓이면 건물 이미지가 떨어지고 입주민 민원으로 이어질 수 있습니다. 정기적인 계단청소는 건물의 청결 유지와 입주 만족도 향상에 도움이 됩니다.",

        features: [
          {
            title: "부부 직접 관리",
            description: "처음부터 끝까지 부부가 직접 관리합니다.",
          },
          {
            title: "하청 없이",
            description: "외부 하청 없이 100% 직접 담당으로 관리합니다.",
          },
          {
            title: "전후 사진 제공",
            description: "매회 작업 후 전후 사진을 전달해드립니다.",
          },
          {
            title: "장기 관리 가능",
            description: "월 2회/4회 등 장기 정기 관리가 가능합니다.",
          },
        ],

        scopeItems: [
          "계단 바닥 먼지 및 오염 제거",
          "난간 및 손잡이 생활오염 제거",
          "엘리베이터 내부 청소",
          "공동현관 유리 및 출입문 청소",
          "거미줄 및 천장 먼지 제거",
          "방향제 및 악취 관리",
        ],

        pricingTiers: [
          {
            badge: "월 2회",
            price: "월 44,000원~",
            note: "빌라 2-3층 기준",
          },
          {
            badge: "월 4회",
            price: "월 66,000원~",
            note: "상가·층별 등 추가 조정",
            highlight: true,
          },
          {
            badge: "고층건물",
            price: "별도 견적",
            note: "카카오톡 문의",
          },
        ],

        faqItems: [
          {
            q: "계단청소는 월 몇 회가 적당한가요?",
            a: "일반 빌라와 원룸 계단청소는 월 2회를 권장하며, 유동인구가 많은 상가나 다세대 건물은 월 4회 정기관리를 추천합니다.",
          },
          {
            q: "엘리베이터도 함께 청소하나요?",
            a: "네. 계단청소 계약 시 엘리베이터 내부 바닥, 버튼 주변, 거울 오염까지 함께 관리할 수 있습니다.",
          },
          {
            q: "공동현관 유리도 포함되나요?",
            a: "네. 공동현관 출입문 유리, 손잡이, 프레임 오염까지 함께 관리합니다.",
          },
          {
            q: "비대면 관리가 가능한가요?",
            a: "가능합니다. 작업 후 전후사진을 전달해드리기 때문에 현장에 계시지 않아도 확인할 수 있습니다.",
          },
          {
            q: "하청업체가 방문하나요?",
            a: "아닙니다. 이천계단지기는 부부가 직접 방문하여 작업하며 외부 하청을 사용하지 않습니다.",
          },
          {
            q: "이천 외 지역도 가능한가요?",
            a: "이천을 중심으로 신둔면, 부발읍, 마장면, 중리동 등 인근 지역도 상담 가능합니다.",
          },
        ],
      }}
    />
  );
}
