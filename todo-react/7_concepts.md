# React 개념 쉽게 이해하기

이 문서는 Todo React 프로젝트에서 사용된 주요 React 개념을 초보자도 쉽게 이해할 수 있도록 설명합니다.

## 1. useState - 상태 관리하기

### 🎯 개념

**상태(State)**란 화면에 보이는 데이터 중에서 **변할 수 있는 값**입니다.

### 📝 비유로 이해하기

일반 변수와 useState의 차이:

```javascript
// 일반 변수 - 값이 바뀌어도 화면이 안 바뀜
let count = 0;
count = 1; // 화면은 그대로

// useState - 값이 바뀌면 화면도 자동으로 바뀜
const [count, setCount] = useState(0);
setCount(1); // 화면이 자동으로 업데이트됨!
```

**비유**: useState는 **자동 업데이트 메모장**입니다. 메모장에 글을 쓰면(상태 변경) 화면에 자동으로 반영됩니다.

### 💻 프로젝트에서 사용된 예시

```8:11:todo-react/src/App.jsx
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
```

**설명**:

- `useState([])`: 초기값이 빈 배열 `[]`인 상태를 만듭니다
- `[todos, setTodos]`:
  - `todos` = 현재 값 (읽기용)
  - `setTodos` = 값을 바꾸는 함수 (쓰기용)

**실제 사용 예시**:

> ⚠️ **참고**: 아래 코드는 input 요소의 일부 속성만 보여줍니다.

```191:192:todo-react/src/App.jsx
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
```

사용자가 입력 필드에 "공부하기"를 입력하면:

1. `onChange` 이벤트 발생
2. `setTodoInput("공부하기")` 실행
3. `todoInput` 상태가 "공부하기"로 변경
4. React가 자동으로 화면을 다시 그림
5. 입력 필드에 "공부하기"가 표시됨

### 🔑 핵심 정리

- **useState는 변하는 데이터를 저장하는 상자**
- **값을 바꾸려면 set 함수를 사용**
- **값이 바뀌면 화면이 자동으로 업데이트됨**

---

## 2. useEffect - 특정 시점에 코드 실행하기

### 🎯 개념

컴포넌트가 **화면에 나타날 때** 또는 **특정 값이 바뀔 때** 자동으로 코드를 실행하는 도구입니다.

### 📝 비유로 이해하기

**비유**: 자동문처럼, 문이 열릴 때(컴포넌트가 나타날 때) 자동으로 작동합니다.

### 💻 프로젝트에서 사용된 예시

```175:177:todo-react/src/App.jsx
  useEffect(() => {
    loadTodos();
  }, []);
```

**설명**:

- `useEffect(() => { ... }, [])`:
  - 첫 번째 인자: 실행할 함수
  - 두 번째 인자 `[]`: 빈 배열 = **한 번만 실행** (페이지 로드 시)

**작동 순서**:

1. 사용자가 페이지를 열면
2. React가 컴포넌트를 화면에 그림
3. `useEffect`가 자동으로 실행됨
4. `loadTodos()` 함수가 호출되어 서버에서 할일 목록을 가져옴
5. 할일 목록이 화면에 표시됨

### 🔑 핵심 정리

- **useEffect는 "이 시점에 이걸 해줘"라고 명령하는 도구**
- **빈 배열 [] = 페이지 로드 시 한 번만 실행**
- **배열에 값 넣기 = 그 값이 바뀔 때마다 실행**

---

## 3. async/await - 비동기 처리하기

### 🎯 개념

서버에 요청을 보내고 **응답을 기다리는 동안** 다른 작업을 할 수 있게 해주는 방식입니다.

### 📝 비유로 이해하기

**동기 방식 (async 없이)**:

```
주문 → 기다림 (아무것도 못함) → 음식 받음 → 먹기
```

**비동기 방식 (async/await)**:

```
주문 → 기다리는 동안 다른 일 함 → 음식 받음 → 먹기
```

### 💻 프로젝트에서 사용된 예시

> ⚠️ **참고**: 아래 코드는 `loadTodos` 함수 전체입니다.

```14:32:todo-react/src/App.jsx
  const loadTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error("할일 목록을 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setTodos(data || []);
      // 수정 중인 항목의 ID가 더 이상 존재하지 않으면 수정 모드 종료
      if (editingId && !data.find((t) => t._id === editingId)) {
        setEditingId(null);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      alert(
        "할일 목록을 불러오는데 실패했습니다. 서버가 실행 중인지 확인해주세요."
      );
    }
  };
```

**단계별 설명**:

