import express from "express";
import {
  register,
  login,
  refreshAccessToken,
} from "../controllers/authController.js";

const router = express.Router();

// 회원가입
router.post("/register", register);

// 로그인
router.post("/login", login);

// Access Token 재발급
router.post("/token/refresh", refreshAccessToken);

export default router;
