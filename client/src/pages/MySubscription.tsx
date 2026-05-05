import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MySubscription() {
  const { user, isAuthenticated, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const { data: subscription, isLoading } = trpc.subscription.current.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const cancelMutation = trpc.subscription.cancel.useMutation();
  const utils = trpc.useUtils();

  const handleCancel = async () => {
    if (!confirm("정말 구독을 해지하시겠습니까?")) return;
    try {
      await cancelMutation.mutateAsync();
      toast.success("구독이 해지되었습니다.");
      utils.subscription.current.invalidate();
    } catch (error: any) {
      toast.error(error.message || "해지 중 오류가 발생했습니다.");
    }
  };

  const statusLabels: Record<string, string> = {
    active: "활성",
    canceled: "해지됨",
    past_due: "연체",
    incomplete: "미완료",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} />
      <main className="flex-1 container py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">구독 관리</h1>

        {isLoading ? (
          <div className="text-muted-foreground">불러오는 중...</div>
        ) : subscription ? (
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                현재 구독
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">상태</span>
                <span
                  className={`font-medium px-2 py-0.5 rounded text-sm ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusLabels[subscription.status] || subscription.status}
                </span>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">다음 결제일</span>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              )}
              {subscription.status === "active" && (
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "처리 중..." : "구독 해지"}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-lg">
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                아직 활성 구독이 없습니다.
              </p>
              <Button onClick={() => setLocation("/#pricing")}>
                구독 시작하기
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
