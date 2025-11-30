import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { userOrderAPI } from "../../utils/api";
import "./OrderCompletePage.css";

function OrderCompletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialOrderNumber = location.state?.orderNumber || "";
  const initialAmount = location.state?.paymentTotal || 0;

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [paymentTotal, setPaymentTotal] = useState(initialAmount);
  const [loading, setLoading] = useState(!initialOrderNumber || !initialAmount);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!id || (!loading && orderNumber)) return;
      try {
        setLoading(true);
        setError("");
        const order = await userOrderAPI.getMyOrderById(id);
        setOrderNumber(order.orderNumber || "");
        setPaymentTotal(order.totalAmount || 0);
      } catch (err) {
        console.error("주문 완료 페이지 주문 조회 오류:", err);
        setError(err.message || "주문 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, loading, orderNumber]);

  return (
    <div className="order-complete-page">
      <Header />

      <main className="order-complete-main">
        <header className="order-complete-header">
          <h2 className="order-complete-title">ORDER COMPLETE</h2>
          <p className="order-complete-subtitle">
            주문이 정상적으로 완료되었습니다. 감사합니다.
          </p>
        </header>

        <section className="order-complete-content">
          <div className="order-complete-card">
            {loading ? (
              <p className="order-complete-text">주문 정보를 불러오는 중입니다...</p>
            ) : error ? (
              <p className="order-complete-text error">{error}</p>
            ) : (
              <>
                <p className="order-complete-label">주문번호</p>
                <p className="order-complete-value">
                  {orderNumber || "확인 중"}
                </p>

                <p className="order-complete-label">결제 금액</p>
                <p className="order-complete-amount">
                  ₩ {paymentTotal.toLocaleString()}
                </p>

                <p className="order-complete-message">
                  주문 내역은 마이페이지 &gt; 주문 내역에서 다시 확인하실 수 있습니다.
                </p>
              </>
            )}

            <div className="order-complete-actions">
              <button
                type="button"
                className="order-complete-btn secondary"
                onClick={() => navigate("/mypage/orders")}
              >
                주문 내역 보기
              </button>
              <button
                type="button"
                className="order-complete-btn primary"
                onClick={() => navigate("/")}
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OrderCompletePage;


