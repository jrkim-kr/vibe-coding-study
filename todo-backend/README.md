# Todo Backend

Todo Backend API 서버

## 시작하기

### 필요 조건

- Node.js (v18 이상 권장)

### 설치

```bash
npm install
```

### 실행

```bash
# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

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
│   ├── models/          # 데이터베이스 모델 (Mongoose 스키마)
│   │   └── Todo.js      # Todo 모델
│   ├── controllers/     # 비즈니스 로직 (요청 처리)
│   │   └── todoController.js
│   └── routes/          # API 라우트 정의
│       └── todoRoutes.js
├── package.json         # 프로젝트 설정 및 의존성
├── .gitignore          # Git 무시 파일 목록
└── README.md           # 프로젝트 문서
```

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

## API 엔드포인트

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

# 수정
curl -X PUT http://localhost:5000/todos/:id \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 삭제
curl -X DELETE http://localhost:5000/todos/:id
```

## 모델 작동 원리

### 1. Mongoose 모델이란?

Mongoose는 MongoDB와 Node.js를 연결해주는 라이브러리입니다. **모델(Model)**은 데이터베이스의 컬렉션(테이블) 구조와 동작을 정의합니다.

### 2. Todo 모델 구조

```javascript
// src/models/Todo.js
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // 필수 필드
    completed: { type: Boolean, default: false }, // 기본값 설정
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Todo = mongoose.model("Todo", todoSchema);
```

**작동 원리:**

- `Schema`: 데이터 구조 정의 (필드 타입, 제약조건)
- `Model`: Schema를 기반으로 실제 데이터베이스 작업을 수행하는 객체
- MongoDB의 `todos` 컬렉션과 연결됨 (자동으로 복수형 변환)

### 3. 전체 애플리케이션 흐름

```
클라이언트 요청
    ↓
Express 서버 (index.js)
    ↓
라우트 (routes/todoRoutes.js) - URL 매칭
    ↓
컨트롤러 (controllers/todoController.js) - 비즈니스 로직
    ↓
모델 (models/Todo.js) - 데이터베이스 작업
    ↓
MongoDB 데이터베이스
```

### 4. 실제 동작 예시

#### 예시: 할 일 생성 (POST /todos)

1. **클라이언트 요청**

   ```json
   POST /todos
   { "title": "공부하기" }
   ```

2. **라우트 매칭** (`routes/todoRoutes.js`)

   ```javascript
   router.post("/", createTodo); // POST /todos → createTodo 함수 실행
   ```

3. **컨트롤러 처리** (`controllers/todoController.js`)

   ```javascript
   const todo = new Todo({ title }); // 모델 인스턴스 생성
   await todo.save(); // 데이터베이스에 저장
   ```

4. **모델 동작** (`models/Todo.js`)

   - `new Todo()`: 스키마에 맞는 새 객체 생성
   - `save()`: MongoDB에 실제로 저장 (INSERT)
   - 자동으로 `_id`, `createdAt`, `updatedAt` 생성

5. **응답 반환**
   ```json
   {
     "_id": "507f1f77bcf86cd799439011",
     "title": "공부하기",
     "completed": false,
     "createdAt": "2024-01-01T00:00:00.000Z",
     "updatedAt": "2024-01-01T00:00:00.000Z"
   }
   ```

### 5. 주요 Mongoose 메서드

| 메서드                       | 설명             | SQL 비교        |
| ---------------------------- | ---------------- | --------------- |
| `new Todo()`                 | 새 인스턴스 생성 | -               |
| `todo.save()`                | 저장             | INSERT          |
| `Todo.find()`                | 전체 조회        | SELECT \*       |
| `Todo.findById(id)`          | ID로 조회        | SELECT WHERE id |
| `Todo.findByIdAndDelete(id)` | 삭제             | DELETE          |

### 6. 스키마의 역할

- **데이터 검증**: `required: true` → 필수 필드 체크
- **타입 변환**: 자동으로 String, Boolean 등으로 변환
- **기본값 설정**: `default: false` → 값이 없으면 자동 설정
- **자동 필드**: `timestamps: true` → createdAt, updatedAt 자동 관리

### 7. 왜 모델을 분리하나요?

- **재사용성**: 여러 컨트롤러에서 같은 모델 사용 가능
- **유지보수**: 데이터 구조 변경 시 한 곳만 수정
- **테스트 용이**: 모델을 독립적으로 테스트 가능
- **코드 정리**: 관심사 분리 (MVC 패턴)
