# 할일 관리 앱

미니멀리즘 디자인의 할일 관리 웹 애플리케이션입니다. REST API 백엔드 서버를 통해 데이터를 관리합니다.

## 🚀 시작하기

### 1. 백엔드 서버 실행

먼저 `todo-backend` 서버를 실행해야 합니다:

```bash
cd ../todo-backend
npm install
npm run dev
```

서버가 `http://localhost:5000`에서 실행됩니다.

### 2. 프론트엔드 실행

프로젝트는 정적 파일이므로 웹 서버가 필요합니다. 다음 중 하나를 사용하세요:

**Python 사용:**

```bash
python -m http.server 8000
```

**Node.js http-server 사용:**

```bash
npx http-server
```

**VS Code Live Server 확장 사용:**

- VS Code에서 `index.html` 파일을 우클릭
- "Open with Live Server" 선택

그 후 브라우저에서 `http://localhost:8000` (또는 지정한 포트)로 접속합니다.

> ⚠️ 주의: 백엔드 서버(`todo-backend`)가 실행 중이어야 프론트엔드가 정상적으로 동작합니다.

## 📁 프로젝트 구조

```
todo-firebase/
├── index.html              # HTML 구조
├── style.css              # 미니멀리즘 스타일
├── script.js              # 할일 관리 로직 및 REST API 연동
├── .gitignore             # Git 제외 파일 목록
└── README.md              # 프로젝트 설명서
```

> Firebase Realtime Database 버전에서 사용했던 설정 파일은 `../docs/legacy/`로 보관합니다.

> 참고: 이 프로젝트는 `todo-backend` 서버와 함께 사용됩니다. 백엔드 서버는 별도로 실행해야 합니다.

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend**: Node.js, Express, MongoDB (별도 `todo-backend` 프로젝트)
- **API 통신**: REST API (fetch)
- **디자인**: 미니멀리즘 스타일

## ✨ 주요 기능

- ✅ 할일 추가
- ✏️ 할일 수정
- 🗑️ 할일 삭제
- ✓ 완료/미완료 토글
- 💾 서버 기반 데이터 저장

## 📡 API 엔드포인트

프론트엔드는 다음 REST API를 사용합니다:

- `GET /todos` - 할일 목록 조회
- `POST /todos` - 할일 추가 (body: `{ title: string }`)
- `PUT /todos/:id` - 할일 수정/완료 토글 (body: `{ title?: string, completed?: boolean }`)
- `DELETE /todos/:id` - 할일 삭제

서버 주소: `http://localhost:5000`

## 🔧 개발 환경 설정

### 백엔드 서버 설정

`todo-backend` 프로젝트의 README를 참고하여 MongoDB 연결 및 서버 설정을 완료하세요.

### CORS 설정

백엔드 서버에 CORS 미들웨어가 설정되어 있어야 합니다. `todo-backend/src/index.js`에 다음 코드가 포함되어 있는지 확인하세요:

```javascript
import cors from "cors";
app.use(cors());
```
