![image.png](attachment:fcde6de3-e8d4-4031-99d4-085082fb97b8:image.png)

## MVC 패턴 쉽게 이해하기 🎯

**MVC는 프로그램을 3가지 역할로 나누는 설계 방법입니다:**

### 1️⃣ **Model (모델)** - 데이터 담당

- 실제 데이터와 비즈니스 로직을 관리합니다
- 예: 사용자 정보, 상품 목록, 재고 수량 등
- 데이터가 변경되면 View에게 알려줍니다
- **백엔드**: 데이터베이스 스키마, 데이터 검증, 비즈니스 규칙
- **프론트엔드**: 상태 관리, 데이터 구조 정의

### 2️⃣ **View (뷰)** - 화면 담당

- 사용자가 보는 화면을 그립니다
- Model의 데이터를 예쁘게 표시합니다
- 예: 웹페이지, 버튼, 입력창 등
- **백엔드**: API 응답(JSON) 형태로 데이터 제공
- **프론트엔드**: HTML, CSS, React 컴포넌트 등 UI 요소

### 3️⃣ **Controller (컨트롤러)** - 중간 관리자

- 사용자의 입력(클릭, 타이핑)을 받아서 처리합니다
- Model에게 "데이터 수정해!"라고 지시합니다
- View에게 "화면 업데이트해!"라고 지시합니다
- **백엔드**: HTTP 요청 처리, 라우팅, Model과 통신
- **프론트엔드**: 이벤트 핸들링, 상태 업데이트 로직

### 🔄 MVC 동작 흐름

```
사용자 액션   →   Controller   →   Model   →   View   →   사용자에게 표시
  (클릭)         (요청 처리)     (데이터 변경) (화면 업데이트)
```

**예시: 할 일 추가하기**

1. 사용자가 "할 일 추가" 버튼 클릭 (View)
2. Controller가 입력값을 받아서 처리
3. Controller가 Model에게 "새 할 일 저장해줘" 요청
4. Model이 데이터베이스에 저장
5. Model이 변경사항을 알림
6. View가 업데이트된 할 일 목록을 화면에 표시

### 📱 실생활 예시: 인스타그램

- **Model**: 게시물 데이터, 좋아요 수, 댓글 목록
- **View**: 피드 화면, 하트 버튼, 댓글 창
- **Controller**: 하트 버튼을 누르면 → Model의 좋아요 수를 1 증가 → View에 빨간 하트 표시

### 💻 실제 코드 예시: Todo Backend 프로젝트

#### **Model (models/Todo.js)**

```javascript
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
```

- **역할**: 데이터 구조 정의, 데이터베이스 스키마 관리

#### **Controller (controllers/todoController.js)**

```javascript
import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "제목은 필수입니다." });
    }

    const todo = new Todo({ title });
    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

- **역할**: HTTP 요청 처리, 데이터 검증, Model과 통신, 응답 반환

#### **Routes (routes/todoRoutes.js)**

```javascript
import express from "express";
import { createTodo, getAllTodos } from "../controllers/todoController.js";

const router = express.Router();
router.post("/", createTodo);
router.get("/", getAllTodos);

export default router;
```

- **역할**: URL 경로와 Controller 함수를 연결 (라우팅)

### 🏗️ 프로젝트 구조 예시

```
todo-backend/
├── src/
│   ├── models/          # Model: 데이터 구조 정의
│   │   └── Todo.js
│   ├── controllers/      # Controller: 비즈니스 로직 처리
│   │   └── todoController.js
│   ├── routes/          # Routes: URL 라우팅
│   │   └── todoRoutes.js
│   └── index.js         # 서버 진입점
```

### ✨ 왜 MVC를 사용할까?

1. **역할 분담**: 각자 맡은 일만 하니까 코드가 깔끔해요
2. **협업 용이**: 디자이너는 View만, 개발자는 Model만 수정 가능
3. **재사용성**: 같은 Model을 웹/모바일에서 다른 View로 표시 가능
4. **유지보수**: 화면만 바꾸고 싶으면 View만 수정하면 됨!
5. **테스트 용이**: 각 부분을 독립적으로 테스트 가능
6. **확장성**: 새로운 기능 추가가 쉬움

### ⚖️ MVC 패턴의 장단점

#### ✅ 장점

- **명확한 책임 분리**: 각 컴포넌트의 역할이 명확함
- **코드 재사용**: Model을 여러 View에서 사용 가능
- **유지보수성**: 한 부분만 수정해도 다른 부분에 영향 적음
- **테스트 용이**: 각 레이어를 독립적으로 테스트 가능
- **협업 효율**: 여러 개발자가 동시에 작업하기 좋음

#### ❌ 단점

- **복잡도 증가**: 작은 프로젝트에서는 오버엔지니어링일 수 있음
- **학습 곡선**: 초보자에게는 개념 이해가 필요
- **과도한 분리**: 간단한 기능도 여러 파일에 나눠야 함
- **데이터 동기화**: Model과 View 간 동기화가 복잡할 수 있음

### 🎯 MVC 패턴 적용 시 주의사항

1. **Controller는 가볍게 유지**: 비즈니스 로직은 Model에 두기
2. **View는 순수하게**: View는 데이터 표시만, 로직은 Controller에
3. **Model은 독립적으로**: Model은 View나 Controller에 의존하지 않기
4. **순환 참조 방지**: Model ↔ Controller ↔ View 간 순환 참조 피하기
5. **적절한 크기 유지**: 너무 작은 기능까지 분리하지 않기

### 🔀 백엔드 vs 프론트엔드 MVC

#### **백엔드 (Node.js/Express)**

- **Model**: 데이터베이스 스키마, Mongoose 모델
- **View**: JSON 응답 (REST API)
- **Controller**: 요청 처리, 비즈니스 로직, 응답 생성
- **Routes**: URL과 Controller 연결

#### **프론트엔드 (React)**

- **Model**: 상태 관리 (useState, Redux, Context API)
- **View**: React 컴포넌트 (JSX)
- **Controller**: 이벤트 핸들러, 상태 업데이트 함수
- **Routes**: React Router (페이지 라우팅)

### 📚 추가 학습 자료

- **MVVM 패턴**: Model-View-ViewModel (프론트엔드에서 많이 사용)
- **MVP 패턴**: Model-View-Presenter (MVC의 변형)
- **Flux 패턴**: 단방향 데이터 흐름 (React에서 영감을 받음)
