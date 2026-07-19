import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";

const helpfulLinks = [
  { label: "작업기록", href: "/records", desc: "실제 청소 작업 사진과 기록" },
  { label: "정보글", href: "/guide", desc: "계단·유리·화장실 청소 안내" },
  { label: "방문지역", href: "/areas", desc: "이천 서비스 가능 지역" },
  { label: "무료 견적", href: "/quote", desc: "1분이면 끝나는 견적 문의" },
];

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
                <AlertCircle className="relative h-16 w-16 text-red-500" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>

            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              페이지를 찾을 수 없습니다
            </h2>

            <p className="text-slate-600 mb-8 leading-relaxed">
              찾으시는 페이지가 이동되었거나 삭제되었을 수 있어요.
              <br />
              아래에서 필요한 정보를 바로 찾아보세요.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
              {helpfulLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  <span className="block text-sm font-bold text-slate-800">
                    {link.label}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    {link.desc}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGoHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Home className="w-4 h-4 mr-2" />
                홈으로 가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
