import express from "express";
import { authenticate } from "../middleware/auth.js";
import { verifyPayment } from "../controllers/paymentController.js";
import {
  asyncHandler,
  sendBadRequest,
  sendError,
} from "../utils/responseHelpers.js";

const router = express.Router();

// 모든 결제 라우트는 로그인 필요
router.use(authenticate);

// 결제 검증
router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { impUid } = req.body;

    if (!impUid) {
      return sendBadRequest(res, "결제 고유번호(impUid)가 필요합니다.");
    }

    const result = await verifyPayment(impUid);
    res.json(result);
  })
);

export default router;
