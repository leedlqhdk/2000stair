// 상단 메뉴(데스크톱 메뉴·전체 메뉴·모바일 메뉴)가 함께 쓰는 메뉴 구성
export type DropdownItem = {
  label: string;
  href: string;
  sectionId?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items: DropdownItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "소개",
    href: "/about",
    items: [],
  },
  {
    label: "관리지역",
    items: [
      { label: "관고동", href: "/area/gwango" },
      { label: "창전동", href: "/area/changjeon" },
      { label: "중리동", href: "/area/jungni" },
      { label: "증포동", href: "/area/jeungpo" },
      { label: "부발읍", href: "/area/bubal" },
      { label: "신둔면", href: "/area/sindun" },
      { label: "백사면", href: "/area/baeksa" },
      { label: "마장면", href: "/area/majang" },
      { label: "대월면", href: "/area/daewol" },
      { label: "호법면", href: "/area/hobeop" },
      { label: "곤지암읍", href: "/area/gonjiam" },
    ],
  },
  {
    label: "청소서비스",
    items: [
      { label: "계단청소", href: "/services/stair" },
      { label: "사무실청소", href: "/services/office" },
      { label: "유리청소", href: "/services/glass" },
      { label: "화장실청소", href: "/services/bathroom" },
      
    ],
  },
  {
    label: "작업정보",
    items: [
      { label: "청소 전후", href: "/before-after" },
      { label: "자주 묻는 질문", href: "/qna" },
      { label: "정보글", href: "/guide" },
      { label: "공식블로그", href: "https://blog.naver.com/icheonstair" },
    ],
  },
  
];
