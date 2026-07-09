import { MessageCircle, Phone, Star } from "lucide-react";
import AreaIntro from "@/components/AreaIntro";
import AreaTimeline from "@/components/AreaTimeline";
import AreaBlogArchive from "@/components/AreaBlogArchive";
import { useAreaPosts } from "@/hooks/useAreaPosts";

const fallbackPosts: never[] = [];

const reviews = [
  { text: "관리 전후 사진을 보내주셔서 믿고 맡길 수 있었습니다.", source: "신둔면 빌라 동대표님 후기" },
  { text: "공용공간이 꾸준히 깔끔하게 유지돼서 만족합니다.", source: "신둔면 원룸 입주민 후기" },
];

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
<AreaIntro
headline="신둔면의 공용공간을 꾸준히 관리합니다"
description="부부가 직접, 신둔면 빌라·원룸·상가 공용공간을 관리합니다."
focus="수광리·도암리·남정리 등 신둔면 전 지역의 계단·복도·공동현관 상태를 확인하고 관리 주기를 안내합니다."
/>

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
{Array.from({ length: 5 }).map((_, index) => (<Star key={index} className="h-4 w-4 fill-current" />))}
</div>
<p className="text-base leading-relaxed text-foreground">"{review.text}"</p>
<p className="mt-4 text-sm text-muted-foreground">{review.source}</p>
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

<AreaBlogArchive areaName="신둔면" />

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
