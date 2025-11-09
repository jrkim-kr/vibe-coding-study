# 7. Todo React - Backend API 연동

## 프롬프트

todo-react 폴더에 todo-backend를 바탕으로 기존 기능들 todo-firebase의 프론트엔드 코드를 react로 수정해 줘.

## 작업 내용

### 1. 요구사항

- todo-firebase의 프론트엔드 기능을 React로 변환
- todo-backend API를 사용하여 데이터 관리
- todo-firebase와 동일한 UI/UX 유지

### 2. 구현된 기능

#### 할일 관리 기능

- **할일 추가**: 입력 필드에 할일을 입력하고 추가 버튼 또는 Enter 키로 추가
- **할일 삭제**: 삭제 버튼을 클릭하여 할일 삭제
- **할일 완료 토글**: 체크박스 또는 텍스트를 클릭하여 완료/미완료 상태 전환
- **할일 수정**: 수정 버튼을 클릭하여 인라인 편집 모드로 전환
  - Enter 키: 수정 내용 저장
  - Escape 키: 수정 취소
- **빈 상태 표시**: 할일이 없을 때 안내 메시지 표시

#### API 연동

- `GET /todos` - 할일 목록 조회
- `POST /todos` - 할일 생성
- `PUT /todos/:id` - 할일 수정 및 완료 상태 변경
- `DELETE /todos/:id` - 할일 삭제

API 기본 URL: `http://localhost:5000`

### 3. 주요 변경사항

#### App.jsx

- React Hooks 사용 (`useState`, `useEffect`)
- 비동기 API 호출 함수 구현
- 상태 관리:
  - `todos`: 할일 목록
  - `todoInput`: 입력 필드 값
  - `editingId`: 현재 수정 중인 할일 ID
  - `editingTitle`: 수정 중인 할일 제목

#### App.css

- todo-firebase의 `style.css`를 React 컴포넌트 스타일로 변환
- 모든 스타일 유지 (레이아웃, 색상, 애니메이션 등)

#### index.css

- 기본 스타일을 todo-firebase와 동일하게 설정
- 폰트, 배경색, 레이아웃 설정

### 4. 코드 구조

```jsx
// 주요 함수들
- loadTodos(): 서버에서 할일 목록 불러오기
- addTodo(): 할일 추가
- deleteTodo(id): 할일 삭제
- toggleTodo(id): 할일 완료 상태 토글
- startEdit(id): 수정 모드 시작
- cancelEdit(): 수정 모드 취소
- saveEdit(id): 수정 내용 저장
- handleKeyPress(e): 입력 필드 Enter 키 처리
- handleEditKeyPress(e, id): 수정 필드 Enter/Escape 키 처리
```

## 실행 방법

### 1. 백엔드 서버 실행 (필수)

```bash
cd todo-backend
npm run dev
```

- 포트: `5000`
- URL: `http://localhost:5000`
- MongoDB 연결 필요

### 2. 프론트엔드 서버 실행

```bash
cd todo-react
npm run dev
```

- 포트: `5173` (Vite 기본 포트)
- URL: `http://localhost:5173`

### 3. 접속

브라우저에서 `http://localhost:5173`을 열면 Todo 앱을 사용할 수 있습니다.

## 주의사항

1. **MongoDB 실행 필요**: todo-backend는 MongoDB가 실행 중이어야 합니다.

   - 로컬 MongoDB: `mongodb://localhost:27017/todo-db`
   - 또는 `.env` 파일에 `MONGODB_URI` 설정

2. **두 서버 모두 실행**: 프론트엔드와 백엔드가 모두 실행되어야 정상 동작합니다.

3. **CORS 설정**: 백엔드에서 CORS가 활성화되어 있어 프론트엔드에서 API 호출이 가능합니다.

## 기술 스택

- **프론트엔드**: React 18.2.0, Vite 5.0.8
- **백엔드**: Express 5.1.0, MongoDB (Mongoose 8.19.2)
- **스타일링**: CSS (todo-firebase와 동일한 스타일)

## 주요 학습 포인트

자세한 개념 설명은 [7_concepts.md](./7_concepts.md) 파일을 참고하세요.

1. **React Hooks 활용**

   - `useState`: 컴포넌트 상태 관리
   - `useEffect`: 컴포넌트 마운트 시 데이터 로드

2. **비동기 처리**

   - `async/await`를 사용한 API 호출
   - 에러 처리 및 사용자 피드백

3. **조건부 렌더링**

   - 수정 모드와 일반 모드 전환
   - 빈 상태 표시

4. **이벤트 처리**

   - 키보드 이벤트 (Enter, Escape)
   - 클릭 이벤트

5. **RESTful API 연동**
   - HTTP 메서드 활용 (GET, POST, PUT, DELETE)
   - JSON 데이터 처리

> 💡 **더 자세한 설명이 필요하신가요?**  
> 각 개념에 대한 쉬운 설명과 실제 코드 예시는 [7_concepts.md](./7_concepts.md) 파일을 확인해주세요.
