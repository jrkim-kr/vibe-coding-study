// API 기본 URL 설정
const API_BASE_URL = "http://localhost:5000";

// 할일 목록을 저장할 배열
let todos = [];
let editingId = null;

// DOM 요소 가져오기
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// 서버에서 할일 목록 불러오기
async function loadTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error("할일 목록을 불러오는데 실패했습니다.");
    }
    const data = await response.json();
    todos = data || [];
    // 수정 중인 항목의 ID가 더 이상 존재하지 않으면 수정 모드 종료
    if (editingId && !todos.find((t) => t._id === editingId)) {
      editingId = null;
    }
    renderTodos();
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    alert(
      "할일 목록을 불러오는데 실패했습니다. 서버가 실행 중인지 확인해주세요."
    );
    renderTodos();
  }
}

// 할일 추가
async function addTodo() {
  const title = todoInput.value.trim();
  if (title === "") {
    todoInput.focus();
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

    todoInput.value = "";
    todoInput.focus();
    // 목록 새로고침
    await loadTodos();
  } catch (error) {
    console.error("할일 추가 실패:", error);
    alert("할일 추가에 실패했습니다. 다시 시도해주세요.");
  }
}

// 할일 삭제
async function deleteTodo(id) {
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
}

// 할일 완료 토글
async function toggleTodo(id) {
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
}

// 할일 수정 시작
function startEdit(id) {
  editingId = id;
  renderTodos();
}

// 할일 수정 취소
function cancelEdit() {
  editingId = null;
  renderTodos();
}

// 할일 수정 저장
async function saveEdit(id, newTitle) {
  const todo = todos.find((t) => t._id === id);
  if (todo && newTitle.trim() !== "") {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("할일 수정에 실패했습니다.");
      }

      // 수정 모드 종료 및 목록 새로고침
      editingId = null;
      await loadTodos();
    } catch (error) {
      console.error("할일 수정 실패:", error);
      alert("할일 수정에 실패했습니다. 다시 시도해주세요.");
    }
  } else {
    cancelEdit();
  }
}

// 저장 버튼 클릭 핸들러 (인라인 이벤트에서 사용)
function handleSaveEdit(id) {
  const inputElement = document.getElementById(`editInput-${id}`);
  if (inputElement) {
    saveEdit(id, inputElement.value);
  }
}

// 할일 목록 렌더링
function renderTodos() {
  if (todos.length === 0) {
    todoList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">할일이 없습니다.<br>새로운 할일을 추가해보세요!</div>
            </div>
        `;
    return;
  }

  todoList.innerHTML = todos
    .map((todo) => {
      const isEditing = editingId === todo._id;

      if (isEditing) {
        return `
                <li class="todo-item editing">
                    <input 
                        type="text" 
                        class="todo-edit-input" 
                        value="${escapeHtml(todo.title)}"
                        id="editInput-${todo._id}"
                        onkeypress="handleEditKeyPress(event, '${todo._id}')"
                        autofocus
                    >
                    <div class="todo-actions">
                        <button class="todo-btn save-btn" onclick="handleSaveEdit('${
                          todo._id
                        }')">
                            저장
                        </button>
                        <button class="todo-btn cancel-btn" onclick="cancelEdit()">
                            취소
                        </button>
                    </div>
                </li>
            `;
      }

      return `
            <li class="todo-item ${todo.completed ? "completed" : ""}">
                <div class="todo-checkbox ${
                  todo.completed ? "checked" : ""
                }" onclick="toggleTodo('${todo._id}')"></div>
                <span class="todo-text" onclick="toggleTodo('${
                  todo._id
                }')">${escapeHtml(todo.title)}</span>
                <div class="todo-actions">
                    <button class="todo-btn edit-btn" onclick="startEdit('${
                      todo._id
                    }')">
                        수정
                    </button>
                    <button class="todo-btn delete-btn" onclick="deleteTodo('${
                      todo._id
                    }')">
                        삭제
                    </button>
                </div>
            </li>
        `;
    })
    .join("");
}

// HTML 이스케이프 함수
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 입력 필드에서 Enter 키 처리
function handleKeyPress(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

// 수정 입력 필드에서 Enter 키 처리
function handleEditKeyPress(event, id) {
  if (event.key === "Enter") {
    saveEdit(id, event.target.value);
  } else if (event.key === "Escape") {
    cancelEdit();
  }
}

// 이벤트 리스너 등록
addBtn.addEventListener("click", addTodo);

// 모듈 스코프에서 전역 함수들을 window 객체에 할당 (HTML 인라인 이벤트 핸들러용)
window.handleKeyPress = handleKeyPress;
window.handleEditKeyPress = handleEditKeyPress;
window.toggleTodo = toggleTodo;
window.startEdit = startEdit;
window.cancelEdit = cancelEdit;
window.saveEdit = saveEdit;
window.handleSaveEdit = handleSaveEdit;
window.deleteTodo = deleteTodo;

// 페이지 로드 시 할일 목록 불러오기
loadTodos();
