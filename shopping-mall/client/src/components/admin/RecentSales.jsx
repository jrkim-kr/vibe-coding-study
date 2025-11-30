import "./RecentSales.css";

function RecentSales({ sales = [] }) {
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatAmount = (amount) => {
    return `₩ ${amount.toLocaleString()}`;
  };

  if (sales.length === 0) {
    return (
      <div className="recent-sales">
        <div className="recent-sales-empty">최근 판매 내역이 없습니다</div>
      </div>
    );
  }

  return (
    <div className="recent-sales">
      {sales.map((sale) => (
        <div key={sale.id || sale._id} className="recent-sales-item">
          <div className="recent-sales-avatar">
            <span>{getInitials(sale.customerName)}</span>
          </div>
          <div className="recent-sales-info">
            <div className="recent-sales-name">{sale.customerName || "고객"}</div>
            <div className="recent-sales-email">{sale.customerEmail || ""}</div>
          </div>
          <div className="recent-sales-amount">
            {formatAmount(sale.amount || 0)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentSales;

