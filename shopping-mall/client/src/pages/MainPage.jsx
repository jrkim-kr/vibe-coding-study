import { useNavigate } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import BestSellerCard from "./components/BestSellerCard";
import SectionHeader from "./components/SectionHeader";
import FooterColumn from "./components/FooterColumn";
import { newArrivals, bestSellers } from "../data/products.js";
import "./MainPage.css";

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <header className="cu-header">
        <nav className="cu-nav">
          <a href="#">SHOP</a>
          <a href="#">NEW IN</a>
          <a href="#">BEST</a>
        </nav>
        <h1 className="cu-logo">COMMON UNIQUE</h1>
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
          © (주)어나더무드 All rights reserved. BUSINESS NUMBER L.
          제2019-서울마포-2200호 ONLINE L. 108-81-98622 ADDRESS 03992 서울특별시
          마포구 동교로23길 32-23 (동교동) 2, 3층 EMAIL help@anothermood.com
          1688-9308
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
