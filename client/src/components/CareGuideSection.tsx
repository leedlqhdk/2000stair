import { ArrowRight, BookOpenText, Droplets, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const fallbackGuides = [
  {
    id: "summer-stair-smell",
    title: "여름철 계단 냄새가 나는 이유",
    summary: "물청소를 해도 냄새가 남는 이유는 줄눈, 논슬립, 환기 문제와 관련이 있습니다.",
    href: "/blog",
    icon: Droplets,
  },
  {
    id: "rainy-stair-slip",
    title: "비 온 뒤 계단이 미끄러운 이유",
    summary: "물기만 닦는다고 끝나지 않습니다. 흙먼지와 계단 모서리 오염이 미끄럼을 키웁니다.",
    href: "/blog",
    icon: ShieldCheck,
  },
  {
    id: "cleaning-cycle",
    title: "계단청소 주기는 어떻게 정할까",
    summary: "건물 층수, 입주민 수, 공동현관 사용량에 따라 관리 주기는 달라집니다.",
    href: "/blog",
    icon: BookOpenText,
  },
];

export default function CareGuideSection() {
  const { data: allTags } = trpc.blog.tags.useQuery();
  const { data: postData } = trpc.blog.list.useQuery({ limit: 50, offset: 0 });

  const guideTagIds = (allTags ?? [])
    .filter((tag) => tag.name.includes("관리정보") || tag.slug.includes("guide") || tag.slug.includes("info"))
    .map((tag) => tag.id);

  const guidePosts = (postData?.posts ?? [])
    .filter((post) => guideTagIds.some((tagId) => post.tags.includes(tagId)))
    .slice(0, 3)
    .map((post) => ({
      id: String(post.id),
      title: post.title,
      summary: post.seoDescription || post.content.replace(/\s+/g, " ").slice(0, 82),
      href: `/blog/${post.id}`,
      icon: BookOpenText,
    }));

  const guides = guidePosts.length > 0 ? guidePosts : fallbackGuides;

  return (
    <section id="care-guide" className="py-16 md:py-24 bg-white">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.35em] text-primary mb-4">
            STAIR CARE GUIDE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            빌라 계단 관리정보
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            계단 냄새, 미끄럼, 먼지처럼 현장에서 자주 만나는 문제를 쉽게 정리했습니다.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {guides.map((guide) => {
            const Icon = guide.icon;

            return (
              <motion.div
                key={guide.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
              >
                <Link href={guide.href}>
                  <article className="group flex h-full min-h-[250px] flex-col rounded-[1.5rem] border border-blue-100 bg-blue-50/35 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-xl">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-xl font-extrabold leading-snug text-foreground">
                      {guide.title}
                    </h3>

                    <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                      {guide.summary}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-primary transition group-hover:translate-x-1">
                      관리정보 보기
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
