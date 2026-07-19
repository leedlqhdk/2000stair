# 이천계단지기 디지털명함

대표 김규남의 디지털 명함 페이지입니다. 글래스모피즘 카드 디자인으로,
연락처 저장(vCard), 전화·카카오톡·홈페이지·네이버 블로그·이메일·인스타그램·유튜브·당근 링크를 제공합니다.

## 구성

- `index.html` — 페이지 전체 (단일 파일, 폰트는 CDN)
- `images/` — 배경, 프로필, 로고 이미지

## 로컬에서 보기

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 배포

- Vercel(2000stair 팀) 배포 후 `card.2000stair.kr` 도메인 연결 예정
- GitHub Pages 사용 시: Settings → Pages → Branch `main` / root
