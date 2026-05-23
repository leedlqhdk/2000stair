# 🤖 AI 2000stair 협업팀

AI들이 함께 콘텐츠를 만드는 협업 공간입니다.

## 📋 팀 구성 및 역할

| AI             | 역할            | 담당업무                                             | 산출물              |
| -------------- | --------------- | ---------------------------------------------------- | ------------------- |
| 🤖 **Gemini**  | 리서처          | 매일 아침 최신 트렌드, SEO 로직 변화, 경쟁사 분석    | `/research` 리포트  |
| ✍️ **Claude**  | 메인 카피라이터 | Gemini 리서치 기반 전문적 블로그 포스팅 작성         | `/blog-posts` 글    |
| 🎨 **GPT**     | 아트 디렉터     | Claude 글의 주제 시각화, 고퀄리티 이미지 생성        | `/images` 이미지    |
| 🌐 **Manus**   | 웹 빌더         | 블로그 포스팅 활용 웹사이트 제작/포트폴리오 업데이트 | `/website` 웹페이지 |
| 🔍 **Copilot** | 협업 매니저     | 워크플로우 자동화, 리서치 데이터 수집, 프로세스 관리 | 자동화 스크립트     |

---

## 🗂️ 폴더 구조

```
2000stair/
├── research/              # Gemini의 일일 리서치 리포트
│   ├── 2026-05-06.md     # YYYY-MM-DD 형식
│   └── templates/         # 리포트 템플릿
├── blog-posts/            # Claude의 완성된 블로그 글
│   ├── drafts/            # 작업 중인 글
│   └── published/         # 완성된 글
├── images/                # GPT의 생성 이미지
│   ├── thumbnails/        # 블로그 썸네일
│   └── content/           # 본문 삽입 이미지
├── website/               # Manus의 웹사이트
│   ├── src/
│   ├── pages/
│   └── portfolio/
├── docs/                  # 공용 문서
│   ├── WORKFLOW.md        # 협업 워크플로우
│   ├── GUIDELINES.md      # 작성 가이드
│   └── AI_PROMPTS.md      # AI별 프롬프트 템플릿
└── AI_TEAM_README.md      # 이 파일
```

---

## 🔄 자동화 워크플로우

### 1️⃣ Gemini (리서처) - 매일 아침 9:00

**Trigger**: 매일 정해진 시간
**Output**: `/research/YYYY-MM-DD.md` 파일 생성
**Auto-Action**:

- 파일 생성 시 자동으로 Claude에게 알림
- GitHub Issues 자동 생성 (제목: "Daily Research - 2026-05-06")

---

### 2️⃣ Claude (메인 카피라이터)

**Trigger**: Gemini 리서치 완료 (Issues/PR)
**Input**: `/research/YYYY-MM-DD.md` 데이터 활용
**Output**: `/blog-posts/drafts/` → `/blog-posts/published/`
**Auto-Action**:

- 글 작성 완료 후 PR 생성
- PR 제목: "[Blog] [날짜] [주제]"
- 자동으로 GPT에게 이미지 생성 요청

---

### 3️⃣ GPT (아트 디렉터)

**Trigger**: Claude의 블로그 글 완성 (PR)
**Input**: 블로그 글의 주제, 핵심 키워드
**Output**: `/images/thumbnails/` 및 `/images/content/` 이미지
**Auto-Action**:

- 이미지 업로드 완료 후 블로그 PR에 댓글로 알림
- Manus에게 웹사이트 업데이트 요청

---

### 4️⃣ Manus (웹 빌더)

**Trigger**: 블로그 + 이미지 모두 완성 (PR Merge)
**Input**: 완성된 블로그 글 + 이미지
**Output**: 웹사이트 포트폴리오 페이지 업데이트
**Auto-Action**:

- 웹사이트 배포 완료 후 Releases 생성
- 협업팀에게 완성 알림

---

### 5️⃣ Copilot (협업 매니저)

**Trigger**: 모든 단계 모니터링
**Actions**:

- 각 단계별 진행 상황 추적
- 지연되는 작업 감지 및 알림
- 일일 협업 진행 보고서 생성
- 자동화 워크플로우 최적화

---

## 📌 GitHub Issues 자동화

### Issue 템플릿

```
Title: [역할] [날짜] [주제]
Labels: 역할별 라벨 (gemini, claude, gpt, manus, copilot)
Assignee: 담당 AI
```

**예시:**

- `[Gemini] 2026-05-06 AI 시장 트렌드 분석`
- `[Claude] 2026-05-06 블로그 포스팅 작성`
- `[GPT] 2026-05-06 이미지 생성`
- `[Manus] 2026-05-06 웹사이트 업데이트`

---

## 🔗 웹훅 설정

**GitHub Settings → Webhooks에서 설정:**

1. **이벤트 감지**:
   - Push (새 리서치 리포트)
   - Pull Request (글, 이미지, 웹사이트)
   - Issues (작업 요청)

2. **자동화 스크립트**:
   - `/automation/webhooks.js` 참고
   - 각 이벤트별 트리거 처리

---

## ✅ 체크리스트

- [ ] 협업 공간 구조 확인
- [ ] 각 AI의 역할 이해
- [ ] 웹훅 설정 완료
- [ ] 첫 번째 리서치 리포트 생성
- [ ] 자동화 워크플로우 테스트

---

## 📞 협업 시작하기

1. **Gemini**: `/research` 폴더에 일일 리포트 생성
2. **Claude**: Gemini 리포트 읽고 블로그 글 작성
3. **GPT**: Claude 글 읽고 이미지 생성
4. **Manus**: 완성된 콘텐츠로 웹사이트 업데이트
5. **Copilot**: 전체 진행 상황 모니터링 및 자동화

---

**마지막 업데이트**: 2026-05-06
**협업팀 상태**: 🟢 Ready to Collaborate
