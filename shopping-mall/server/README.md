# Shopping Mall Backend API

Node.js, Express, MongoDB를 사용한 쇼핑몰 백엔드 API 서버입니다.

## 기술 스택

- **Node.js**: JavaScript 런타임
- **Express**: 웹 프레임워크
- **MongoDB**: NoSQL 데이터베이스
- **Mongoose**: MongoDB ODM

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
cp .env.example .env
```

3. `.env` 파일을 열어 MongoDB 연결 정보를 설정하세요.

## 실행 방법

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## API 엔드포인트

- `GET /`: API 상태 확인
- `GET /health`: 서버 및 데이터베이스 상태 확인

## 프로젝트 구조

```
server/
├── src/
│   └── index.js          # 메인 서버 파일
├── .env.example          # 환경 변수 예제
├── .gitignore
├── package.json
└── README.md
```

## MongoDB 연결

로컬 MongoDB를 사용하는 경우:
- MongoDB가 실행 중이어야 합니다.
- 기본 연결 URI: `mongodb://localhost:27017/shopping-mall-db`

MongoDB Atlas를 사용하는 경우:
- `.env` 파일에 Atlas 연결 문자열을 설정하세요.

