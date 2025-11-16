# Todo React

Vite를 사용한 React Todo 애플리케이션입니다.

## 목차

- [시작하기](#시작하기)
- [기술 스택](#기술-스택)
- [개발](#개발)
- [빌드](#빌드)
- [배포](#배포)

## 시작하기

### 필요 조건

- Node.js (v18 이상 권장)
- npm 또는 yarn

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 백엔드 API 주소를 설정하세요:

```bash
# .env 파일 생성
touch .env
```

`.env` 파일에 다음 내용을 추가하세요:

```
VITE_API_BASE_URL=https://your-backend-url-here.com
```

**로컬 개발 시:**

```
VITE_API_BASE_URL=http://localhost:5000
```

## 기술 스택

### 핵심 기술

- **React** `^18.2.0` - UI 라이브러리
- **React DOM** `^18.2.0` - React DOM 렌더링

### 빌드 도구

- **Vite** `^5.0.8` - 빠른 빌드 도구 및 개발 서버
- **@vitejs/plugin-react** `^4.2.1` - Vite용 React 플러그인

### 배포

- **Vercel** - 프론트엔드 배포 플랫폼

전체 기술 스택은 [TODO_TECH_STACK.md](../TODO_TECH_STACK.md)를 참고하세요.

## 개발

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 빌드

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

빌드된 결과물을 로컬에서 미리 확인할 수 있습니다.

## 배포

이 프로젝트는 **Vercel**에 배포되어 있습니다.

### Vercel 배포 방법

1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. "Add New Project" 클릭
3. 이 프로젝트 저장소 선택
4. 환경 변수 설정:
   - `VITE_API_BASE_URL`: 백엔드 API 주소 (예: `https://your-backend.cloudtype.app`)
5. "Deploy" 클릭

### 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정하면:

- 프로덕션 환경에서 자동으로 적용됩니다
- 빌드 시점에 환경 변수가 주입됩니다

### 참고사항

- Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에서 접근 가능합니다
- 배포 후 환경 변수를 변경하면 재배포가 필요합니다
- Vercel은 Git 저장소와 연결되어 자동 배포가 가능합니다
