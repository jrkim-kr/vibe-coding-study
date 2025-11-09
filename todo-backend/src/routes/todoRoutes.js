import express from "express";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

// 할 일 생성
router.post("/", createTodo);

// 할 일 전체 조회
router.get("/", getAllTodos);

// 할 일 단일 조회
router.get("/:id", getTodoById);

// 할 일 수정
router.put("/:id", updateTodo);

// 할 일 삭제
router.delete("/:id", deleteTodo);

export default router;
