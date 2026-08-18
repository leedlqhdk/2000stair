import { Link } from "wouter";
import { ArrowLeft, Building2, Camera, FileText, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";

const proofItems = [
  { icon: Building2, title: "지역별 상담", shortTitle: "상담", text: "주소와 사진을 기준으로 방문 가능 여부를 먼저 확인합니다." },
  { icon: Camera, title: "초도청소 후 청소 전후 사진 제공", shortTitle: "사진", text: "초도청소 후 청소 전후 사진으로 관리 상태를 공유합니다." },
  { icon: ReceiptText, title: "사업자 증빙", shortTitle: "증빙", text: "세금계산서와 현금영수증 발행이 가능합니다." },
  { icon: FileText, title: "계약 기준", shortTitle: "계약", text: "관리 범위와 주기를 정리해 계약 조건을 안내합니다." },
];

type AreaIntroProps = {
  headline: string;
  description: string;
  focus: string;
};

export default function AreaIntro({ headline, description, focus }: AreaIntroProps) {
  return (
    <>
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <Link href="/areas">
          <a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-80">
            <ArrowLeft className="h-4 w-4" />
            관리지역으로 돌아가기
          </a>
        </Link>

        <div className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="p-6 md:p-8">
              <p className="mb-4 text-xs font-bold tracking-[0.35em] text-primary md:text-sm">
                AREA ARCHIVE
              </p>
              <h1 className="mb-4 text-3xl font-extrabold leading-[1.18] text-foreground md:text-4xl">
                {headline}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="border-t border-blue-100 bg-blue-50/70 p-6 lg:border-l lg:border-t-0 md:p-8">
              <p className="text-sm font-extrabold text-primary">상담 전 확인할 내용</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{focus}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <section className="mb-8 grid grid-cols-4 gap-2 md:mb-16 md:gap-4">
        {proofItems.map((item) => (
          <div key={item.title} className="flex min-h-[74px] flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white px-2 py-3 text-center shadow-sm md:min-h-0 md:items-start md:justify-start md:rounded-[1.25rem] md:p-5 md:text-left">
            <item.icon className="mb-1.5 h-5 w-5 text-primary md:mb-3" />
            <h2 className="text-[12px] font-extrabold leading-tight text-foreground md:mb-2 md:text-sm">
              <span className="md:hidden">{item.shortTitle}</span>
              <span className="hidden md:inline">{item.title}</span>
            </h2>
            <p className="hidden text-sm leading-6 text-muted-foreground md:block">{item.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
