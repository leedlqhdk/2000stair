import { useState } from "react";
import { Link } from "wouter";
import { MapPin, ArrowRight, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

// ── 지역 → 페이지 URL 매핑 ──────────────────────────────────────────
const REGION_LINKS: Record<string, string> = {
  증포동: "/area/downtown",
  창전동: "/area/downtown",
  중리동: "/area/downtown",
  관고동: "/area/downtown",
  부발읍: "/area/bubal",
  신둔면: "/area/sindun",
  백사면: "/area/baeksa",
  마장면: "/area/majang",
  대월면: "/area/daewol",
};

const DONG = ["증포동", "창전동", "중리동", "관고동"];

const MAP_REGIONS = [
  "증포동", "창전동", "중리동", "관고동",
  "부발읍", "신둔면", "백사면", "마장면", "대월면",
];

const DONG_LIST = ["증포동", "창전동", "중리동", "관고동"];
const EUP_LIST  = ["부발읍", "장호원읍"];
const MYEON_LIST = ["신둔면", "백사면", "마장면", "호법면", "대월면", "모가면", "설성면", "율면"];

const LABEL_POS: Record<string, { cx: number; cy: number; sm?: boolean }> = {
  신둔면: { cx: 176, cy: 190 },
  백사면: { cx: 338, cy: 121 },
  부발읍: { cx: 510, cy: 270 },
  마장면: { cx: 160, cy: 437 },
  증포동: { cx: 343, cy: 310, sm: true },
  창전동: { cx: 311, cy: 396, sm: true },
  중리동: { cx: 362, cy: 390, sm: true },
  관고동: { cx: 318, cy: 451, sm: true },
  대월면: { cx: 320, cy: 620 },
};

const SVG_PATHS: Record<string, string> = {
  신둔면: "M 0.0,0.0 L 176.1,0.0 L 249.5,68.9 L 278.8,172.2 L 308.2,258.3 L 264.2,327.2 L 132.1,378.9 L 0.0,292.8 Z",
  백사면: "M 176.1,0.0 L 454.9,0.0 L 469.6,155.0 L 381.5,241.1 L 293.5,258.3 L 249.5,68.9 Z",
  부발읍: "M 454.9,0.0 L 645.7,0.0 L 645.7,499.5 L 528.3,516.7 L 425.6,447.8 L 366.9,378.9 L 366.9,310.0 L 381.5,241.1 L 469.6,155.0 Z",
  마장면: "M 0.0,292.8 L 132.1,378.9 L 264.2,327.2 L 308.2,361.7 L 308.2,499.5 L 234.8,568.4 L 88.1,568.4 L 0.0,499.5 Z",
  증포동: "M 308.2,258.3 L 381.5,258.3 L 381.5,327.2 L 337.5,361.7 L 308.2,361.7 Z",
  창전동: "M 308.2,361.7 L 337.5,361.7 L 337.5,430.6 L 293.5,430.6 L 278.8,396.1 Z",
  중리동: "M 337.5,361.7 L 381.5,327.2 L 381.5,396.1 L 366.9,430.6 L 337.5,430.6 Z",
  관고동: "M 278.8,396.1 L 293.5,430.6 L 366.9,430.6 L 366.9,482.3 L 322.9,499.5 L 278.8,465.0 Z",
  대월면: "M 234.8,568.4 L 308.2,499.5 L 322.9,499.5 L 366.9,482.3 L 425.6,447.8 L 528.3,516.7 L 645.7,499.5 L 645.7,740.6 L 0.0,740.6 L 0.0,499.5 L 88.1,568.4 Z",
};
function InteractiveMap({ activeRegion, onEnter, onLeave, onClick }: {
  activeRegion: string | null;
  onEnter: (name: string) => void;
  onLeave: () => void;
  onClick: (name: string) => void;
}) {
  return (
    <svg viewBox="0 0 645.7 740.6" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
      {MAP_REGIONS.map((name) => {
        const isDong = DONG.includes(name);
        const isActive = activeRegion === name;
        return (
          <path key={name} id={name} d={SVG_PATHS[name]} data-region={name} className="cursor-pointer"
            style={{
              fill: isActive ? "var(--primary)" : isDong ? "#e4eefc" : "#ffffff",
              stroke: isActive ? "var(--primary)" : "#c9d8f5",
              strokeWidth: 1.4,
              transition: "fill 0.18s ease, stroke 0.18s ease",
            }}
            onMouseEnter={() => onEnter(name)} onMouseLeave={onLeave} onClick={() => onClick(name)}
          />
        );
      })}
      {MAP_REGIONS.map((name) => {
        const pos = LABEL_POS[name];
        if (!pos) return null;
        const isActive = activeRegion === name;
        const isSm = pos.sm;
        return (
          <g key={`label-${name}`} style={{ pointerEvents: "none" }}>
            {isSm && <circle cx={pos.cx} cy={pos.cy - 9} r={2.6} fill="var(--primary)" />}
            <text x={pos.cx} y={pos.cy + (isSm ? 4 : 6)} textAnchor="middle"
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: isSm ? 13 : 19,
                fill: isActive ? "var(--primary)" : "var(--foreground)",
                paintOrder: "stroke" as "stroke", stroke: "#ffffff", strokeWidth: 3,
                strokeLinejoin: "round" as "round", transition: "fill 0.18s ease",
              }}>
              {name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RegionLink({ name, active, onEnter, onLeave }: {
  name: string; active: boolean; onEnter: () => void; onLeave: () => void;
}) {
  const href = REGION_LINKS[name];
  const isDong = DONG.includes(name);
  const baseStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    height: 46, padding: "0 14px 0 16px", borderRadius: 12,
    border: `1px solid ${active ? "var(--primary)" : "var(--blue-100, #e4ecfb)"}`,
    background: active ? (isDong ? "#dceafc" : "var(--blue-50, #f4f8ff)") : (isDong ? "var(--blue-50, #f4f8ff)" : "#ffffff"),
    textDecoration: "none", cursor: "pointer", transition: "all 0.16s ease",
  };
  return (
    <Link href={href ?? "#"}>
      <a style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: active ? "var(--primary)" : "var(--foreground)", transition: "color 0.16s ease" }}>
          {name}
        </span>
        <span style={{ color: active ? "var(--primary)" : "#9db8ec", transform: active ? "translateX(2px)" : "translateX(0)", transition: "transform 0.16s ease, color 0.16s ease", display: "flex" }}>
          <ArrowRight size={16} />
        </span>
      </a>
    </Link>
  );
}

function RegionChip({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const href = REGION_LINKS[name];
  const isDong = DONG.includes(name);
  const chip = (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: size === "sm" ? "0 15px" : "0 18px", height: size === "sm" ? 40 : 46,
      borderRadius: 999, border: isDong ? "1px solid var(--primary)" : "1px solid var(--blue-100, #e4ecfb)",
      background: isDong ? "var(--primary)" : "#ffffff", fontSize: size === "sm" ? 14 : 15, fontWeight: 700,
      color: isDong ? "#ffffff" : "var(--foreground)", boxShadow: isDong ? "var(--shadow-card)" : undefined,
      cursor: href ? "pointer" : "default", textDecoration: "none", whiteSpace: "nowrap" as const,
    }}>
      {name}
    </span>
  );
  if (href) return <Link href={href}><a style={{ textDecoration: "none" }}>{chip}</a></Link>;
  return chip;
}

function GroupHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.02em", color: "var(--muted-foreground)", marginBottom: 10 }}>
      {label}
      {count !== undefined && (
        <span style={{ color: "var(--primary)", background: "var(--blue-50, #f4f8ff)", border: "1px solid var(--blue-100, #e4ecfb)", padding: "2px 9px", borderRadius: 999, fontSize: 11.5 }}>
          {count}
        </span>
      )}
      <span style={{ flex: 1, height: 1, background: "var(--blue-100, #e4ecfb)" }} />
    </div>
  );
}
export default function Areas() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  function handleNavigate(name: string) {
    const url = REGION_LINKS[name];
    if (url) window.location.href = url;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      {/* ── 데스크톱: 인터랙티브 지도 (lg 이상) */}
      <main className="hidden lg:block">
        <div className="container max-w-6xl pt-24 pb-20">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.32fr 1fr", gap: 40, alignItems: "start" }}>
              {/* 좌측: 지도 카드 */}
              <div style={{ position: "relative", background: "radial-gradient(120% 120% at 30% 10%, #f4f8ff 0%, var(--blue-50, #f4f8ff) 60%, #eaf1fc 100%)", border: "1px solid var(--blue-100, #e4ecfb)", borderRadius: "var(--radius-card, 1.25rem)", padding: 18, boxShadow: "var(--shadow-card)" }}>
                <InteractiveMap activeRegion={activeRegion} onEnter={setActiveRegion} onLeave={() => setActiveRegion(null)} onClick={handleNavigate} />
                <div style={{ position: "absolute", left: 26, bottom: 24, display: "flex", gap: 16, alignItems: "center", background: "rgba(255,255,255,0.9)", border: "1px solid var(--blue-100, #e4ecfb)", borderRadius: 999, padding: "8px 16px", backdropFilter: "blur(4px)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "var(--muted-foreground)" }}>
                    <span style={{ width: 14, height: 14, borderRadius: 5, background: "var(--primary)", border: "1px solid var(--blue-100, #e4ecfb)", flexShrink: 0 }} />
                    시내 (동지역)
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "var(--muted-foreground)" }}>
                    <span style={{ width: 14, height: 14, borderRadius: 5, background: "#ffffff", border: "1px solid var(--blue-100, #e4ecfb)", flexShrink: 0 }} />
                    읍·면
                  </span>
                </div>
              </div>

              {/* 우측: 지역 목록 */}
              <div>
                <div style={{ marginBottom: 18 }}>
                  <p className="text-xs font-extrabold tracking-[0.22em] text-primary uppercase mb-3" style={{ fontFamily: "var(--font-eyebrow)" }}>SERVICE AREA</p>
                  <h1 className="text-foreground" style={{ margin: "0 0 8px", fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, lineHeight: 1.25 }}>지역을 선택하세요</h1>
                  <p style={{ margin: 0, fontSize: 14.5, fontWeight: 500, lineHeight: 1.6, color: "var(--muted-foreground)" }}>지도를 누르거나 아래에서 동네를 선택하면 해당 지역 안내 페이지로 이동합니다.</p>
                </div>
                <GroupHeader label="시내 (동지역)" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                  {DONG_LIST.map((name) => (
                    <RegionLink key={name} name={name} active={activeRegion === name} onEnter={() => setActiveRegion(name)} onLeave={() => setActiveRegion(null)} />
                  ))}
                </div>
                <GroupHeader label="읍 · 면" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["부발읍", "신둔면", "백사면", "마장면", "대월면"].map((name) => (
                    <RegionLink key={name} name={name} active={activeRegion === name} onEnter={() => setActiveRegion(name)} onLeave={() => setActiveRegion(null)} />
                  ))}
                </div>
                <div style={{ marginTop: 22, display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 18px", borderRadius: 16, background: "var(--blue-50, #f4f8ff)", border: "1px solid var(--blue-100, #e4ecfb)" }}>
                  <MapPin size={20} style={{ flexShrink: 0, color: "var(--primary)", marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, color: "var(--foreground)" }}>
                    <strong style={{ fontWeight: 800 }}>우리 동네가 지도에 없나요?</strong>{" "}인근 지역도 대부분 방문 가능합니다. 카톡으로 주소를 보내주시면 바로 안내드려요.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── 모바일: 칩 리스트형 (lg 미만) */}
      <main className="block lg:hidden">
        <div className="px-5 pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="flex gap-2 text-xs font-bold text-muted-foreground mb-3 mt-2">
              <Link href="/"><a className="hover:text-primary transition">홈</a></Link>
              <span>·</span>
              <span className="text-primary">방문지역</span>
            </div>
            <h1 className="text-foreground mb-3 leading-snug" style={{ fontFamily: "var(--font-display)", fontSize: 25, fontWeight: 700, lineHeight: 1.26 }}>
              이천이라면 <span className="text-primary">어디든</span><br />부부가 직접 갑니다
            </h1>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground mb-5">14개 읍·면·동 전 지역, 하청 없이 부부가 직접 방문합니다.</p>
            <div className="mb-4">
              <GroupHeader label="시내 (동지역)" />
              <div className="flex flex-wrap gap-2">{DONG_LIST.map((name) => <RegionChip key={name} name={name} size="sm" />)}</div>
            </div>
            <div className="mb-4">
              <GroupHeader label="읍" count={2} />
              <div className="flex flex-wrap gap-2">{EUP_LIST.map((name) => <RegionChip key={name} name={name} size="sm" />)}</div>
            </div>
            <div className="mb-5">
              <GroupHeader label="면" count={8} />
              <div className="flex flex-wrap gap-2">{MYEON_LIST.map((name) => <RegionChip key={name} name={name} size="sm" />)}</div>
            </div>
            <div className="flex gap-3 items-start rounded-2xl mb-6" style={{ padding: "14px 16px", background: "var(--blue-50, #f4f8ff)", border: "1px solid var(--blue-100, #e4ecfb)" }}>
              <MapPin size={18} style={{ flexShrink: 0, color: "var(--primary)", marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.6, color: "var(--foreground)" }}>
                <strong style={{ fontWeight: 800 }}>목록에 없어도</strong> 주소를 보내주시면 방문 가능 여부를 바로 안내드려요.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="https://open.kakao.com/o/sFbfqiJe" target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full font-extrabold text-sm"
                style={{ height: 52, background: "#fee500", color: "#191600", border: "none", textDecoration: "none" }}>
                <MessageCircle size={17} />카톡으로 견적 받기
              </a>
              <a href="tel:01084381887" aria-label="전화 문의" className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white text-primary" style={{ width: 52, height: 52, flexShrink: 0 }}>
                <Phone size={19} />
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
