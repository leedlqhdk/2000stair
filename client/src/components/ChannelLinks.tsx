import { Instagram, Play } from "lucide-react";
import { trackConversion } from "@/lib/analytics";

// 당근 로고 (흰 당근핀 + 주황 원 배경용)
export function DaangnLogoWhite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="29" cy="9" rx="6.5" ry="4.4" transform="rotate(-28 29 9)" fill="#ffffff" />
      <path
        d="M24 14 C32 14 38 20 38 27 C38 34.5 29 42 24 46 C19 42 10 34.5 10 27 C10 20 16 14 24 14 Z"
        fill="#ffffff"
      />
      <circle cx="24" cy="27.5" r="5.4" fill="#ff6f0f" />
    </svg>
  );
}

// 당근 로고 (흰 배경 카드용 — 주황 당근핀)
export function DaangnLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="29" cy="8" rx="7" ry="4.8" transform="rotate(-28 29 8)" fill="#26a96c" />
      <path
        d="M24 13.5 C32.6 13.5 38.8 19.8 38.8 27.4 C38.8 35.4 29.4 42.8 24 47 C18.6 42.8 9.2 35.4 9.2 27.4 C9.2 19.8 15.4 13.5 24 13.5 Z"
        fill="#ff6f0f"
      />
      <circle cx="24" cy="27" r="6" fill="#ffffff" />
    </svg>
  );
}

type Channel = {
  key: string;
  label: string;
  href: string;
  circleClass: string;
};

// 공식 채널: 네이버 블로그 · 유튜브 · 인스타그램 · 당근
export const OFFICIAL_CHANNELS: readonly Channel[] = [
  {
    key: "blog",
    label: "네이버블로그",
    href: "https://blog.naver.com/icheonstair",
    circleClass: "bg-black",
  },
  {
    key: "youtube",
    label: "유튜브",
    href: "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU",
    circleClass: "bg-[#ff0000]",
  },
  {
    key: "instagram",
    label: "인스타그램",
    href: "https://www.instagram.com/icheon_stair/",
    circleClass: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]",
  },
  {
    key: "daangn",
    label: "당근",
    href: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
    circleClass: "bg-[#ff6f0f]",
  },
] as const;

function ChannelIcon({ channelKey }: { channelKey: string }) {
  switch (channelKey) {
    case "blog":
      return (
        <span className="flex items-center gap-[3px] leading-none text-[#00c73c]">
          <span className="font-['GmarketSans'] text-[19px] font-extrabold">b</span>
          <span className="h-[15px] w-px rounded-full bg-[#00c73c]" />
        </span>
      );
    case "youtube":
      return <Play className="h-5 w-5 translate-x-[1px] fill-white text-white" />;
    case "instagram":
      return <Instagram className="h-6 w-6 text-white" strokeWidth={2.2} />;
    case "daangn":
      return <DaangnLogoWhite className="h-6 w-6" />;
    default:
      return null;
  }
}

export default function ChannelLinks({
  location,
  channels = OFFICIAL_CHANNELS,
}: {
  location: string;
  channels?: readonly Channel[];
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {channels.map((channel) => (
        <a
          key={channel.key}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion("review_click", { location, label: channel.label })}
          className="flex flex-col items-center gap-2"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition active:scale-95 ${channel.circleClass}`}
          >
            <ChannelIcon channelKey={channel.key} />
          </span>
          <span className="text-center text-[11.5px] font-bold text-foreground">{channel.label}</span>
        </a>
      ))}
    </div>
  );
}
