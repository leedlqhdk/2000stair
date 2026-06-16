import { Loader2, Phone, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";
const STAIR_BUILDING_TYPE = "빌라/상가 계단";

type DiagnosisState = {
  buildingType: string;
  floors: string;
  pollution: string;
  cycle: string;
};

type DiagnosisResult = {
  title: string;
  summary: string;
  recommendation: string;
  cta: string;
  source?: "gemini" | "fallback";
  setupRequired?: boolean;
};

const initialDiagnosis: DiagnosisState = {
  buildingType: STAIR_BUILDING_TYPE,
  floors: "2~3층",
  pollution: "보통",
  cycle: "월 4회",
};

const options = {
  buildingType: [STAIR_BUILDING_TYPE, "유리청소", "화장실청소", "사무실청소"],
  floors: ["2~3층", "4층", "5~6층"],
  pollution: ["깨끗한 편", "보통", "오염 심함"],
  cycle: ["월 2회", "월 4회", "상담 후 결정"],
};

const expandedButtonClass = "w-[120px] px-3 md:w-[168px] md:px-5";
const collapsedButtonClass = "w-11 px-0 md:w-14 md:px-0";
const expandedTextClass = "max-w-[72px] opacity-100 md:max-w-[80px]";
const collapsedTextClass = "max-w-0 opacity-0";

const createDiagnosisMessage = (diagnosis: DiagnosisState, result: DiagnosisResult | null) => {
  const rows = [
    "안녕하세요. 이천계단지기 홈페이지 AI 진단 후 문의드립니다.",
    "",
    `[진단 선택]`,
    `건물 유형: ${diagnosis.buildingType}`,
    ...(diagnosis.buildingType === STAIR_BUILDING_TYPE ? [`계단 층수: ${diagnosis.floors}`] : []),
    `오염 상태: ${diagnosis.pollution}`,
    `관리 주기: ${diagnosis.cycle}`,
  ];

  if (result) {
    rows.push("", "[AI 안내]", result.title, result.summary, result.recommendation);
  }

  rows.push("", "건물 사진을 보내드리면 정확한 견적 안내 부탁드립니다.");

  return rows.join("\n");
};

export default function KakaoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const scrollTimer = useRef<number | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>(initialDiagnosis);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimer.current) {
        window.clearTimeout(scrollTimer.current);
      }

      scrollTimer.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 650);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) {
        window.clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  const buttonWidthClass = isScrolling ? collapsedButtonClass : expandedButtonClass;
  const buttonTextClass = isScrolling ? collapsedTextClass : expandedTextClass;
  const buttonGapClass = isScrolling ? "gap-0" : "gap-1 md:gap-2";
  const isStairCleaning = diagnosis.buildingType === STAIR_BUILDING_TYPE;

  const handleChange = (key: keyof DiagnosisState, value: string) => {
    setDiagnosis((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "buildingType" && value === STAIR_BUILDING_TYPE && !prev.floors ? { floors: "2~3층" } : {}),
    }));
    setResult(null);
    setErrorMessage("");
    setCopyMessage("");
  };

  const handleKakaoInquiry = async () => {
    const message = createDiagnosisMessage(diagnosis, result);

    try {
      await navigator.clipboard.writeText(message);
      setCopyMessage("진단 내용이 복사됐어요. 카톡창에서 붙여넣기만 해주세요.");
    } catch (error) {
      console.error(error);
      setCopyMessage("카톡창이 열리면 아래 진단 내용을 복사해서 보내주세요.");
    }

    window.open(KAKAO_CHANNEL_URL, "_blank", "noopener,noreferrer");
  };

  const analyzeBuilding = async () => {
    setIsAnalyzing(true);
    setErrorMessage("");
    setCopyMessage("");

    try {
      const response = await fetch("/api/ai-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diagnosis),
      });

      if (!response.ok) {
        throw new Error("AI diagnosis request failed");
      }

      const data = (await response.json()) as DiagnosisResult;
      setResult(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("AI 진단을 불러오지 못했어요. 잠시 후 다시 눌러주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {!isFooterVisible && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5 md:bottom-6 md:right-6 md:gap-3">
          {!isScrolling && (
            <div className="pointer-events-none mb-1 mr-1 rounded-2xl bg-white/95 px-4 py-3 shadow-lg shadow-blue-900/8 ring-1 ring-blue-100 backdrop-blur">
              <p className="text-center text-xs font-extrabold leading-snug text-slate-700 md:text-sm">
                사진 보내주시면
                <br />
                빠르게 답변드려요 :)
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`flex h-11 items-center justify-center overflow-hidden rounded-full bg-white text-xs font-extrabold text-primary shadow-md shadow-blue-900/5 ring-1 ring-blue-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:h-14 md:text-base ${buttonGapClass} ${buttonWidthClass}`}
            aria-label="AI 관리진단 열기"
          >
            <Sparkles className="h-4 w-4 shrink-0 translate-y-px stroke-[2.8] md:h-5 md:w-5" />
            <span className={`whitespace-nowrap transition-all duration-300 ${buttonTextClass}`}>AI진단</span>
          </button>

          <a
            href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
            className={`flex h-11 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-extrabold text-white shadow-md shadow-blue-900/10 transition-all duration-300 hover:bg-primary/90 md:h-14 md:text-base ${buttonGapClass} ${buttonWidthClass}`}
            aria-label="전화 문의하기"
          >
            <Phone className="h-4 w-4 shrink-0 translate-x-[0.5px] translate-y-[0.5px] stroke-[2.8] md:h-5 md:w-5" />
            <span className={`whitespace-nowrap transition-all duration-300 ${buttonTextClass}`}>전화문의</span>
          </a>

        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 px-4 pb-4 backdrop-blur-sm md:items-center md:pb-0">
          <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-2xl ring-1 ring-blue-100 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5 translate-y-px" />
                  Gemini AI 진단
                </p>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
                  우리 건물 관리 진단
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  조건을 선택하면 AI가 가격표 기준 예상 비용과 상담 방향을 함께 안내해드려요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="AI 관리진단 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4">
              <DiagnosisSelect label="건물 유형" value={diagnosis.buildingType} items={options.buildingType} onChange={(value) => handleChange("buildingType", value)} />
              {isStairCleaning ? (
                <DiagnosisSelect label="계단 층수" value={diagnosis.floors} items={options.floors} onChange={(value) => handleChange("floors", value)} />
              ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600 ring-1 ring-slate-200">
                  유리청소, 화장실청소, 사무실청소는 현장 사진 확인 후 별도 안내해드려요.
                </div>
              )}
              <DiagnosisSelect label="현재 오염 상태" value={diagnosis.pollution} items={options.pollution} onChange={(value) => handleChange("pollution", value)} />
              <DiagnosisSelect label="원하는 관리주기" value={diagnosis.cycle} items={options.cycle} onChange={(value) => handleChange("cycle", value)} />
            </div>

            <button
              type="button"
              onClick={analyzeBuilding}
              disabled={isAnalyzing}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI가 분석 중
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 translate-y-px" />
                  AI로 분석하기
                </>
              )}
            </button>

            {errorMessage && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {errorMessage}
              </p>
            )}

            {result && (
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-4 ring-1 ring-blue-100">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold tracking-[0.18em] text-primary">AI 분석 결과</p>
                  {result.source === "fallback" && (
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-blue-100">
                      기본 문장
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-slate-900">{result.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{result.summary}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{result.recommendation}</p>
                <p className="mt-3 text-sm font-bold leading-6 text-primary">{result.cta}</p>
                {result.setupRequired && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Gemini API 키가 연결되면 이 문장이 실시간 AI 생성 문장으로 바뀝니다.
                  </p>
                )}
              </div>
            )}

            {copyMessage && (
              <p className="mt-3 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-bold leading-6 text-yellow-800 ring-1 ring-yellow-100">
                {copyMessage}
              </p>
            )}

            <details className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
              <summary className="cursor-pointer font-extrabold text-slate-800">카톡으로 보낼 진단 내용 보기</summary>
              <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-xs leading-5 text-slate-600">{createDiagnosisMessage(diagnosis, result)}</pre>
            </details>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`} className="flex h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-md hover:bg-primary/90">
                전화 상담
              </a>
              <button type="button" onClick={handleKakaoInquiry} className="flex h-12 items-center justify-center rounded-full bg-[#FEE500] px-4 text-sm font-extrabold text-[#191919] shadow-md ring-1 ring-black/5 hover:bg-[#F4DC00]">
                카톡 문의
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DiagnosisSelect({ label, value, items, onChange }: { label: string; value: string; items: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
