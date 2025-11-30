import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { orderAPI } from "../../utils/api";
import "./AdminOrders.css";

const shippingStatuses = [
  "주문접수",
  "배송준비중",
  "배송중",
  "배송완료",
  "취소",
  "반품",
];

function AdminOrders() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // URL 경로에 따라 activeMenu 설정
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") {
      setActiveMenu("dashboard");
    } else if (path.includes("/products")) {
      setActiveMenu("products");
    } else if (path.includes("/orders")) {
      setActiveMenu("orders");
    } else if (path.includes("/categories")) {
      setActiveMenu("categories");
    } else if (path.includes("/customers")) {
      setActiveMenu("customers");
    }
  }, [location.pathname]);

  // 화면 크기가 1024px보다 클 때는 사이드바를 항상 열어둠
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // 초기 설정
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter, dateFilter]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        limit: 100,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter !== "전체") {
        params.status = statusFilter;
      }

      if (dateFilter) {
        params.date = dateFilter;
      }

      const response = await orderAPI.getOrders(params);
      setOrders(response.orders || []);
    } catch (err) {
      console.error("주문 목록 로드 오류:", err);
      setError(err.message || "주문 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`배송 상태를 "${newStatus}"로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      alert("배송 상태가 변경되었습니다.");
      loadOrders(); // 목록 새로고침

      // 모달이 열려있으면 선택된 주문도 업데이트
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = await orderAPI.getOrderById(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      alert(err.message || "배송 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleViewDetail = async (order) => {
    try {
      // 주문 상세 정보 로드
      const response = await orderAPI.getOrderById(order._id || order.id);
      // 서버는 order 객체를 직접 반환
      setSelectedOrder(response || order);
      setShowDetailModal(true);
    } catch (err) {
      console.error("주문 상세 조회 오류:", err);
      // 상세 조회 실패 시 기본 정보만 표시
      setSelectedOrder(order);
      setShowDetailModal(true);
    }
  };

  const formatOrderDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "주문접수":
        return "status-pending";
      case "배송준비중":
        return "status-preparing";
      case "배송중":
        return "status-shipping";
      case "배송완료":
        return "status-delivered";
      case "취소":
        return "status-cancelled";
      case "반품":
        return "status-returned";
      default:
        return "";
    }
  };

  const getPaymentStatusClass = (status) => {
    if (typeof status === "string") {
      return status === "결제완료" || status === "paid" ? "payment-complete" : "payment-pending";
    }
    // 객체인 경우
    return status === "paid" ? "payment-complete" : "payment-pending";
  };

  const getPaymentStatusText = (payment) => {
    if (typeof payment === "string") return payment;
    if (payment?.status === "paid") return "결제완료";
    if (payment?.status === "pending") return "결제대기";
    if (payment?.status === "failed") return "결제실패";
    return "결제대기";
  };

  return (
    <div className="admin-container">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="admin-main">
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <div className="admin-content">
          <div className="admin-page-header">
            <div>
              <h2 className="admin-page-title">주문 관리</h2>
              <p className="admin-page-subtitle">
                주문 목록을 조회하고 배송 상태를 변경할 수 있습니다
              </p>
            </div>
          </div>

          <div className="admin-orders-toolbar">
            <div className="admin-orders-filters">
              <div className="admin-search-box">
                <svg
                  className="admin-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="주문번호, 고객명, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
              </div>
              <select
                className="admin-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="전체">전체 상태</option>
                {shippingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="admin-filter-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="주문일자"
              />
            </div>
            <div className="admin-orders-count">
              총 {orders.length}건
            </div>
          </div>

          {error && (
            <div className="admin-error-message">{error}</div>
          )}

          <div className="admin-orders-table-container">
            {loading ? (
              <div className="admin-loading">로딩 중...</div>
            ) : (
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>주문번호</th>
                    <th>고객정보</th>
                    <th>주문일자</th>
                    <th>상품</th>
                    <th>주문금액</th>
                    <th>결제상태</th>
                    <th>배송상태</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="admin-empty-state">
                        {searchTerm || statusFilter !== "전체" || dateFilter
                          ? "검색 결과가 없습니다"
                          : "등록된 주문이 없습니다"}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const orderNumber = order.orderNumber || order.id;
                      const customerName = order.userId?.name || order.customerName || "고객";
                      const customerEmail = order.userId?.email || order.customerEmail || "";
                      const orderDate = formatOrderDate(order.createdAt || order.orderDate);
                      const items = order.items || [];
                      const totalAmount = order.totalAmount || 0;
                      const shippingStatus = order.shippingStatus || "주문접수";
                      const paymentStatus = order.paymentStatus || "결제대기";

                      return (
                        <tr key={order._id || order.id}>
                          <td>
                            <div className="admin-order-id">{orderNumber}</div>
                          </td>
                          <td>
                            <div className="admin-order-customer">
                              <div className="admin-order-customer-name">
                                {customerName}
                              </div>
                              <div className="admin-order-customer-email">
                                {customerEmail}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="admin-order-date">{orderDate}</span>
                          </td>
                          <td>
                            <div className="admin-order-items">
                              {items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="admin-order-item">
                                  <img
                                    src={
                                      item.productImage ||
                                      item.image ||
                                      "https://via.placeholder.com/40"
                                    }
                                    alt={item.productName || item.name || "상품"}
                                    className="admin-order-item-image"
                                  />
                                  <span className="admin-order-item-name">
                                    {item.productName || item.name || "상품"}
                                  </span>
                                  <span className="admin-order-item-quantity">
                                    x{item.quantity || 1}
                                  </span>
                                </div>
                              ))}
                              {items.length > 2 && (
                                <div className="admin-order-item-more">
                                  +{items.length - 2}개 더보기
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="admin-order-amount">
                              ₩ {totalAmount.toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-order-payment-status ${getPaymentStatusClass(
                                paymentStatus
                              )}`}
                            >
                              {getPaymentStatusText(paymentStatus)}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`admin-order-status-select ${getStatusClass(
                                shippingStatus
                              )}`}
                              value={shippingStatus}
                              onChange={(e) =>
                                handleStatusChange(order._id || order.id, e.target.value)
                              }
                            >
                              {shippingStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              className="admin-action-btn admin-detail-btn"
                              onClick={() => handleViewDetail(order)}
                            >
                              상세보기
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showDetailModal && selectedOrder && (
        <div
          className="order-detail-modal-overlay"
          onClick={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
        >
          <div
            className="order-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-detail-header">
              <h2 className="order-detail-title">주문 상세 정보</h2>
              <button
                className="order-detail-close"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="order-detail-content">
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">주문 정보</h3>
                <div className="order-detail-info">
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">주문번호:</span>
                    <span className="order-detail-value">
                      {selectedOrder.orderNumber || selectedOrder.id}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">주문일자:</span>
                    <span className="order-detail-value">
                      {formatOrderDate(selectedOrder.createdAt || selectedOrder.orderDate)}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">결제상태:</span>
                    <span
                      className={`order-detail-value ${getPaymentStatusClass(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">배송상태:</span>
                    <select
                      className={`order-detail-status-select ${getStatusClass(
                        selectedOrder.shippingStatus
                      )}`}
                      value={selectedOrder.shippingStatus || "주문접수"}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder._id || selectedOrder.id, e.target.value)
                      }
                    >
                      {shippingStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3 className="order-detail-section-title">고객 정보</h3>
                <div className="order-detail-info">
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">이름:</span>
                    <span className="order-detail-value">
                      {selectedOrder.userId?.name || selectedOrder.customerName || "-"}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">이메일:</span>
                    <span className="order-detail-value">
                      {selectedOrder.userId?.email || selectedOrder.customerEmail || "-"}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">연락처:</span>
                    <span className="order-detail-value">
                      {selectedOrder.shipping?.phone || selectedOrder.phone || "-"}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">배송지:</span>
                    <span className="order-detail-value">
                      {selectedOrder.shipping
                        ? `${selectedOrder.shipping.address1 || ""} ${selectedOrder.shipping.address2 || ""}`.trim() || "-"
                        : selectedOrder.shippingAddress || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3 className="order-detail-section-title">주문 상품</h3>
                <div className="order-detail-items">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="order-detail-item">
                      <img
                        src={
                          item.productImage ||
                          item.image ||
                          "https://via.placeholder.com/60"
                        }
                        alt={item.productName || item.name || "상품"}
                        className="order-detail-item-image"
                      />
                      <div className="order-detail-item-info">
                        <div className="order-detail-item-name">
                          {item.productName || item.name || "상품"}
                        </div>
                        <div className="order-detail-item-details">
                          <span>수량: {item.quantity || 1}개</span>
                          <span>
                            가격: ₩ {(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="order-detail-item-total">
                        ₩ {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-detail-total">
                  <span className="order-detail-total-label">총 주문금액:</span>
                  <span className="order-detail-total-amount">
                    ₩ {(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
