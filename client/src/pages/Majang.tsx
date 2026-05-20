export default function MajangAreaPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container max-w-6xl pt-24 pb-20">
        
        {/* 상단 */}
        <div className="mb-12">
          <p className="text-sm font-bold tracking-[0.3em] text-primary mb-4">
            AREA ARCHIVE
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground mb-4">
            마장면 작업일지
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            마장면 빌라·원룸 공동공간 관리 사례
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            최근 작업 지역을 기준으로 업데이트됩니다.
          </p>
        </div>

        {/* 작업 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <article className="overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500">
            
            <div className="overflow-hidden">
              <img
                src="/manus-storage/example.webp"
                alt="마장면 원룸 계단청소"
                className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-extrabold text-foreground leading-snug mb-3">
                마장면 원룸 계단청소 작업일지
              </h2>

              <p className="text-sm text-muted-foreground">
                2026.05.20
              </p>
            </div>

          </article>

        </div>

        {/* 문의 CTA */}
        <div className="mt-20 rounded-[2rem] border border-blue-100 bg-blue-50/40 p-8 md:p-12 text-center">

          <h2 className="text-3xl font-extrabold text-foreground mb-4">
            마장면 관리 문의
          </h2>

          <p className="text-muted-foreground mb-8">
            정기관리·계단청소·공동현관 관리 문의 가능합니다.
          </p>

          <a
            href="https://pf.kakao.com/_IiNfn"
            target="_blank"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-white font-bold hover:opacity-90 transition"
          >
            카카오톡 문의하기
          </a>

        </div>

      </section>
    </main>
  );
}
