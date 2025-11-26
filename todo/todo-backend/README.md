# Todo Backend

Todo Backend API 서버입니다.

## 목차

- [시작하기](#시작하기)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [API 문서](#api-문서)
- [배포](#배포)
- [추가 문서](#추가-문서)

## 시작하기

### 필요 조건

- Node.js (v18 이상 권장)

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 MongoDB 연결 문자열을 설정하세요:

```bash
echo 'MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING' > .env
```

### 실행

```bash
# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## 기술 스택

### 핵심 기술

- **Node.js** (v18+) - JavaScript 런타임
- **Express** `^5.1.0` - 웹 프레임워크

### 데이터베이스

- **MongoDB Atlas** - 클라우드 NoSQL 데이터베이스
- **Mongoose** `^8.19.2` - MongoDB ODM

### 주요 라이브러리

- **CORS** `^2.8.5` - Cross-Origin Resource Sharing
- **dotenv** `^17.2.3` - 환경 변수 관리

### 배포

- **Cloudtype** - 백엔드 배포 플랫폼

전체 기술 스택은 [`../docs/todo-tech-stack.md`](../docs/todo-tech-stack.md)를 참고하세요.

## 프로젝트 구조

일반적인 Node.js 백엔드 프로젝트는 **`src` 폴더 안에 모든 소스 코드**를 구성합니다. 이는 다음과 같은 이유로 권장됩니다:

- **명확한 분리**: 소스 코드와 설정 파일, 문서를 구분
- **빌드/배포 용이**: `src` 폴더만 빌드하면 됨
- **모던한 관례**: 대부분의 Node.js 프로젝트에서 사용하는 표준 구조

### 현재 프로젝트 구조

```
todo-backend/
├── src/
│   ├── index.js         # 메인 엔트리 포인트 (서버 시작)
│   ├── models/          # Model: 데이터베이스 모델 (Mongoose 스키마)
│   │   └── Todo.js      # Todo 모델
│   ├── controllers/     # Controller: 비즈니스 로직 (요청 처리)
│   │   └── todoController.js
│   └── routes/          # Routes: URL 라우팅 (MVC의 일부 아님)
│       └── todoRoutes.js
├── package.json         # 프로젝트 설정 및 의존성
├── .gitignore          # Git 무시 파일 목록
└── README.md           # 프로젝트 문서
```

**참고**: 이 프로젝트는 **MVC 패턴**을 따릅니다. View는 프론트엔드(React 앱)에서 담당하며, 백엔드는 JSON 데이터만 반환합니다. Routes는 URL을 컨트롤러 함수에 매핑하는 역할만 합니다. 자세한 내용은 [`../docs/backend-architecture.md`](../docs/backend-architecture.md)를 참고하세요.

### 확장 가능한 구조 (향후 추가 가능)

```
todo-backend/
├── src/
│   ├── models/          # 데이터베이스 모델
│   ├── controllers/     # 비즈니스 로직 (요청 처리)
│   ├── routes/          # API 라우트 정의
│   ├── middleware/      # 커스텀 미들웨어
│   ├── config/          # 설정 파일 (DB 연결 등)
│   ├── utils/           # 유틸리티 함수
│   └── index.js         # 엔트리 포인트
├── package.json
└── README.md
```

**참고**: `src` 폴더를 사용하는 것이 일반적이지만, 작은 프로젝트에서는 루트에 직접 `models`, `routes` 등을 두는 방식도 사용됩니다. 프로젝트 규모와 팀 선호도에 따라 선택하면 됩니다.

## API 문서

### Todo API

| 메서드 | 엔드포인트   | 설명            |
| ------ | ------------ | --------------- |
| POST   | `/todos`     | 할 일 생성      |
| GET    | `/todos`     | 할 일 전체 조회 |
| GET    | `/todos/:id` | 할 일 단일 조회 |
| PUT    | `/todos/:id` | 할 일 수정      |
| DELETE | `/todos/:id` | 할 일 삭제      |

### 사용 예시

```bash
# 할 일 생성
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "새로운 할 일"}'

# 전체 조회
curl http://localhost:5000/todos

# 단일 조회
curl http://localhost:5000/todos/:id

# 수정
curl -X PUT http://localhost:5000/todos/:id \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 삭제
curl -X DELETE http://localhost:5000/todos/:id
```

## 배포

이 프로젝트는 다음 플랫폼에 배포되어 있습니다:

- **데이터베이스**: MongoDB Atlas
- **백엔드 서버**: Cloudtype

자세한 배포 가이드는 [`../docs/fullstack-deployment.md`](../docs/fullstack-deployment.md)를 참고하세요.

## 추가 문서

- [배포 가이드](../docs/fullstack-deployment.md) - MongoDB Atlas 및 Cloudtype, Vercel 풀스택 배포 방법
- [아키텍처 가이드](../docs/backend-architecture.md) - Mongoose 모델 및 애플리케이션 흐름 설명
