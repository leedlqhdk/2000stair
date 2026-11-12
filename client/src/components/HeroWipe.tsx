import { useEffect, useRef, useState } from "react";
import { Hand } from "lucide-react";

type HeroWipeProps = {
  /** 사진 경로 앞부분. `${base}-before-${너비}.webp`, `${base}-after-${너비}.webp`를 쓴다 */
  base: string;
  widths: number[];
  /** 청소 후 사진 설명 */
  alt: string;
  reduced: boolean;
  /** 두 사진을 다 받아 화면에 그렸을 때 (다음 장면 사진을 받기 시작하는 신호) */
  onReady?: () => void;
};

// 닦는 붓 크기: 화면 너비의 7% (64~120px)
const BRUSH_RATIO = 0.07;
const BRUSH_MIN = 64;
const BRUSH_MAX = 120;
// 마지막으로 닦은 뒤 이만큼 지나면 먼지가 천천히 다시 덮인다 (정기관리가 필요한 이유처럼, 다시 닦아볼 수 있게)
const RESTORE_DELAY_MS = 3500;
const RESTORE_FRAMES = 70;
// 처음 한 번 저절로 닦이는 길 (화면 비율 좌표). 녹 얼룩 위를 지그재그로 문지른다
const DEMO_PATH: Array<[number, number]> = [
  [0.2, 0.3],
  [0.47, 0.22],
  [0.3, 0.41],
  [0.57, 0.33],
  [0.4, 0.5],
];
const DEMO_MS = 1500;
// 사용자가 이만큼(화면 px) 문지르면 안내 문구를 거둔다
const HINT_DONE_DISTANCE = 260;

