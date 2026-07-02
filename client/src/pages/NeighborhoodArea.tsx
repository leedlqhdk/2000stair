import { Link, useParams } from "wouter";
import { ArrowLeft, Building2, Camera, FileText, MessageCircle, Phone, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";
import AreaTimeline from "@/components/AreaTimeline";
import { downtownPosts } from "@/data/areas/downtown";
import { trackConversion } from "@/lib/analytics";
import { useAreaPosts } from "@/hooks/useAreaPosts";

type NeighborhoodConfig = {
  name: string;
  headline: string;
  description: string;
  focus: string;
};

const neighborhoodData: Record<string, NeighborhoodConfig> = {
  gwango: {
    name: "관고동",
    headline: "관고동 관활(사음동)",
    description:
      "관고동 생활권의 상가, 빌라, 소형 건물 공용공간을 현장 상태에 맞춰 직접 관리합니다.",
    focus: "상가 출입구, 계단, 공동현관처럼 방문객이 먼저 보는 공간을 중심으로 관리 범위를 안내합니다.",
  },
  changjeon: {
    name: "창전동",
    headline: "창전동 빌라·원룸 계단을 꾸준히 관리합니다",
    description:
      "창전동 빌라와 원룸의 계단, 복도, 공동현관을 정기 방문 기준으로 상담합니다.",
    focus: "입주민 이동이 잦은 계단과 복도 위주로 오염 상태를 확인하고 월 2회·4회 주기를 안내합니다.",
  },
  jungni: {
    name: "중리동",
    headline: "중리동 관활(증일동, 율현동, 진리동, 단월동, 대포동, 고담동, 장록동)",
    description:
      "중리동 건물의 현관, 계단, 복도 상태를 사진으로 확인한 뒤 필요한 관리 범위를 안내합니다.",
    focus: "건물주가 현장에 자주 오기 어려운 경우에도 작업 전후 사진으로 관리 상태를 확인할 수 있게 돕습니다.",
  },
  jeungpo: {
    name: "증포동",
    headline: "증포동 관할(안흥동, 갈산동, 증포동, 송정동)",
    description:
      "증포동 생활권의 빌라, 원룸, 상가주택 공용공간을 주소와 사진 기준으로 확인하고 직접 관리합니다.",
    focus: "주거 밀집 구역의 계단, 복도, 공동현관처럼 입주민이 매일 보는 공간을 중심으로 관리 주기를 안내합니다.",
  },
};

const proofItems = [
  { icon: Building2, title: "지역별 상담", shortTitle: "상담", text: "주소와 사진을 기준으로 방문 가능 여부를 먼저 확인합니다." },
  { icon: Camera, title: "사진 기록", shortTitle: "사진", text: "정기관리 현장은 작업 전후 상태를 사진으로 공유합니다." },
  { icon: ReceiptText, title: "사업자 증빙", shortTitle: "증빙", text: "세금계산서와 현금영수증 발행이 가능합니다." },
  { icon: FileText, title: "계약 기준", shortTitle: "계약", text: "관리 범위와 주기를 정리해 계약 조건을 안내합니다." },
];

type NeighborhoodAreaPageProps = {
  areaSlug?: string;
};

export default function NeighborhoodAreaPage({ areaSlug }: NeighborhoodAreaPageProps) {
  const params = useParams();
  const slug = areaSlug ?? params.slug ?? "gwango";
  const data = neighborhoodData[slug] ?? neighborhoodData.gwango;
  const fallbackPosts = downtownPosts.filter((post) => post.area === slug);
  const { posts, isLoading } = useAreaPosts(slug, fallbackPosts);

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

        <section className="mb-8 grid grid-cols-4 gap-2 md:mb-16 md:gap-4">
          {proofItems.map((item) => (
            <div key={item.title} className="flex min-h-[74px] flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white px-2 py-3 text-center shadow-sm md:min-h-0 md:items-start md:justify-start md:rounded-[1.25rem] md:p-5 md:text-left">
              <item.icon className="mb-1.5 h-5 w-5 text-primary md:mb-3" />
              <h2 className="text-[12px] font-extrabold leading-tight text-foreground md:mb-2 md:text-sm">
                <span className="md:hidden">{item.shortTitle}</span>
                <span className="hidden md:inline">{item.title}</span>
              </h2>
              <p className="hidden text-sm leading-6 text-muted-foreground md:block">{item.text}</p>
            </div>
          ))}
        </section>

        {isLoading ? (
          <section className="mb-12 md:mb-16">
            <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 text-sm font-semibold text-muted-foreground shadow-sm">
              작업 기록을 불러오는 중입니다.
            </div>
          </section>
        ) : (
          <AreaTimeline
            areaName={data.name}
            areaSlug={slug}
            posts={posts}
            title={`${data.name} 작업 일지`}
            description={`${data.name}에서 진행한 작업들을 날짜순으로 확인해보세요.`}
            emptyMessage={`${data.name} 작업 기록은 노션 작업일지 등록 후 표시됩니다.`}
          />
        )}

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
