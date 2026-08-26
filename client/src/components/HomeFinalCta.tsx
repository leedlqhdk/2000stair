import { MessageCircle, Phone } from "lucide-react";
import { trackConversion } from "@/lib/analytics";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "01084381887";

export default function HomeFinalCta() {
  return (
    <section className="bg-primary py-14 text-white md:py-20">
      <div className="container max-w-4xl text-center">
        <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-white/65">CONTACT</p>
        <h2 className="break-keep text-3xl font-extrabold leading-tight md:text-4xl">
          건물 주소만 보내주세요.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-base font-semibold leading-relaxed text-white/82 md:text-lg">
          확인 후 방문견적을 안내드립니다.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 md:grid-cols-2">
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion("kakao_click", { location: "home_final_cta", label: "카카오톡" })}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-primary shadow-lg transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            카카오톡
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() => trackConversion("phone_click", { location: "home_final_cta", label: "전화" })}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <Phone className="h-5 w-5" />
            전화
          </a>
        </div>
      </div>
    </section>
  );
}
