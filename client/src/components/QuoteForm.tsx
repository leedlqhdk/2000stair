import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Send, MapPin, Phone, User, Mail } from "lucide-react";

export default function QuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState<"in_person" | "non_contact">("in_person");
  const [planId, setPlanId] = useState("stair_4");
  const [message, setMessage] = useState("");

  const submitQuote = trpc.quote.submit.useMutation();

  // Listen for plan selection from PricingSection
  useEffect(() => {
    const handleSelectPlan = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.planId) {
        setPlanId(customEvent.detail.planId);
      }
    };
    window.addEventListener("selectPlan", handleSelectPlan);
    return () => window.removeEventListener("selectPlan", handleSelectPlan);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      toast.error("연락처를 입력해주세요.");
      return;
    }
    if (!address.trim()) {
      toast.error("주소를 입력해주세요.");
      return;
    }

    try {
      await submitQuote.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        serviceType,
        planId,
        message: message.trim() || undefined,
      });

      toast.success("견적 신청이 완료되었습니다! 빠른 시일 내에 연락드리겠습니다.");
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setServiceType("in_person");
      setPlanId("stair_4");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <section id="quote-form" className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              무료 방문 견적 신청
            </h2>
            <p className="text-muted-foreground text-lg">
              아래 정보를 입력하시면 빠른 시일 내에 무료 방문 견적을 드립니다.
            </p>
          </div>

          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">견적 신청서</CardTitle>
              <CardDescription>
                모든 항목을 작성해주시면 정확한 견적을 안내해 드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    이름 / 업체명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동 / OO빌라 관리사무소"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    연락처 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    이메일 (선택)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    건물 주소 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="경기도 이천시 OO동 OO번지"
                  />
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <Label>서비스 유형 <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceType("in_person")}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        serviceType === "in_person"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">대면 서비스</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        현장 방문 후 직접 상담
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceType("non_contact")}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        serviceType === "non_contact"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">비대면 서비스</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        사진/영상으로 견적 진행
                      </div>
                    </button>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="space-y-2">
                  <Label htmlFor="plan">희망 서비스</Label>
                  <Select value={planId} onValueChange={setPlanId}>
                    <SelectTrigger>
                      <SelectValue placeholder="서비스를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stair_2_3">2-3층 계단 (40,000원~)</SelectItem>
                      <SelectItem value="stair_4">4층 계단 (50,000원~)</SelectItem>
                      <SelectItem value="stair_5_6">5-6층 계단 (60,000원~)</SelectItem>
                      <SelectItem value="bathroom">화장실/사무실/상가 유리청소 (별도 문의)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">추가 요청사항 (선택)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="건물 층수, 특이사항, 희망 청소 시작일 등을 자유롭게 적어주세요."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base"
                  disabled={submitQuote.isPending}
                >
                  {submitQuote.isPending ? (
                    "신청 중..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      무료 견적 신청하기
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  신청 후 �4시간 이내에 연락드립니다. 견적은 무료이며 부담 없이 상담 받으세요.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
