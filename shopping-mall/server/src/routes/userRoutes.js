import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// 회원가입
router.post("/register", register);

// 로그인
router.post("/login", login);

// Access Token 재발급
router.post("/token/refresh", refreshAccessToken);

// 현재 사용자 정보 조회 (인증 필요)
router.get("/me", authenticate, getMe);

// 사용자 프로필 업데이트 (인증 필요)
router.put("/me", authenticate, updateProfile);

// 배송지 목록 조회 (인증 필요)
router.get("/me/addresses", authenticate, getAddresses);

// 배송지 추가 (인증 필요)
router.post("/me/addresses", authenticate, addAddress);

// 배송지 수정 (인증 필요)
router.put("/me/addresses/:addressId", authenticate, updateAddress);

// 배송지 삭제 (인증 필요)
router.delete("/me/addresses/:addressId", authenticate, deleteAddress);

export default router;
