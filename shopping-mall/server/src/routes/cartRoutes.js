import express from "express";
import {
  getMyCart,
  addOrUpdateItem,
  updateItemQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// 모든 장바구니 라우트는 로그인 필요
router.use(authenticate);

// 현재 로그인한 사용자의 장바구니 조회
router.get("/", getMyCart);

// 장바구니에 상품 추가 또는 수량 증가
router.post("/items", addOrUpdateItem);

// 특정 상품 수량 변경
router.patch("/items/:productId", updateItemQuantity);

// 장바구니에서 상품 제거
router.delete("/items/:productId", removeItem);

// 장바구니 비우기
router.delete("/", clearCart);

export default router;


