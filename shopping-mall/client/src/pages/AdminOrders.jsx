import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminOrders.css";

const initialOrders = [
  {
    id: "ORD-2024-001",
    customerName: "Olivia Martin",
    customerEmail: "olivia.martin@email.com",
    orderDate: "2024-01-15",
    items: [
      {
        name: "페포 벌로 퍼 레더 자켓",
        quantity: 1,
        price: 40900,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
      },
    ],
    totalAmount: 40900,
    shippingStatus: "배송준비중",
    paymentStatus: "결제완료",
    shippingAddress: "서울특별시 마포구 동교로23길 32-23",
    phone: "010-1234-5678",
  },
  {
    id: "ORD-2024-002",
    customerName: "Jackson Lee",
    customerEmail: "jackson.lee@email.com",
    orderDate: "2024-01-14",
    items: [
      {
        name: "체르디 앙고라 헤어리 루즈 V 넥 니트 가디건",
        quantity: 1,
        price: 48600,
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    totalAmount: 48600,
    shippingStatus: "배송중",
    paymentStatus: "결제완료",
    shippingAddress: "서울특별시 강남구 테헤란로 123",
    phone: "010-2345-6789",
  },
  {
    id: "ORD-2024-003",
    customerName: "Isabella Nguyen",
    customerEmail: "isabella.nguyen@email.com",
    orderDate: "2024-01-13",
    items: [
      {
        name: "[MADE] 누브라 부클 누빔 하이넥 집업 점퍼",
        quantity: 2,
        price: 60200,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "레논 울 헤어리 라운드 노르딕 니트 가디건",
        quantity: 1,
        price: 26000,
        image:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
      },
    ],
    totalAmount: 146400,
    shippingStatus: "배송완료",
    paymentStatus: "결제완료",
    shippingAddress: "서울특별시 서초구 서초대로 456",
    phone: "010-3456-7890",
  },
  {
    id: "ORD-2024-004",
    customerName: "William Kim",
    customerEmail: "will@email.com",
    orderDate: "2024-01-12",
    items: [
      {
        name: "코리엔 리본 펜던트 니트 뷔스티에",
        quantity: 1,
        price: 25100,
        image:
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      },
    ],
    totalAmount: 25100,
    shippingStatus: "주문접수",
    paymentStatus: "결제완료",
    shippingAddress: "서울특별시 종로구 세종대로 789",
    phone: "010-4567-8901",
  },
];

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
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`배송 상태를 "${newStatus}"로 변경하시겠습니까?`)) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, shippingStatus: newStatus } : order
        )
      );
      alert("배송 상태가 변경되었습니다.");
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || order.shippingStatus === statusFilter;
    const matchesDate = !dateFilter || order.orderDate === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

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
    return status === "결제완료" ? "payment-complete" : "payment-pending";
  };

  return (
    <div className="admin-container">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-logo">COMMON UNIQUE</h1>
          <h2 className="admin-console-title">Admin Console</h2>
          <div className="admin-user">
            <svg
              className="admin-user-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 20c2-3 4.5-4.5 7.5-4.5s5.5 1.5 7.5 4.5" />
            </svg>
            <span>admin@common-unique.com</span>
          </div>
        </header>

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
              총 {filteredOrders.length}건
            </div>
          </div>

          <div className="admin-orders-table-container">
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-empty-state">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="admin-order-id">{order.id}</div>
                      </td>
                      <td>
                        <div className="admin-order-customer">
                          <div className="admin-order-customer-name">
                            {order.customerName}
                          </div>
                          <div className="admin-order-customer-email">
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-order-date">
                          {order.orderDate}
                        </span>
                      </td>
                      <td>
                        <div className="admin-order-items">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="admin-order-item">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="admin-order-item-image"
                              />
                              <span className="admin-order-item-name">
                                {item.name}
                              </span>
                              <span className="admin-order-item-quantity">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="admin-order-item-more">
                              +{order.items.length - 2}개 더보기
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="admin-order-amount">
                          ₩ {order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-order-payment-status ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`admin-order-status-select ${getStatusClass(
                            order.shippingStatus
                          )}`}
                          value={order.shippingStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
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
                  ))
                )}
              </tbody>
            </table>
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
                    <span className="order-detail-value">{selectedOrder.id}</span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">주문일자:</span>
                    <span className="order-detail-value">
                      {selectedOrder.orderDate}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">결제상태:</span>
                    <span
                      className={`order-detail-value ${getPaymentStatusClass(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">배송상태:</span>
                    <select
                      className={`order-detail-status-select ${getStatusClass(
                        selectedOrder.shippingStatus
                      )}`}
                      value={selectedOrder.shippingStatus}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder.id, e.target.value)
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
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">이메일:</span>
                    <span className="order-detail-value">
                      {selectedOrder.customerEmail}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">연락처:</span>
                    <span className="order-detail-value">
                      {selectedOrder.phone}
                    </span>
                  </div>
                  <div className="order-detail-info-row">
                    <span className="order-detail-label">배송지:</span>
                    <span className="order-detail-value">
                      {selectedOrder.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3 className="order-detail-section-title">주문 상품</h3>
                <div className="order-detail-items">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-detail-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-detail-item-image"
                      />
                      <div className="order-detail-item-info">
                        <div className="order-detail-item-name">
                          {item.name}
                        </div>
                        <div className="order-detail-item-details">
                          <span>수량: {item.quantity}개</span>
                          <span>
                            가격: ₩ {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="order-detail-item-total">
                        ₩ {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-detail-total">
                  <span className="order-detail-total-label">총 주문금액:</span>
                  <span className="order-detail-total-amount">
                    ₩ {selectedOrder.totalAmount.toLocaleString()}
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

