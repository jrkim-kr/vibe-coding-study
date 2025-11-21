import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminCustomers.css";

const initialCustomers = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    phone: "010-1234-5678",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-20",
    orderCount: 12,
    totalSpent: 1250000,
    status: "활성",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    phone: "010-2345-6789",
    joinDate: "2023-03-22",
    lastLogin: "2024-01-19",
    orderCount: 8,
    totalSpent: 890000,
    status: "활성",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    phone: "010-3456-7890",
    joinDate: "2023-05-10",
    lastLogin: "2024-01-18",
    orderCount: 25,
    totalSpent: 3200000,
    status: "활성",
  },
  {
    id: 4,
    name: "William Kim",
    email: "will@email.com",
    phone: "010-4567-8901",
    joinDate: "2023-07-05",
    lastLogin: "2023-12-15",
    orderCount: 3,
    totalSpent: 150000,
    status: "비활성",
  },
  {
    id: 5,
    name: "Sophia Park",
    email: "sophia.park@email.com",
    phone: "010-5678-9012",
    joinDate: "2023-09-18",
    lastLogin: "2024-01-21",
    orderCount: 18,
    totalSpent: 2100000,
    status: "활성",
  },
  {
    id: 6,
    name: "James Chen",
    email: "james.chen@email.com",
    phone: "010-6789-0123",
    joinDate: "2023-11-30",
    lastLogin: "2024-01-10",
    orderCount: 5,
    totalSpent: 450000,
    status: "활성",
  },
  {
    id: 7,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "010-7890-1234",
    joinDate: "2022-12-20",
    lastLogin: "2023-11-05",
    orderCount: 2,
    totalSpent: 98000,
    status: "비활성",
  },
  {
    id: 8,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "010-8901-2345",
    joinDate: "2023-02-14",
    lastLogin: "2024-01-22",
    orderCount: 30,
    totalSpent: 4500000,
    status: "활성",
  },
];

function AdminCustomers() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("customers");
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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

  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleStatusChange = (customerId, newStatus) => {
    if (window.confirm(`회원 상태를 "${newStatus}"로 변경하시겠습니까?`)) {
      setCustomers(
        customers.map((c) =>
          c.id === customerId ? { ...c, status: newStatus } : c
        )
      );
      alert("회원 상태가 변경되었습니다.");
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({
          ...selectedCustomer,
          status: newStatus,
        });
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "전체" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    return status === "활성" ? "status-active" : "status-inactive";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
              <h2 className="admin-page-title">회원 관리</h2>
              <p className="admin-page-subtitle">
                회원 목록을 조회하고 관리할 수 있습니다
              </p>
            </div>
          </div>

          <div className="admin-customers-toolbar">
            <div className="admin-customers-filters">
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
                  placeholder="이름, 이메일, 전화번호로 검색..."
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
                <option value="활성">활성</option>
                <option value="비활성">비활성</option>
              </select>
            </div>
            <div className="admin-customers-count">
              총 {filteredCustomers.length}명
            </div>
          </div>

          <div className="admin-customers-table-container">
            <table className="admin-customers-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>전화번호</th>
                  <th>가입일</th>
                  <th>최근 로그인</th>
                  <th>주문 수</th>
                  <th>총 구매금액</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="admin-empty-state">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="admin-customer-name">{customer.name}</div>
                      </td>
                      <td>
                        <div className="admin-customer-email">
                          {customer.email}
                        </div>
                      </td>
                      <td>
                        <span className="admin-customer-phone">
                          {customer.phone}
                        </span>
                      </td>
                      <td>
                        <span className="admin-customer-date">
                          {formatDate(customer.joinDate)}
                        </span>
                      </td>
                      <td>
                        <span className="admin-customer-date">
                          {formatDate(customer.lastLogin)}
                        </span>
                      </td>
                      <td>
                        <span className="admin-customer-order-count">
                          {customer.orderCount}건
                        </span>
                      </td>
                      <td>
                        <span className="admin-customer-total">
                          ₩ {customer.totalSpent.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`admin-customer-status-select ${getStatusClass(
                            customer.status
                          )}`}
                          value={customer.status}
                          onChange={(e) =>
                            handleStatusChange(customer.id, e.target.value)
                          }
                        >
                          <option value="활성">활성</option>
                          <option value="비활성">비활성</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="admin-action-btn admin-detail-btn"
                          onClick={() => handleViewDetail(customer)}
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

      {showDetailModal && selectedCustomer && (
        <div
          className="customer-detail-modal-overlay"
          onClick={() => {
            setShowDetailModal(false);
            setSelectedCustomer(null);
          }}
        >
          <div
            className="customer-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="customer-detail-header">
              <h2 className="customer-detail-title">회원 상세 정보</h2>
              <button
                className="customer-detail-close"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCustomer(null);
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

            <div className="customer-detail-content">
              <div className="customer-detail-section">
                <h3 className="customer-detail-section-title">기본 정보</h3>
                <div className="customer-detail-info">
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">이름:</span>
                    <span className="customer-detail-value">
                      {selectedCustomer.name}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">이메일:</span>
                    <span className="customer-detail-value">
                      {selectedCustomer.email}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">전화번호:</span>
                    <span className="customer-detail-value">
                      {selectedCustomer.phone}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">가입일:</span>
                    <span className="customer-detail-value">
                      {formatDate(selectedCustomer.joinDate)}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">최근 로그인:</span>
                    <span className="customer-detail-value">
                      {formatDate(selectedCustomer.lastLogin)}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">상태:</span>
                    <select
                      className={`customer-detail-status-select ${getStatusClass(
                        selectedCustomer.status
                      )}`}
                      value={selectedCustomer.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedCustomer.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="활성">활성</option>
                      <option value="비활성">비활성</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="customer-detail-section">
                <h3 className="customer-detail-section-title">구매 정보</h3>
                <div className="customer-detail-info">
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">주문 수:</span>
                    <span className="customer-detail-value">
                      {selectedCustomer.orderCount}건
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">총 구매금액:</span>
                    <span className="customer-detail-value customer-detail-amount">
                      ₩ {selectedCustomer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">평균 주문금액:</span>
                    <span className="customer-detail-value">
                      ₩{" "}
                      {selectedCustomer.orderCount > 0
                        ? Math.round(
                            selectedCustomer.totalSpent /
                              selectedCustomer.orderCount
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;

