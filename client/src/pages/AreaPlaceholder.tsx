import { Link, useParams } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";

const labels: Record<string, string> = {
  gwango: "관고동",
  changjeon: "창전동",
  jungni: "중리동",
  jeungpo: "증포동",
};

export default function AreaPlaceholder() {
  const { slug = "" } = useParams<{ slug: string }>();
  const name = labels[slug] ?? "이천 지역";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white px-5 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/areas">
          <a className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
            <ArrowLeft className="h-4 w-4" /> 관리지역으로 돌아가기
          </a>
        </Link>
        <div className="rounded-3xl border border-blue-100 bg-white px-6 py-20 shadow-sm">
          <MapPin className="mx-auto mb-5 h-10 w-10 text-primary" />
          <p className="mb-3 text-xs font-extrabold tracking-[0.25em] text-primary">SERVICE AREA</p>
          <h1 className="text-3xl font-extrabold text-foreground">{name}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            {name} 지역 안내 페이지를 준비하고 있습니다. 관리 범위와 현장 기록을 정리해 순서대로 추가할게요.
          </p>
        </div>
      </div>
    </main>
  );
}
