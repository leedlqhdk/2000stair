import { MessageCircle, Phone, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

type DiagnosisState = {
  buildingType: string;
  floors: string;
  elevator: string;
  pollution: string;
  cycle: string;
  area: string;
};

const initialDiagnosis: DiagnosisState = {
  buildingType: "빌라",
  floors: "3~4층",
  elevator: "없음",
  pollution: "보통",
  cycle: "아직 모르겠음",
  area: "이천 시내권",
};

const options = {
  buildingType: ["빌라", "원룸", "상가", "사무실"],
  floors: ["2층 이하", "3~4층", "5층 이상"],
  elevator: ["있음", "없음"],
  pollution: ["깨끗한 편", "보통", "오염 심함"],
  cycle: ["주 1회", "주 2회", "월 관리", "아직 모르겠음"],
  area: ["마장면", "신둔면", "부발읍", "이천 시내권", "기타"],
};

export default function KakaoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>(initialDiagnosis);

  const diagnosisResult = useMemo(() => {
    const noElevator = diagnosis.elevator === "없음";
    const highFloors = diagnosis.floors === "5층 이상";
    const dirty = diagnosis.pollution === "오염 심함";
    const busyBuilding = ["원룸", "상가"].includes(diagnosis.buildingType);

    if (dirty || highFloors || (noElevator && busyBuilding)) {
      return {
        title: "주 1~2회 정기 관리 추천",
        description:
          "보행량과 오염 누적 가능성이 높은 구조입니다. 계단 모서리 먼지, 배달 오염, 공동현관 주변까지 함께 관리하는 방식이 좋습니다.",
      };
    }

    if (diagnosis.cycle === "월 관리" || diagnosis.pollution === "깨끗한 편") {
      return {
        title: "월 1~2회 관리부터 추천",
        description:
          "현재 상태가 비교적 안정적인 편입니다. 다만 공용공간은 계절과 입주민 이동량에 따라 오염 속도가 달라져 정기 점검이 좋습니다.",
      };
    }

    return {
      title: "주 1회 정기 관리 추천",
      description:
        "일반적인 빌라·원룸 공용공간 기준으로 주 1회 관리가 가장 무난합니다. 먼지가 쌓이기 전에 꾸준히 관리하는 방식이 비용 대비 효율적입니다.",
    };
  }, [diagnosis]);

  const handleChange = (key: keyof DiagnosisState, value: string) => {
    setDiagnosis((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="fixed bottom-3 right-3 z-50 flex w-[150px] flex-col items-stretch gap-2 rounded-[1.25rem] bg-white/88 p-1.5 shadow-xl ring-1 ring-blue-100/80 backdrop-blur md:bottom-6 md:right-6 md:w-[168px] md:bg-transparent md:p-0 md:shadow-none md:ring-0">
        <a
          href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-3 text-sm font-extrabold text-white shadow-md transition-colors duration-200 hover:bg-primary/90 md:h-14 md:text-base md:shadow-lg"
          aria-label="전화 문의하기"
        >
          <Phone className="h-4 w-4 stroke-[2.8] md:h-5 md:w-5" />
          <span>전화 문의</span>
        </a>

        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#FEE500] px-3 text-sm font-extrabold text-[#191919] shadow-md ring-1 ring-black/5 transition-colors duration-200 hover:bg-[#F4DC00] md:h-14 md:text-base md:shadow-lg"
          aria-label="카카오톡 상담하기"
        >
          <MessageCircle className="h-4 w-4 stroke-[2.8] md:h-5 md:w-5" />
          <span>카톡 상담</span>
        </a>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-50 via-white to-blue-50 px-3 text-sm font-extrabold text-primary shadow-md ring-1 ring-blue-200/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:h-14 md:text-base"
          aria-label="AI 관리진단 열기"
        >
          <span className="absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/70 blur-sm transition-transform duration-700 group-hover:translate-x-56" />
          <Sparkles className="h-4 w-4 stroke-[2.8] md:h-5 md:w-5" />
          <span>AI 관리진단</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/45 px-4 pb-4 backdrop-blur-sm md:items-center md:pb-0">
          <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-2xl ring-1 ring-blue-100 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  30초 무료 체크
                </p>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
                  우리 건물 관리 진단
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  간단히 선택하면 현재 건물에 맞는 관리 주기를 안내해드려요.
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
              <DiagnosisSelect
                label="건물 유형"
                value={diagnosis.buildingType}
                items={options.buildingType}
                onChange={(value) => handleChange("buildingType", value)}
              />
              <DiagnosisSelect
                label="층수"
                value={diagnosis.floors}
                items={options.floors}
                onChange={(value) => handleChange("floors", value)}
              />
              <DiagnosisSelect
                label="엘리베이터"
                value={diagnosis.elevator}
                items={options.elevator}
                onChange={(value) => handleChange("elevator", value)}
              />
              <DiagnosisSelect
                label="현재 오염 상태"
                value={diagnosis.pollution}
                items={options.pollution}
                onChange={(value) => handleChange("pollution", value)}
              />
              <DiagnosisSelect
                label="원하는 관리 주기"
                value={diagnosis.cycle}
                items={options.cycle}
                onChange={(value) => handleChange("cycle", value)}
              />
              <DiagnosisSelect
                label="지역"
                value={diagnosis.area}
                items={options.area}
                onChange={(value) => handleChange("area", value)}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 p-4 ring-1 ring-blue-100">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">분석 결과</p>
              <h3 className="mt-2 text-lg font-extrabold text-slate-900">{diagnosisResult.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{diagnosisResult.description}</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                실제 견적은 건물 구조, 면적, 오염도, 작업 범위 확인 후 안내됩니다.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={`tel:${PHONE_NUMBER.replace(/-/g, "")}`}
                className="flex h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-extrabold text-white shadow-md hover:bg-primary/90"
              >
                전화 상담
              </a>
              <a
                href={KAKAO_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center rounded-full bg-[#FEE500] px-4 text-sm font-extrabold text-[#191919] shadow-md ring-1 ring-black/5 hover:bg-[#F4DC00]"
              >
                카톡 문의
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DiagnosisSelect({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: string[];
  onChange: (value: string) => void;
}) {
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
