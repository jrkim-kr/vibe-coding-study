import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminHeader.css";

const adminMenuItems = [
  { id: "dashboard", label: "대시보드", path: "/admin" },
  { id: "products", label: "상품 관리", path: "/admin/products" },
  { id: "orders", label: "주문 관리", path: "/admin/orders" },
  { id: "categories", label: "카테고리 관리", path: "/admin/categories" },
  { id: "customers", label: "회원 관리", path: "/admin/customers" },
];

function AdminHeader({ isSidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 사용자 정보 로드
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
      }
    }
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // 현재 활성 메뉴 확인
  const getActiveMenuId = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") {
      return "dashboard";
    } else if (path.includes("/products")) {
      return "products";
    } else if (path.includes("/orders")) {
      return "orders";
    } else if (path.includes("/categories")) {
      return "categories";
    } else if (path.includes("/customers")) {
      return "customers";
    }
    return null;
  };

  const handleLogout = async () => {
    // 서버 장바구니 비우기
    try {
      const { cartAPI } = await import("../../utils/api");
      await cartAPI.clearCart();
    } catch (error) {
      console.warn("서버 장바구니 비우기 실패 (무시 가능):", error);
    }

    // 로컬 장바구니 비우기
    try {
      const { clearCart } = await import("../../utils/cart");
      clearCart();
    } catch (error) {
      console.warn("로컬 장바구니 비우기 실패 (무시 가능):", error);
    }

    // 인증 정보 제거
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setShowDropdown(false);
    navigate("/");
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          className="admin-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="사이드바 토글"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
            <h1
              className="admin-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              SHOPPPING MALL DEMO
            </h1>
        <h2 className="admin-console-title">Admin Console</h2>
      </div>
      <div className="admin-header-right">
        {user && (
          <div className="admin-user-menu" ref={dropdownRef}>
            <button
              type="button"
              className="admin-user-name"
              onClick={() => setShowDropdown(!showDropdown)}
              title="관리자 메뉴"
            >
              {user.name || user.email}
              <svg
                className="admin-dropdown-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showDropdown && (
              <div className="admin-dropdown-menu">
                {adminMenuItems.map((item) => {
                  const isActive = getActiveMenuId() === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`admin-dropdown-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => handleMenuClick(item.path)}
                    >
                      {item.label}
                    </button>
                  );
                })}
                <div className="admin-dropdown-divider" />
                <button
                  type="button"
                  className="admin-dropdown-item"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;

