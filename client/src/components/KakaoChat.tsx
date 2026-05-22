import { MessageCircle, Phone } from "lucide-react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

export default function KakaoChat() {
  return (
    <div className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-6 md:bottom-6 z-50 grid grid-cols-2 gap-2 md:flex md:flex-col md:items-end md:gap-3">
      <a
        href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
        className="flex h-14 items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-white px-4 text-base font-extrabold text-primary shadow-lg transition-colors duration-200 hover:border-primary/35 hover:bg-blue-50 md:h-13 md:px-5"
        aria-label="전화 문의하기"
      >
        <Phone className="h-5 w-5 stroke-[2.8]" />
        <span>전화 문의</span>
      </a>

      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-4 text-base font-extrabold text-[#191919] shadow-lg ring-1 ring-black/5 transition-colors duration-200 hover:bg-[#F4DC00] md:h-13 md:px-5"
        aria-label="카카오톡 상담하기"
      >
        <MessageCircle className="h-5 w-5 stroke-[2.8]" />
        <span>카톡 상담</span>
      </a>
    </div>
  );
}
