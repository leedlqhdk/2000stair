import { useEffect, useState } from "react";
import { ExternalLink, GitCommitHorizontal, Rocket, ScrollText } from "lucide-react";
import Navbar from "@/components/Navbar";

type ReleaseNote = {
  date: string;
  title: string;
  summary: string;
  commit: string;
  commitUrl: string | null;
};

type StatusPayload = {
  siteUrl: string;
  repositoryUrl: string;
  generatedAt: string;
  deployment: {
    sha: string;
    shortSha: string;
    branch: string;
    deploymentId: string;
    commitMessage: string;
  };
  releaseNotes: ReleaseNote[];
};

export default function OpsStatus() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/public/status", { cache: "no-store" });
        if (!response.ok) throw new Error("status request failed");
        const data = (await response.json()) as StatusPayload;
        if (!cancelled) {
          setStatus(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("운영 상태를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />
      <main className="container max-w-5xl pt-24 pb-16 md:pt-32 md:pb-24">
        <section className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-extrabold tracking-[0.2em] text-primary">OPS STATUS</p>
          <h1 className="text-3xl font-extrabold text-foreground md:text-5xl">운영 · 배포 상태</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            현재 배포 SHA, 브랜치, 최근 반영한 변경 로그를 외부에서 바로 확인할 수 있도록 정리한 페이지입니다.
          </p>
        </section>

        {loading ? (
          <section className="mt-8 rounded-[2rem] border border-blue-100 bg-white p-7 text-sm text-muted-foreground shadow-sm md:p-10">
            운영 상태를 불러오는 중입니다.
          </section>
        ) : error ? (
          <section className="mt-8 rounded-[2rem] border border-red-100 bg-red-50 p-7 text-sm font-semibold text-red-600 shadow-sm md:p-10">
            {error}
          </section>
        ) : status ? (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-blue-50 p-2 text-primary">
                  <GitCommitHorizontal className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold tracking-[0.18em] text-primary">DEPLOY SHA</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{status.deployment.shortSha}</p>
                <p className="mt-2 break-all text-xs text-muted-foreground">{status.deployment.sha}</p>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-blue-50 p-2 text-primary">
                  <Rocket className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold tracking-[0.18em] text-primary">BRANCH</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">{status.deployment.branch}</p>
                <p className="mt-2 text-xs text-muted-foreground">배포 ID: {status.deployment.deploymentId}</p>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-blue-50 p-2 text-primary">
                  <ScrollText className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold tracking-[0.18em] text-primary">UPDATED</p>
                <p className="mt-2 text-lg font-extrabold text-foreground">
                  {new Date(status.generatedAt).toLocaleString("ko-KR")}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{status.deployment.commitMessage || "커밋 메시지 없음"}</p>
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm md:p-10">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-foreground">최근 변경 로그</h2>
                  <p className="mt-2 text-sm text-muted-foreground">최근 운영/SEO/배포 관련 반영 내역입니다.</p>
                </div>
                <a
                  href={status.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  저장소 바로가기
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {status.releaseNotes.map((note) => (
                  <article key={`${note.date}-${note.title}`} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-extrabold tracking-[0.16em] text-primary">{note.date}</p>
                        <h3 className="mt-1 text-lg font-extrabold text-foreground">{note.title}</h3>
                      </div>
                      {note.commitUrl ? (
                        <a
                          href={note.commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
                        >
                          {note.commit.slice(0, 7)}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">현재 커밋에 포함</span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{note.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
