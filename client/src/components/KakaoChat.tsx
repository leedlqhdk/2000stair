import { MessageCircle, Phone, Sparkles } from "lucide-react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

const buttonBase =
  "flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group";

export default function KakaoChat() {
  return (
    <div className="fixed top-20 right-4 md:top-24 md:right-6 z-50 flex flex-col gap-2 md:gap-3 items-end">
      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} bg-primary text-white border border-primary/20`}
        aria-label="AI 진단 받기"
      >
        <Sparkles className="w-5 h-5 translate-y-px" />
        <span className="font-semibold text-sm hidden md:inline md:ml-2">
          AI 진단
        </span>
      </a>

      <a
        href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
        className={`${buttonBase} bg-white/95 text-primary border border-blue-100 backdrop-blur`}
        aria-label="전화 문의하기"
      >
        <Phone className="w-5 h-5 translate-x-[0.5px] translate-y-[0.5px]" />
        <span className="font-semibold text-sm hidden md:inline md:ml-2">
          전화 문의
        </span>
      </a>

      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} bg-[#FEE500] text-[#191919]`}
        aria-label="카카오톡 상담하기"
      >
        <MessageCircle className="w-5 h-5 translate-y-[0.5px] fill-current" />
        <span className="font-semibold text-sm hidden md:inline md:ml-2">
          카톡 상담
        </span>
      </a>
    </div>
  );
}
