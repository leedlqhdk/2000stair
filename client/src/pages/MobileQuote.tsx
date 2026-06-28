import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, MessageCircle, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { trackConversion } from "@/lib/analytics";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_IiNfn/chat";
const PHONE_NUMBER = "010-8438-1887";

const buildingTypes = ["빌라", "상가", "오피스텔", "주택", "기타"];
const serviceItems = ["계단청소", "유리청소", "화장실청소", "정기관리"];

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function MobileQuote() {
  const [, setLocation] = useLocation();
  const [phone, setPhone] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);

  const submitQuote = trpc.quote.submit.useMutation();

  function toggleService(item: string) {
    setServices((prev) => (prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]));
  }

  async function handleSubmit() {
    const phoneOk = phone.replace(/\D/g, "").length >= 10;
    const nextErrors = {
      phone: !phoneOk,
      agree: !agree,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const extraNote = [
      buildingType ? `건물유형: ${buildingType}` : null,
      services.length ? `청소항목: ${services.join(", ")}` : null,
      message.trim() || null,
    ]
      .filter(Boolean)
      .join("\n");

    trackConversion("quote_form_submit", { location: "mobile_quote_page", label: "무료 견적 신청하기" });

    try {
      await submitQuote.mutateAsync({
        name: "모바일 간편문의",
        phone: phone.trim(),
        address: "전화 상담 요청",
        serviceType: "in_person",
        planId: services.length ? services.join(",") : "상담 후 결정",
        message: extraNote || undefined,
      });
      setDone(true);
    } catch {
      // toast/error feedback is handled globally by trpc error link
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-background px-8 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-primary">
          <Check className="h-9 w-9" strokeWidth={2.4} />
        </div>
        <h1 className="font-['GmarketSans'] text-xl font-extrabold text-foreground">
          문의가 접수되었습니다
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          평일 기준 빠르게 연락드릴게요.
          <br />
          급하시면 카카오톡으로 사진과 함께 보내주세요.
        </p>

        <div className="mt-6 w-full rounded-2xl border border-blue-100 bg-blue-50 p-4 text-left">
          <div className="flex gap-2 py-1 text-[13px]">
            <span className="w-16 shrink-0 font-bold text-muted-foreground">연락처</span>
            <span className="font-semibold text-foreground">{phone}</span>
          </div>
          {buildingType && (
            <div className="flex gap-2 py-1 text-[13px]">
              <span className="w-16 shrink-0 font-bold text-muted-foreground">건물</span>
              <span className="font-semibold text-foreground">{buildingType}</span>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 flex h-13 w-full items-center justify-center rounded-2xl bg-primary text-[15.5px] font-extrabold text-white shadow-lg shadow-primary/25"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-blue-100 bg-white/95 px-2 backdrop-blur">
        <button
          type="button"
          onClick={() => setLocation("/")}
          aria-label="뒤로"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground active:bg-blue-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-['GmarketSans'] text-[17px] font-extrabold text-foreground">무료 견적 문의</h1>
      </header>

      <div className="px-5 pb-2 pt-5">
        <p className="font-['Pretendard'] text-[11px] font-extrabold tracking-[0.2em] text-primary">
          FREE ESTIMATE
        </p>
        <h2 className="mt-2 font-['GmarketSans'] text-[1.4rem] font-extrabold leading-snug text-foreground">
          건물 상태만 알려주시면
          <br />
          최적의 견적을 보내드려요
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          아래 내용을 남겨주시면 평일 기준 빠르게 연락드립니다. 사진이 있다면 카카오톡으로 함께 보내주세요.
        </p>
      </div>

      <div className="flex flex-col gap-5 px-5 py-4">
        <div className="flex flex-col gap-2">
          <label className="text-[13.5px] font-bold text-foreground">
            연락처 <span className="text-primary">*</span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            inputMode="numeric"
            placeholder="010-0000-0000"
            maxLength={13}
            className={`h-[52px] rounded-xl border-[1.5px] px-4 text-[15px] font-medium outline-none focus:border-primary ${errors.phone ? "border-destructive" : "border-blue-200"}`}
          />
          {errors.phone && <span className="text-xs font-bold text-destructive">연락처를 정확히 입력해 주세요.</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13.5px] font-bold text-foreground">
            건물 유형 <span className="text-muted-foreground">(선택)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {buildingTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBuildingType(type)}
                className={`rounded-[11px] border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition ${
                  buildingType === type
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                    : "border-blue-200 bg-white text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13.5px] font-bold text-foreground">
            청소 항목 <span className="text-muted-foreground">(중복 선택)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceItems.map((item) => {
              const active = services.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleService(item)}
                  className={`inline-flex items-center gap-1.5 rounded-[11px] border-[1.5px] px-4 py-2.5 text-[13.5px] font-bold transition ${
                    active
                      ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                      : "border-blue-200 bg-white text-gray-700"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13.5px] font-bold text-foreground">
            요청 내용 <span className="text-muted-foreground">(선택)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="층수, 평수, 오염 상태, 희망 일정 등을 자유롭게 적어주세요."
            className="h-[108px] resize-none rounded-xl border-[1.5px] border-blue-200 px-4 py-3.5 text-[15px] font-medium leading-relaxed outline-none focus:border-primary"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
          />
          <span className="text-[12.5px] font-semibold leading-relaxed text-gray-700">
            <b className="text-foreground">개인정보 수집·이용에 동의합니다.</b>
            <br />
            문의 응대 목적에 한해 연락처를 수집하며, 응대 완료 후 파기합니다.
          </span>
        </label>
        {errors.agree && (
          <span className="-mt-3 text-xs font-bold text-destructive">개인정보 수집·이용에 동의해 주세요.</span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 px-5 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitQuote.isPending}
          className="flex h-[54px] items-center justify-center gap-2 rounded-2xl bg-primary text-[15.5px] font-extrabold text-white shadow-lg shadow-primary/25 disabled:opacity-60"
        >
          <Send className="h-[18px] w-[18px]" />
          {submitQuote.isPending ? "신청 중..." : "견적 문의 보내기"}
        </button>
        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion("kakao_click", { location: "mobile_quote_page", label: "카카오톡으로 바로 문의" })}
          className="flex h-[54px] items-center justify-center gap-2 rounded-2xl bg-[#FEE500] text-[15.5px] font-extrabold text-[#3a2929]"
        >
          <MessageCircle className="h-[18px] w-[18px]" />
          카카오톡으로 바로 문의
        </a>
      </div>
      <p className="px-5 pb-9 pt-3.5 text-center text-xs font-semibold text-muted-foreground">
        전화 상담 <b className="text-foreground">{PHONE_NUMBER}</b> · 평일 09:00 - 18:00
      </p>
    </div>
  );
}
