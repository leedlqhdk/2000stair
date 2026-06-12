import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaServiceCards from "@/components/AreaServiceCards";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts, type AreaPost } from "@/hooks/useAreaPosts";

const fallbackPosts: AreaPost[] = [
{ title: "송정동 빌라 계단청소", date: "2026.05.20", image: "/images/areas/downtown/downtown-1.webp", area: "downtown" },
{ title: "관고동 상가건물 관리", date: "2026.05.18", image: "/images/areas/downtown/downtown-2.webp", area: "downtown" },
{ title: "관고동 상가 계단 정기청소", date: "2026.05.15", image: "/images/areas/downtown/downtown-3.webp", area: "downtown" },
{ title: "송정동 빌라 계단 바닥 정기관리", date: "2026.05.12", image: "/images/areas/downtown/downtown-4.webp", area: "downtown" },
{ title: "창전동 연립빌라 공동현관 유리코팅", date: "2026.04.19", image: "/images/areas/downtown/downtown-5.webp", area: "downtown" },
{ title: "안흥동 상가 화장실 정기관리", date: "2026.04.10", image: "/images/areas/downtown/downtown-6.webp", area: "downtown" },
];

const serviceAreas = ["전체", "관고동", "창전동", "증포동", "중리동", "갈산동", "안흥동", "송정동", "사음동"];

const serviceCards = [
  {
    title: "이천 현지 관리",
    text: "이천 시내권 빌라·원룸·상가의 계단과 공용공간을 정기적으로 관리합니다.",
  },
  {
    title: "현장 기록 제공",
    text: "방문마다 작업 전후 사진을 직접 촬영해 기록합니다. 멀리 있어도 현장 상태를 확인하실 수 있습니다.",
  },
  {
    title: "부부 직접관리",
    text: "외주 없이 부부가 직접 작업합니다. 담당자가 바뀌지 않아 꾸준한 품질을 유지합니다.",
  },
];

const reviews = [
"관리 전후 사진을 보내주셔서 확인하기 편했습니다. 연락도 빨라서 좋았어요.",
"정기적으로 관리받으니까 건물이 덜 낡아 보입니다.",
];

const faqs = [
{
question: "이천 시내권은 어디까지 방문 가능한가요?",
answer: "관고동, 창전동, 증포동, 중리동, 갈산동, 안흥동, 송정동, 사음동 등 이천 시내권 전 지역 상담 가능합니다. 사진과 주소를 보내주시면 방문 가능 여부를 먼저 확인합니다.",
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

export default function DowntownAreaPage() {
const { posts } = useAreaPosts("downtown", fallbackPosts);
const [selectedArea, setSelectedArea] = useState("전체");

const filteredPosts = selectedArea === "전체"
? posts
: posts.filter((post) => post.title.includes(selectedArea));

return (
<main className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">

<section className="container max-w-6xl pt-24 pb-16 md:pt-32 md:pb-24">
<motion.div
className="mb-10 md:mb-12"
initial={{ opacity: 0, y: 28 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.65 }}
>
<Link href="/areas">
<a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition">
<ArrowLeft className="h-4 w-4" />
관리지역으로 돌아가기
</a>
</Link>

<div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
<p className="mb-4 text-xs font-bold tracking-[0.25em] text-primary md:text-sm">
AREA ARCHIVE
</p>

<h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
이천 시내권의 공용공간을 꾸준히 관리합니다
</h1>

<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
관고동·창전동·증포동을 중심으로 빌라·원룸·상가 공용공간을 직접 관리합니다.
</p>

<div className="mt-7 border-t border-blue-100 pt-6">
<div className="mb-4 flex items-center gap-2 text-primary">
<MapPin className="h-5 w-5" />
<h2 className="text-xl font-extrabold text-foreground md:text-2xl">
시내권 관리 가능 지역
</h2>
</div>

<div className="flex flex-wrap gap-2">
{serviceAreas.map((area) => {
const isActive = selectedArea === area;

return (
<button
key={area}
type="button"
onClick={() => setSelectedArea(area)}
className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
isActive
? "bg-primary text-white shadow-sm"
: "bg-blue-50 text-primary hover:bg-primary/10"
}`}
aria-pressed={isActive}
>
{area}
</button>
);
})}
</div>
</div>
</div>
</motion.div>

<AreaServiceCards cards={serviceCards} />

<AreaTimeline
areaName={selectedArea === "전체" ? "시내권" : selectedArea}
areaSlug="downtown"
posts={filteredPosts}
title={selectedArea === "전체" ? "시내권 작업 일지" : `${selectedArea} 작업 일지`}
description={selectedArea === "전체" ? "관고동·창전동·증포동 등 시내권 현장을 날짜순으로 확인해보세요." : `${selectedArea} 현장 기록만 모아 보여드립니다.`}
emptyMessage={`${selectedArea} 작업 기록은 사진 정리 후 순서대로 추가할게요.`}
/>

<section className="mb-12 md:mb-16">
<div className="mb-5">
<h2 className="text-xl font-extrabold text-foreground md:text-2xl">고객 후기</h2>
<p className="mt-1 text-sm text-muted-foreground">시내권 관리 현장에서 받은 피드백입니다.</p>
</div>
<div className="grid gap-4 md:grid-cols-2">
{reviews.map((review) => (
<div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
<div className="mb-3 flex items-center gap-1 text-yellow-400">
{Array.from({ length: 5 }).map((_, index) => (
<Star key={index} className="h-4 w-4 fill-current" />
))}
</div>
<p className="text-base leading-relaxed text-foreground">"{review}"</p>
<p className="mt-4 text-sm text-muted-foreground">이천 시내권 건물주 후기</p>
</div>
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
<h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">이천 시내권 청소 관리가 필요하신가요?</h2>
<p className="mb-8 text-muted-foreground">관고동·창전동·증포동 인근 정기관리와 일회성 청소 모두 문의 가능합니다.</p>
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
