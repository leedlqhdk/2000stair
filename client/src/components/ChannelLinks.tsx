import { Instagram } from "lucide-react";
import { trackConversion } from "@/lib/analytics";

// 당근 공식 앱 로고 모양(주황 당근핀 + 초록 잎)을 인라인 SVG로 재현
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
  badge: string;
  badgeClass: string;
};

export const OFFICIAL_CHANNELS: readonly Channel[] = [
  {
    key: "blog",
    label: "네이버 블로그",
    href: "https://blog.naver.com/icheonstair",
    badge: "N",
    badgeClass: "bg-[#03c75a]",
  },
  {
    key: "daangn",
    label: "당근마켓",
    href: "https://www.daangn.com/kr/local-profile/%EC%9D%B4%EC%B2%9C%EA%B3%84%EB%8B%A8%EC%A7%80%EA%B8%B0-umrc7zg26w1h/",
    badge: "",
    badgeClass: "border border-slate-200 bg-white",
  },
  {
    key: "youtube",
    label: "유튜브",
    href: "https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU",
    badge: "▶",
    badgeClass: "bg-[#ff0000]",
  },
] as const;

export const INSTAGRAM_CHANNEL: Channel = {
  key: "instagram",
  label: "인스타그램",
  href: "https://www.instagram.com/icheon_stair/",
  badge: "",
  badgeClass: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
};

export default function ChannelLinks({
  location,
  channels = OFFICIAL_CHANNELS,
}: {
  location: string;
  channels?: readonly Channel[];
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {channels.map((channel) => (
        <a
          key={channel.key}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion("review_click", { location, label: channel.label })}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-blue-100 bg-white px-2 py-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition hover:border-blue-300 active:scale-[0.98]"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm ${channel.badgeClass}`}
          >
            {channel.key === "instagram" ? (
              <Instagram className="h-4.5 w-4.5" strokeWidth={2.4} />
            ) : channel.key === "daangn" ? (
              <DaangnLogo className="h-6 w-6" />
            ) : (
              channel.badge
            )}
          </span>
          <span className="text-[12.5px] font-extrabold text-foreground">{channel.label}</span>
        </a>
      ))}
    </div>
  );
}
