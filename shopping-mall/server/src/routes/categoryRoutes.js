import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 모든 카테고리 관리 라우트는 인증 및 관리자 권한 필요
router.use(authenticate);
router.use(requireAdmin);

// 카테고리 목록 조회
router.get("/", getCategories);

// 카테고리 상세 조회
router.get("/:id", getCategoryById);

// 카테고리 등록
router.post("/", createCategory);

// 카테고리 수정
router.put("/:id", updateCategory);

// 카테고리 삭제
router.delete("/:id", deleteCategory);

export default router;
