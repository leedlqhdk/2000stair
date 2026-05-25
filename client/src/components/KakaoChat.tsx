import { Loader2, MessageCircle, Phone, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

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
  buildingType: "빌라",
  floors: "3~4층",
  pollution: "보통",
  cycle: "아직 모르겠음",
};

const options = {
  buildingType: ["빌라", "원룸", "상가", "사무실"],
  floors: ["2층 이하", "3~4층", "5층 이상"],
  pollution: ["깨끗한 편", "보통", "오염 심함"],
  cycle: ["주 1회", "주 2회", "월 관리", "아직 모르겠음"],
};

const expandedButtonClass = "w-[102px] px-2 md:w-[168px] md:px-5";
const collapsedButtonClass = "w-9 px-0 md:w-14 md:px-0";
const expandedTextClass = "max-w-[64px] opacity-100 md:max-w-[80px]";
const collapsedTextClass = "max-w-0 opacity-0";

export default function KakaoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<number | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>(initialDiagnosis);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const buttonWidthClass = isScrolling ? collapsedButtonClass : expandedButtonClass;
  const buttonTextClass = isScrolling ? collapsedTextClass : expandedTextClass;
  const buttonGapClass = isScrolling ? "gap-0" : "gap-1 md:gap-2";

  const handleChange = (key: keyof DiagnosisState, value: string) => {
    setDiagnosis((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setErrorMessage("");
  };

  const analyzeBuilding = async () => {
    setIsAnalyzing(true);
    setErrorMessage("");

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
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5 md:bottom-6 md:right-6 md:gap-3">
        {!isScrolling && (
          <div className="pointer-events-none mb-1 mr-1 rounded-2xl bg-white/95 px-4 py-3 shadow-lg shadow-blue-900/8 ring-1 ring-blue-100 backdrop-blur">
            <p className="text-center text-[11px] font-extrabold leading-snug text-slate-700 md:text-sm">
              사진 보내주시면
              <br />
              빠르게 답변드려요 :)
            </p>
          </div>
        )}
      </div>
    </>
  );
}
