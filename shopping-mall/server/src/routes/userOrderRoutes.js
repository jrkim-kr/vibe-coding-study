import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
} from "../controllers/userOrderController.js";

const router = express.Router();

// 모든 사용자 주문 라우트는 로그인 필요
router.use(authenticate);

// 내 주문 목록 조회
router.get("/", getMyOrders);

// 주문 상세 조회
router.get("/:id", getMyOrderById);

// 장바구니 기반 주문 생성
router.post("/", createOrderFromCart);

export default router;


