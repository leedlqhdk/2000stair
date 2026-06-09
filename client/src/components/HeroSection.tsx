            <div className="mt-5 flex max-w-md flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
              <a
                href="https://pf.kakao.com/_IiNfn/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 sm:w-auto"
              >
                카톡으로 사진 보내기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-4 flex max-w-xl flex-wrap gap-x-6 gap-y-2">
              {["하청 없이 부부가 직접", "무료 방문 견적", "작업 전후 사진 보고"].map(badge => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  {badge}
                </span>
              ))}
            </div>
