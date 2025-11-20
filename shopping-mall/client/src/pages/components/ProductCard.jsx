import "./ProductCard.css";

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

export default ProductCard;

