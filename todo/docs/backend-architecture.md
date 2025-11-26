# 아키텍처 가이드

이 문서는 Todo Backend의 아키텍처와 작동 원리를 설명합니다.

## 목차

- [MVC 패턴 구조](#mvc-패턴-구조)
- [Mongoose 모델이란?](#mongoose-모델이란)
- [Todo 모델 구조](#todo-모델-구조)
- [전체 애플리케이션 흐름](#전체-애플리케이션-흐름)
- [실제 동작 예시](#실제-동작-예시)
- [주요 Mongoose 메서드](#주요-mongoose-메서드)
- [스키마의 역할](#스키마의-역할)
- [왜 모델을 분리하나요?](#왜-모델을-분리하나요)

## Mongoose 모델이란?

Mongoose는 MongoDB와 Node.js를 연결해주는 라이브러리입니다. **모델(Model)**은 데이터베이스의 컬렉션(테이블) 구조와 동작을 정의합니다.

## Todo 모델 구조

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

## MVC 패턴 구조

이 프로젝트는 **MVC (Model-View-Controller) 패턴**을 따릅니다:

### 각 컴포넌트의 역할

| 컴포넌트       | 파일                            | 역할                                                       |
| -------------- | ------------------------------- | ---------------------------------------------------------- |
| **Model**      | `models/Todo.js`                | 데이터베이스 모델 및 데이터 구조 정의                      |
| **View**       | 프론트엔드 (React 앱)           | 사용자 인터페이스 (백엔드에는 View가 없음)                 |
| **Controller** | `controllers/todoController.js` | 비즈니스 로직 처리                                         |
| **Routes**     | `routes/todoRoutes.js`          | URL 라우팅 (어떤 URL이 어떤 컨트롤러 함수를 호출할지 결정) |

### 중요 사항

- **Routes는 MVC의 일부가 아닙니다**: Routes는 URL을 컨트롤러 함수에 매핑하는 역할만 합니다.
- **백엔드에는 View가 없습니다**: 백엔드 API는 JSON 데이터만 반환하며, View는 프론트엔드(React 앱)에서 담당합니다.
- **Controller가 핵심**: Controller에서 실제 비즈니스 로직(데이터 검증, 처리, 응답)을 수행합니다.

## 전체 애플리케이션 흐름

```
클라이언트 요청 (React 앱)
    ↓
Express 서버 (index.js)
    ↓
라우트 (routes/todoRoutes.js) - URL 매칭 및 라우팅
    ↓
컨트롤러 (controllers/todoController.js) - 비즈니스 로직 처리
    ↓
모델 (models/Todo.js) - 데이터베이스 작업
    ↓
MongoDB 데이터베이스
    ↓
JSON 응답 반환
    ↓
프론트엔드 (React 앱) - View에서 데이터 표시
```

## 실제 동작 예시

### 예시: 할 일 생성 (POST /todos)

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

## 주요 Mongoose 메서드

| 메서드                       | 설명             | SQL 비교        |
| ---------------------------- | ---------------- | --------------- |
| `new Todo()`                 | 새 인스턴스 생성 | -               |
| `todo.save()`                | 저장             | INSERT          |
| `Todo.find()`                | 전체 조회        | SELECT \*       |
| `Todo.findById(id)`          | ID로 조회        | SELECT WHERE id |
| `Todo.findByIdAndDelete(id)` | 삭제             | DELETE          |

## 스키마의 역할

- **데이터 검증**: `required: true` → 필수 필드 체크
- **타입 변환**: 자동으로 String, Boolean 등으로 변환
- **기본값 설정**: `default: false` → 값이 없으면 자동 설정
- **자동 필드**: `timestamps: true` → createdAt, updatedAt 자동 관리

## 왜 모델을 분리하나요?

- **재사용성**: 여러 컨트롤러에서 같은 모델 사용 가능
- **유지보수**: 데이터 구조 변경 시 한 곳만 수정
- **테스트 용이**: 모델을 독립적으로 테스트 가능
- **코드 정리**: 관심사 분리 (MVC 패턴)
