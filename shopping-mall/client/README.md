# Shoppping Mall Demo Client

Vite와 React를 사용한 Shoppping Mall Demo 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React 18** - 사용자 인터페이스 구축
- **React Router** - 클라이언트 사이드 라우팅
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **Cloudinary** - 이미지 업로드 및 관리

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
cp env.example .env
```

3. `.env` 파일을 열어 다음을 설정하세요:
   - `VITE_API_BASE_URL`: 백엔드 API 서버 URL (기본값: `http://localhost:5000`)
   - `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary Upload Preset

## 실행 방법

### 개발 모드
```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 프로덕션 미리보기
```bash
npm run preview
```

빌드된 애플리케이션을 미리 볼 수 있습니다.

## 프로젝트 구조

```
client/
├── src/
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── MainPage.jsx    # 메인 페이지
│   │   ├── LoginPage.jsx   # 로그인 페이지
│   │   ├── RegisterPage.jsx # 회원가입 페이지
│   │   └── Admin*.jsx       # 관리자 페이지들
│   │
│   ├── components/          # 재사용 컴포넌트
│   │   ├── ProductCard.jsx  # 상품 카드
│   │   ├── ImageUploader.jsx # 이미지 업로더
│   │   ├── ProductModal.jsx # 상품 등록/수정 모달
│   │   └── AdminSidebar.jsx # 관리자 사이드바
│   │
│   ├── utils/              # 유틸리티 함수
│   │   └── cloudinary.js   # Cloudinary 업로드
│   │
│   ├── data/               # 정적 데이터
│   │   └── products.js     # 샘플 상품 데이터
│   │
│   ├── App.jsx             # 메인 앱 컴포넌트
│   ├── main.jsx            # 진입점
│   └── index.css           # 전역 스타일
│
├── index.html              # HTML 템플릿
├── vite.config.js          # Vite 설정
├── env.example             # 환경 변수 예제
├── package.json
└── README.md
```

## 라우팅

### 사용자 페이지
- `/` - 메인 페이지
- `/login` - 로그인
- `/register` - 회원가입

### 관리자 페이지
- `/admin` - 대시보드
- `/admin/products` - 상품 관리
- `/admin/orders` - 주문 관리
- `/admin/categories` - 카테고리 관리
- `/admin/customers` - 회원 관리

## 주요 기능

### 이미지 업로드
- Cloudinary를 통한 이미지 업로드
- 드래그 앤 드롭 스타일 UI
- 업로드 진행률 표시
- 이미지 미리보기 및 삭제

### 관리자 기능
- 대시보드: 매출 통계, 주문 현황
- 상품 관리: 등록, 수정, 삭제, 검색
- 주문 관리: 주문 목록, 배송 상태 변경
- 카테고리 관리: 계층 구조 지원
- 회원 관리: 회원 목록, 통계 조회

## 환경 변수

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 백엔드 API 서버 URL | `http://localhost:5000` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | - |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Upload Preset | - |

## 백엔드 서버 연결

프론트엔드는 백엔드 서버(`http://localhost:5000`)와 통신합니다.
백엔드 서버가 실행 중이어야 정상적으로 작동합니다.

## Cloudinary 설정

이미지 업로드를 사용하려면 Cloudinary 계정이 필요합니다:

1. [Cloudinary](https://cloudinary.com/)에서 계정 생성
2. 대시보드에서 Cloud Name 확인
3. Settings > Upload > Upload presets에서 Unsigned preset 생성
4. `.env` 파일에 설정 추가

## 스타일링

- CSS 모듈 방식 사용
- 반응형 디자인 지원
- 모바일, 태블릿, 데스크톱 최적화

## 개발 팁

### 새 페이지 추가
1. `src/pages/`에 컴포넌트 생성
2. `src/App.jsx`에 라우트 추가

### 새 컴포넌트 추가
1. `src/components/`에 컴포넌트 생성
2. 필요한 스타일 파일 생성

### API 호출
현재는 직접 fetch를 사용하고 있습니다. 향후 axios나 React Query 도입을 고려할 수 있습니다.

## 빌드 및 배포

### 빌드
```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 배포
빌드된 `dist/` 폴더를 정적 호스팅 서비스(Vercel, Netlify 등)에 배포할 수 있습니다.

---

**마지막 업데이트:** 2025-01-22

