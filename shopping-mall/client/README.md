# Shopping Mall Client

Vite와 React를 사용한 쇼핑몰 프론트엔드 애플리케이션입니다.

## 기술 스택

- **React**: 사용자 인터페이스 구축
- **Vite**: 빠른 개발 환경 및 빌드 도구

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정 (선택사항):
```bash
cp env.example .env
```

3. `.env` 파일을 열어 API 서버 URL을 설정하세요 (기본값: `http://localhost:5000`)

## 실행 방법

### 개발 모드
```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

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
│   ├── App.jsx          # 메인 컴포넌트
│   ├── App.css          # 앱 스타일
│   ├── main.jsx         # 진입점
│   └── index.css        # 전역 스타일
├── index.html           # HTML 템플릿
├── vite.config.js       # Vite 설정
├── package.json
└── README.md
```

## Vite 설정

- 개발 서버 포트: `3000`
- API 프록시: `/api` 요청이 자동으로 `http://localhost:5000`으로 전달됩니다.

## 백엔드 서버 연결

프론트엔드는 백엔드 서버(`http://localhost:5000`)와 통신합니다.
백엔드 서버가 실행 중이어야 정상적으로 작동합니다.

