import "./BestSellerCard.css";

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

export default BestSellerCard;

