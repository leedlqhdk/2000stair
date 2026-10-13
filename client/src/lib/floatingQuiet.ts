/** 전체화면 섹션이 새로 나타나거나 크기가 바뀌었을 때 플로팅 버튼에 다시 확인하라고 알리는 이벤트 */
export const FLOATING_QUIET_EVENT = "floating-quiet-change";

/**
 * 화면 하단 플로팅 버튼(전화·카톡, 맨 위로) 뒤로 전체화면 섹션(data-floating-quiet)이 지나가는지 확인한다.
 * 그 섹션의 글자나 사진을 가리지 않도록 플로팅 버튼을 줄이거나 숨길 때 쓴다.
 * @param zoneHeight 화면 아래 끝에서부터 플로팅 버튼이 차지하는 높이(px)
 */
export function isQuietSectionBehind(zoneHeight: number) {
  const viewportBottom = window.innerHeight;
  return Array.from(document.querySelectorAll("[data-floating-quiet]")).some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.height > 0 && rect.top < viewportBottom && rect.bottom > viewportBottom - zoneHeight;
  });
}

export function notifyFloatingQuietChange() {
  window.dispatchEvent(new Event(FLOATING_QUIET_EVENT));
}
