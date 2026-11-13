import type { MouseEvent as ReactMouseEvent } from "react";
import { toast } from "sonner";
import { DESKTOP_POINTER_QUERY } from "@/hooks/useMediaQuery";

// 연락처 한 곳에서 관리한다 (첫 화면·문의 밴드·플로팅 버튼·상단 메뉴·견적 폼이 함께 쓴다)
export const PHONE_NUMBER = "01084381887";
export const PHONE_DISPLAY = "010-8438-1887";
export const PHONE_HREF = `tel:${PHONE_NUMBER}`;
export const BUSINESS_HOURS = "평일 09:00–18:00";
export const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
export const QUOTE_PATH = "/quote";
// 홈에서 보여주는 기준 가격 (계단청소 상세 페이지·자주 묻는 질문의 요금표와 같은 값)
export const PRICE_ANCHOR = "2~3층 빌라 월 2회 4만 원부터";

export function isDesktopPointer() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_POINTER_QUERY).matches;
}

/** PC에서 전화번호를 누르면 번호를 복사하고 알려준다 (클릭 자체는 installConversionTracking이 전환으로 기록한다) */
export async function copyPhoneNumber() {
  let copied = false;
  try {
    await navigator.clipboard.writeText(PHONE_DISPLAY);
    copied = true;
  } catch {
    // 클립보드를 못 쓰는 환경에서는 번호만 보여준다
  }
  toast(copied ? "전화번호를 복사했어요" : `전화 ${PHONE_DISPLAY}`, {
    description: copied ? `${PHONE_DISPLAY} · ${BUSINESS_HOURS}` : BUSINESS_HOURS,
    position: "top-center",
    duration: 3500,
  });
  return copied;
}

/**
 * 전화 링크(tel:)의 onClick. 휴대폰에서는 그대로 전화를 걸고,
 * PC에서는 전화 앱 선택 창 대신 번호를 복사해 준다.
 */
export function onPhoneLinkClick(event: ReactMouseEvent<HTMLAnchorElement>) {
  if (!isDesktopPointer()) return;
  event.preventDefault();
  void copyPhoneNumber();
}

/**
 * 사이트 어디의 전화 링크(tel:)든 PC에서 누르면 번호를 복사해 준다 (상세·지역 페이지, 푸터처럼 onClick을 따로 달지 않은 곳까지).
 * 이미 onPhoneLinkClick이 처리한 클릭(defaultPrevented)은 건너뛴다.
 */
export function installDesktopPhoneCopy() {
  if (typeof document === "undefined") return () => {};

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const anchor = (event.target as Element | null)?.closest?.("a[href^='tel:']");
    if (!anchor || !isDesktopPointer()) return;
    event.preventDefault();
    void copyPhoneNumber();
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
