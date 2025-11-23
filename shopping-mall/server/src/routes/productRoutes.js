import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 모든 상품 관리 라우트는 인증 및 관리자 권한 필요
router.use(authenticate);
router.use(requireAdmin);

// 상품 목록 조회
router.get("/", getProducts);

// 상품 상세 조회
router.get("/:id", getProductById);

// 상품 등록
router.post("/", createProduct);

// 상품 수정
router.put("/:id", updateProduct);

// 상품 삭제
router.delete("/:id", deleteProduct);

export default router;

