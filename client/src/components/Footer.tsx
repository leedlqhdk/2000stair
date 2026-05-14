import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center mb-4">
              <img
                src="/manus-storage/icheon-stair-logo-original_ae15bcef.png"
                alt="이천계단지기"
                className="h-8 w-auto"
              />
            </a>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              이천 전 지역 계단청소 전문업체.
              정기 구독으로 깨끗한 건물을 유지하세요.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>010-8438-1887</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>rbska3308@naver.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>경기도 이천시 경충대로3160번길21</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">서비스</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  서비스 소개
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  요금 안내
                </a>
              </li>
              <li>
                <a href="#quote-form" className="hover:text-white transition-colors">
                  무료 견적 신청
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">고객지원</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="https://blog.naver.com/icheonstair/224035739944"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  견적표 안내
                </a>
              </li>
              <li>
                <a href="tel:010-8438-1887" className="hover:text-white transition-colors">
                  전화 문의
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">SNS</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="https://www.instagram.com/icheon_stair/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.threads.net/@icheon_stair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href="https://blog.naver.com/icheonstair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  네이버 블로그
                </a>
              </li>
              <li>
                <a
                  href="https://pf.kakao.com/_IiNfn/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  카카오톡 상담
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} 이천계단지기. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <span>사업자등록번호: 234-23-02318</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
