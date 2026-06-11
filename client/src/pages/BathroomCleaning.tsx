import ServicePageLayout from "@/components/ServicePageLayout";

export default function BathroomCleaning() {
  return (
    <ServicePageLayout
      data={{
        serviceFolder: "restroom-cleaning",
        heroStyle: "fullscreenVideo",
        heroBgImage: "/images/services/restroom-cleaning/icheon-restroom-cleaning-main.webp",
        heroVideo: "/images/services/restroom-cleaning/bathroom-cleaning-video.mov",
        heroTitle: "쾌적한 화장실,\n건물 신뢰도를 높입니다",
        heroSubtitle: "이천 화장실청소 전문업체 | 공용화장실 정기관리",
        seoTitle: "이천 화장실청소 전문업체 | 공용화장실 정기관리 – 이천계단지기",
        features: [
          {
            title: "위생 전문 관리",
            description: "세균·악취 원인을 차단하는 고가의 전문 약품과 장비로 관리합니다.",
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
            description: "요청시 청소 전·후 사진을 카카오톡으로 전달해드립니다.",
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
            label: "이천 상가 공용화장실 사례 1 – 오염 제거·악취 원인 제거·바닥 세척",
          },
          {
            before: "/images/services/restroom-cleaning/bathroom-02-before.webp",
            after: "/images/services/restroom-cleaning/bathroom-02-after.webp",
            label: "이천 상가 공용화장실 사례 2 – 타일 오염 제거·배수구 세척·소독 등",
          },
        ],
        pricingTiers: [
          { badge: "월 2회", price: "20,000~", note: "소형 상가·공용화장실 기준" },
          { badge: "월 4회", price: "40,000~", note: "가장 인기 있는 정기관리", highlight: true },
          { badge: "일회성", price: "별도 견적", note: "오염이 심해 강도 높은 세척 필요시" },
        ],
        infoContent: {
          title: "공용화장실 정기청소가 필요한 이유",
          body: `상가 건물, 사무실, 원룸 건물의 공용화장실은 하루에도 수십 명이 사용하는 공간입니다. 사용 빈도가 높을수록 세균, 악취, 오염이 빠르게 축적됩니다. 정기적인 전문 청소 없이는 일반 청소만으로 위생을 유지하기 어렵습니다.

이천 화장실청소 전문업체 이천계단지기는 변기 내·외부 세척 및 소독, 세면대 물때 제거, 바닥 오염 제거, 악취 원인 차단까지 공용화장실 위생 관리의 전 과정을 담당합니다.

악취는 배수구, 변기 주변 오염, 벽면 타일 사이 곰팡이가 주요 원인입니다. 전문 약품과 장비를 사용하면 단순 청소로는 제거되지 않는 악취 원인을 근본적으로 해결할 수 있습니다.

소독은 기본 옵션으로 포함되며, 사용자가 많은 다중이용시설의 경우 적어도 일주일에 한번씩은 정기관리를 권장합니다. 건물 입주자나 방문 고객에게 청결하고 쾌적한 화장실을 제공하는 것은 건물 전체의 신뢰도와 직결됩니다.`,
        },
        faq: [
          {
            q: "화장실청소는 몇 회가 적당한가요?",
            a: "사용 인원에 따라 다릅니다. 소규모 상가는 월 2~4회, 유동인구가 많은 건물은 월 8회 이상 정기관리를 권장합니다.",
          },
          {
            q: "악취 제거도 가능한가요?",
            a: "네, 배수구·타일 사이·변기 주변 등 악취 원인을 전문 약품으로 처리합니다. 단순 방향제 마스킹이 아닌 원인 제거를 목표로 합니다.",
          },
          {
            q: "추가금은 얼마나 추가되나요?",
            a: "소변기 및 추가 위생시설은 수량에 따라 별도 비용이 발생할 수 있으며, 현장 확인 후 정확한 견적을 안내드립니다..",
          },
          {
            q: "휴지통 관리도 가능한가요?",
            a: "네, 휴지통 교체 및 비닐 처리, 주변 오염 제거도 기본 범위에 포함됩니다.",
          },
          {
            q: "이천 전지역 가능한가요?",
            a: "현재는 이천 시내와 신둔면, 마장면, 대월면, 부발읍 등 이천 북부 지역만 방문이 가능합니다.",
          },
        ],
        showReviews: true,
      }}
    />
  );
}
