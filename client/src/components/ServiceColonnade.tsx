import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HOME_EASE } from "@/components/HomeMotion";

export type ColonnadeItem = {
  /** 기둥 하단에 표시할 서비스명 (예: "계단청소") */
  title: string;
  /** 서비스명 아래 보조 영문 라벨 (예: "STAIR") */
  en: string;
  /** 펼쳐진 기둥 상단의 짧은 설명 */
  subtitle: string;
  /** 섹션 중앙 헤드라인, "\n"으로 줄을 나눈다 */
  headline: string;
  image: string;
  href: string;
};

type ServiceColonnadeProps = {
  items: ColonnadeItem[];
  /** 헤드라인 위에 놓이는 섹션 제목 영역 */
  header?: ReactNode;
  /** 높이 지정용 클래스 */
  className?: string;
};

// 화면 전체를 채우는 열주(colonnade)형 서비스 섹션 (데스크톱 전용).
// 세로 기둥 중 하나가 넓어지며 사진이 아래에서 차오르고, 이전 기둥의 사진은 위로 걷힌다.
// 섹션 중앙 헤드라인은 기둥이 바뀔 때 위로 굴러 교체된다.
const CANVAS = "#f7f9fc";
const ACTIVE_GROW = 2.6;

export default function ServiceColonnade({ items, header, className = "" }: ServiceColonnadeProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number[]>([]);

  const wipe = reduced ? 0 : 0.7;
  const roll = reduced ? 0 : 0.6;
  const current = items[active];

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
                className="absolute inset-x-0 top-0 h-[62%]"
                style={{
                  background: `linear-gradient(to bottom, ${CANVAS} 0%, ${CANVAS}eb 24%, ${CANVAS}99 46%, ${CANVAS}00 100%)`,
                }}
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

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 lg:p-8">
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
            </div>
          </Link>
        );
      })}

      {/* 섹션 제목 + 중앙 헤드라인 — 기둥이 바뀌면 헤드라인이 위로 굴러 교체 */}
      <div className="pointer-events-none absolute inset-x-0 top-[10%] z-20 flex flex-col items-center px-6 text-center">
        {header}
        <div className="relative mt-5 w-full lg:mt-6">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="absolute inset-x-0 top-0 flex flex-col items-center"
              initial="enter"
              animate="center"
              exit="leave"
              variants={{ enter: {}, center: {}, leave: {} }}
            >
              {current.headline.split("\n").map((line, lineIndex) => (
                <span key={lineIndex} className="block overflow-hidden py-[0.06em]">
                  <motion.span
                    className="block whitespace-nowrap font-['GmarketSans'] text-[clamp(2rem,3.9vw,3.75rem)] font-bold leading-[1.18] text-foreground"
                    variants={{
                      enter: { y: "110%", opacity: 0 },
                      center: {
                        y: "0%",
                        opacity: 1,
                        transition: { duration: roll, delay: reduced ? 0 : 0.08 + lineIndex * 0.07, ease: HOME_EASE },
                      },
                      leave: {
                        y: "-110%",
                        opacity: 0,
                        transition: { duration: reduced ? 0 : 0.45, delay: reduced ? 0 : lineIndex * 0.04, ease: HOME_EASE },
                      },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}

              <motion.div
                className="mt-6 lg:mt-8"
                variants={{
                  enter: { y: 10, opacity: 0 },
                  center: { y: 0, opacity: 1, transition: { duration: roll, delay: reduced ? 0 : 0.22, ease: HOME_EASE } },
                  leave: { opacity: 0, transition: { duration: reduced ? 0 : 0.25 } },
                }}
              >
                <Link
                  href={current.href}
                  className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/85 px-5 py-2.5 text-sm font-bold text-foreground shadow-sm backdrop-blur-sm transition hover:border-primary/30 hover:bg-white hover:text-primary lg:px-6 lg:py-3 lg:text-[15px]"
                >
                  자세히 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
