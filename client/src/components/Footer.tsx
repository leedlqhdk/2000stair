import { Phone, Mail, MapPin, MessageCircle, Youtube, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16 md:py-20">
      <motion.div
        className="container max-w-7xl"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-10 lg:gap-14">
          <div>
            <a href="/" className="inline-flex items-center mb-5 group" aria-label="이천계단지기 홈으로 이동">
              <img
                src="/images/icheon-logo-white.png"
                alt="이천계단지기"
                className="h-10 md:h-11 w-auto max-w-[220px] object-contain"
              />
            </a>

            <p className="text-white/65 text-sm leading-relaxed max-w-sm mb-6">
              이천 빌라·상가 공용공간을 부부가 직접 관리합니다.
            </p>

            <div className="space-y-2.5 text-sm text-white/60">
              <a
                href="tel:010-8438-1887"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                010-8438-1887
              </a>

              <a
                href="mailto:rbska3308@naver.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                rbska3308@naver.com
              </a>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                경기도 이천시 경충대로3160번길 21
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Service</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  상담 절차
                </a>
              </li>
              <li>
                <a href="#box-preview" className="hover:text-white transition-colors">
                  관리 방식
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  청소 전후
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  청소 비용
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Archive</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <a
                  href="/areas"
                  className="hover:text-white transition-colors"
                >
                  관리 가능 지역
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
                  href="https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  유튜브 채널
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-foreground px-4 py-3 text-sm font-bold hover:bg-white/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                카톡 상담
              </a>

              <div className="flex gap-2">
                <a
                  href="https://www.instagram.com/icheon_stair/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://youtube.com/@2000stair?si=UxYmvQPywQSOj3DU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                <a
                  href="https://blog.naver.com/icheonstair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-xs font-bold transition-colors"
                  aria-label="Naver Blog"
                >
                  B
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-sm text-white/45">
            © {new Date().getFullYear()} 이천계단지기. All rights reserved.
          </p>

          <p className="text-sm text-white/45">
            사업자등록번호 234-23-02318 · 이천 계단청소 정기관리
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
