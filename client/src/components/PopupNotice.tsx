import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/** 공지 교체 시 이 키를 함께 변경하면 이전에 "오늘 하루 닫기"한 사용자도 새 공지를 본다. */
const STORAGE_KEY = "popup_notice_2026_08";
const KAKAO_URL = "https://pf.kakao.com/_IiNfn";
const PHONE_LABEL = "010-8438-1887";
const EASE = [0.22, 1, 0.36, 1] as const;

function nextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

function isSuppressedToday() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

const CheckBadge = ({ size = 22 }: { size?: number }) => (
  <span
    className="flex shrink-0 items-center justify-center rounded-full bg-[#3155A4] font-bold text-white"
    style={{ width: size, height: size, fontSize: 13, lineHeight: 1 }}
    aria-hidden
  >
    ✓
  </span>
);

export default function PopupNotice() {
  const [open, setOpen] = useState(() => !isSuppressedToday());
  const [suppressToday, setSuppressToday] = useState(false);
  const reduce = useReducedMotion();
  const scrimRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (suppressToday) {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(nextMidnight()));
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
  };

  // body 스크롤 잠금 + Esc 닫기 + 포커스 트랩 + 진입 포커스
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        scrimRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const list = focusables();
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => focusables()[0]?.focus(), 40);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, suppressToday]);

  const scrimAnim = reduce
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.38, ease: "easeOut" as const } };
  const panelAnim = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.99 },
        transition: { duration: 0.62, ease: EASE },
      };

  const Eyebrow = (
    <p className="font-['Plus_Jakarta_Sans'] font-extrabold uppercase tracking-[0.28em] text-[#3155A4]">
      NOTICE
    </p>
  );

  const Checkbox = (
    <label className="flex cursor-pointer select-none items-center gap-2 text-[#7A8698]">
      <input
        type="checkbox"
        checked={suppressToday}
        onChange={(e) => setSuppressToday(e.target.checked)}
        className="cursor-pointer accent-[#3155A4]"
      />
      오늘 하루 이 창을 열지 않기
    </label>
  );

  const Phone = (
    <a
      href="tel:01084381887"
      className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#3155A4]"
    >
      {PHONE_LABEL}
    </a>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="notice-scrim"
          ref={scrimRef}
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 md:items-center md:p-0"
          style={{ background: "rgba(13,25,48,0.52)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          {...scrimAnim}
        >
          {/* ───────── PC: 중앙 모달 ───────── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-title"
            className="relative hidden w-[600px] overflow-hidden border border-[#E4EDFB] bg-white md:block"
            style={{ borderRadius: 25, boxShadow: "0 30px 70px rgba(15,76,169,0.28)" }}
            {...panelAnim}
          >
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="absolute right-[14px] top-[14px] flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E4EDFB] bg-white text-[#7A8698] transition-colors duration-200 hover:bg-[#F4F8FF] hover:text-[#3155A4]"
              style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
            >
              <X size={15} strokeWidth={2} />
            </button>

            <div className="flex items-start gap-[18px] px-8 pb-5 pt-7">
              <div className="flex flex-1 flex-col gap-[10px]">
                <div className="text-[12px] leading-none">{Eyebrow}</div>
                <h2
                  id="notice-title"
                  className="font-['GmarketSans'] font-bold text-[#14181F]"
                  style={{ fontSize: 25, lineHeight: 1.35, letterSpacing: "0.01em", textWrap: "pretty" }}
                >
                  공장청소 · 화장실청소
                  <br />
                  문의 접수 중단 안내
                </h2>
                <div
                  className="flex flex-col gap-[5px] text-[#5C6878]"
                  style={{ fontSize: 15, lineHeight: 1.62 }}
                >
                  <p className="font-bold text-[#14181F]">많은 성원에 진심으로 감사드립니다.</p>
                  <p>
                    당분간 <strong className="font-bold text-[#14181F]">공장청소 · 화장실청소</strong> 문의는 받지 않습니다.
                  </p>
                  <p>기존 관리 고객분들께 집중하기 위해, 무리하게 관리 구역을 늘리지 않기로 했습니다.</p>
                </div>
              </div>

              <div className="w-[172px] pt-1.5">
                <img
                  src="/character-wife.png"
                  alt="이천계단지기 캐릭터"
                  className="h-[192px] w-full"
                  style={{ objectFit: "contain", objectPosition: "bottom" }}
                />
                <p
                  className="mt-1 text-center font-bold text-[#3155A4]"
                  style={{ fontSize: 12, letterSpacing: "0.02em" }}
                >
                  부부가 직접 관리
                </p>
              </div>
            </div>

            <div className="mx-8 mb-[14px] flex items-stretch gap-2" style={{ height: 40 }}>
              <div
                className="flex flex-1 items-center gap-[10px] border border-[#D9E6FA] bg-[#F4F8FF] px-4"
                style={{ borderRadius: 12 }}
              >
                <CheckBadge />
                <span className="font-bold text-[#14181F]" style={{ fontSize: 15, lineHeight: 1.4 }}>
                  계단청소 문의는 그대로 가능합니다.
                </span>
              </div>
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center whitespace-nowrap bg-[#3155A4] px-[18px] font-bold text-white transition-colors duration-200 hover:bg-[#284a8f]"
                style={{ borderRadius: 12, fontSize: 14 }}
              >
                계단청소 카톡 문의
              </a>
              <button
                type="button"
                onClick={close}
                className="flex items-center justify-center whitespace-nowrap border border-[#E4EDFB] bg-white px-[18px] font-bold text-[#3155A4] transition-colors duration-200 hover:bg-[#F4F8FF]"
                style={{ borderRadius: 12, fontSize: 14 }}
              >
                닫기
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[#E4EDFB] bg-[#FCFDFF] px-8 py-[9px]">
              <div className="text-[13px] font-medium">{Checkbox}</div>
              <div className="text-[16px]">{Phone}</div>
            </div>
          </motion.div>

          {/* ───────── Mobile: 하단 시트 ───────── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-title-m"
            className="relative w-full overflow-hidden border border-[#E4EDFB] bg-white md:hidden"
            style={{ borderRadius: 25, boxShadow: "0 24px 56px rgba(15,76,169,0.3)" }}
            {...panelAnim}
          >
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              className="absolute right-3 top-3 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E4EDFB] bg-white text-[#7A8698] transition-colors hover:bg-[#F4F8FF] hover:text-[#3155A4]"
            >
              <X size={15} strokeWidth={2} />
            </button>

            <div className="px-5 pt-5">
              <div className="flex flex-col gap-[6px]">
                <p className="font-['Plus_Jakarta_Sans'] text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#3155A4]">
                  NOTICE
                </p>
                <h2
                  id="notice-title-m"
                  className="font-['GmarketSans'] font-bold text-[#14181F]"
                  style={{ fontSize: 20, lineHeight: 1.38 }}
                >
                  공장청소 · 화장실청소
                  <br />
                  문의 접수 중단 안내
                </h2>
              </div>
            </div>

            <div
              className="flex flex-col gap-[5px] px-5 pt-3 text-[#5C6878]"
              style={{ fontSize: 14, lineHeight: 1.62 }}
            >
              <p className="font-bold text-[#14181F]">많은 성원에 진심으로 감사드립니다.</p>
              <p>
                당분간 <strong className="font-bold text-[#14181F]">공장청소 · 화장실청소</strong> 문의는 받지 않습니다. 기존 관리 고객분들께 집중하기 위해, 무리하게 관리 구역을 늘리지 않기로 했습니다.
              </p>
            </div>

            <div
              className="mx-5 mt-3 flex items-center gap-[10px] border border-[#D9E6FA] bg-[#F4F8FF] px-[14px] py-[11px]"
              style={{ borderRadius: 16 }}
            >
              <CheckBadge />
              <span className="font-bold text-[#14181F]" style={{ fontSize: 14, lineHeight: 1.4 }}>
                계단청소 문의는 그대로 가능합니다.
              </span>
            </div>

            <div className="flex gap-2 px-5 py-[10px]">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center bg-[#3155A4] font-bold text-white transition-colors hover:bg-[#284a8f]"
                style={{ height: 32, borderRadius: 12, fontSize: 13 }}
              >
                계단청소 카톡 문의
              </a>
              <button
                type="button"
                onClick={close}
                className="flex items-center justify-center border border-[#E4EDFB] bg-white font-bold text-[#3155A4] transition-colors hover:bg-[#F4F8FF]"
                style={{ width: 86, height: 32, borderRadius: 12, fontSize: 13 }}
              >
                닫기
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[#E4EDFB] bg-[#FCFDFF] px-5 py-2">
              <label className="flex cursor-pointer select-none items-center gap-1.5 text-[12px] font-medium text-[#7A8698]">
                <input
                  type="checkbox"
                  checked={suppressToday}
                  onChange={(e) => setSuppressToday(e.target.checked)}
                  className="h-[14px] w-[14px] cursor-pointer accent-[#3155A4]"
                />
                오늘 하루 열지 않기
              </label>
              <a href="tel:01084381887" className="font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#3155A4]">
                {PHONE_LABEL}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
