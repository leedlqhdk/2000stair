import { useState } from "react";
import { useLocation } from "wouter";
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
  호법면: "/area/hobeop",
};

export default function HomeAreaMapSection() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  function handleNavigate(name: string) {
    const url = REGION_LINKS[name];
    if (url) setLocation(url);
  }

  return (
    <section className="bg-gradient-to-b from-white via-blue-50/35 to-white py-20 md:py-28">
      <div className="container max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <h2 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            관리 지역
          </h2>
          <p className="mt-5 break-keep text-lg font-semibold leading-relaxed text-muted-foreground">
            지역명을 누르면 해당 지역 전용 안내와 작업일지를 확인할 수 있습니다.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
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
