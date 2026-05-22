import { MessageCircle, Phone } from "lucide-react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

export default function KakaoChat() {
  return (
    <div className="fixed inset-x-3 bottom-3 md:inset-x-auto md:right-6 md:bottom-6 z-50 rounded-[1.35rem] bg-white/88 p-1.5 shadow-xl ring-1 ring-blue-100/80 backdrop-blur md:bg-transparent md:p-0 md:shadow-none md:ring-0 grid grid-cols-2 gap-1.5 md:flex md:flex-col md:items-end md:gap-3">
      <a
        href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-4 text-base font-extrabold text-white shadow-md transition-colors duration-200 hover:bg-primary/90 md:px-5 md:shadow-lg"
        aria-label="전화 문의하기"
      >
        <Phone className="h-5 w-5 stroke-[2.8]" />
        <span>전화 문의</span>
      </a>

      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-4 text-base font-extrabold text-[#191919] shadow-md ring-1 ring-black/5 transition-colors duration-200 hover:bg-[#F4DC00] md:px-5 md:shadow-lg"
        aria-label="카카오톡 상담하기"
      >
        <MessageCircle className="h-5 w-5 stroke-[2.8]" />
        <span>카톡 상담</span>
      </a>
    </div>
  );
}
