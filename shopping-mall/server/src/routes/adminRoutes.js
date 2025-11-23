import express from "express";
import {
  getDashboardStats,
  getRecentRevenue,
  getRecentSales,
} from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// 모든 관리자 라우트는 인증 및 관리자 권한 필요
router.use(authenticate);
router.use(requireAdmin);

// 대시보드 통계
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/revenue", getRecentRevenue);
router.get("/dashboard/sales", getRecentSales);

export default router;
