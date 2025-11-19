import express from "express";
import { register, login } from "../controllers/userController.js";

const router = express.Router();

// 회원가입
router.post("/register", register);

// 로그인
router.post("/login", login);

export default router;
