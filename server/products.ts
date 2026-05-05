/**
 * PeanutCrate 청소 구독 서비스 플랜 정의
 * 대면/비대면 2년 청소 구독 서비스
 */

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  popular: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "소규모 건물을 위한 기본 청소 구독",
    features: [
      "월 2회 정기 계단 청소",
      "공동현관 바닥 청소",
      "우편함 주변 정리",
      "청소 완료 사진 보고",
      "2년 약정 할인 적용",
    ],
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    description: "가장 인기 있는 정기 청소 구독",
    features: [
      "주 1회 정기 계단 청소",
      "복도 + 계단 + 현관 전체 관리",
      "엘리베이터 내부 청소",
      "화장실 청소 포함",
      "분기별 특수 청소 1회",
      "청소 완료 사진 보고",
      "2년 약정 할인 적용",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "완벽한 건물 관리를 위한 프리미엄 구독",
    features: [
      "주 2회 정기 청소 (계단+복도+현관)",
      "엘리베이터 + 화장실 + 주차장",
      "외부 유리창 청소 포함",
      "월 1회 특수 청소 (왁스코팅 등)",
      "비둘기/해충 방제 관리",
      "전담 매니저 배정",
      "24시간 긴급 청소 대응",
      "2년 약정 최대 할인 적용",
    ],
    popular: false,
  },
];

export function getPlanById(id: string) {
  return PLANS.find((p) => p.id === id);
}
