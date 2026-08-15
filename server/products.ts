/**
 * 이천계단지기 서비스 메뉴 정의
 * 실제 확정 요금 기준 서비스 항목
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
    price: "60,000원~",
    description: "월 4회(주 1회) 기준 · 2층 60,000원 / 3층 70,000원",
    popular: false,
  },
  {
    id: "stair_4",
    name: "4층 계단",
    price: "80,000원",
    description: "월 4회(주 1회) 기준 · 4층 80,000원",
    popular: false,
  },
  {
    id: "stair_5_6",
    name: "5-6층 계단",
    price: "90,000원~",
    description: "월 4회(주 1회) 기준 · 5층 90,000원 / 6층 100,000원",
    popular: false,
  },
  {
    id: "stair_7_8",
    name: "7-8층 계단",
    price: "110,000원~",
    description: "월 4회(주 1회) 기준 · 7층 110,000원 / 8층 120,000원",
    popular: false,
  },
  {
    id: "bathroom",
    name: "화장실 / 상가유리 / 사무실 청소",
    price: "별도 문의",
    description: "공용화장실, 유리, 사무실 청소는 현장 조건을 확인한 뒤 별도 안내드립니다.",
    popular: false,
  },
];

export function getPlanById(id: string) {
  return PLANS.find((p) => p.id === id);
}
