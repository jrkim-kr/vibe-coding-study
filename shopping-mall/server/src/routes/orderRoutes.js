import express from "express";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 모든 주문 관리 라우트는 인증 및 관리자 권한 필요
router.use(authenticate);
router.use(requireAdmin);

// 주문 목록 조회
router.get("/", getOrders);

// 주문 상세 조회
router.get("/:id", getOrderById);

// 배송 상태 변경
router.patch("/:id/status", updateOrderStatus);

export default router;
