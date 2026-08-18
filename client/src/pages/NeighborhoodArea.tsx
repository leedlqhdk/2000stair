import { useParams } from "wouter";
import { MessageCircle, Phone } from "lucide-react";
import AreaTimeline from "@/components/AreaTimeline";
import AreaIntro from "@/components/AreaIntro";
import AreaLocalDetails from "@/components/AreaLocalDetails";
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
    headline: "관고동 상가·빌라 공용공간을 정기관리합니다",
    description: "관고시장, 설봉공원 인근, 사음동 방향의 상가·빌라 공용공간을 현장 상태에 맞춰 상담합니다.",
    focus: "상가 출입구, 계단, 공동현관처럼 방문객이 먼저 보는 공간을 중심으로 사진과 주소를 확인합니다.",
  },
  changjeon: {
    name: "창전동",
    headline: "창전동 빌라·원룸 계단과 복도를 꾸준히 관리합니다",
    description: "창전동 시내 주거지와 상가주택 밀집 구역의 계단, 복도, 공동현관을 정기 방문 기준으로 상담합니다.",
    focus: "입주민 이동이 잦은 계단과 복도 위주로 오염 상태를 확인하고 월 2회·4회 주기를 안내합니다.",
  },
  jungni: {
    name: "중리동",
    headline: "중리동 빌라·상가 공용부를 사진으로 확인하며 관리합니다",
    description: "관할 구역은 증일동, 율현동, 진리동, 단월동, 대포동, 고담동, 장록동 일대를 포함합니다.",
    focus: "건물주가 현장에 자주 오기 어려운 경우에도 초도청소 후 청소 전후 사진 제공으로 관리 상태를 확인할 수 있게 돕습니다.",
  },
  jeungpo: {
    name: "증포동",
    headline: "증포동 빌라·상가 공용공간을 꾸준히 관리합니다",
    description: "증포동, 안흥동, 갈산동, 송정동 일대의 빌라·원룸·상가주택 공용공간을 상담합니다.",
    focus: "주거 밀집 구역의 계단, 복도, 공동현관처럼 입주민이 매일 보는 공간을 중심으로 관리 주기를 안내합니다.",
  },
};

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
        <AreaIntro headline={data.headline} description={data.description} focus={data.focus} />
        <AreaLocalDetails areaSlug={slug} />

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
