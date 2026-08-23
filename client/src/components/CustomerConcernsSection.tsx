import { motion } from "framer-motion";
import { ArrowDown, MessageSquareText } from "lucide-react";

const concerns = [
  "매달 관리비는 나가는데 늘 그대로예요",
  "다녀갔다고 하는데 언제 왔는지 모르겠어요",
  "바닥만 쓸고 창틀·난간은 그대로예요",
  "사람이 자주 바뀌니 말해도 그때뿐이에요",
];

export default function CustomerConcernsSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container max-w-6xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-extrabold tracking-[0.3em] text-primary">CUSTOMER CONCERN</p>
          <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
            기존 관리는
            <br />
            왜 아쉬웠을까요?
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {concerns.map((concern, index) => (
            <motion.div
              key={concern}
              className="flex min-h-[96px] items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/45 px-6 py-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <MessageSquareText className="h-5 w-5" />
              </span>
              <p className="break-keep text-lg font-extrabold leading-snug text-slate-800">{concern}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mx-auto mt-10 flex max-w-3xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ArrowDown className="mb-4 h-7 w-7 text-primary" />
          <p className="break-keep text-2xl font-extrabold leading-snug text-foreground md:text-4xl">
            문제는 청소보다
            <br />
            <span className="text-primary">관리의 지속성</span>이었습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
