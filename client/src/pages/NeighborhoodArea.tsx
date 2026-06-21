import { Link, useParams } from "wouter";
import { ArrowLeft, Building2, Camera, FileText, MessageCircle, Phone, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";
import { trackConversion } from "@/lib/analytics";

type NeighborhoodConfig = {
  name: string;
  headline: string;
  description: string;
  localities: string[];
  focus: string;
  examples: string[];
};

const neighborhoodData: Record<string, NeighborhoodConfig> = {
  gwango: {
    name: "관고동",
    headline: "관고동 상가·빌라 공용공간을 정기관리합니다",
    description:
      "관고동 생활권의 상가, 빌라, 소형 건물 공용공간을 현장 상태에 맞춰 직접 관리합니다.",
    localities: ["관고동", "설봉공원 인근", "관고시장 인근"],
    focus: "상가 출입구, 계단, 공동현관처럼 방문객이 먼저 보는 공간을 중심으로 관리 범위를 안내합니다.",
    examples: ["상가 공용계단 정기관리", "공동현관 유리 손자국 관리", "복도·난간 먼지 관리"],
  },
  changjeon: {
    name: "창전동",
    headline: "창전동 빌라·원룸 계단을 꾸준히 관리합니다",
    description:
      "창전동 빌라와 원룸의 계단, 복도, 공동현관을 정기 방문 기준으로 상담합니다.",
    localities: ["창전동", "시내 주거지", "상가주택 밀집 구역"],
    focus: "입주민 이동이 잦은 계단과 복도 위주로 오염 상태를 확인하고 월 2회·4회 주기를 안내합니다.",
    examples: ["원룸 계단 바닥 관리", "빌라 복도 먼지 제거", "공동현관 첫인상 관리"],
  },
  songjeong: {
    name: "송정동",
    headline: "송정동 빌라·상가 공용부를 사진으로 확인하며 관리합니다",
    description:
      "송정동 건물의 현관, 계단, 복도 상태를 사진으로 확인한 뒤 필요한 관리 범위를 안내합니다.",
    localities: ["송정동", "주거 밀집 구역", "상가주택 주변"],
    focus: "건물주가 현장에 자주 오기 어려운 경우에도 작업 전후 사진으로 관리 상태를 확인할 수 있게 돕습니다.",
    examples: ["현관·복도 정기관리", "계단 난간 손자국 관리", "상가주택 공용부 관리"],
  },
};

const proofItems = [
  { icon: Building2, title: "지역별 상담", text: "주소와 사진을 기준으로 방문 가능 여부를 먼저 확인합니다." },
  { icon: Camera, title: "사진 기록", text: "정기관리 현장은 작업 전후 상태를 사진으로 공유합니다." },
  { icon: ReceiptText, title: "사업자 증빙", text: "세금계산서와 현금영수증 발행이 가능합니다." },
  { icon: FileText, title: "계약 기준", text: "관리 범위와 주기를 정리해 계약 조건을 안내합니다." },
];

type NeighborhoodAreaPageProps = {
  areaSlug?: string;
};

export default function NeighborhoodAreaPage({ areaSlug }: NeighborhoodAreaPageProps) {
  const params = useParams();
  const slug = areaSlug ?? params.slug ?? "gwango";
  const data = neighborhoodData[slug] ?? neighborhoodData.gwango;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <Link href="/areas">
            <a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
              <ArrowLeft className="h-4 w-4" />
              관리지역으로 돌아가기
            </a>
          </Link>

          <div className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="p-6 md:p-8">
                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  AREA ARCHIVE
                </p>
                <h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
                  {data.headline}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                  {data.description}
                </p>
              </div>
              <div className="border-t border-blue-100 bg-blue-50/70 p-6 lg:border-l lg:border-t-0 md:p-8">
                <p className="text-sm font-extrabold text-primary">상담 전 확인할 내용</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{data.focus}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mb-12 grid gap-4 md:grid-cols-4 md:mb-16">
          {proofItems.map((item) => (
            <div key={item.title} className="rounded-[1.25rem] border border-blue-100 bg-white p-5 shadow-sm">
              <item.icon className="mb-3 h-5 w-5 text-primary" />
              <h2 className="mb-2 text-sm font-extrabold text-foreground">{item.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:mb-16">
          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-xl font-extrabold text-foreground md:text-2xl">
              {data.name} 관리 가능 구역
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.localities.map((name) => (
                <span key={name} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-primary">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-xl font-extrabold text-foreground md:text-2xl">
              많이 문의하는 관리 범위
            </h2>
            <div className="grid gap-3">
              {data.examples.map((example) => (
                <p key={example} className="rounded-2xl bg-blue-50/70 px-4 py-3 text-sm font-bold text-slate-700">
                  {example}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            {data.name} 청소 관리가 필요하신가요?
          </h2>
          <p className="mb-8 text-muted-foreground">
            주소와 공용공간 사진을 보내주시면 관리 가능 범위부터 확인해드립니다.
          </p>
          <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
            <a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" onClick={() => trackConversion("kakao_click", { location: `area_${slug}`, label: `${data.name} 카카오톡 문의` })} className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
              <MessageCircle className="mr-2 h-4 w-4" />
              카카오톡 문의하기
            </a>
            <a href="tel:01084381887" onClick={() => trackConversion("phone_click", { location: `area_${slug}`, label: `${data.name} 전화 문의` })} className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50">
              <Phone className="mr-2 h-4 w-4" />
              전화 문의하기
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
