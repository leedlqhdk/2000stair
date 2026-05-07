/**
 * 이천계단지기 서비스 메뉴 정의
 * 실제 견적표 기반 서비스 항목
 */

export interface ServicePlan {
  id: string;
  name: string;
  price: string;
  description: string;
  popular: boolean;
}

export const PLANS: ServicePlan[] = [
  {
    id: "stair_2_3",
    name: "2-3층 계단",
    price: "66,000원~",
    description: "이천지역 밀착 관리 · 친환경 수입세제로 매달 같은 손이 관리합니다",
    popular: false,
  },
  {
    id: "stair_4",
    name: "4층 계단",
    price: "77,000원~",
    description: "부부 직영, 외주 없이, 처음 온 날과 같은 품질로 유지합니다",
    popular: true,
  },
  {
    id: "stair_5_6",
    name: "5-6층 계단",
    price: "88,000원~",
    description: "건물당 걸레 1장 원칙, 위층 아래층 동일한 기준으로 호텔급 관리",
    popular: false,
  },
  {
    id: "bathroom",
    name: "화장실 / 상가유리 / 사무실 청소",
    price: "별도 문의",
    description: "청소계획표 기반, 친환경 수입 세제로 위생 기준을 지켜 관리합니다",
    popular: false,
  },
];

export function getPlanById(id: string) {
  return PLANS.find((p) => p.id === id);
}
