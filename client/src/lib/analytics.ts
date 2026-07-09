type ConversionEventName =
  | "kakao_click"
  | "phone_click"
  | "review_click"
  | "quote_form_view"
  | "quote_form_submit";

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

// 유입 경로 추적 (Google Analytics 4)
// 페이지뷰와 유입 경로(referrer / UTM)가 자동으로 수집되고,
// 아래 trackConversion 으로 보내는 전환 이벤트도 함께 기록됩니다.
// 측정 ID는 어차피 페이지 소스에 공개되는 값이라 기본값으로 넣어둔다.
// (Vercel 환경변수 VITE_GA_MEASUREMENT_ID 로 덮어쓸 수 있음)
const MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || "G-ZJQ4RCD4E1";

function analyticsEnabled() {
  // 측정 ID가 설정되어 있고 프로덕션 빌드일 때만 실제로 전송합니다.
  return Boolean(MEASUREMENT_ID) && import.meta.env.PROD;
}

let initialized = false;

export function initAnalytics() {
  if (initialized || !analyticsEnabled() || typeof window === "undefined") return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  window.gtag("js", new Date());
  // SPA에서 라우트 변경마다 직접 page_view를 전송하므로 자동 전송은 끕니다.
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
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

export function trackConversion(eventName: ConversionEventName, params: ConversionEventParams = {}) {
  if (typeof window === "undefined") return;

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
