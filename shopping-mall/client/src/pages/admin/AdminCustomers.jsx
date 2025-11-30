import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { customerAPI } from "../../utils/api";
import "./AdminCustomers.css";

function AdminCustomers() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("customers");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
    loadCustomers();
  }, [searchTerm, statusFilter]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const loadCustomers = async () => {
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

      const response = await customerAPI.getCustomers(params);
      setCustomers(response.customers || []);
    } catch (err) {
      console.error("회원 목록 로드 오류:", err);
      setError(err.message || "회원 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (customer) => {
    try {
      // 회원 상세 정보 로드
      const response = await customerAPI.getCustomerById(customer._id || customer.id);
      // 서버는 customer 객체를 직접 반환
      setSelectedCustomer(response || customer);
      setShowDetailModal(true);
    } catch (err) {
      console.error("회원 상세 조회 오류:", err);
      // 상세 조회 실패 시 기본 정보만 표시
      setSelectedCustomer(customer);
      setShowDetailModal(true);
    }
  };

  const handleStatusChange = async (customerId, newStatus) => {
    if (!window.confirm(`회원 상태를 "${newStatus}"로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await customerAPI.updateCustomerStatus(customerId, newStatus);
      alert("회원 상태가 변경되었습니다.");
      loadCustomers(); // 목록 새로고침

      // 모달이 열려있으면 선택된 회원도 업데이트
      if (selectedCustomer && (selectedCustomer._id === customerId || selectedCustomer.id === customerId)) {
        const updatedCustomer = await customerAPI.getCustomerById(customerId);
        setSelectedCustomer(updatedCustomer || { ...selectedCustomer, status: newStatus });
      }
    } catch (err) {
      alert(err.message || "회원 상태 변경 중 오류가 발생했습니다.");
    }
  };

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
              총 {customers.length}명
            </div>
          </div>

          {error && (
            <div className="admin-error-message">{error}</div>
          )}

          <div className="admin-customers-table-container">
            {loading ? (
              <div className="admin-loading">로딩 중...</div>
            ) : (
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
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="admin-empty-state">
                        {searchTerm || statusFilter !== "전체"
                          ? "검색 결과가 없습니다"
                          : "등록된 회원이 없습니다"}
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => {
                      const customerId = customer._id || customer.id;
                      const orderCount = customer.orderCount || 0;
                      const totalSpent = customer.totalSpent || 0;
                      const status = customer.isDeleted ? "비활성" : (customer.status || "활성");

                      return (
                        <tr key={customerId}>
                          <td>
                            <div className="admin-customer-name">{customer.name || "-"}</div>
                          </td>
                          <td>
                            <div className="admin-customer-email">
                              {customer.email || "-"}
                            </div>
                          </td>
                          <td>
                            <span className="admin-customer-phone">
                              {customer.phone || "-"}
                            </span>
                          </td>
                          <td>
                            <span className="admin-customer-date">
                              {formatDate(customer.createdAt || customer.joinDate)}
                            </span>
                          </td>
                          <td>
                            <span className="admin-customer-date">
                              {formatDate(customer.lastLogin)}
                            </span>
                          </td>
                          <td>
                            <span className="admin-customer-order-count">
                              {orderCount}건
                            </span>
                          </td>
                          <td>
                            <span className="admin-customer-total">
                              ₩ {totalSpent.toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`admin-customer-status-select ${getStatusClass(
                                status
                              )}`}
                              value={status}
                              onChange={(e) =>
                                handleStatusChange(customerId, e.target.value)
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
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
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
                      {selectedCustomer.name || "-"}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">이메일:</span>
                    <span className="customer-detail-value">
                      {selectedCustomer.email || "-"}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">전화번호:</span>
                    <span className="customer-detail-value">
                      {selectedCustomer.phone || "-"}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">가입일:</span>
                    <span className="customer-detail-value">
                      {formatDate(selectedCustomer.createdAt || selectedCustomer.joinDate)}
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
                        selectedCustomer.isDeleted ? "비활성" : (selectedCustomer.status || "활성")
                      )}`}
                      value={selectedCustomer.isDeleted ? "비활성" : (selectedCustomer.status || "활성")}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedCustomer._id || selectedCustomer.id,
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
                      {selectedCustomer.orderCount || 0}건
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">총 구매금액:</span>
                    <span className="customer-detail-value customer-detail-amount">
                      ₩ {(selectedCustomer.totalSpent || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="customer-detail-info-row">
                    <span className="customer-detail-label">평균 주문금액:</span>
                    <span className="customer-detail-value">
                      ₩{" "}
                      {(() => {
                        const orderCount = selectedCustomer.orderCount || 0;
                        const totalSpent = selectedCustomer.totalSpent || 0;
                        return orderCount > 0
                          ? Math.round(totalSpent / orderCount).toLocaleString()
                          : (selectedCustomer.averageOrderAmount || 0).toLocaleString();
                      })()}
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
