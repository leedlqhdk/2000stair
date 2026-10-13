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

// 홈 진행 방식 섹션 왼쪽에 들어가는 관리 지역 지도 (지역을 누르면 지역 안내 페이지로 이동)
export default function HomeAreaMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  function handleNavigate(name: string) {
    const url = REGION_LINKS[name];
    if (url) setLocation(url);
  }

  return (
    <InteractiveMap
      activeRegion={activeRegion}
      onEnter={setActiveRegion}
      onLeave={() => setActiveRegion(null)}
      onClick={handleNavigate}
    />
  );
}
