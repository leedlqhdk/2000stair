import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** 마우스·트랙패드로 쓰는 화면(PC·노트북). 전화 링크(tel:)가 열리지 않거나 앱 선택 창이 떠서, 번호를 보여주고 복사해 주는 편이 낫다 */
export const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function useDesktopPointer() {
  return useMediaQuery(DESKTOP_POINTER_QUERY);
}
