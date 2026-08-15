import { useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const areas = {
  gwango: "관고동",
  changjeon: "창전동",
  jungni: "중리동",
  jeungpo: "증포동",
  bubal: "부발읍",
  sindun: "신둔면",
  baeksa: "백사면",
  majang: "마장면",
  daewol: "대월면",
} as const;

export default function AdminFieldArea() {
  const [, params] = useRoute("/admin/field/areas/:slug");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: sites } = trpc.field.sites.useQuery(undefined, { enabled: user?.role === "admin" });
  const slug = params?.slug as keyof typeof areas | undefined;
  const name = slug && areas[slug] ? areas[slug] : "방문지역";

  useEffect(() => {
    if (user && user.role !== "admin") setLocation("/admin/field");
  }, [setLocation, user]);

  if (user?.role !== "admin") return null;

  const areaSites = (sites ?? []).filter((site) => site.address.includes(name.replace(/읍|면|동$/, "")) || site.name.includes(name));

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900">
      <header className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-blue-600">ADMIN FIELD · AREA</p>
            <h1 className="text-xl font-extrabold">{name} 세부지역</h1>
          </div>
          <Link href="/admin/field">
            <Button variant="outline" className="gap-1"><ArrowLeft className="h-4 w-4" />전체지도</Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-5">
        <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
          <p className="mb-1 text-xs font-bold tracking-[.2em] text-blue-600">관리자 전용 지역 페이지</p>
          <h2 className="text-lg font-bold">{name} 방문지역 지도</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">홈페이지 공개 지역 페이지와 분리된 관리자용 지도입니다. 이 지역 현장과 작업 메모를 확인하는 공간으로 사용합니다.</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 p-3">
            {slug && areas[slug] ? <img src={`/images/area-maps/${slug}.svg`} alt={`${name} 관리자 세부 지도`} className="mx-auto block max-h-[70vh] w-full object-contain" /> : <p className="p-8 text-center text-sm text-slate-500">지역 지도를 찾을 수 없습니다.</p>}
          </div>
        </section>
        <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">이 지역 등록 현장</h2><span className="text-sm text-slate-500">{areaSites.length}곳</span></div>
          {areaSites.length ? <div className="space-y-2">{areaSites.map((site) => <div key={site.id} className="flex items-center gap-3 rounded-xl border p-3"><MapPin className="h-5 w-5 shrink-0 text-blue-600" /><div className="min-w-0"><strong className="block truncate">{site.name}</strong><span className="block truncate text-sm text-slate-500">{site.address}</span></div></div>)}</div> : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">아직 이 지역에 등록된 현장이 없습니다. 현장 탭에서 주소를 등록하면 여기에 표시됩니다.</p>}
        </section>
      </main>
    </div>
  );
}
