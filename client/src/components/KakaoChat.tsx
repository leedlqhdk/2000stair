import { MessageCircle, Phone } from "lucide-react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8180-6895";

export default function KakaoChat() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* 전화 문의 버튼 */}
      <a
        href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
        aria-label="전화 문의하기"
      >
        <Phone className="w-5 h-5" />
        <span className="font-semibold text-sm hidden sm:inline group-hover:inline">
          전화 문의
        </span>
      </a>
      {/* 카카오톡 상담 버튼 */}
      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#FEE500] text-[#191919] px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
        aria-label="카카오톡 상담하기"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="font-semibold text-sm hidden sm:inline group-hover:inline">
          카톡 상담
        </span>
      </a>
    </div>
  );
}