// PC 첫 화면 1번 장면: 청소 전 사진이 깔려 있고, 마우스로 문지르는 자리마다 청소 후 모습이 드러난다.
// 청소 전 사진은 캔버스에 그려 붓 모양으로 지우고(destination-out), 그 아래에 청소 후 사진(<img>)을 깐다.
// 두 사진은 같은 자리에서 찍은 것을 바닥 무늬 기준으로 겹치게 맞춰 둬서, 닦인 경계에서 무늬가 어긋나지 않는다.
export default function HeroWipe({ base, widths, alt, reduced, onReady }: HeroWipeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beforeRef = useRef<HTMLImageElement>(null);
  const afterRef = useRef<HTMLImageElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState<"waiting" | "shown" | "done">("waiting");

  const srcSet = (kind: "before" | "after") => widths.map((width) => `${base}-${kind}-${width}.webp ${width}w`).join(", ");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !before || !after || !ctx) return;

    let disposed = false;
    let drawn = false;
    let dpr = 1;
    let radius = 0;
    let last: { x: number; y: number } | null = null;
    let restoreTimer = 0;
    let restoreRaf = 0;
    let demoRaf = 0;
    let wipedDistance = 0;
    let hintDone = false;

    // 사진을 object-fit: cover와 같은 방식(가운데 기준)으로 캔버스에 채워, 아래 청소 후 사진과 위치를 맞춘다
    const drawBefore = (alpha = 1) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / before.naturalWidth, ch / before.naturalHeight);
      const w = before.naturalWidth * scale;
      const h = before.naturalHeight * scale;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = alpha;
      ctx.drawImage(before, (cw - w) / 2, (ch - h) / 2, w, h);
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(wrap.clientWidth * dpr);
      canvas.height = Math.round(wrap.clientHeight * dpr);
      radius = Math.max(BRUSH_MIN, Math.min(BRUSH_MAX, wrap.clientWidth * BRUSH_RATIO)) * dpr;
      // 사이트 공통 커서가 이 위에서 붓 크기 원으로 바뀐다
      wrap.dataset.cursorSize = String(Math.round((radius / dpr) * 2));
      if (drawn) drawBefore();
    };

    // 가운데는 완전히, 가장자리는 부드럽게 지워지는 둥근 붓
    const stamp = (x: number, y: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(0.55, "rgba(0,0,0,0.85)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    // 빠르게 움직여도 붓 자국이 끊기지 않게 지난 위치에서 지금 위치까지 촘촘히 찍는다
    const wipeTo = (x: number, y: number) => {
      if (!last) {
        stamp(x, y);
        last = { x, y };
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (radius * 0.3)));
      for (let i = 1; i <= steps; i++) stamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
      last = { x, y };
    };

    const stopRestore = () => {
      window.clearTimeout(restoreTimer);
      cancelAnimationFrame(restoreRaf);
    };
    const scheduleRestore = () => {
      stopRestore();
      if (reduced) return;
      restoreTimer = window.setTimeout(() => {
        let frames = 0;
        const step = () => {
          if (disposed) return;
          drawBefore(0.06);
          frames += 1;
          if (frames < RESTORE_FRAMES) restoreRaf = requestAnimationFrame(step);
          else drawBefore(1);
        };
        restoreRaf = requestAnimationFrame(step);
      }, RESTORE_DELAY_MS);
    };

    const playDemo = () => {
      const startedAt = performance.now();
      const segments = DEMO_PATH.length - 1;
      last = null;
      const step = (now: number) => {
        if (disposed) return;
        const t = Math.min(1, (now - startedAt) / DEMO_MS);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const position = eased * segments;
        const index = Math.min(segments - 1, Math.floor(position));
        const local = position - index;
        const [x0, y0] = DEMO_PATH[index];
        const [x1, y1] = DEMO_PATH[index + 1];
        wipeTo((x0 + (x1 - x0) * local) * canvas.width, (y0 + (y1 - y0) * local) * canvas.height);
        if (t < 1) demoRaf = requestAnimationFrame(step);
        else {
          last = null;
          setHint((current) => (current === "waiting" ? "shown" : current));
        }
      };
      demoRaf = requestAnimationFrame(step);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drawn) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(demoRaf);
      stopRestore();
      const previous = last;
      wipeTo(x * dpr, y * dpr);
      if (previous && !hintDone) {
        wipedDistance += Math.hypot(x * dpr - previous.x, y * dpr - previous.y) / dpr;
        if (wipedDistance > HINT_DONE_DISTANCE) {
          hintDone = true;
          setHint("done");
        }
      }
      scheduleRestore();
    };
    const onPointerLeave = () => {
      last = null;
    };

    const start = async () => {
      // 두 사진을 다 받은 뒤에 그려야, 청소 후 사진이 먼저 보였다가 더러워지는 일이 없다
      await Promise.all([before.decode(), after.decode()]).catch(() => undefined);
      if (disposed || !before.naturalWidth) return;
      resize();
      drawBefore();
      drawn = true;
      setReady(true);
      onReadyRef.current?.();
      if (reduced) setHint("shown");
      else window.setTimeout(() => !disposed && playDemo(), 900);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    void start();

    return () => {
      disposed = true;
      stopRestore();
      cancelAnimationFrame(demoRaf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      // 마우스 자리에는 사이트 공통 커서가 붓 크기 원으로 바뀐다. 터치는 세로 스크롤을 그대로 두고 옆으로 문지를 때만 닦인다
      data-cursor="brush"
      className={`absolute inset-0 transition-opacity duration-700 pointer-fine:cursor-none ${ready ? "opacity-100" : "opacity-0"}`}
      style={{ touchAction: "pan-y" }}
    >
      <img
        ref={afterRef}
        src={`${base}-after-1920.webp`}
        srcSet={srcSet("after")}
        sizes="100vw"
        alt={alt}
        width={1920}
        height={1080}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 캔버스에 그릴 청소 전 사진 (화면 크기에 맞는 후보를 브라우저가 고르게 img로 받는다) */}
      <img
        ref={beforeRef}
        src={`${base}-before-1920.webp`}
        srcSet={srcSet("before")}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="hidden"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[24%] z-20 -translate-x-1/2 transition-all duration-500 ${
          hint === "shown" ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <p className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white/90 px-5 py-3 text-sm font-bold text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.25)] backdrop-blur">
          <Hand className="h-4 w-4 text-primary" />
          마우스로 바닥을 문질러 보세요
          <span className="font-semibold text-slate-500">청소 전 → 후</span>
        </p>
      </div>
    </div>
  );
}
