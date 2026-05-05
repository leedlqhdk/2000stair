import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          구독이 완료되었습니다!
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          PeanutCrate 구독을 시작해 주셔서 감사합니다. 첫 번째 박스가 곧
          준비됩니다. 배송 시작 전 이메일로 알려드릴게요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => setLocation("/")}>
            홈으로 돌아가기
          </Button>
          <Button variant="outline" onClick={() => setLocation("/my-subscription")}>
            구독 관리
          </Button>
        </div>
      </div>
    </div>
  );
}
