type ConversionEventName =
  | "kakao_click"
  | "phone_click"
  | "review_click"
  | "cta_click"
  | "quote_form_view"
  | "quote_form_submit"
  | "quote_form_error";

type ConversionEventParams = {
  location?: string;
  label?: string;
  value?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// 유입 경로·전환 측정 (Google Analytics 4)
// 측정 태그(gtag.js)는 index.html <head>에서 먼저 받고, 자동 page_view는 꺼 둔다(send_page_view: false).
// 화면 전환마다 trackPageview가 page_view를 한 번씩 보내고, 전화·카톡 클릭은 trackConversion으로 기록한다.
// 측정 ID는 어차피 페이지 소스에 공개되는 값이라 기본값으로 넣어둔다.
// (Vercel 환경변수 VITE_GA_MEASUREMENT_ID 로 덮어쓸 수 있음)
const MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || "G-ZJQ4RCD4E1";

function analyticsEnabled() {
  // 측정 ID가 설정되어 있고 프로덕션 빌드일 때만 실제로 전송합니다.
  return Boolean(MEASUREMENT_ID) && import.meta.env.PROD;
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  // index.html의 태그가 막혔거나(광고 차단) 아직 안 받아졌어도 호출이 실패하지 않게 큐만 준비해 둔다
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}

export function trackPageview(path: string) {
  if (!analyticsEnabled() || typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    page_referrer: document.referrer,
  });
}

// 같은 클릭을 버튼의 onClick과 문서 전체 감시(installConversionTracking)가 함께 보고하면 한 번만 기록한다
let lastSent = { name: "", at: 0 };

export function trackConversion(eventName: ConversionEventName, params: ConversionEventParams = {}) {
  if (typeof window === "undefined") return;

  const now = performance.now();
  if (lastSent.name === eventName && now - lastSent.at < 200) return;
  lastSent = { name: eventName, at: now };

  window.gtag?.("event", eventName, {
    event_category: "conversion",
    event_label: params.label,
    location: params.location,
    value: params.value,
  });

  window.dispatchEvent(
    new CustomEvent("site-conversion", {
      detail: {
        eventName,
        ...params,
      },
    })
  );
}

/** 어느 화면·어느 섹션의 버튼인지: data-track-location → 가장 가까운 id가 있는 영역 → 경로 */
function conversionLocation(element: Element) {
  const tagged = element.closest<HTMLElement>("[data-track-location]");
  if (tagged?.dataset.trackLocation) return tagged.dataset.trackLocation;
  const path = window.location.pathname;
  const section = element.closest("[id]:not(#root)");
  return section?.id ? `${path}#${section.id}` : path;
}

/**
 * 사이트 어디서든 전화(tel:)·카톡 링크를 누르면 전환으로 기록한다.
 * 버튼마다 onClick을 달지 않아도 되므로 상세·지역·작업일지 페이지의 버튼도 빠짐없이 잡힌다.
 */
export function installConversionTracking() {
  if (typeof document === "undefined") return () => {};

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const anchor = target?.closest?.("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") ?? "";

    let eventName: ConversionEventName | null = null;
    if (/^(tel|sms):/i.test(href)) eventName = "phone_click";
    else if (/(pf\.kakao\.com|open\.kakao\.com)/i.test(href)) eventName = "kakao_click";
    if (!eventName) return;

    const label = (anchor.getAttribute("aria-label") || anchor.textContent || "").replace(/\s+/g, " ").trim();
    trackConversion(eventName, { location: conversionLocation(anchor), label: label.slice(0, 60) });
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
