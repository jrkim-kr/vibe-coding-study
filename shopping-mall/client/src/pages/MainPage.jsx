import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import BestSellerCard from "../components/BestSellerCard";
import SectionHeader from "../components/SectionHeader";
import FooterColumn from "../components/FooterColumn";
import { newArrivals, bestSellers } from "../data/products.js";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("currentUser");

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log("사용자 정보:", userData); // 디버깅용
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("사용자 정보 파싱 오류:", error);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="main-page">
      <header className="cu-header">
        <nav className="cu-nav">
          <a href="#">SHOP</a>
          <a href="#">NEW IN</a>
          <a href="#">BEST</a>
        </nav>
        <h1 className="cu-logo">SHOPPPING MALL DEMO</h1>
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
                      console.log("관리자 버튼 클릭됨, 이동:", "/admin");
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
                <div className="cu-user-menu">
                  <span className="cu-user-name">{user?.name || "사용자"}</span>
                  <button
                    type="button"
                    className="cu-logout-btn"
                    onClick={handleLogout}
                    title="로그아웃"
                  >
                    로그아웃
                  </button>
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
            <span className="icon-badge">0</span>
          </button>
        </div>
      </header>

      <section className="cu-hero">
        <div className="cu-hero-image" role="img" aria-label="winter look" />
        <div className="cu-hero-text">
          <span className="cu-hero-caption">exp 25.time24</span>
          <p className="cu-hero-green">renew</p>
          <p className="cu-hero-white">winterlookeday</p>
          <p className="cu-hero-white cu-hero-outline">starting upto 30%</p>
        </div>
      </section>

      <section className="cu-section">
        <SectionHeader
          label="NEW ARRIVAL"
          description="Crafted To Impress, Designed To Surpass Every Expectation With Remarkable Quality."
        />
        <div className="cu-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="cu-section cu-best-section">
        <SectionHeader
          label="Our Best Sellers"
          description="Crafted To Impress, Designed To Surpass Every Expectation With Remarkable Quality."
        />
        <div className="cu-best-grid">
          {bestSellers.map((item) => (
            <BestSellerCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <footer className="cu-footer">
        <div className="cu-footer-grid">
          <FooterColumn
            title="CLIENT SERVICES"
            items={["ORDERS", "TRACKING"]}
          />
          <FooterColumn
            title="COMPANY"
            items={["ABOUT", "LEGAL", "PRIVACY POLICY"]}
          />
          <FooterColumn
            title="COMMUNITY"
            items={["NOTICE", "Q&A", "REVIEW", "CELEBRITY"]}
          />
          <FooterColumn
            title="CUSTOMER CENTER"
            items={["1:1 KAKAO", "INSTAGRAM"]}
          />
        </div>
        <p className="cu-footer-info">
          © Shoppping Mall Demo Inc. All rights reserved. BUSINESS NUMBER:
          123-45-67890 ONLINE LICENSE: 2025-SEOUL-0001 ADDRESS: 123 Demo Street,
          Seoul, Korea EMAIL support@shopppingmall.demo PHONE 02-123-4567
        </p>
      </footer>

      <button className="cu-chat-btn" aria-label="Kakao 상담">
        <span />
      </button>
      <div className="cu-floating">
        <span className="cu-floating-icon">💬</span>
        <span className="cu-floating-icon">👟</span>
      </div>
    </div>
  );
}

export default MainPage;