1. **`async`**: "이 함수는 시간이 걸리는 작업을 할 거야"

   ```javascript
   const loadTodos = async () => {
   ```

2. **`await fetch(...)`**: "서버에 요청 보내고 응답 올 때까지 기다려"

   ```javascript
   const response = await fetch(`${API_BASE_URL}/todos`);
   ```

   - 서버에 "할일 목록 줘"라고 요청
   - 응답이 올 때까지 대기

3. **`await response.json()`**: "응답을 JSON 형식으로 변환해줘"

   ```javascript
   const data = await response.json();
   ```

4. **`setTodos(data)`**: "받은 데이터를 상태에 저장"

   ```javascript
   setTodos(data || []);
   ```

5. **`try/catch`**: "에러가 나면 이렇게 처리해줘"
   ```javascript
   catch (error) {
     alert("실패했습니다");
   }
   ```

**실제 동작 흐름**:

```
사용자가 페이지 열기
  ↓
useEffect 실행
  ↓
loadTodos() 호출
  ↓
서버에 요청 보내기 (await)
  ↓
서버가 데이터 보내기 (1-2초 걸림)
  ↓
데이터 받기
  ↓
setTodos()로 상태 업데이트
  ↓
화면에 할일 목록 표시
```

### 🔑 핵심 정리

- **async = "이 함수는 시간이 걸려"**
- **await = "이게 끝날 때까지 기다려"**
- **try/catch = "에러 나면 이렇게 처리해"**

---

## 4. 조건부 렌더링 - 상황에 따라 다른 화면 보여주기

### 🎯 개념

**조건**에 따라 화면에 **다른 내용**을 보여주는 방식입니다.

### 📝 비유로 이해하기

**비유**: 날씨에 따라 다른 옷을 입는 것처럼, 상황에 따라 다른 화면을 보여줍니다.

- 비 오면 → 우산 표시
- 맑으면 → 선글라스 표시

### 💻 프로젝트에서 사용된 예시

#### 예시 1: 할일이 없을 때

> ⚠️ **참고**: 아래 코드는 전체 구조입니다. 할일 목록 부분의 세부 내용은 생략되었습니다.

```201:279:todo-react/src/App.jsx
        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-text">
              할일이 없습니다.
              <br />
              새로운 할일을 추가해보세요!
            </div>
          </div>
        ) : (
          <ul className="todo-list">
            {/* ... 할일 목록 렌더링 ... */}
          </ul>
        )}
```

**설명**:

- `todos.length === 0` → 할일이 0개면
- `?` → 이걸 보여줘 (빈 상태 메시지)
- `:` → 아니면 이걸 보여줘 (할일 목록)

**중요**: 삼항 연산자는 `조건 ? 참일때 : 거짓일때` 형태로 **반드시 `:` 부분이 있어야** 합니다!

**작동 방식**:

```
할일이 0개?
  → 네 → "할일이 없습니다" 메시지 표시
  → 아니요 → 할일 목록 표시
```

#### 예시 2: 수정 모드 vs 일반 모드

> ⚠️ **참고**: 아래 코드는 전체 구조입니다. 일반 모드 부분의 세부 내용은 생략되었습니다.

```212:277:todo-react/src/App.jsx
            {todos.map((todo) => {
              const isEditing = editingId === todo._id;

              if (isEditing) {
                return (
                  <li key={todo._id} className="todo-item editing">
                    <input
                      type="text"
                      className="todo-edit-input"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, todo._id)}
                      autoFocus
                    />
                    <div className="todo-actions">
                      <button
                        className="todo-btn save-btn"
                        onClick={() => saveEdit(todo._id)}
                      >
                        저장
                      </button>
                      <button
                        className="todo-btn cancel-btn"
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                    </div>
                  </li>
                );
              }

              return (
                // ... 일반 모드 할일 항목 렌더링 ...
              );
            })}
```

**설명**:

- `isEditing = editingId === todo._id`: 이 할일이 수정 중인가?
- `if (isEditing)`: 수정 중이면 → 입력 필드와 저장/취소 버튼 보여줘
- `else`: 아니면 → 일반 할일 항목 보여줘

**작동 방식**:

```
사용자가 "수정" 버튼 클릭
  ↓
editingId = 해당 할일의 ID로 설정
  ↓
isEditing = true
  ↓
입력 필드와 저장/취소 버튼 표시
```

### 🔑 핵심 정리

- **조건부 렌더링 = "만약 ~라면 이걸 보여줘"**
- **삼항 연산자 `? :` = 간단한 조건**
- **if문 = 복잡한 조건**

---

## 5. 이벤트 처리 - 사용자 행동에 반응하기

