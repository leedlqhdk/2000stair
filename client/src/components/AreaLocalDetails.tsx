import { Link } from "wouter";
import { ArrowRight, ClipboardCheck, MapPin, Sparkles } from "lucide-react";

type AreaLocalDetailsData = {
  areaName: string;
  summary: string;
  zones: string[];
  checks: string[];
};

export const areaDetails: Record<string, AreaLocalDetailsData> = {
  majang: {
    areaName: "마장면",
    summary: "오천리·양촌리·장암리처럼 주거지와 상가가 함께 있는 구역은 출입구 먼지와 계단 모서리 상태를 함께 확인합니다.",
    zones: ["오천리", "양촌리", "장암리", "덕평리"],
    checks: ["원룸·빌라 계단 바닥", "공동현관 유리", "복도 모서리 먼지"],
  },
  daewol: {
    areaName: "대월면",
    summary: "사동리·초지리·군량리 일대는 계단, 창틀, 공동현관 유리 상태를 함께 보고 정기관리 범위를 정리합니다.",
    zones: ["사동리", "초지리", "군량리", "장평리"],
    checks: ["계단 바닥 오염", "창틀 먼지", "공동현관 손자국"],
  },
  sindun: {
    areaName: "신둔면",
    summary: "수광리·도암리·남정리 인근 건물은 주소와 사진을 기준으로 이동 동선과 관리 주기를 먼저 확인합니다.",
    zones: ["수광리", "도암리", "남정리", "지석리"],
    checks: ["계단·복도 먼지", "현관 출입부", "정기관리 가능 주기"],
  },
  bubal: {
    areaName: "부발읍",
    summary: "아미리·무촌리·신하리 생활권은 빌라와 상가 공용부가 섞여 있어 출입부와 복도 사용량을 함께 봅니다.",
    zones: ["아미리", "무촌리", "신하리", "가좌리"],
    checks: ["상가 출입부", "빌라 공용계단", "유리·화장실 포함 여부"],
  },
  baeksa: {
    areaName: "백사면",
    summary: "모전리·조읍리·현방리 주변은 건물 위치와 외부 먼지 유입 정도를 확인해 필요한 관리 범위를 안내합니다.",
    zones: ["모전리", "조읍리", "현방리", "송말리"],
    checks: ["외부 먼지 유입", "계단 난간", "공동현관 바닥"],
  },
  gonjiam: {
    areaName: "곤지암읍 인근",
    summary: "신둔면과 가까운 곤지암읍 인접 구역은 주소를 먼저 확인한 뒤 방문 가능 여부와 관리 범위를 안내합니다.",
    zones: ["신둔 방향", "실촌 생활권", "곤지암읍 주변"],
    checks: ["방문 가능 동선", "계단·복도 상태", "정기관리 적합 여부"],
  },
  gwango: {
    areaName: "관고동",
    summary: "관고시장·설봉공원 인근처럼 방문객이 오가는 구역은 상가 출입구와 공동현관 첫인상을 중심으로 봅니다.",
    zones: ["관고시장 인근", "설봉공원 인근", "사음동 방향"],
    checks: ["상가 출입구", "공동현관 유리", "계단 난간·손잡이"],
  },
  changjeon: {
    areaName: "창전동",
    summary: "시내 주거지와 상가주택이 가까운 창전동은 입주민 이동이 잦은 계단과 복도 관리 주기를 우선 확인합니다.",
    zones: ["창전동 시내 주거지", "상가주택 밀집 구역", "중리동 방향"],
    checks: ["입주민 이동 동선", "복도 먼지", "공동현관 출입부"],
  },
  jungni: {
    areaName: "중리동",
    summary: "중리동과 인접 생활권은 건물주가 자주 확인하기 어려운 공용부를 사진 기준으로 확인하고 관리합니다.",
    zones: ["증일동", "율현동", "진리동", "대포동"],
    checks: ["공용계단 상태", "복도·현관 오염", "초도청소 후 청소 전후 사진 제공"],
  },
  jeungpo: {
    areaName: "증포동",
    summary: "증포동·안흥동·갈산동·송정동 일대는 주거 밀집 구역의 계단, 복도, 공동현관 청결 유지가 중요합니다.",
    zones: ["증포동", "안흥동", "갈산동", "송정동"],
    checks: ["빌라·원룸 계단", "공동현관 바닥", "정기관리 주기"],
  },
};

type AreaLocalDetailsProps = {
  areaSlug: string;
};

export default function AreaLocalDetails({ areaSlug }: AreaLocalDetailsProps) {
  const detail = areaDetails[areaSlug];

  if (!detail) return null;

  return (
    <section className="mb-10 border-y border-blue-100 py-6 md:mb-16 md:py-8">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.28em] text-primary">LOCAL CHECK</p>
          <h2 className="mt-1 text-xl font-extrabold leading-tight text-foreground md:text-2xl">
            {detail.areaName}에서 먼저 확인하는 부분
          </h2>
        </div>
      </div>

      <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
        {detail.summary}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            주요 상담 구역
          </div>
          <div className="flex flex-wrap gap-2">
            {detail.zones.map((zone) => (
              <span key={zone} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary">
                {zone}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-foreground">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            자주 보는 관리 포인트
          </div>
          <ul className="space-y-2">
            {detail.checks.map((check) => (
              <li key={check} className="flex items-center gap-2 text-xs font-semibold text-slate-600 md:text-sm">
                <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a href="#area-records" className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-white transition hover:opacity-90">
          {detail.areaName} 작업일지
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <Link href="/services/stair">
          <a className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold text-primary transition hover:bg-blue-50">
            계단청소 범위
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </Link>
        <Link href="/records">
          <a className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold text-primary transition hover:bg-blue-50">
            전체 작업기록
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </Link>
      </div>
    </section>
  );
}
