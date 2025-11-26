# 기술 스택

Todo 애플리케이션 프로젝트에서 사용하는 기술 스택입니다.

## 전체 아키텍처

```
┌─────────────────┐
│   Vercel        │  ← 프론트엔드 배포
│  (React + Vite) │
└────────┬────────┘
         │ HTTP API
         ↓
┌─────────────────┐
│   Cloudtype     │  ← 백엔드 배포
│  (Node.js +     │
│   Express)      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ MongoDB Atlas   │  ← 데이터베이스
└─────────────────┘
```

## 프론트엔드 (todo-react)

### 핵심 기술

- **React** `^18.2.0` - UI 라이브러리
- **React DOM** `^18.2.0` - React DOM 렌더링

### 빌드 도구

- **Vite** `^5.0.8` - 빠른 빌드 도구 및 개발 서버
- **@vitejs/plugin-react** `^4.2.1` - Vite용 React 플러그인

### 개발 도구

- **@types/react** `^18.2.43` - React TypeScript 타입 정의
- **@types/react-dom** `^18.2.17` - React DOM TypeScript 타입 정의

### 언어 및 모듈 시스템

- **JavaScript (ES6+)** - 모던 JavaScript
- **ES Modules** - `type: "module"` 사용

### 배포

- **Vercel** - 프론트엔드 배포 플랫폼
  - 자동 배포 (Git 연동)
  - 환경 변수 관리
  - CDN 제공

## 백엔드 (todo-backend)

### 핵심 기술

- **Node.js** `v18+` - JavaScript 런타임 환경
- **Express** `^5.1.0` - 웹 애플리케이션 프레임워크

### 데이터베이스

- **MongoDB Atlas** - 클라우드 NoSQL 데이터베이스
- **Mongoose** `^8.19.2` - MongoDB ODM (Object Data Modeling)
  - 스키마 정의
  - 데이터 검증
  - 쿼리 빌더

### 미들웨어 및 유틸리티

- **CORS** `^2.8.5` - Cross-Origin Resource Sharing 처리
- **dotenv** `^17.2.3` - 환경 변수 관리

### 언어 및 모듈 시스템

- **JavaScript (ES6+)** - 모던 JavaScript
- **ES Modules** - `type: "module"` 사용

### 배포

- **Cloudtype** - 백엔드 배포 플랫폼
  - Docker 컨테이너 기반
  - 자동 빌드 및 배포
  - 환경 변수 관리

## 데이터베이스

### MongoDB Atlas

- **타입**: NoSQL 문서 데이터베이스
- **특징**:
  - 클라우드 기반 (서버리스)
  - 자동 백업 및 복구
  - 글로벌 분산
  - 무료 티어 제공

## 개발 환경

### 패키지 관리자

- **npm** - Node.js 패키지 관리자

### 버전 관리

- **Git** - 소스 코드 버전 관리
- **GitHub** - 원격 저장소

## 프로젝트 구조

### 백엔드 아키텍처

- **MVC 패턴** 적용
  - Models: 데이터베이스 모델 (Mongoose 스키마)
  - Controllers: 비즈니스 로직
  - Routes: API 라우트 정의

### 프론트엔드 아키텍처

- **컴포넌트 기반** 구조
- **React Hooks** 사용 (useState, useEffect)

## API 통신

- **RESTful API** - HTTP 메서드 기반
- **JSON** - 데이터 교환 형식
- **CORS** - 크로스 오리진 요청 허용

## 환경 변수

### 프론트엔드

- `VITE_API_BASE_URL` - 백엔드 API 기본 URL

### 백엔드

- `MONGODB_URI` - MongoDB 연결 문자열
- `PORT` - 서버 포트 (기본값: 5000)

## 주요 기능

### 백엔드 API

- ✅ 할 일 생성 (POST)
- ✅ 할 일 조회 (GET)
- ✅ 할 일 수정 (PUT)
- ✅ 할 일 삭제 (DELETE)

### 프론트엔드 기능

- ✅ 할 일 목록 표시
- ✅ 할 일 추가
- ✅ 할 일 수정
- ✅ 할 일 삭제
- ✅ 할 일 완료 토글

