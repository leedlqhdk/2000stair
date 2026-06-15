import { useState } from "react";
import { CheckCircle2, ClipboardCopy, MapPin, MessageCircle, Phone, RotateCcw, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "form" | "ready";

export default function QuickQuoteSection() {
  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = `[이천계단지기 간편 견적신청]\n📞 연락처: ${phone}\n📍 주소: ${address}${notes.trim() ? `\n📝 기타: ${notes}` : ""}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !address.trim()) return;
    setLoading(true);

    navigator.clipboard.writeText(message).catch(() => {});

    setTimeout(() => {
      setLoading(false);
      setStep("ready");
    }, 300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenKakao = () => {
    window.open("https://pf.kakao.com/_IiNfn/chat", "_blank");
  };

  const handleReset = () => {
    setStep("form");
    setPhone("");
    setAddress("");
    setNotes("");
    setCopied(false);
  };

  return (
    <section className="bg-gradient-to-b from-white via-blue-50/30 to-blue-50/50 py-14 md:py-20">
      <div className="container max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm"
        >
          <AnimatePresence mode="wait">
            {step === "form" ? (
              /* ── STEP 1: 폼 ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid md:grid-cols-[1fr_1.2fr]">
                  {/* 왼쪽 */}
                  <div className="p-7 md:p-10">
                    <p className="mb-3 text-xs font-bold tracking-[0.3em] text-primary">
                      FREE ESTIMATE
                    </p>
                    <h2 className="mb-2 text-2xl font-extrabold leading-snug text-foreground md:text-3xl">
                      간편 견적신청
                    </h2>
                    <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
                      연락처와 주소를 남겨주시면<br />
                      빠른 시일 내에 직접 연락드립니다.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-foreground">
                          연락처 <span className="text-primary">*</span>
                        </label>
                        <div className="flex items-center gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-white transition">
                          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-0000-0000"
                            required
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-foreground">
                          주소 <span className="text-primary">*</span>
                        </label>
                        <div className="flex items-center gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 focus-within:border-primary/50 focus-within:bg-white transition">
                          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="동·읍·면까지 입력해주세요"
                            required
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽 */}
                  <div className="flex flex-col border-t border-blue-50 p-7 md:border-l md:border-t-0 md:p-10">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-xs font-bold text-foreground">
                        기타사항
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="건물 층수, 청소 주기, 특이사항 등을 자유롭게 적어주세요."
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:bg-white transition min-h-[100px] md:h-[calc(100%-2rem)]"
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
                      >
                        {loading ? (
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <SendHorizonal className="h-5 w-5" />
                        )}
                        상담 신청하기
                      </button>

                      <div className="flex items-center justify-center gap-4">
                        <a
                          href="tel:01084381887"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          전화 문의
                        </a>
                        <span className="text-muted-foreground/30">·</span>
                        <a
                          href="https://pf.kakao.com/_IiNfn/chat"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          카카오 바로가기
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.form>
            ) : (
              /* ── STEP 2: 카카오 전송 안내 ── */
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-7 md:p-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="h-7 w-7 shrink-0 text-green-500" />
                  <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-primary mb-0.5">STEP 2 / 2</p>
                    <h2 className="text-xl font-extrabold text-foreground">
                      카카오톡에 붙여넣기 해주세요
                    </h2>
                  </div>
                </div>

                {/* 복사된 메시지 미리보기 */}
                <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-bold text-primary">전송될 내용</p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-primary border border-blue-100 hover:bg-primary hover:text-white transition"
                    >
                      <ClipboardCopy className="h-3 w-3" />
                      {copied ? "복사됨 ✓" : "다시 복사"}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-medium leading-relaxed">
                    {message}
                  </pre>
                </div>

                {/* 안내 스텝 */}
                <div className="mb-6 grid grid-cols-3 gap-2 text-center text-xs font-bold text-muted-foreground">
                  <div className="rounded-xl bg-blue-50 px-2 py-3">
                    <p className="text-lg mb-1">①</p>
                    아래 버튼으로<br />카카오톡 열기
                  </div>
                  <div className="rounded-xl bg-blue-50 px-2 py-3">
                    <p className="text-lg mb-1">②</p>
                    채팅창 길게 누르기<br />(모바일)
                  </div>
                  <div className="rounded-xl bg-blue-50 px-2 py-3">
                    <p className="text-lg mb-1">③</p>
                    붙여넣기 선택<br />(PC: Ctrl+V)
                  </div>
                </div>

                {/* 카카오 열기 버튼 */}
                <button
                  type="button"
                  onClick={handleOpenKakao}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-6 py-4 text-base font-extrabold text-[#191919] shadow-lg transition hover:bg-[#F4DC00] active:scale-[0.98] mb-3"
                >
                  <MessageCircle className="h-5 w-5" />
                  카카오톡 채팅 열기
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-100 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  다시 작성하기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
