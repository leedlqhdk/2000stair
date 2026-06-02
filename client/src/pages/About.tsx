import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  {
    title: "같은 사람이 봅니다",
    text: "건물 상태를 기억하고 이어서 관리합니다.",
  },
  {
    title: "사진으로 남깁니다",
    text: "관리 전후를 기록해 확인하기 쉽게 합니다.",
  },
  {
    title: "직접 관리합니다",
    text: "상담부터 방문까지 부부가 직접 챙깁니다.",
  },
];

type InfoPost = {
  id: string;
  title: string;
  image: string;
  url: string;
};

const fallbackInfoPosts: InfoPost[] = [
  {
    id: "naver-guide-1",
    title: "이천 빌라 계단청소 업체 선택 시 꼭 확인해야 할 점",
    image: "/images/blog-banner-main.png",
    url: "https://blog.naver.com/icheonstair/224302652052",
  },
];

export default function About() {
  const [infoPosts, setInfoPosts] = useState<InfoPost[]>(fallbackInfoPosts);
  const scrollingInfoPosts =
    infoPosts.length > 1 ? [...infoPosts, ...infoPosts] : infoPosts;

  useEffect(() => {
    let active = true;

    fetch("/api/content-posts?contentType=정보성&limit=5")
      .then(async (response) => {
        if (!response.ok) throw new Error(`Failed to load posts: ${response.status}`);
        return response.json() as Promise<{ posts?: InfoPost[] }>;
      })
      .then((data) => {
        if (!active) return;
        if (data.posts?.length) {
          setInfoPosts(data.posts);
        }
      })
      .catch((error) => {
        console.error("Failed to load featured info posts", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <Navbar />

      <main>
        <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.section
            className="mb-14 overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-7 shadow-sm md:mb-20 md:p-10"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <Link href="/">
                  <a className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-blue-50">
                    <ArrowLeft className="h-4 w-4" />
                    메인으로 돌아가기
                  </a>
                </Link>

                <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                  ABOUT
                </p>
                <h1 className="mb-5 text-[2.4rem] font-extrabold leading-[1.18] text-foreground md:text-5xl">
                  부부 직영,<br />
                  함께 관리합니다
                </h1>
                <p className="max-w-sm text-base leading-8 text-muted-foreground md:max-w-md md:text-base">
                  상담부터 현장 관리,
                  작업 기록까지 직접 관리합니다.
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <img
                  src="/booboo.webp"
                  alt="이천계단지기 부부 캐릭터"
                  className="w-[92vw] max-w-[420px] md:w-[360px]"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.section>

          <section className="mb-14 md:mb-20">
            <p className="mb-3 text-sm font-extrabold text-primary">
              DIRECT MANAGEMENT
            </p>

            <h2 className="mb-5 text-2xl font-extrabold leading-snug text-foreground md:text-4xl">
              같은 사람이 꾸준히 봅니다
            </h2>

            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              계단청소는 한 번보다 꾸준함이 중요합니다. 처음 확인한 건물 상태를 기억하고 이어서 관리합니다.
            </p>
          </section>

          <section className="mb-14 overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/50 p-7 shadow-sm md:mb-20 md:p-10">
            <div className="mb-7">
              <p className="mb-2 text-sm font-extrabold text-primary">
                WHO WE ARE
              </p>
              <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
                역할을 나누어 관리합니다
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-blue-100/80 bg-white/82 p-7 shadow-sm shadow-blue-950/5">
                <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-primary">
                  FIELD
                </p>
                <h3 className="mb-4 text-2xl font-extrabold text-foreground">
                  현장관리
                </h3>
                <p className="mb-6 text-sm leading-8 text-muted-foreground">
                  계단·복도·공동현관을 직접 확인합니다.
                </p>

                <div className="flex justify-center rounded-3xl bg-white py-4">
                  <img
                    src="/character-husband.png"
                    alt="현장 관리 남편 캐릭터"
                    className="w-40 md:w-36"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-blue-100/80 bg-white/82 p-7 shadow-sm shadow-blue-950/5">
                <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-primary">
                  RECORD
                </p>
                <h3 className="mb-4 text-2xl font-extrabold text-foreground">
                  상담·기록
                </h3>
                <p className="mb-6 text-sm leading-8 text-muted-foreground">
                  문의·일정·작업 사진을 정리합니다.
                </p>

                <div className="flex justify-center rounded-3xl bg-white py-4">
                  <img
                    src="/character-wife.png"
                    alt="상담 기록 아내 캐릭터"
                    className="w-40 md:w-36"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-14 md:mb-20">
            <div className="mb-6">
              <p className="mb-2 text-sm font-extrabold text-primary">
                OUR STANDARD
              </p>
              <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
                저희가 지키는 기준
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <div key={value.title} className="border-t border-blue-100 pt-5">
                  <h3 className="mb-2 text-lg font-extrabold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-blue-100 bg-white px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="mb-8 text-center">
              <img
                src="/booboo2.webp"
                alt="이천계단지기 부부 캐릭터"
                className="mx-auto mb-5 w-56 md:w-48"
                loading="lazy"
              />

              <p className="mb-2 text-sm font-extrabold text-primary">
                GUIDE CONTENT
              </p>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
                청소 맡기기 전에 이런 글도 참고해보세요
              </h2>

              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                대표 이미지로 먼저 보고, 궁금한 내용은 제목을 눌러 네이버 글에서 바로 확인할 수 있습니다.
              </p>
            </div>

            <div className="overflow-hidden">
              <motion.div
                className="flex w-max gap-4"
                animate={
                  infoPosts.length > 1
                    ? { x: ["0%", "-50%"] }
                    : { x: "0%" }
                }
                transition={
                  infoPosts.length > 1
                    ? {
                        duration: 26,
                        ease: "linear",
                        repeat: Infinity,
                      }
                    : undefined
                }
              >
                {scrollingInfoPosts.map((post, index) => (
                  <motion.a
                    key={`${post.id}-${index}`}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-[260px] shrink-0 overflow-hidden rounded-[1.6rem] border border-blue-100 bg-white shadow-sm md:w-[320px]"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: (index % infoPosts.length) * 0.08 }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-primary/0 transition-all duration-300 group-hover:bg-primary/88" />
                      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <p className="max-w-[15rem] text-lg font-extrabold leading-snug text-white opacity-0 transition-all duration-300 group-hover:opacity-100 md:text-2xl">
                          {post.title}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            <div className="mt-6 flex justify-center md:justify-end">
              <a
                href="https://blog.naver.com/icheonstair"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-extrabold text-primary transition hover:translate-x-1"
              >
                블로그 더 보기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}
