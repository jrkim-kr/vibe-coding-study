// Main entry point for the Shoppping Mall Demo Backend API
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import publicProductRoutes from "./routes/publicProductRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userOrderRoutes from "./routes/userOrderRoutes.js";

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express 미들웨어 설정
app.use(cors()); // CORS 설정 - 모든 도메인에서 접근 허용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB 연결
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/shopping-mall-db";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // MongoDB 연결 성공 후 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB 연결 실패:", error);
    process.exit(1);
  });

// 기본 라우트
app.get("/", (req, res) => {
  res.json({
    message: "Shoppping Mall Demo Backend API",
    status: "running",
  });
});

// Health check 라우트
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API 라우트
app.use("/api/users", userRoutes);

// 관리자 API 라우트
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/customers", customerRoutes);

// 공개 상품 API 라우트 (메인 페이지 등에서 사용)
app.use("/api/products", publicProductRoutes);

// 장바구니 API
app.use("/api/cart", cartRoutes);

// 사용자 주문 API
app.use("/api/orders", userOrderRoutes);

// MongoDB 연결 상태 확인
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB 연결 성공!");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB 연결 오류:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB 연결이 끊어졌습니다.");
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "서버 내부 오류가 발생했습니다.",
    message: err.message,
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: "요청한 리소스를 찾을 수 없습니다.",
  });
});
