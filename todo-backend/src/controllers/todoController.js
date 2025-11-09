import Todo from "../models/Todo.js";

// 할 일 생성
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

// 할 일 전체 조회
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 할 일 단일 조회
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "할 일을 찾을 수 없습니다." });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 할 일 수정
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "할 일을 찾을 수 없습니다." });
    }

    if (title !== undefined) {
      todo.title = title;
    }
    if (completed !== undefined) {
      todo.completed = completed;
    }

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 할 일 삭제
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ error: "할 일을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "할 일이 삭제되었습니다.", todo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
