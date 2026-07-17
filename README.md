# 이천계단지기 — 대표 김규남 링크 페이지

[litt.ly/2000stair](https://litt.ly/2000stair) 페이지를 정적 HTML로 재현한 링크인바이오 페이지입니다.

## 구성

- `index.html` — 페이지 전체 (HTML + CSS + 약간의 JS, 단일 파일)
- `images/` — 프로필·커버·서비스·갤러리 이미지

## 로컬에서 보기

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## GitHub Pages 배포

저장소 **Settings → Pages → Branch: `main` / root** 로 설정하면
`https://<계정명>.github.io/<저장소명>/` 주소로 공개됩니다.
