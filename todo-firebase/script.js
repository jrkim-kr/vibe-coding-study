// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  remove,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);
const todosRef = ref(database, "todos");

// 할일 목록을 저장할 배열
let todos = [];
let editingId = null;

// DOM 요소 가져오기
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// Firebase에서 할일 목록 불러오기 (실시간 동기화)
function loadTodos() {
  onValue(
    todosRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Firebase에서 가져온 데이터를 배열로 변환
        todos = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => {
            // createdAt 기준으로 최신순 정렬
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
          });
      } else {
        todos = [];
      }
      // 수정 중인 항목의 ID가 더 이상 존재하지 않으면 수정 모드 종료
      if (editingId && !todos.find((t) => t.id === editingId)) {
        editingId = null;
      }
      renderTodos();
    },
    (error) => {
      console.error("데이터 로드 실패:", error);
      renderTodos();
    }
  );
}

// 할일 추가
async function addTodo() {
  const text = todoInput.value.trim();
  if (text === "") {
    todoInput.focus();
    return;
  }

  const newTodo = {
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  try {
    // Firebase에 새 할일 추가 (push를 사용하면 자동으로 고유 키 생성)
    const newTodoRef = push(todosRef, newTodo);
    todoInput.value = "";
    todoInput.focus();
  } catch (error) {
    console.error("할일 추가 실패:", error);
    alert("할일 추가에 실패했습니다. 다시 시도해주세요.");
  }
}

// 할일 삭제
async function deleteTodo(id) {
  try {
    const todoRef = ref(database, `todos/${id}`);
    await remove(todoRef);
  } catch (error) {
    console.error("할일 삭제 실패:", error);
    alert("할일 삭제에 실패했습니다. 다시 시도해주세요.");
  }
}

// 할일 완료 토글
async function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    try {
      const todoRef = ref(database, `todos/${id}`);
      await update(todoRef, {
        completed: !todo.completed,
      });
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
async function saveEdit(id, newText) {
  const todo = todos.find((t) => t.id === id);
  if (todo && newText.trim() !== "") {
    try {
      const todoRef = ref(database, `todos/${id}`);
      await update(todoRef, {
        text: newText.trim(),
      });
      // 수정 모드 종료 및 UI 즉시 업데이트
      editingId = null;
      renderTodos();
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
      const isEditing = editingId === todo.id;

      if (isEditing) {
        return `
                <li class="todo-item editing">
                    <input 
                        type="text" 
                        class="todo-edit-input" 
                        value="${escapeHtml(todo.text)}"
                        id="editInput-${todo.id}"
                        onkeypress="handleEditKeyPress(event, '${todo.id}')"
                        autofocus
                    >
                    <div class="todo-actions">
                        <button class="todo-btn save-btn" onclick="handleSaveEdit('${
                          todo.id
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
                }" onclick="toggleTodo('${todo.id}')"></div>
                <span class="todo-text" onclick="toggleTodo('${
                  todo.id
                }')">${escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="todo-btn edit-btn" onclick="startEdit('${
                      todo.id
                    }')">
                        수정
                    </button>
                    <button class="todo-btn delete-btn" onclick="deleteTodo('${
                      todo.id
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
