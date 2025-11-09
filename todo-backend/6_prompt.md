# 대화 내용 요약

## 1. Firebase를 REST API로 변경

### 요청

이제 firebase를 아닌 todo-backend를 참고하여 서버를 통해 기능 구현해 줘.

### 개선된 프롬프트

todo-firebase 프로젝트에서 Firebase를 사용하지 않고, todo-backend 서버를 사용하도록 바꿔줘. Firebase 관련 코드는 모두 제거하고, 서버에 요청을 보내서 할일을 추가하고, 조회하고, 수정하고, 삭제하는 방식으로 동작하도록 해줘. 서버 주소는 http://localhost:5000이야.

### 수행 작업

- `todo-firebase/script.js` 완전 재작성
  - Firebase 관련 코드 제거 (initializeApp, getDatabase, ref, push, remove, update, onValue)
  - REST API 호출로 변경 (`fetch()` 사용)
  - API 기본 URL 설정: `http://localhost:5000`
- 필드명 변경
  - `text` → `title` (백엔드 API와 일치)
  - `id` → `_id` (MongoDB의 \_id 필드 사용)
- 실시간 동기화 제거
  - Firebase의 `onValue()` 실시간 동기화 제거
  - 작업 후 `loadTodos()` 호출하여 수동으로 목록 새로고침

### 변경된 API 호출

- `GET /todos` - 할일 목록 조회
- `POST /todos` - 할일 추가 (body: `{ title: string }`)
- `PUT /todos/:id` - 할일 수정/완료 토글 (body: `{ title?: string, completed?: boolean }`)
- `DELETE /todos/:id` - 할일 삭제

---

## 2. REST API 개념 설명

### 질문

REST API는 뭐야?

### 개선된 프롬프트

REST API가 뭔지 쉽게 설명해줘. 예를 들어 할일 목록을 가져오거나, 새 할일을 추가하는 것 같은 예시도 들어줘. 왜 쓰는지, 어떤 장점이 있는지도 알려줘.

### 핵심 내용

**REST**(Representational State Transfer)는 웹 서비스 설계 원칙
**API**(Application Programming Interface)는 애플리케이션 간 통신 규약

### 주요 특징

1. **HTTP 메서드 사용**: GET, POST, PUT, DELETE 등
2. **리소스 기반**: URL로 리소스를 표현 (예: `/todos`, `/todos/123`)
3. **상태 없음(Stateless)**: 각 요청은 독립적
4. **표준 형식**: 주로 JSON 사용

### HTTP 메서드 의미

| 메서드     | 의미 | 예시                |
| ---------- | ---- | ------------------- |
| **GET**    | 조회 | 할일 목록 가져오기  |
| **POST**   | 생성 | 새 할일 추가        |
| **PUT**    | 수정 | 할일 내용/상태 변경 |
| **DELETE** | 삭제 | 할일 삭제           |

### REST API의 장점

- **표준화**: 널리 사용되는 방식
- **간단함**: HTTP만으로 구현 가능
- **독립성**: 프론트엔드와 백엔드를 분리 가능
- **확장성**: 다양한 클라이언트에서 사용 가능

---

## 3. 403 에러 해결 (CORS 설정)

### 질문

할 일 목록을 불러오는데 실패한다는 403에러가 떴는데, 어떻게 해결해야 해?

### 개선된 프롬프트

할 일 목록을 불러오려고 하는데 403 에러가 나와. 서버는 잘 돌아가고 있는데 왜 안 되는지 알려줘. 해결 방법도 알려줘.

### 원인