### 🎯 개념

사용자가 **클릭, 키보드 입력** 등을 할 때 **함수를 실행**하는 방식입니다.

### 📝 비유로 이해하기

**비유**: 버튼을 누르면 전등이 켜지는 것처럼, 사용자의 행동에 따라 앱이 반응합니다.

### 💻 프로젝트에서 사용된 예시

#### 키보드 이벤트

```159:163:todo-react/src/App.jsx
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };
```

**설명**:

- `e.key`: 어떤 키를 눌렀는지
- `e.key === "Enter"`: Enter 키를 눌렀으면
- `addTodo()`: 할일 추가 함수 실행

**사용 예시**:

> ⚠️ **참고**: 아래 코드는 input 요소 전체입니다.

```187:194:todo-react/src/App.jsx
        <input
          type="text"
          className="todo-input"
          placeholder="할일을 입력하세요"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
```

**작동 방식**:

```
사용자가 입력 필드에 "공부하기" 입력
  ↓
Enter 키 누름
  ↓
handleKeyPress 실행
  ↓
e.key === "Enter" 확인
  ↓
addTodo() 실행
  ↓
할일 추가됨!
```

#### 수정 모드에서의 키보드 이벤트

```166:172:todo-react/src/App.jsx
  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };
```

**설명**:

- Enter 키 → 수정 저장
- Escape 키 → 수정 취소

#### 클릭 이벤트

> ⚠️ **참고**: 아래 코드는 button 요소 전체입니다.

```195:197:todo-react/src/App.jsx
        <button className="add-btn" onClick={addTodo}>
          추가
        </button>
```

**설명**:

- `onClick={addTodo}`: 버튼을 클릭하면 `addTodo` 함수 실행

**작동 방식**:

```
사용자가 "추가" 버튼 클릭
  ↓
onClick 이벤트 발생
  ↓
addTodo() 함수 실행
  ↓
할일이 추가됨!
```

### 🔑 핵심 정리

- **이벤트 = 사용자의 행동 (클릭, 키보드 입력 등)**
- **onClick = 클릭했을 때**
- **onChange = 값이 바뀔 때**
- **onKeyPress = 키를 눌렀을 때**

---

## 6. RESTful API 연동 - 서버와 대화하기

### 🎯 개념

프론트엔드(React)와 백엔드(서버)가 **데이터를 주고받는** 표준화된 방법입니다.

### 🤔 REST API vs RESTful API - 차이점은?

**짧은 답변**: 실무에서는 **거의 같은 의미**로 사용됩니다!

**자세한 설명**:

#### REST API

- **REST 원칙을 따르는 API**를 의미하는 명사형 표현
- "REST 아키텍처 스타일을 사용하는 API"라는 의미

#### RESTful API

- **REST 원칙을 따르는 API**를 의미하는 형용사형 표현
- "REST 원칙을 따르는(RESTful)" API라는 의미
- `-ful`은 "~을 따르는, ~한"이라는 의미의 접미사

**비유로 이해하기**:

- REST API = "건강한 음식" (명사)
- RESTful API = "건강한 음식" (형용사 + 명사)
- 의미는 같지만 표현 방식만 다름!

**실무에서는**:

- 두 용어를 **같은 의미**로 사용하는 경우가 대부분
- 엄밀하게 구분하자면:
  - **RESTful API**: REST 원칙을 **완전히** 따르는 API
  - **REST API**: REST 원칙을 **부분적으로** 따르는 API (더 넓은 의미)

**우리 프로젝트에서는**:

- RESTful API라는 용어를 사용했지만
- REST API라고 해도 전혀 문제없습니다!
- 둘 다 같은 의미로 이해하시면 됩니다.

### 📝 비유로 이해하기

**비유**: 도서관에서 책을 빌리고, 반납하고, 새 책을 등록하는 것과 같습니다.

- GET = 책 찾기 (읽기)
- POST = 새 책 등록 (쓰기)
- PUT = 책 정보 수정 (수정)
- DELETE = 책 삭제 (지우기)

### 💻 HTTP 메서드 종류

| 메서드 | 의미        | 비유         |
| ------ | ----------- | ------------ |
| GET    | 데이터 조회 | 책 찾기      |
| POST   | 데이터 생성 | 새 책 등록   |
| PUT    | 데이터 수정 | 책 정보 수정 |
| DELETE | 데이터 삭제 | 책 삭제      |

### 💻 프로젝트에서 사용된 예시

#### GET - 할일 목록 가져오기

> ⚠️ **참고**: 아래 코드는 `loadTodos` 함수의 전체 구조입니다. 중간의 세부 로직은 생략되었습니다.

