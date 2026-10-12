/**
 * 화면 하단 플로팅 버튼(전화·카톡, 맨 위로) 뒤로 전체화면 섹션(data-floating-quiet)이 지나가는지 확인한다.
 * 그 섹션의 하단 글자를 가리지 않도록 플로팅 버튼을 줄이거나 숨길 때 쓴다.
 * @param zoneHeight 화면 아래 끝에서부터 플로팅 버튼이 차지하는 높이(px)
 */
export function isQuietSectionBehind(zoneHeight: number) {
  const section = document.querySelector("[data-floating-quiet]");
  if (!section) return false;

  const rect = section.getBoundingClientRect();
  if (rect.height === 0) return false;

  const viewportBottom = window.innerHeight;
  return rect.top < viewportBottom && rect.bottom > viewportBottom - zoneHeight;
}
