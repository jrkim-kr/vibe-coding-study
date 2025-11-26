import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

/**
 * 공통 상품 카드 컴포넌트
 *
 * props:
 * - product: { id/_id, name, image, originalPrice, finalPrice, reviews, palette? }
 * - variant: "new" | "best" (섹션에 따라 스타일/용도 구분, 기본값 "new")
 */
function ProductCard({ product, variant = "new" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!product?.id && !product?._id) return;
    const id = product.id || product._id;
    navigate(`/products/${id}`);
  };

  const palette = Array.isArray(product.palette) ? product.palette : [];
  const isBest = variant === "best";

  return (
    <article
      className={`cu-card ${isBest ? "cu-card--best" : "cu-card--new"}`}
      onClick={handleClick}
    >
      <div className="cu-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {palette.length > 0 && (
          <div className="cu-palette">
            {palette.map((color) => (
              <span
                key={color}
                className="cu-swatch"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
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

export default ProductCard;


