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
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
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
