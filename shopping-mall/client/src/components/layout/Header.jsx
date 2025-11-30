import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartCount,
  CART_UPDATED_EVENT,
  clearCart,
  setCartItems,
} from "../../utils/cart";
import { cartAPI } from "../../utils/api";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("currentUser");

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("사용자 정보 파싱 오류:", error);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }

      // 장바구니 수량 갱신
      setCartCount(getCartCount());
    };

    checkAuth();
  }, []);

  // 로그인된 상태라면 서버 장바구니와 동기화하여 뱃지 숫자 맞추기
  useEffect(() => {
    const syncCartFromServer = async () => {
      if (!isLoggedIn) return;
      try {
        const serverCart = await cartAPI.getCart();
        if (serverCart && Array.isArray(serverCart.items)) {
          setCartItems(serverCart.items);
          const count = serverCart.items.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );
          setCartCount(count);
          return;
        }
      } catch (error) {
        console.warn("헤더에서 서버 장바구니 동기화 실패:", error);
      }
      // 실패 시 로컬 기준으로라도 맞춰주기
      setCartCount(getCartCount());
    };

    syncCartFromServer();
  }, [isLoggedIn]);

  useEffect(() => {
    const handler = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("storage", handler);
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(CART_UPDATED_EVENT, handler);
    };
  }, []);

  // 드롭다운 외부 클릭 시 닫기
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

  const handleLogout = () => {
    // 로컬 장바구니 비우기 및 뱃지 0으로
    clearCart();
    setCartCount(0);

    // 인증 정보 제거
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <header className="cu-header">
      <nav className="cu-nav">
        <a href="#">SHOP</a>
        <a href="#">NEW IN</a>
        <a href="#">BEST</a>
      </nav>
      <h1
        className="cu-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        SHOPPPING MALL DEMO
      </h1>
      <div className="cu-actions">
        <div className="cu-search-block">
          <span className="cu-search-line" />
          <button type="button" aria-label="검색" title="검색">
            <svg
              className="cu-icon"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" />
            </svg>
          </button>
        </div>
        {isLoggedIn ? (
          <>
            {user?.role === "admin" ? (
              <>
                <button
                  type="button"
                  className="cu-admin-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/admin");
                  }}
                  title="관리자 페이지"
                >
                  어드민
                </button>
                <button
                  type="button"
                  className="cu-logout-btn"
                  onClick={handleLogout}
                  title="로그아웃"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="cu-user-menu" ref={dropdownRef}>
                <button
                  type="button"
                  className="cu-user-name"
                  onClick={() => setShowDropdown(!showDropdown)}
                  title="마이페이지"
                >
                  {user?.name || "사용자"}
                  <svg
                    className="cu-dropdown-icon"
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
                  <div className="cu-dropdown-menu">
                    <button
                      type="button"
                      className="cu-dropdown-item"
                      onClick={() => handleMenuClick("/mypage")}
                    >
                      마이페이지
                    </button>
                    <button
                      type="button"
                      className="cu-dropdown-item"
                      onClick={() => handleMenuClick("/mypage/orders")}
                    >
                      주문 내역
                    </button>
                    <button
                      type="button"
                      className="cu-dropdown-item"
                      onClick={() => handleMenuClick("/mypage/profile")}
                    >
                      회원 정보
                    </button>
                    <button
                      type="button"
                      className="cu-dropdown-item"
                      onClick={() => handleMenuClick("/mypage/addresses")}
                    >
                      배송지 관리
                    </button>
                    <button
                      type="button"
                      className="cu-dropdown-item"
                      onClick={() => handleMenuClick("/mypage/reviews")}
                    >
                      리뷰 관리
                    </button>
                    <div className="cu-dropdown-divider" />
                    <button
                      type="button"
                      className="cu-dropdown-item"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className="cu-icon-btn"
            aria-label="로그인 페이지 이동"
            onClick={() => navigate("/login")}
            title="로그인"
          >
            <svg
              className="cu-icon"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 20c2-3 4.5-4.5 7.5-4.5s5.5 1.5 7.5 4.5" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="cu-icon-btn cu-icon-cart"
          aria-label="장바구니"
          title="장바구니"
          onClick={() => navigate("/cart")}
        >
          <svg
            className="cu-icon"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path d="M3 6h3l2.4 9.6a2 2 0 0 0 2 1.6h7.6" />
            <path d="M9 6h12l-1.5 6h-9" />
            <circle cx="11" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span className="icon-badge">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
