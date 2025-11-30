import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import MyPageSidebar from "../../components/mypage/MyPageSidebar";
import { userOrderAPI } from "../../utils/api";
import "./MyPageLayout.css";
import "./MyOrdersPage.css";

function MyOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await userOrderAPI.getMyOrderById(id);
        setOrder(res);
      } catch (err) {
        console.error("내 주문 상세 조회 오류:", err);
        setError(err.message || "주문 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mypage-layout-wrapper">
      <Header />
      <div className="mypage-container">
        <MyPageSidebar />
        <main className="mypage-content">
          <div className="mypage-main">
      <header className="mypage-main-header">
        <h2 className="mypage-main-title">주문 상세</h2>
        <p className="mypage-main-subtitle">
          주문 상세 정보와 배송지를 확인할 수 있습니다.
        </p>
      </header>

      <section className="mypage-main-content">
        {loading ? (
          <div className="mypage-empty">주문 정보를 불러오는 중입니다...</div>
        ) : error ? (
          <div className="mypage-empty error">{error}</div>
        ) : !order ? (
          <div className="mypage-empty">주문 정보를 찾을 수 없습니다.</div>
        ) : (
          <div className="my-order-detail">
            <div className="my-order-detail-section">
              <div className="my-order-detail-row">
                <span className="my-order-detail-label">주문번호</span>
                <span className="my-order-detail-value">
                  {order.orderNumber || "주문번호 없음"}
                </span>
              </div>
              <div className="my-order-detail-row">
                <span className="my-order-detail-label">주문일시</span>
                <span className="my-order-detail-value">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="my-order-detail-row">
                <span className="my-order-detail-label">배송상태</span>
                <span className="my-order-detail-value">
                  {order.shippingStatus || "주문접수"}
                </span>
              </div>
            </div>

            <div className="my-order-detail-section">
              <h3 className="my-order-detail-title">배송지 정보</h3>
              <div className="my-order-detail-row">
                <span className="my-order-detail-label">수령인</span>
                <span className="my-order-detail-value">
                  {order.shipping?.recipientName || "-"}
                </span>
              </div>
              <div className="my-order-detail-row">
                <span className="my-order-detail-label">연락처</span>
                <span className="my-order-detail-value">
                  {order.shipping?.phone || "-"}
                </span>
              </div>
              <div className="my-order-detail-row">
                <span className="my-order-detail-label">주소</span>
                <span className="my-order-detail-value">
                  {order.shipping
                    ? `${order.shipping.zipCode || ""} ${
                        order.shipping.address1 || ""
                      } ${order.shipping.address2 || ""}`.trim() || "-"
                    : "-"}
                </span>
              </div>
              {order.shipping?.memo && (
                <div className="my-order-detail-row">
                  <span className="my-order-detail-label">배송 메모</span>
                  <span className="my-order-detail-value">
                    {order.shipping.memo}
                  </span>
                </div>
              )}
            </div>

            <div className="my-order-detail-section">
              <h3 className="my-order-detail-title">주문 상품</h3>
              <ul className="my-order-detail-items">
                {(order.items || []).map((item) => (
                  <li key={item._id} className="my-order-detail-item">
                    <div className="my-order-detail-thumb">
                      <img
                        src={
                          item.productImage ||
                          item.productId?.images?.[0] ||
                          "https://via.placeholder.com/64"
                        }
                        alt={item.productName || item.productId?.name || "상품"}
                      />
                    </div>
                    <div className="my-order-detail-info">
                      <div className="my-order-detail-name">
                        {item.productName || item.productId?.name || "상품"}
                      </div>
                      <div className="my-order-detail-meta">
                        <span>수량 {item.quantity}개</span>
                        <span>·</span>
                        <span>
                          ₩ {(item.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="my-order-detail-line-total">
                      ₩ {(item.totalPrice || 0).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="my-order-detail-total">
                <span className="my-order-detail-total-label">
                  총 결제 금액
                </span>
                <span className="my-order-detail-total-amount">
                  ₩ {(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="my-order-detail-actions">
              <button
                type="button"
                className="mypage-empty-btn"
                onClick={() => navigate("/mypage/orders")}
              >
                주문 목록으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyOrderDetailPage;