```14:32:todo-react/src/App.jsx
  const loadTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      // ... 응답 검증 및 에러 처리 ...
      const data = await response.json();
      setTodos(data || []);
      // ... 수정 모드 종료 로직 ...
    } catch (error) {
      // ... 에러 처리 ...
    }
  };
```

**설명**:

- `fetch("http://localhost:5000/todos")`: 서버에 "할일 목록 줘"라고 요청
- 기본적으로 GET 요청 (메서드 생략 시)
- 서버가 할일 목록을 JSON 형식으로 보냄
- `response.json()`: JSON을 JavaScript 객체로 변환
- `setTodos(data)`: 받은 데이터를 상태에 저장

**작동 흐름**:

```
React: "할일 목록 줘" (GET 요청)
  ↓
서버: "여기 있어" (JSON 데이터)
  ↓
React: 데이터 받아서 화면에 표시
```

#### POST - 새 할일 만들기

> ⚠️ **참고**: 아래 코드는 `addTodo` 함수의 전체 구조입니다. 중간의 세부 로직은 생략되었습니다.

```35:61:todo-react/src/App.jsx
  const addTodo = async () => {
    const title = todoInput.trim();
    if (title === "") {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      // ... 응답 검증 ...
      setTodoInput("");
      await loadTodos();
    } catch (error) {
      // ... 에러 처리 ...
    }
  };
```

**설명**:

- `method: "POST"`: 새 데이터를 만들겠다는 의미
- `body: JSON.stringify({ title })`: 보낼 데이터를 JSON 형식으로 변환
- 서버가 새 할일을 만들고 응답을 보냄

**작동 흐름**:

```
사용자: "공부하기" 입력 후 추가 버튼 클릭
  ↓
React: "새 할일 만들어줘" (POST 요청 + "공부하기" 데이터)
  ↓
서버: "완료! 새 할일 만들었어" (응답)
  ↓
React: 목록 새로고침해서 화면에 표시
```

#### PUT - 할일 수정하기

> ⚠️ **참고**: 아래 코드는 `toggleTodo` 함수의 전체 구조입니다. 중간의 세부 로직은 생략되었습니다.

```83:108:todo-react/src/App.jsx
  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (todo) {
      try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        });
        // ... 응답 검증 ...
        await loadTodos();
      } catch (error) {
        // ... 에러 처리 ...
      }
    }
  };
```

**설명**:

- `PUT /todos/${id}`: 특정 할일(id)을 수정
- `body: { completed: !todo.completed }`: 완료 상태를 반대로 변경
- 서버가 해당 할일을 수정하고 응답

**작동 흐름**:

```
사용자: 체크박스 클릭
  ↓
React: "이 할일의 완료 상태 바꿔줘" (PUT 요청)
  ↓
서버: "완료! 상태 바꿨어" (응답)
  ↓
React: 목록 새로고침
```

#### DELETE - 할일 삭제하기

> ⚠️ **참고**: 아래 코드는 `deleteTodo` 함수의 전체 구조입니다. 중간의 세부 로직은 생략되었습니다.

```64:80:todo-react/src/App.jsx
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });
      // ... 응답 검증 ...
      await loadTodos();
    } catch (error) {
      // ... 에러 처리 ...
    }
  };
```

**설명**:

- `DELETE /todos/${id}`: 특정 할일(id)을 삭제
- 서버가 해당 할일을 삭제하고 응답

**작동 흐름**:

```
사용자: "삭제" 버튼 클릭
  ↓
React: "이 할일 삭제해줘" (DELETE 요청)
  ↓
서버: "완료! 삭제했어" (응답)
  ↓
React: 목록 새로고침
```

### 🔑 전체 데이터 흐름

```
사용자 액션 (버튼 클릭 등)
  ↓
React 함수 실행 (addTodo, deleteTodo 등)
  ↓
fetch()로 서버에 요청 (GET/POST/PUT/DELETE)
  ↓
서버가 데이터 처리 (MongoDB에 저장/조회/수정/삭제)
  ↓
서버가 응답 반환 (JSON 데이터)
  ↓
React가 상태 업데이트 (setTodos 등)
  ↓
화면 자동 재렌더링 (새로운 데이터 표시)
```

### 🔑 핵심 정리

- **GET = 가져오기 (읽기)**
- **POST = 만들기 (쓰기)**
- **PUT = 수정하기 (업데이트)**
- **DELETE = 지우기 (삭제)**
- **fetch() = 서버와 통신하는 도구**
- **JSON = 데이터를 주고받는 형식**
