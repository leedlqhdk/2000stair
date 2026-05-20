import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  {
    title: "대월면 빌라 계단청소",
    date: "2026.05.20",
    image: "/manus-storage/stair-floor-after_0e13b4f5.webp",
  },
  {
    title: "대월면 공동현관 유리관리",
    date: "2026.05.18",
    image: "/manus-storage/glass-after_3ef4a793.webp",
  },
  {
    title: "대월면 원룸 공용공간 관리",
    date: "2026.05.15",
    image: "/manus-storage/window-frame-after_9c733b21.webp",
  },
  {
    title: "대월면 계단 난간 정기관리",
    date: "2026.05.12",
    image: "/manus-storage/railing-after_004e4850.webp",
  },
];

const reviews = [
  "공용공간이 눈에 띄게 깔끔해져서 만족스럽습니다.",
  "요청사항을 빠르게 확인해주셔서 편하게 맡겼습니다.",
];

export default function DaewolAreaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      <section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <Link href="/blog">
            <a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition">
              <ArrowLeft className="h-4 w-4" />
              작업일지로 돌아가기
            </a>
          </Link>

          <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm">
            <div className="grid md:grid-cols-[0.95fr_1.05fr] items-stretch">
              <div className="p-7 md:p-12">
                <p className="text-xs md:text-sm font-bold tracking-[0.35em] text-primary mb-5">
                  AREA ARCHIVE
                </p>

                <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.12] text-foreground mb-5">
                  대월면의
                  <br />
                  공용공간을 꾸준히 관리합니다
                </h1>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  부부가 직접, 대월면 빌라·원룸·상가 공용공간을 관리합니다.
                </p>

                <div className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm">
                  최근 작업 12건
                </div>
              </div>

              <div className="relative min-h-[300px] md:min-h-[430px] overflow-hidden bg-blue-50">
                <img
                  src="/manus-storage/work-vest_b3f4fbac.png"
                  alt="대월면 계단청소 관리 현장"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-blue-900/10" />
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mb-12 md:mb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
                대월면 작업 기록
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                최근 작업 지역을 기준으로 업데이트됩니다.
              </p>
            </div>

            <Link href="/blog">
              <a className="hidden md:inline-flex items-center text-sm font-bold text-primary hover:opacity-80 transition">
                전체 보기
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, index) => (
              <motion.article
                key={post.title}
                className="group overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <div className="overflow-hidden bg-blue-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-extrabold leading-snug text-foreground mb-3">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground">
                고객 후기
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                대월면 관리 현장에서 받은 실제 피드백입니다.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review}
                className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-base leading-relaxed text-foreground">
                  “{review}”
                </p>

                <p className="mt-4 text-sm text-muted-foreground">
                  대월면 건물주 후기
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            대월면 청소 관리가 필요하신가요?
          </h2>

          <p className="text-muted-foreground mb-8">
            정기관리·일회성 청소 모두 문의 가능합니다.
          </p>

          <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
            <a
              href="https://pf.kakao.com/_IiNfn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              카카오톡 문의하기
            </a>

            <a
              href="tel:01084381887"
              className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50"
            >
              <Phone className="mr-2 h-4 w-4" />
              전화 문의하기
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
