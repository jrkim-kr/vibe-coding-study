import { useState, useEffect } from "react";
import ProductCard from "../components/product/ProductCard";
import SectionHeader from "../components/ui/SectionHeader";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { publicProductAPI } from "../utils/api";
import "./MainPage.css";

function MainPage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 메인 페이지 상품 조회 (공개 API 사용)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // 메인 페이지용으로 최대 8개까지 조회
        const response = await publicProductAPI.getProducts({
          page: 1,
          limit: 8,
          status: "판매중",
        });

        const products = response.products || [];

        // 카드 컴포넌트에서 기대하는 형태로 매핑
        const mapped = products.map((p, index) => {
          const price =
            typeof p.price === "number"
              ? p.price
              : parseInt(p.price ?? "0", 10) || 0;

          const formattedPrice = price.toLocaleString();

          return {
            id: p._id || p.id || index,
            name: p.name,
            originalPrice: formattedPrice,
            finalPrice: formattedPrice,
            reviews: 0,
            image:
              (Array.isArray(p.images) && p.images[0]) ||
              "https://via.placeholder.com/800x800?text=Product",
            // 팔레트 정보는 없으므로 기본 색상값 사용
            palette: ["#f4f4f4", "#d4d4d4", "#a3a3a3"],
          };
        });

        // 앞쪽 4개는 NEW ARRIVAL, 나머지는 BEST로 사용
        setNewArrivals(mapped.slice(0, 4));
        setBestSellers(mapped.slice(4));
      } catch (err) {
        console.error("메인 상품 조회 오류:", err);
        setError(err.message || "상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="main-page">
      <Header />

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
        {loading && (
          <p style={{ textAlign: "center", marginTop: "16px" }}>로딩 중...</p>
        )}
        {error && !loading && (
          <p style={{ textAlign: "center", marginTop: "16px", color: "red" }}>
            {error}
          </p>
        )}
        <div className="cu-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="cu-section cu-best-section">
        <SectionHeader
          label="Best Sellers"
          description="Crafted To Impress, Designed To Surpass Every Expectation With Remarkable Quality."
        />
        {!loading && !error && bestSellers.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "16px" }}>
            표시할 베스트 상품이 없습니다.
          </p>
        )}
        <div className="cu-best-grid">
          {bestSellers.map((item) => (
            <ProductCard key={item.id} product={item} variant="best" />
          ))}
        </div>
      </section>

      <Footer />

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
