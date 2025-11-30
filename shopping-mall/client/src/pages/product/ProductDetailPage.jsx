import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicProductAPI, cartAPI } from "../../utils/api";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { addToCart } from "../../utils/cart";
import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await publicProductAPI.getProductById(id);
        setProduct(data);

        const firstImage =
          (Array.isArray(data.images) && data.images[0]) ||
          "https://via.placeholder.com/800x800?text=Product";
        setSelectedImage(firstImage);
      } catch (err) {
        console.error("상품 상세 조회 오류:", err);
        setError(err.message || "상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (
        product &&
        typeof product.stock === "number" &&
        next > product.stock
      ) {
        return product.stock;
      }
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    // 로컬 장바구니 업데이트
    addToCart(product, quantity);

    // 서버 장바구니 동기화 (로그인 상태 가정)
    try {
      await cartAPI.addOrUpdateItem({
        productId: product._id || product.id,
        quantity,
      });
      alert("장바구니에 상품이 담겼습니다.");
    } catch (error) {
      console.error("서버 장바구니 동기화 오류:", error);
      if (
        error.message.includes("인증") ||
        error.message.includes("로그인") ||
        error.message.includes("토큰")
      ) {
        if (
          window.confirm(
            "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
          )
        ) {
          window.location.href = "/login";
        }
      } else {
        alert(error.message || "장바구니 동기화 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <Header />
        <div className="pd-container">
          <p className="pd-message">상품 정보를 불러오는 중입니다...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-page">
        <Header />
        <div className="pd-container">
          <p className="pd-message pd-error">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <Header />
        <div className="pd-container">
          <p className="pd-message pd-error">상품을 찾을 수 없습니다.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const price =
    typeof product.price === "number"
      ? product.price
      : parseInt(product.price ?? "0", 10) || 0;
  const formattedPrice = price.toLocaleString();

  const mainImage =
    selectedImage ||
    (Array.isArray(product.images) && product.images[0]) ||
    "https://via.placeholder.com/800x800?text=Product";

  const isSoldOut = product.status === "품절" || product.stock === 0;
  const isLowStock =
    !isSoldOut &&
    typeof product.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 5;

  return (
    <div className="pd-page">
      <Header />
      <main className="pd-main">
        <section className="pd-gallery">
          <div className="pd-main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="pd-thumbs">
              {product.images.map((img) => (
                <button
                  key={img}
                  type="button"
                  className={`pd-thumb ${
                    img === mainImage ? "pd-thumb-active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={product.name} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="pd-info">
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-price">{formattedPrice} won</p>

          <div className="pd-meta">
            <div className="pd-meta-row">
              <span className="pd-meta-label">카테고리</span>
              <span className="pd-meta-value">
                {product.category?.name || "미지정"}
              </span>
            </div>
          </div>

          <div className="pd-divider" />

          <div className="pd-option-row">
            <span className="pd-option-label">수량</span>
            <div className="pd-qty-control">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  isSoldOut ||
                  (typeof product.stock === "number" &&
                    quantity >= product.stock)
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="pd-total-row">
            <span className="pd-total-label">TOTAL</span>
            <span className="pd-total-value">
              {(price * quantity).toLocaleString()} won ({quantity}개)
            </span>
          </div>

          {isLowStock && (
            <p className="pd-low-stock">
              품절 임박! 남은 수량이 많지 않습니다.
            </p>
          )}
          {isSoldOut && (
            <p className="pd-soldout-message">현재 품절된 상품입니다.</p>
          )}

          <div className="pd-actions">
            <button
              type="button"
              className="pd-btn pd-buy"
              disabled={isSoldOut}
            >
              BUY NOW
            </button>
            <button
              type="button"
              className="pd-btn pd-cart"
              disabled={isSoldOut}
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>

          {product.description && (
            <div className="pd-description">
              <h2>상품 설명</h2>
              <p>{product.description}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
