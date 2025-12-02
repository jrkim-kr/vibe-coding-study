## Jeongran Kim – Portfolio

### 🔍 주요 기능

- **원페이지 포트폴리오**
  - Hero(소개) / 기술 스택 / 프로젝트 / 학습 & 노트 섹션 구성
  - 상단 Nav 버튼 클릭 시 각 섹션으로 부드럽게 스크롤 이동

- **Hero 카드**
  - 현재 학습 상태: `Currently learning Vibe Coding`
  - 프로필 이미지, 이름, 역할, Tech Stack / Github / Email / Velog 정보 표시
  - 버튼
    - GitHub 프로필 바로가기: [`https://github.com/jrkim-kr`](https://github.com/jrkim-kr)
    - Google Slides 포트폴리오: 바이브 코딩 과정용 발표용 포트폴리오 슬라이드

- **프로젝트 섹션**
  - **ReciPICK** – 레시피 기반 식재료 쇼핑몰
  - **SOL Pick** – 스마트 식생활 관리 서비스
  - 각 카드에 역할, 사용 기술, GitHub Repo 링크 정리

- **학습 & 노트 섹션**
  - **Vibe Coding by 코알누**
    - 기간: `2025.10 ~ 2025.11`
    - 레포: [`https://github.com/jrkim-kr/vibe-coding-study`](https://github.com/jrkim-kr/vibe-coding-study)
  - **Docker by 코딩애플**
    - 기간: `2025.06 ~ 2025.08`
    - 레포: [`https://github.com/jrkim-kr/docker-coding-apple`](https://github.com/jrkim-kr/docker-coding-apple)

- **테마 토글 (Modern ↔ Retro)**
  - 헤더 오른쪽 `Retro / Modern` 버튼으로 테마 전환
  - 선택한 테마를 `localStorage`에 저장해 새로고침 후에도 유지
  - **Modern**: 토스 스타일 다크 모드, 글래스모피즘 카드, 블루 포인트 컬러  
  - **Retro**: 보라/파랑/핑크 네온, 픽셀 폰트(`Press Start 2P`, `VT323`), CRT 스캔라인 효과

---

### 🛠 기술 스택

- **Frontend**
  - HTML5, CSS3, Vanilla JavaScript
  - 커스텀 디자인 시스템 (CSS 변수 + 테마 클래스)
  - 구글 웹 폰트: Pretendard, Poppins, Press Start 2P, VT323

- **구조**
  - `index.html` – 페이지 구조 및 섹션 정의
  - `style.css` – 토스 스타일 / 레트로 스타일 테마, 레이아웃 및 컴포넌트 스타일
  - `script.js` – Nav 스무스 스크롤, 상단으로 이동 버튼, 테마 토글 로직

---

### 📁 폴더 구조

```bash
jrkim-portfolio/
  ├─ index.html           # 메인 포트폴리오 페이지
  ├─ style.css            # 공통 + 모던/레트로 테마 스타일
  ├─ script.js            # 스크롤/테마 토글 관련 스크립트
  └─ profile-avatar.png   # Hero 카드에 사용되는 프로필 이미지
```

---

### ▶️ 실행 방법

```bash
cd jrkim-portfolio

# macOS
open index.html

# Windows (PowerShell 또는 CMD)
start index.html

# Linux (예시)
xdg-open index.html
```

브라우저에서 페이지를 연 뒤,  
- 상단 Nav로 섹션을 이동해 보고  
- 오른쪽 `Retro` 버튼을 눌러 2000년대 픽셀 레트로 테마도 함께 확인해 볼 수 있습니다.

---

### 📬 연락처

- GitHub: [`https://github.com/jrkim-kr`](https://github.com/jrkim-kr)  
- Email: `jeongrankim99@gmail.com`  
- Velog: [`https://velog.io/@jrkim99/posts`](https://velog.io/@jrkim99/posts)


