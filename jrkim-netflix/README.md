# Netflix Style 영화 웹사이트

현재 상영 중인 영화를 보여주는 Netflix 스타일의 웹사이트입니다. TMDB(The Movie Database) API를 활용하여 영화 정보를 가져오고, 반응형 디자인으로 구현되었습니다.

## 📋 프로젝트 소개

이 프로젝트는 HTML, CSS, JavaScript를 사용하여 Netflix와 유사한 디자인의 영화 웹사이트를 만든 학습 프로젝트입니다. TMDB API를 통해 현재 상영 중인 영화 데이터를 가져와 표시합니다.

## 🎯 주요 기능

### 강의 3-2: 기본 영화 카드 표시

- 현재 상영 중인 영화 목록 표시
- 영화 포스터 이미지 표시
- 영화 제목 및 기본 정보 표시
- Netflix 스타일의 다크 테마 디자인
- 반응형 레이아웃 (데스크톱, 태블릿, 모바일 지원)
- 수평 스크롤 가능한 영화 카드 레이아웃
- 카드 호버 시 확대 효과

### 강의 3-3: 상세 정보 및 모달 기능

- 영화 카드에 추가 정보 표시:
  - 평점 (vote_average)
  - 투표 수 (vote_count)
  - 개봉일 (release_date)
- 카드 클릭 시 모달 창으로 상세 정보 표시:
  - 영화 포스터 (대형)
  - 제목
  - 평점 및 투표 수
  - 개봉일
  - 줄거리 (overview)
- 모달 기능:
  - 닫기 버튼으로 닫기
  - 배경 클릭으로 닫기
  - ESC 키로 닫기
  - 모달 열림 시 배경 스크롤 방지

## 🛠️ 기술 스택

- **HTML5**: 웹페이지 구조
- **CSS3**: 스타일링 및 반응형 디자인
- **JavaScript (ES6+)**: API 호출 및 동적 콘텐츠 생성
- **TMDB API**: 영화 데이터 제공

## 📁 파일 구조

```
jrkim-netflix/
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트
├── script.js           # JavaScript 로직
├── README.md           # 프로젝트 문서
├── 3-2_prompt.md       # 강의 3-2 프롬프트 및 결과물
└── 3-3_prompt.md       # 강의 3-3 프롬프트 및 결과물
```

## 🚀 시작하기

### 사전 요구사항

- 웹 브라우저 (Chrome, Firefox, Safari, Edge 등)
- 인터넷 연결 (TMDB API 호출을 위해 필요)

### 설치 및 실행

1. 저장소 클론 또는 파일 다운로드

```bash
git clone <repository-url>
cd jrkim-netflix
```

2. 브라우저에서 `index.html` 파일 열기

   - 로컬 서버 없이도 바로 실행 가능합니다.
   - 또는 로컬 서버를 사용하는 것을 권장합니다:

   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (http-server)
   npx http-server
   ```

3. 브라우저에서 `http://localhost:8000` 접속

## 📖 사용 방법

1. **페이지 로드**: 페이지가 열리면 자동으로 현재 상영 중인 영화 목록을 가져옵니다.

2. **영화 카드 탐색**:

   - 마우스를 카드 위에 올리면 확대 효과가 적용됩니다.
   - 좌우로 스크롤하여 더 많은 영화를 볼 수 있습니다.

3. **상세 정보 보기**:

   - 영화 카드를 클릭하면 모달 창이 열립니다.
   - 모달에서 영화의 상세 정보(줄거리, 평점, 개봉일 등)를 확인할 수 있습니다.

4. **모달 닫기**:
   - 우측 상단의 × 버튼 클릭
   - 모달 배경(어두운 영역) 클릭
   - ESC 키 누르기

## 🎨 디자인 특징

- **Netflix 스타일**: 다크 테마 (#141414 배경)
- **반응형 디자인**: 모든 디바이스에서 최적화된 레이아웃
- **부드러운 애니메이션**: 호버 효과, 모달 전환 효과
- **사용자 친화적 UI**: 직관적인 네비게이션 및 인터랙션

## 🔧 API 설정

이 프로젝트는 TMDB(The Movie Database) API를 사용합니다.

- **API 엔드포인트**: `https://api.themoviedb.org/3/movie/now_playing`
- **이미지 베이스 URL**: `https://image.tmdb.org/t/p/w500`
- **언어 설정**: 한국어 (ko-KR)

> **참고**: API 키는 `script.js` 파일에 포함되어 있습니다. 실제 프로덕션 환경에서는 환경 변수나 보안 설정을 통해 관리하는 것을 권장합니다.

## 🐛 문제 해결

### API 오류 확인 방법

개발자 도구의 Network 탭에서 다음을 확인하세요:

1. **Headers**

   - Request URL: API 주소 일치 여부 확인
   - 쿼리 파라미터: 서비스가 제공하는 파라미터 확인
   - Status Code: 응답 상태 코드 확인

2. **Payload**

   - 전송된 쿼리 파라미터 값 확인

3. **Preview / Response**
   - 응답 데이터 확인

### 일반적인 문제

- **CORS 오류**: 로컬 서버를 사용하여 실행하세요.
- **이미지가 표시되지 않음**: 네트워크 연결 및 이미지 URL 확인
- **API 호출 실패**: API 키 유효성 및 네트워크 연결 확인

## 📝 학습 내용 정리

### 강의 3-2 

- TMDB API 연동
- 비동기 데이터 처리 (async/await)
- 동적 DOM 요소 생성
- CSS Flexbox를 활용한 레이아웃
- 반응형 디자인 구현

### 강의 3-3 

- 영화 데이터 필드 활용 (overview, vote_count, release_date)
- 모달 창 구현
- 이벤트 리스너 활용 (클릭, 키보드)
- CSS 전환 효과 및 애니메이션
- API 오류 디버깅 방법

## 📄 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

## 🙏 참고 자료

- [TMDB API 문서](https://developers.themoviedb.org/3/getting-started/introduction)
- [TMDB 웹사이트](https://www.themoviedb.org/)

---

**프로젝트 작성일**: 2025년 11월 2일
**버전**: 1.0.1
