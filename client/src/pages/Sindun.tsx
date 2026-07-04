import { Link } from "wouter";
import { ArrowLeft, FileText, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaServiceCards from "@/components/AreaServiceCards";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts } from "@/hooks/useAreaPosts";

const fallbackPosts: never[] = [];

const serviceCards = [
  {
    title: "이천 현지 관리",
    text: "가까운 거리, 빠른 대응",
  },
  {
    title: "현장 기록 제공",
    text: "작업 전후 사진 공유",
  },
  {
    title: "부부 직접관리",
    text: "하청 없이 책임 관리",
  },
];

const reviews = [
{
text: "관리 전후 사진을 보내주셔서 믿고 맡길 수 있었습니다.",
source: "신둔면 빌라 동대표님 후기",
},
{
text: "공용공간이 꾸준히 깔끔하게 유지돼서 만족합니다.",
source: "신둔면 원룸 입주민 후기",
},
];

const localities = ["신둔면", "수광리", "도암리", "남정리"];

const faqs = [
{
question: "신둔면 어디까지 방문 가능한가요?",
answer: "수광리, 도암리, 남정리 등 신둔면 전 지역 상담 가능합니다. 사진과 주소를 보내주시면 방문 가능 여부를 먼저 확인합니다.",
},
{
question: "정기관리는 어떻게 진행되나요?",
answer: "사진 또는 주소를 보내주시면 건물 층수와 오염 상태를 확인한 뒤 월 2회 또는 4회 정기관리 일정을 안내해드립니다.",
},
{
question: "유리청소·화장실청소도 함께 가능한가요?",
answer: "네. 계단청소와 함께 공동현관 유리청소, 화장실청소도 정기관리 또는 개별로 문의하실 수 있습니다.",
},
];

export default function SindunAreaPage() {
const { posts } = useAreaPosts("sindun", fallbackPosts);

return (
<main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">

<section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
<motion.div
className="mb-8 md:mb-10"
initial={{ opacity: 0, y: 28 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.65 }}
>
<Link href="/areas">
<a className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition">
<ArrowLeft className="h-4 w-4" />
관리지역으로 돌아가기
</a>
</Link>

<div className="relative overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-white p-7 shadow-sm md:p-10">
<div className="pointer-events-none absolute -right-8 bottom-0 hidden h-56 w-56 rounded-full bg-blue-100/30 md:block" />
<div className="pointer-events-none absolute right-28 bottom-10 hidden h-24 w-44 border-l-[18px] border-t-[18px] border-blue-100/45 md:block" />
<div className="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
<div>
<p className="mb-4 text-xs font-extrabold tracking-[0.35em] text-primary md:text-sm">
AREA ARCHIVE
</p>
<h1 className="mb-5 text-4xl font-extrabold leading-[1.15] text-foreground md:text-5xl">
신둔면의<br className="hidden md:block" /> <span className="text-primary">공용공간을 꾸준히 관리합니다</span>
</h1>
<p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
부부가 직접, 신둔면 빌라·원룸·상가 공용공간을 관리합니다.
</p>
</div>
<div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold text-white shadow-sm md:text-base">
<FileText className="h-5 w-5" />
최근 작업 기록
</div>
</div>
</div>
</motion.div>

<AreaServiceCards cards={serviceCards} />

<AreaTimeline
areaName="신둔면"
areaSlug="sindun"
posts={posts}
title="신둔면 작업 일지"
description="노션 작업일지 기준으로 업데이트됩니다."
emptyMessage="신둔면 작업 기록은 노션 작업일지 등록 후 표시됩니다."
/>

<section className="mb-12 md:mb-16">
<div className="mb-5">
<h2 className="text-xl font-extrabold text-foreground md:text-2xl">고객 후기</h2>
<p className="mt-1 text-sm text-muted-foreground">신둔면 관리 현장에서 받은 피드백입니다.</p>
</div>
<div className="grid gap-4 md:grid-cols-2">
{reviews.map((review) => (
<div key={review.text} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
<div className="mb-3 flex items-center gap-1 text-yellow-400">
{Array.from({ length: 5 }).map((_, index) => (
<Star key={index} className="h-4 w-4 fill-current" />
))}
</div>
<p className="text-base leading-relaxed text-foreground">"{review.text}"</p>
<p className="mt-4 text-sm text-muted-foreground">{review.source}</p>
</div>
))}
</div>
</section>

<section className="mb-12 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-16 md:p-8">
<h2 className="mb-4 text-xl font-extrabold text-foreground md:text-2xl">관리 가능 지역</h2>
<div className="flex flex-wrap gap-2">
{localities.map((name) => (
<span key={name} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-primary">{name}</span>
))}
</div>
</section>

<section className="mb-12 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-16 md:p-8">
<h2 className="mb-5 text-xl font-extrabold text-foreground md:text-2xl">자주 묻는 질문</h2>
<div className="grid gap-4 md:grid-cols-2">
{faqs.map((faq) => (
<div key={faq.question} className="rounded-2xl bg-blue-50/70 p-5">
<h3 className="mb-2 text-sm font-extrabold text-foreground">{faq.question}</h3>
<p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
</div>
))}
</div>
</section>

<section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
<h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">신둔면 청소 관리가 필요하신가요?</h2>
<p className="mb-8 text-muted-foreground">정기관리·일회성 청소 모두 문의 가능합니다.</p>
<div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
<a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
<MessageCircle className="mr-2 h-4 w-4" />
카카오톡 문의하기
</a>
<a href="tel:01084381887" className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50">
<Phone className="mr-2 h-4 w-4" />
전화 문의하기
</a>
</div>
</section>
</section>
</main>
);
}
