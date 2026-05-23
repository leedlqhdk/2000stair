import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Phone, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyQuotes() {
  const { user, isAuthenticated, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [, setLocation] = useLocation();
  const { data: requests, isLoading } = trpc.quote.myRequests.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "접수 완료", color: "text-yellow-600 bg-yellow-100" };
      case "contacted":
        return { label: "상담 진행 중", color: "text-blue-600 bg-blue-100" };
      case "confirmed":
        return { label: "계약 완료", color: "text-green-600 bg-green-100" };
      case "canceled":
        return { label: "취소됨", color: "text-gray-600 bg-gray-100" };
      default:
        return { label: status, color: "text-gray-600 bg-gray-100" };
    }
  };

  const getServiceTypeLabel = (type: string) => {
    return type === "in_person" ? "대면" : "비대면";
  };

  const getPlanLabel = (planId: string) => {
    switch (planId) {
      case "basic":
        return "Basic";
      case "standard":
        return "Standard";
      case "premium":
        return "Premium";
      default:
        return planId;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>

        <h1 className="text-2xl font-bold mb-6">내 견적 신청 내역</h1>

        {isLoading ? (
          <p className="text-muted-foreground">불러오는 중...</p>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(req => {
              const status = getStatusLabel(req.status);
              return (
                <Card key={req.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {getServiceTypeLabel(req.serviceType)} |{" "}
                            {getPlanLabel(req.planId)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {req.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(req.createdAt).toLocaleDateString(
                            "ko-KR"
                          )}{" "}
                          신청
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                아직 견적 신청 내역이 없습니다
              </h3>
              <p className="text-muted-foreground mb-6">
                무료 방문 견적을 신청하고 맞춤 청소 서비스를 시작하세요.
              </p>
              <Button onClick={() => setLocation("/#quote-form")}>
                무료 견적 신청하기
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
