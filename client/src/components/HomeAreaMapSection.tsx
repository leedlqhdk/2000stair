import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { InteractiveMap } from "@/pages/Areas";

const REGION_LINKS: Record<string, string> = {
  관고동: "/area/gwango",
  창전동: "/area/changjeon",
  중리동: "/area/jungni",
  증포동: "/area/jeungpo",
  부발읍: "/area/bubal",
  신둔면: "/area/sindun",
  백사면: "/area/baeksa",
  마장면: "/area/majang",
  대월면: "/area/daewol",
};

const featuredRegions = ["신둔면", "마장면", "대월면", "관고동", "창전동", "중리동", "증포동", "부발읍", "백사면"];

export default function HomeAreaMapSection() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  function handleNavigate(name: string) {
    const url = REGION_LINKS[name];
    if (url) setLocation(url);
  }

  return (
    <section id="home-areas" className="bg-gradient-to-b from-white via-blue-50/35 to-white py-20 md:py-28">
      <div className="container grid max-w-6xl items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="mb-4 text-xs font-extrabold tracking-[0.3em] text-primary">SERVICE AREA</p>
          <h2 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            이천에서 실제 관리하는
            <br />
            지역입니다
          </h2>
          <p className="mt-5 break-keep text-lg font-semibold leading-relaxed text-muted-foreground">
            지역명을 누르면 해당 지역 전용 안내와 작업일지를 확인할 수 있습니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {featuredRegions.map((name) => (
              <Link
                key={name}
                href={REGION_LINKS[name]}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-blue-100 bg-white px-4 text-sm font-extrabold text-primary shadow-sm transition hover:border-primary/35 hover:bg-blue-50"
                onMouseEnter={() => setActiveRegion(name)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <MapPin className="h-4 w-4" />
                {name}
              </Link>
            ))}
          </div>

          <Link
            href="/areas"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(15,76,169,0.22)] transition hover:-translate-y-0.5"
          >
            전체 방문지역 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,76,169,0.10)]">
          <InteractiveMap
            activeRegion={activeRegion}
            onEnter={setActiveRegion}
            onLeave={() => setActiveRegion(null)}
            onClick={handleNavigate}
          />
        </div>
      </div>
    </section>
  );
}
