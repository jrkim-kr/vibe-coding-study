import axios from "axios";

/**
 * 포트원 결제 검증
 * @param {string} impUid - 포트원 결제 고유번호
 * @returns {Promise<Object>} 결제 정보
 */
export const verifyPayment = async (impUid) => {
  try {
    const REST_API_KEY = process.env.PORTONE_REST_API_KEY;
    const REST_API_SECRET = process.env.PORTONE_REST_API_SECRET;

    if (!REST_API_KEY || !REST_API_SECRET) {
      throw new Error("포트원 API 키가 설정되지 않았습니다.");
    }

    // 포트원 액세스 토큰 발급
    const tokenResponse = await axios.post(
      "https://api.iamport.kr/users/getToken",
      {
        imp_key: REST_API_KEY,
        imp_secret: REST_API_SECRET,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { access_token } = tokenResponse.data.response;

    // 결제 정보 조회
    const paymentResponse = await axios.get(
      `https://api.iamport.kr/payments/${impUid}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const paymentData = paymentResponse.data.response;

    // 결제 상태 확인
    if (paymentData.status !== "paid") {
      throw new Error(
        `결제가 완료되지 않았습니다. 상태: ${paymentData.status}`
      );
    }

    return {
      success: true,
      payment: {
        impUid: paymentData.imp_uid,
        merchantUid: paymentData.merchant_uid,
        amount: paymentData.amount,
        status: paymentData.status,
        payMethod: paymentData.pay_method,
        paidAt: paymentData.paid_at,
        buyerName: paymentData.buyer_name,
        buyerEmail: paymentData.buyer_email,
        buyerTel: paymentData.buyer_tel,
      },
    };
  } catch (error) {
    console.error("결제 검증 오류:", error);
    if (error.response) {
      throw new Error(
        error.response.data?.message || "결제 검증 중 오류가 발생했습니다."
      );
    }
    throw error;
  }
};

