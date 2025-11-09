import { useState, useEffect } from "react";
import "./App.css";

// API 기본 URL 설정
const API_BASE_URL = "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // 서버에서 할일 목록 불러오기
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

  // 할일 추가
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

      if (!response.ok) {
        throw new Error("할일 추가에 실패했습니다.");
      }

      setTodoInput("");
      // 목록 새로고침
      await loadTodos();
    } catch (error) {
      console.error("할일 추가 실패:", error);
      alert("할일 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 할일 삭제
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("할일 삭제에 실패했습니다.");
      }

      // 목록 새로고침
      await loadTodos();
    } catch (error) {
      console.error("할일 삭제 실패:", error);
      alert("할일 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 할일 완료 토글
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

        if (!response.ok) {
          throw new Error("할일 상태 업데이트에 실패했습니다.");
        }

        // 목록 새로고침
        await loadTodos();
      } catch (error) {
        console.error("할일 상태 업데이트 실패:", error);
        alert("할일 상태 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 할일 수정 시작
  const startEdit = (id) => {
    const todo = todos.find((t) => t._id === id);
    if (todo) {
      setEditingId(id);
      setEditingTitle(todo.title);
    }
  };

  // 할일 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // 할일 수정 저장
  const saveEdit = async (id) => {
    const newTitle = editingTitle.trim();
    if (newTitle === "") {
      cancelEdit();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("할일 수정에 실패했습니다.");
      }

      // 수정 모드 종료 및 목록 새로고침
      setEditingId(null);
      setEditingTitle("");
      await loadTodos();
    } catch (error) {
      console.error("할일 수정 실패:", error);
      alert("할일 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 입력 필드에서 Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // 수정 입력 필드에서 Enter 키 처리
  const handleEditKeyPress = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // 페이지 로드 시 할일 목록 불러오기
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">할일</h1>
        <p className="subtitle">오늘 해야 할 일을 기록하세요</p>
      </header>

      <div className="input-section">
        <input
          type="text"
          className="todo-input"
          placeholder="할일을 입력하세요"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-btn" onClick={addTodo}>
          추가
        </button>
      </div>

      <div className="todo-list-container">
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
                <li
                  key={todo._id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  <div
                    className={`todo-checkbox ${
                      todo.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTodo(todo._id)}
                  ></div>
                  <span
                    className="todo-text"
                    onClick={() => toggleTodo(todo._id)}
                  >
                    {todo.title}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="todo-btn edit-btn"
                      onClick={() => startEdit(todo._id)}
                    >
                      수정
                    </button>
                    <button
                      className="todo-btn delete-btn"
                      onClick={() => deleteTodo(todo._id)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
