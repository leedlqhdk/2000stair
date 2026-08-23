import { Link } from "wouter";
import { ClipboardList, MessageCircle, Phone } from "lucide-react";
import { trackConversion } from "@/lib/analytics";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "01084381887";

export default function HomeFinalCta() {
  return (
    <section className="bg-primary py-20 text-white md:py-28">
      <div className="container max-w-5xl text-center">
        <p className="mb-4 text-xs font-extrabold tracking-[0.3em] text-white/65">CONTACT</p>
        <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
          건물 주소만
          <br />
          보내주세요.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl break-keep text-xl font-semibold leading-relaxed text-white/82">
          확인 후 방문견적을 안내드립니다.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion("kakao_click", { location: "home_final_cta", label: "카카오톡" })}
            className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-extrabold text-primary shadow-lg transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" />
            카카오톡
          </a>
          <a
            href={`tel:${PHONE_NUMBER}`}
            onClick={() => trackConversion("phone_click", { location: "home_final_cta", label: "전화" })}
            className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-base font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <Phone className="h-5 w-5" />
            전화
          </a>
          <Link
            href="/quote"
            onClick={() => trackConversion("quote_form_view", { location: "home_final_cta", label: "견적문의" })}
            className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-base font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            <ClipboardList className="h-5 w-5" />
            견적문의
          </Link>
        </div>
      </div>
    </section>
  );
}
