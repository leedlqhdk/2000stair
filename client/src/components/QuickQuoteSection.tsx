import { useState } from "react";
import { CheckCircle2, MapPin, Phone, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "form" | "sent";

export default function QuickQuoteSection() {
  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !address.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, notes }),
      });
      if (!res.ok) throw new Error();
      setStep("sent");
    } catch {
      setError("전송에 실패했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setPhone("");
    setAddress("");
    setNotes("");
    setError("");
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
                      무료방문견적 신청
                    </h2>
                    <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
                      연락처와 주소를 남겨주시면<br />
                      직접 방문해 무료로 견적서를 드립니다.
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
                      {error && (
                        <p className="text-xs text-red-500 text-center">{error}</p>
                      )}
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
                        무료방문견적 신청
                      </button>

                      <div className="flex items-center justify-center gap-4">
                        <a
                          href="tel:01084381887"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          전화 문의
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 px-7 text-center"
              >
                <CheckCircle2 className="h-14 w-14 text-green-500 mb-5" />
                <h2 className="text-2xl font-extrabold text-foreground mb-2">
                  신청이 완료됐습니다!
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-8 max-w-sm">
                  빠른 시일 내에 직접 연락드리겠습니다.<br />
                  무료로 방문하여 정확한 견적서를 드립니다.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition"
                >
                  다시 신청하기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
