/**
 * PeanutCrate 구독 플랜 정의
 * Stripe에서 실제 Product/Price를 생성한 후 ID를 업데이트해야 합니다.
 * 현재는 동적으로 Stripe에서 생성하는 방식을 사용합니다.
 */

export interface PlanDefinition {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number; // 원 단위
  yearlyPrice: number; // 원 단위 (연간 총액)
  popular?: boolean;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "basic",
    name: "Basic",
    description: "청소 입문자를 위한 기본 구성",
    features: [
      "다목적 세정제 1종",
      "극세사 타올 2장",
      "고무장갑 1켤레",
      "월간 청소 팁 가이드",
    ],
    monthlyPrice: 19900,
    yearlyPrice: 199000,
  },
  {
    id: "standard",
    name: "Standard",
    description: "깨끗한 집을 위한 인기 구성",
    features: [
      "다목적 세정제 2종",
      "극세사 타올 4장",
      "고무장갑 1켤레",
      "스펀지 & 수세미 세트",
      "방향제 1종",
      "프리미엄 청소 가이드",
    ],
    monthlyPrice: 29900,
    yearlyPrice: 299000,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "완벽한 청소를 위한 올인원 구성",
    features: [
      "프리미엄 세정제 3종",
      "극세사 타올 6장",
      "고무장갑 2켤레",
      "스펀지 & 수세미 프리미엄 세트",
      "프리미엄 방향제 2종",
      "전문가 청소 도구 1종",
      "1:1 청소 컨설팅",
      "우선 배송",
    ],
    monthlyPrice: 49900,
    yearlyPrice: 499000,
  },
];

export function getPlanById(id: string) {
  return PLANS.find((p) => p.id === id);
}
