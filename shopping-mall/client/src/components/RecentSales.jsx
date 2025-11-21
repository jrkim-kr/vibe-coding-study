import "./RecentSales.css";

const salesData = [
  {
    id: 1,
    initials: "OM",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "₩ 129,000",
  },
  {
    id: 2,
    initials: "JL",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "₩ 39,000",
  },
  {
    id: 3,
    initials: "IN",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "₩ 299,000",
  },
  {
    id: 4,
    initials: "WK",
    name: "William Kim",
    email: "will@email.com",
    amount: "₩ 99,000",
  },
];

function RecentSales() {
  return (
    <div className="recent-sales">
      {salesData.map((sale) => (
        <div key={sale.id} className="recent-sales-item">
          <div className="recent-sales-avatar">
            <span>{sale.initials}</span>
          </div>
          <div className="recent-sales-info">
            <div className="recent-sales-name">{sale.name}</div>
            <div className="recent-sales-email">{sale.email}</div>
          </div>
          <div className="recent-sales-amount">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
}

export default RecentSales;

