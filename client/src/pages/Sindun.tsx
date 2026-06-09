import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts } from "@/hooks/useAreaPosts";

const fallbackPosts: never[] = [];

const serviceCards = [
  {
    title: "ì´ì² íì§ ê´ë¦¬",
    text: "ì´ì²ì ì ëë©´ ë¹ë¼Â·ìë£¸Â·ìê°ì ê³ë¨ê³¼ ê³µì©ê³µê°ì ì ê¸°ì ì¼ë¡ ê´ë¦¬í©ëë¤.",
  },
  {
    title: "íì¥ ê¸°ë¡ ì ê³µ",
    text: "ë°©ë¬¸ë§ë¤ ìì ì í ì¬ì§ì ì§ì  ì´¬ìí´ ê¸°ë¡í©ëë¤. ë©ë¦¬ ìì´ë íì¥ ìíë¥¼ íì¸íì¤ ì ììµëë¤.",
  },
  {
    title: "ë¶ë¶ ì§ì ê´ë¦¬",
    text: "ì¸ì£¼ ìì´ ë¶ë¶ê° ì§ì  ììí©ëë¤. ë´ë¹ìê° ë°ëì§ ìì ê¾¸ì¤í íì§ì ì ì§í©ëë¤.",
  },
];

const reviews = [
{
text: "ê´ë¦¬ ì í ì¬ì§ì ë³´ë´ì£¼ìì ë¯¿ê³  ë§¡ê¸¸ ì ìììµëë¤.",
source: "ì ëë©´ ë¹ë¼ ëëíë íê¸°",
},
{
text: "ê³µì©ê³µê°ì´ ê¾¸ì¤í ê¹ëíê² ì ì§ë¼ì ë§ì¡±í©ëë¤.",
source: "ì ëë©´ ìë£¸ ìì£¼ë¯¼ íê¸°",
},
];

export default function SindunAreaPage() {
const { posts } = useAreaPosts("sindun", fallbackPosts);

useEffect(() => {
  document.title = "ì ëë©´ ê³ë¨ì²­ì ì ë¬¸ | ì´ì²ê³ë¨ì§ê¸°";
}, []);

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
<a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition">
<ArrowLeft className="h-4 w-4" />
ê´ë¦¬ì§ì­ì¼ë¡ ëìê°ê¸°
</a>
</Link>

<div className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:p-8">
<p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
AREA ARCHIVE
</p>
<div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
<div>
<h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
ì ëë©´ì ê³µì©ê³µê°ì ê¾¸ì¤í ê´ë¦¬í©ëë¤
</h1>
<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
ë¶ë¶ê° ì§ì , ì ëë©´ ë¹ë¼Â·ìë£¸Â·ìê° ê³µì©ê³µê°ì ê´ë¦¬í©ëë¤.
</p>
</div>
<div className="inline-flex w-fit items-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm">
ìµê·¼ ìì ê¸°ë¡
</div>
</div>
</div>
</motion.div>

<section className="mb-12 grid gap-4 md:grid-cols-3 md:mb-16">
  {serviceCards.map((card) => (
    <div key={card.title} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
      <p className="mb-3 text-sm font-extrabold text-primary">{card.title}</p>
      <p className="text-sm leading-7 text-muted-foreground">{card.text}</p>
    </div>
  ))}
</section>

<AreaTimeline
areaName="ì ëë©´"
areaSlug="sindun"
posts={posts}
title="ì ëë©´ ìì ì¼ì§"
description="ë¸ì ììì¼ì§ ê¸°ì¤ì¼ë¡ ìë°ì´í¸ë©ëë¤."
emptyMessage="ì ëë©´ ìì ê¸°ë¡ì ë¸ì ììì¼ì§ ë±ë¡ í íìë©ëë¤."
/>

<section className="mb-12 md:mb-16">
<div className="mb-5">
<h2 className="text-xl font-extrabold text-foreground md:text-2xl">ê³ ê° íê¸°</h2>
<p className="mt-1 text-sm text-muted-foreground">ì ëë©´ ê´ë¦¬ íì¥ìì ë°ì í¼ëë°±ìëë¤.</p>
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

<section className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 text-center shadow-sm md:p-12">
<h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">ì ëë©´ ì²­ì ê´ë¦¬ê° íìíì ê°ì?</h2>
<p className="mb-8 text-muted-foreground">ì ê¸°ê´ë¦¬Â·ì¼íì± ì²­ì ëª¨ë ë¬¸ì ê°ë¥í©ëë¤.</p>
<div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
<a href="https://pf.kakao.com/_IiNfn/chat" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
<MessageCircle className="mr-2 h-4 w-4" />
ì¹´ì¹´ì¤í¡ ë¬¸ìíê¸°
</a>
<a href="tel:01084381887" className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white px-6 py-4 text-sm font-bold text-primary transition hover:bg-blue-50">
<Phone className="mr-2 h-4 w-4" />
ì í ë¬¸ìíê¸°
</a>
</div>
</section>
</section>
</main>
);
}
