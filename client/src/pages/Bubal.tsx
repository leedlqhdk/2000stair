import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, MessageCircle, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import AreaTimeline from "@/components/AreaTimeline";
import { useAreaPosts, type AreaPost } from "@/hooks/useAreaPosts";

const fallbackPosts: AreaPost[] = [];

const serviceCards = [
{
title: "ê´ë¦¬ ëì",
text: "ë¶ë°ì ë¹ë¼, ìë£¸, ìê°, ìí ê±´ë¬¼ì ê³ë¨Â·ë³µëÂ·ê³uëíê´ì ê´ë¦¬í©ëë¤.",
},
{
title: "ì²­ì ë²ì",
text: "ë°ë¥ ë¨¼ì§ ì ê±°, ëê° ììêµ­, ì ë¦¬ë¬¸, ì°í¸í¨ ì£¼ë³, ì¶ìêµ¬ ì¤ì¼ì í¨ê» íì¸í©ëë¤.",
},
{
title: "ì§í ë°©ì",
text: "ì¬ì§ì¼ë¡ ìíë¥¼ ë¨¼ì  íì¸íê³ , ì ê¸°ê´ë¦¬ ì£¼ê¸°ì ìì ë²ìë¥¼ ê±´ë¬¼ì ë§ì¶° ìë´í©ëë¤.",
},
];

const reviews = [
"ê³µì©íê´ê³¼ ê³ë¨ì´ ê¾¸ì¤í ì ë¦¬ëëê¹ ìì£¼ë¯¼ ë¯¼ìì´ ì¤ììµëë¤.",
"ì¬ì§ì¼ë¡ ì í ìíë¥¼ ë³´ë´ì£¼ìì ê´ë¦¬ ì¬ë¶ë¥¼ ë°ë¡ íì¸í  ì ìììµëë¤.",
];

const faqs = [
{
question: "ë¶ë°ì ì´ë ì§ì­ê¹ì§ ê°ë¥íê°ì?",
answer: "ìë¯¸ë¦¬, ë¬´ì´ë¦¬, ì íë¦¬ ë± ë¶ë°ì ì£¼ì ìíê¶ì ìë´ ê°ë¥í©ëë¤. ì¬ì§ê³¼ ì£¼ìë¥¼ ë³´ë´ì£¼ìë©´ ë°©ë¬¸ ê°ë¥ ì¬ë¶ë¥¼ ë¨¼ì  íì¸í©ëë¤.",
},
{
question: "ìì ê¸°ë¡ì´ ìì§ ìì´ë ìë´ ê°ë¥íê°ì?",
answer: "ê°ë¥í©ëë¤. ìì ì¬ì§ì ìì°¨ì ì¼ë¡ ì ë¦¬ ì¤ì´ë©°, ê²¬ì ì íì¬ ê±´ë¬¼ ìíì ê´ë¦¬ ë²ìë¥¼ ê¸°ì¤ì¼ë¡ ìë´ëë¦½ëë¤.",
},
];

export default function BubalAreaPage() {
const { posts } = useAreaPosts("bubal", fallbackPosts);

useEffect(() => {
  document.title = "ë¶ë°ì ê³ë¨ì²­ì ì ë¬¸ | ì´ì²ê³ë¨ì§ê¸°";
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
<a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
<ArrowLeft className="h-4 w-4" />
ê´ë¦¬ì§ì­ì¼ë¡ ëìê°ê¸°
</a>
</Link>

<div className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm">
<div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
<div className="p-6 md:p-8">
<p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
AREA ARCHIVE
</p>
<h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
ë¶ë°ì ê³ë¨ì²­ìì ê³µì©ê³µê° ê´ë¦¬ë¥¼ ì¤ë¹íê³  ììµëë¤
</h1>
<p className="max-w-2xl text-base leading-8 text-muted-foreground">
ë¶ë°ì ë¹ë¼Â·ìë£¸Â·ìê° ê³µì©ê³µê°ì íì²­ ìì´ ì§ì  ê´ë¦¬í©ëë¤. ìì ê¸°ë¡ì ìì°¨ì ì¼ë¡ ì ë¦¬ ì¤ì´ë©°, ìë´ì ë°ë¡ ê°ë¥í©ëë¤.
</p>
</div>
<div className="border-t border-blue-100 bg-blue-50/70 p-6 lg:border-l lg:border-t-0 md:p-8">
<p className="text-sm font-extrabold text-primary">ìë´ ì  ë³´ë´ì£¼ìë©´ ì¢ì ì¬ì§</p>
<ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
<li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />ê³ë¨ ì ì²´ì ì¸µê° ë³µë</li>
<li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />ê³µëíê´ ì ë¦¬ë¬¸ê³¼ ë°ë¥</li>
<li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />ì¤ì¼ì´ ì¬í êµ¬ê° close-up</li>
</ul>
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
areaName="ë¶ë°ì"
areaSlug="bubal"
posts={posts}
title="ë¶ë°ì ìì ì¼ì§"
description="ë¶ë°ì íì¥ ì¬ì§ì ì ë¦¬ëë ììëë¡ ìì ì¼ì§ì ì¶ê°ë©ëë¤."
emptyMessage="ë¶ë°ì ìì ê¸°ë¡ì ì¬ì§ ì ë¦¬ í ììëë¡ ì¶ê°í ê²ì. ìë´ê³¼ ê²¬ì  ìë´ë ì§ê¸ë ê°ë¥í©ëë¤."
/>

<section className="mb-12 grid gap-4 md:grid-cols-2 md:mb-16">
{reviews.map((review) => (
<div key={review} className="rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm">
<div className="mb-3 flex items-center gap-1 text-yellow-400">
{Array.from({ length: 5 }).map((_, index) => (
<Star key={index} className="h-4 w-4 fill-current" />
))}
</div>
<p className="text-base leading-relaxed text-foreground">"{review}"</p>
<p className="mt-4 text-sm text-muted-foreground">ë¶ë°ì ì¸ê·¼ ê±´ë¬¼ ê´ë¦¬ í¼ëë°±</p>
</div>
))}
</section>

<section className="mb-12 rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm md:mb-16 md:p-8">
<h2 className="mb-5 text-xl font-extrabold text-foreground md:text-2xl">ìì£¼ ë¬»ë ì§ë¬¸</h2>
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
<h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">ë¶ë°ì ì²­ì ê´ë¦¬ê° íìíì ê°ì?</h2>
<p className="mb-8 text-muted-foreground">ê³ë¨Â·ë³µëÂ·ê³µëíê´ ì¬ì§ì ë³´ë´ì£¼ìë©´ ê´ë¦¬ ê°ë¥ ë²ìë¶í° íì¸í´ëë¦½ëë¤.</p>
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
