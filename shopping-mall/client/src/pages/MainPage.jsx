import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const products = [
  {
    id: 1,
    name: "페포 벌로 퍼 레더 자켓",
    originalPrice: "47,500",
    finalPrice: "40,900",
    reviews: 7,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    palette: ["#2f1e1b", "#f9f7f2", "#c19f7f"],
  },
  {
    id: 2,
    name: "체르디 앙고라 헤어리 루즈 V 넥 니트 가디건",
    originalPrice: "59,000",
    finalPrice: "48,600",
    reviews: 12,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4c?auto=format&fit=crop&w=800&q=80",
    palette: ["#c5141f", "#1f1f22", "#f7f1e9"],
  },
  {
    id: 3,
    name: "[MADE] 누브라 부클 누빔 하이넥 집업 점퍼",
    originalPrice: "74,500",
    finalPrice: "60,200",
    reviews: 18,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    palette: ["#c1b5a4", "#5c4f45", "#f4f0e6"],
  },
  {
    id: 4,
    name: "레논 울 헤어리 라운드 노르딕 니트 가디건",
    originalPrice: "31,000",
    finalPrice: "26,000",
    reviews: 5,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    palette: ["#1e1c25", "#d9dce3", "#f5f5f0"],
  },
];

const bestSellers = [
  {
    id: "b1",
    name: "코리엔 리본 펜던트 니트 뷔스티에",
    originalPrice: "28,500",
    finalPrice: "25,100",
    reviews: 32,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    palette: ["#d6ccbf", "#4a3f39", "#1c1c1c"],
  },
  {
    id: "b2",
    name: "[4만장돌파/+기모ver] 로셀 베이직 하이 넥 티 - 2타입",
    originalPrice: "14,500",
    finalPrice: "14,500",
    reviews: 4066,
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
    palette: ["#cdb69a", "#f4ecdd", "#a7957d"],
    overlay: {
      title: "warm item",
      description: "포근한 기모 안감으로 따뜻하게",
    },
  },
  {
    id: "b3",
    name: "[7COLOR] 라포비 기모 빈티지 체크 셔츠",
    originalPrice: "32,600",
    finalPrice: "17,900",
    reviews: 24,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    palette: ["#e4b5c0", "#2b1c1a", "#f3e4d7"],
  },
  {
    id: "b4",
    name: "베킷츠 박시 퍼 라이닝 리버시블 하이 넥 패딩",
    originalPrice: "57,800",
    finalPrice: "33,700",
    reviews: 4,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    palette: ["#f4f2ef", "#cfcfcf", "#1f1f24"],
  },
];

function ProductCard({ product }) {
  return (
    <article className="cu-card">
      <div className="cu-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="cu-palette">
          {product.palette.map((color) => (
            <span
              key={color}
              className="cu-swatch"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <div className="cu-card-body">
        <p className="cu-card-title">{product.name}</p>
        <p className="cu-card-price">{product.originalPrice} won</p>
        <p className="cu-card-final">최종 할인가 : {product.finalPrice} won</p>
        <p className="cu-card-review">review : {product.reviews}</p>
      </div>
    </article>
  );
}

function BestSellerCard({ item }) {
  return (
    <article className="cu-best-card">
      <div className="cu-best-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        {item.overlay && (
          <div className="cu-best-overlay">
            <span className="cu-thermo-icon" />
            <p className="cu-best-overlay-title">{item.overlay.title}</p>
            <p className="cu-best-overlay-desc">{item.overlay.description}</p>
          </div>
        )}
      </div>
      <div className="cu-best-body">
        <div className="cu-color-dots">
          {item.palette.map((color) => (
            <span
              key={color}
              className="cu-color-dot"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="cu-best-title">{item.name}</p>
        <p className="cu-best-price">{item.originalPrice} won</p>
        <p className="cu-best-final">최종 할인가 : {item.finalPrice} won</p>
        <p className="cu-best-review">review : {item.reviews}</p>
      </div>
    </article>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div className="cu-footer-column">
      <p className="cu-footer-title">{title}</p>
      {items.map((item) => (
        <a key={item} href="#">
          {item}
        </a>
      ))}
    </div>
  );
}

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
        <div className="cu-section-header">
          <div>
            <p className="cu-section-label">NEW ARRIVAL</p>
            <p className="cu-section-desc">
              Crafted To Impress, Designed To Surpass Every Expectation With
              Remarkable Quality.
            </p>
          </div>
          <a className="cu-section-link" href="#">
            MORE VIEW
          </a>
        </div>

        <div className="cu-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="cu-section cu-best-section">
        <div className="cu-section-header">
          <div>
            <p className="cu-section-label">Our Best Sellers</p>
            <p className="cu-section-desc">
              Crafted To Impress, Designed To Surpass Every Expectation With
              Remarkable Quality.
            </p>
          </div>
          <a className="cu-section-link" href="#">
            MORE VIEW
          </a>
        </div>

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
