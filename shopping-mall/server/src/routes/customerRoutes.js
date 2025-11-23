import express from "express";
import {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
} from "../controllers/customerController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 모든 회원 관리 라우트는 인증 및 관리자 권한 필요
router.use(authenticate);
router.use(requireAdmin);

// 회원 목록 조회
router.get("/", getCustomers);

// 회원 상세 조회
router.get("/:id", getCustomerById);

// 회원 상태 변경
router.patch("/:id/status", updateCustomerStatus);

export default router;

