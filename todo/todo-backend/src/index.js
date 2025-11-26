// Main entry point for the Todo Backend API
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express 미들웨어 설정
app.use(cors()); // CORS 설정 - 모든 도메인에서 접근 허용
app.use(express.json());

// MongoDB 연결
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todo-db";

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
  res.json({ message: "Todo Backend API" });
});

// Todo 라우트
app.use("/todos", todoRoutes);

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
