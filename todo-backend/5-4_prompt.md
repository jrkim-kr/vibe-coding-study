# 대화 내용 요약

## 1. Node.js 프로젝트 설정

### 요청

Node.js를 사용할 수 있게 세팅 요청

### 수행 작업

- `package.json` 생성
  - ES Modules 사용 (`"type": "module"`)
  - 기본 스크립트 설정 (`start`, `dev`)
- `.gitignore` 생성 (node_modules, .env, logs 등)
- `src/index.js` 기본 파일 생성
- `README.md` 생성
- 패키지 설치 확인 (Node.js v25.1.0, npm v11.6.2)

---

## 2. MongoDB 연결 및 Express 서버 설정

### 요청

- MongoDB 연결 코드 추가
- 서버를 포트 5000번에서 실행
- MongoDB 연결 성공 시 성공 멘트 표시

### 수행 작업

- 필요한 패키지 설치: `express`, `mongoose`, `dotenv`
- MongoDB 연결 코드 작성
  - `mongoose.connect()` 사용
  - 환경 변수 지원 (`.env` 파일의 `MONGODB_URI`)
  - 기본값: `mongodb://localhost:27017/todo-db`
- Express 서버 설정
  - 포트 5000번에서 실행
  - JSON 미들웨어 설정
  - 기본 라우트 추가 (`/`)
- MongoDB 연결 성공 메시지 출력
- 연결 상태 이벤트 리스너 추가 (`connected`, `error`, `disconnected`)

---

## 3. 중복 메시지 문제 해결

### 요청

MongoDB 연결 성공 멘트가 2번 나오는 이유 확인 및 수정

### 문제 원인

- `mongoose.connect().then()` 내부에서 성공 메시지 출력
- `mongoose.connection.on('connected')` 이벤트 리스너에서도 성공 메시지 출력
- 두 곳에서 같은 메시지가 중복 출력됨

### 해결 방법

- `mongoose.connect().then()` 내부의 성공 메시지 제거
- `mongoose.connection.on('connected')` 이벤트 리스너에서만 성공 메시지 출력
- 결과: 성공 메시지가 한 번만 출력됨

---

## 최종 코드 구조

```
src/index.js
├── Express 서버 설정
├── MongoDB 연결
│   ├── mongoose.connect()
│   └── 연결 상태 이벤트 리스너
└── 기본 라우트 (/)
```

## 주요 특징

- **포트**: 5000번
- **MongoDB**: mongoose를 사용한 연결 관리
- **환경 변수**: dotenv를 통한 설정 관리
- **에러 처리**: MongoDB 연결 실패 시 프로세스 종료
- **연결 상태 모니터링**: connected, error, disconnected 이벤트 처리
