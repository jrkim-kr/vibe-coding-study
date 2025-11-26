import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// 공개용 상품 목록/상세 조회 (인증 없이 사용)
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;


