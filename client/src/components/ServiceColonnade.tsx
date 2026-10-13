import { useState } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HOME_EASE } from "@/components/HomeMotion";

export type ColonnadeItem = {
  /** 기둥 하단에 표시할 서비스명 (예: "계단청소") */
  title: string;
  /** 서비스명 아래 보조 영문 라벨 (예: "STAIR") */
  en: string;
  /** 펼쳐진 기둥 상단의 짧은 설명 */
  subtitle: string;
  image: string;
  href: string;
};

type ServiceColonnadeProps = {
  items: ColonnadeItem[];
  /** 높이 지정용 클래스 */
  className?: string;
};

// 화면 전체를 채우는 열주(colonnade)형 서비스 섹션 (데스크톱 전용).
// 세로 기둥 중 하나가 넓어지며 사진이 아래에서 차오르고, 이전 기둥의 사진은 위로 걷힌다.
const CANVAS = "#f7f9fc";
const ACTIVE_GROW = 2.6;

export default function ServiceColonnade({ items, className = "" }: ServiceColonnadeProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number[]>([]);

  const wipe = reduced ? 0 : 0.7;

  const activate = (index: number) => {
    if (index === active) return;
    setExiting((prev) => [...prev.filter((i) => i !== index), active]);
    setActive(index);
  };

  return (
    <div
      // 하단 플로팅 버튼(전화·카톡, 맨 위로)이 기둥 하단 글자를 가리지 않도록 이 섹션 위에서는 버튼을 줄인다
      data-floating-quiet
      className={`relative flex min-h-[560px] w-full overflow-hidden border-y border-blue-100 ${className}`}
      style={{ backgroundColor: CANVAS, containerType: "inline-size" }}
    >
      {items.map((item, index) => {
        const isActive = index === active;
        const state = isActive ? "active" : exiting.includes(index) ? "exit" : "idle";
        const plainTitle = item.title.replace(/\s/g, "");

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={`이천 ${plainTitle} 정기관리 상세 안내`}
            aria-current={isActive ? "true" : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") activate(index);
            }}
            onFocus={(event) => {
              // 키보드(Tab) 포커스일 때만 펼친다. 마우스·터치로 생긴 포커스까지 펼치면
              // 클릭 시점에 이미 활성 상태가 되어 첫 탭이 곧바로 페이지 이동으로 처리된다.
              if (event.currentTarget.matches(":focus-visible")) activate(index);
            }}
            onClick={(event) => {
              // 터치(태블릿): 첫 탭은 기둥을 펼치고, 펼쳐진 기둥을 다시 누르면 상세 페이지로 이동
              if (!isActive) {
                event.preventDefault();
                activate(index);
              }
            }}
            className={`relative block h-full min-w-0 overflow-hidden outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary motion-reduce:transition-none ${
              index > 0 ? "border-l border-blue-100" : ""
            }`}
            style={{ flexGrow: isActive ? ACTIVE_GROW : 1, flexBasis: 0 }}
          >
            {/* 펼쳐지지 않은 칸에도 사진을 흐리게 깔아 빈칸처럼 보이지 않게 한다 (선명한 사진은 그 위로 차오른다) */}
            <div aria-hidden="true" className="absolute inset-0">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                draggable={false}
                className="absolute inset-y-0 left-1/2 h-full max-w-none -translate-x-1/2 object-cover opacity-50 blur-[1.5px] grayscale-[35%]"
                style={{ width: "max(100%, 47cqw)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to bottom, ${CANVAS}e6 0%, ${CANVAS}59 32%, ${CANVAS}4d 62%, ${CANVAS}cc 100%)` }}
              />
            </div>

            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={state}
              variants={{
                active: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: wipe, ease: HOME_EASE } },
                exit: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: wipe, ease: HOME_EASE } },
                idle: { clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0 } },
              }}
              onAnimationComplete={(definition) => {
                if (definition === "exit") {
                  setExiting((prev) => prev.filter((i) => i !== index));
                }
              }}
            >
              <img
                src={item.image}
                alt={`이천 ${plainTitle} 정기관리 서비스`}
                loading="lazy"
                draggable={false}
                className="absolute inset-y-0 left-1/2 h-full max-w-none -translate-x-1/2 object-cover"
                style={{ width: "max(100%, 47cqw)" }}
              />
              <div
                className="absolute inset-x-0 top-0 h-[28%]"
                style={{ background: `linear-gradient(to bottom, ${CANVAS} 0%, ${CANVAS}d9 30%, ${CANVAS}00 100%)` }}
              />
              <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-slate-950/55 via-slate-950/15 to-transparent" />
            </motion.div>

            <div
              className={`pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-2 whitespace-nowrap text-xs transition-all duration-500 lg:left-8 lg:top-7 lg:text-sm ${
                isActive ? "translate-y-0 opacity-100 delay-200" : "-translate-y-1 opacity-0"
              }`}
            >
              <span className="font-extrabold tabular-nums text-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold text-muted-foreground">{item.subtitle}</span>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 z-10 p-6 lg:p-8">
              <div className="relative w-fit">
                <h3
                  className={`whitespace-nowrap font-['GmarketSans'] text-lg font-extrabold leading-snug transition-colors duration-500 lg:text-xl xl:text-2xl ${
                    isActive ? "text-white" : "text-foreground"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-1.5 text-[11px] font-bold tracking-[0.22em] transition-colors duration-500 lg:text-xs ${
                    isActive ? "text-white/75" : "text-muted-foreground"
                  }`}
                >
                  {item.en}
                </p>
                <span
                  aria-hidden="true"
                  className={`absolute left-full top-1/2 ml-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-500 lg:ml-5 lg:h-11 lg:w-11 ${
                    isActive ? "translate-x-0 opacity-100 delay-300" : "-translate-x-2 opacity-0"
                  }`}
                >
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