브라우저에서 다른 포트(또는 file:// 프로토콜)로 요청을 보낼 때 CORS(Cross-Origin Resource Sharing) 정책에 의해 차단됨

### 해결 방법

1. **cors 패키지 설치**

   ```bash
   npm install cors
   ```

2. **todo-backend에 CORS 미들웨어 추가**

   ```javascript
   import cors from "cors";

   app.use(cors()); // CORS 설정 - 모든 도메인에서 접근 허용
   ```

3. **서버 재시작 필요**
   - 변경사항 적용을 위해 `npm run dev` 재실행

### CORS란?

**CORS**(Cross-Origin Resource Sharing)는 브라우저의 보안 정책

- 다른 포트나 도메인으로 요청할 때 서버가 허용해야 함
- 문제: 브라우저(`file://` 또는 다른 포트) → 서버(`localhost:5000`) 요청 시 차단
- 해결: 서버에 `cors()` 미들웨어 추가로 모든 도메인에서의 요청 허용

---

## 4. 미들웨어 개념 설명

### 질문

미들웨어는 무슨 뜻이야?

### 개선된 프롬프트

미들웨어가 뭔지 쉽게 설명해줘. 우리 프로젝트에서 어떻게 쓰이는지도 알려줘.

### 핵심 내용

**미들웨어**는 요청과 응답 사이에서 실행되는 함수

- Express에서 요청이 라우트 핸들러에 도달하기 전에 처리됨

### 요청 처리 흐름

```
클라이언트 요청
    ↓
[미들웨어 1] → CORS 처리
    ↓
[미들웨어 2] → JSON 파싱
    ↓
[라우트 핸들러] → 실제 비즈니스 로직
    ↓
응답 반환
```

### 현재 프로젝트의 미들웨어

```javascript
app.use(cors()); // CORS 설정 - 모든 도메인에서 접근 허용
app.use(express.json()); // JSON 데이터를 JavaScript 객체로 변환
```

### 미들웨어의 특징

1. **순서가 중요**: 위에서 아래로 순차 실행
2. **모든 요청에 적용**: `app.use()`로 등록하면 모든 라우트에 적용
3. **다음으로 전달**: `next()`를 호출하면 다음 미들웨어로 진행

### 미들웨어 사용 이유

- **재사용성**: 여러 라우트에서 공통 처리
- **관심사 분리**: CORS, 인증, 로깅 등을 분리
- **유지보수**: 한 곳에서 수정하면 전체에 적용

---

## 5. npm run dev 명령어 설명

### 질문

npm run dev 이거는 뭐하는 코드야?

### 개선된 프롬프트

npm run dev가 뭘 하는 명령어인지 설명해줘. npm start와 뭐가 다른지도 알려줘.

### 핵심 내용

`npm run dev`는 `package.json`의 `scripts` 섹션에 정의된 명령어를 실행

### package.json의 scripts

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  }
}
```

### 실행 내용

```bash
node --watch src/index.js
```

- `node`: Node.js 실행
- `--watch`: 파일 변경 감지 모드
- `src/index.js`: 실행할 파일

### 두 가지 실행 방식 비교

| 명령어        | 실행 내용                   | 특징                                      |
| ------------- | --------------------------- | ----------------------------------------- |
| `npm start`   | `node src/index.js`         | 일반 실행 (파일 변경 시 수동 재시작 필요) |
| `npm run dev` | `node --watch src/index.js` | 개발 모드 (파일 변경 시 자동 재시작)      |

### `--watch` 옵션의 장점

개발 중 파일을 수정하면 서버가 **자동으로 재시작**됨

**예시:**

1. `npm run dev` 실행
2. `src/index.js` 수정
3. 서버가 자동으로 재시작됨
4. 변경사항이 즉시 반영됨

### 요약

- **`npm run dev`**: 개발 모드로 서버 실행 (자동 재시작)
- **`npm start`**: 프로덕션 모드로 서버 실행 (수동 재시작)

개발 중에는 `npm run dev`를 사용하면 편리함

---

## 최종 코드 구조

```
todo-firebase/
├── script.js (REST API 호출로 변경)
└── index.html

todo-backend/
├── src/
│   ├── index.js (CORS 미들웨어 추가)
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── controllers/
│   │   └── todoController.js
│   └── models/
│       └── Todo.js
└── package.json (cors 패키지 추가)
```

## 주요 변경사항

- **프론트엔드**: Firebase → REST API (`fetch()` 사용)
- **백엔드**: CORS 미들웨어 추가
- **필드명**: `text` → `title`, `id` → `_id`
- **동기화 방식**: 실시간 동기화 → 수동 새로고침
