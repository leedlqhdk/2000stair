import { Package } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Package className="w-6 h-6" />
              <span>PeanutCrate</span>
            </a>
            <p className="text-white/60 text-sm leading-relaxed">
              매달 엄선된 프리미엄 친환경 청소 용품을 문 앞까지 배송해 드립니다.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">서비스</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  작동 방식
                </a>
              </li>
              <li>
                <a href="#box-preview" className="hover:text-white transition-colors">
                  박스 구성
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  가격
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">고객지원</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  자주 묻는 질문
                </button>
              </li>
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  배송 안내
                </button>
              </li>
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  환불 정책
                </button>
              </li>
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  문의하기
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">SNS</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  Instagram
                </button>
              </li>
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  YouTube
                </button>
              </li>
              <li>
                <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
                  Blog
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} PeanutCrate. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
              이용약관
            </button>
            <button onClick={() => toast.info("준비 중인 기능입니다.")} className="hover:text-white transition-colors">
              개인정보처리방침
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
