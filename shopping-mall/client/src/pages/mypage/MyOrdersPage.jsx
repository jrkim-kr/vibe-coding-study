import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import { userOrderAPI } from "../../utils/api";
import "./MyPageLayout.css";
import "./MyOrdersPage.css";

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await userOrderAPI.getMyOrders({ limit: 50 });
        setOrders(res.orders || []);
      } catch (err) {
        console.error("내 주문 목록 조회 오류:", err);
        setError(err.message || "주문 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleClickOrder = (orderId) => {
    navigate(`/mypage/orders/${orderId}`);
  };

  return (
    <div className="mypage-layout-wrapper">
      <Header />
      <div className="mypage-container">
        <MyPageSidebar />
        <main className="mypage-content">
          <div className="mypage-main">
      <header className="mypage-main-header">
        <h2 className="mypage-main-title">주문 내역</h2>
        <p className="mypage-main-subtitle">
          최근 주문 내역을 확인하고 배송 상태를 확인하세요.
        </p>
      </header>

      <section className="mypage-main-content">
        {loading ? (
          <div className="mypage-empty">주문 내역을 불러오는 중입니다...</div>
        ) : error ? (
          <div className="mypage-empty error">{error}</div>
        ) : orders.length === 0 ? (
          <div className="mypage-empty">
            아직 주문 내역이 없습니다.
            <button
              type="button"
              className="mypage-empty-btn"
              onClick={() => navigate("/")}
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <ul className="my-orders-list">
            {orders.map((order) => (
              <li
                key={order._id}
                className="my-order-item"
                onClick={() => handleClickOrder(order._id)}
              >
                <div className="my-order-main-row">
                  <div>
                    <div className="my-order-number">
                      {order.orderNumber || "주문번호 없음"}
                    </div>
                    <div className="my-order-date">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="my-order-status">
                    <span className="my-order-badge">
                      {order.shippingStatus || "주문접수"}
                    </span>
                  </div>
                </div>
                <div className="my-order-sub-row">
                  <span className="my-order-count">
                    상품 {order.items?.length || 0}개
                  </span>
                  <span className="my-order-amount">
                    ₩ {(order.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyOrdersPage;
