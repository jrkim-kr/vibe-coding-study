import jwt from "jsonwebtoken";
import User from "../models/User.js";

// JWT_SECRET을 userController와 동일하게 설정
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

/**
 * JWT 토큰 검증 미들웨어
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer 토큰

    if (!token) {
      return res.status(401).json({
        error: "인증 토큰이 필요합니다.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.isDeleted) {
      return res.status(401).json({
        error: "유효하지 않은 사용자입니다.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "유효하지 않은 토큰입니다.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "토큰이 만료되었습니다.",
      });
    }
    return res.status(500).json({
      error: "인증 처리 중 오류가 발생했습니다.",
    });
  }
};

/**
 * 관리자 권한 확인 미들웨어
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "인증이 필요합니다.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "관리자 권한이 필요합니다.",
    });
  }

  next();
};
