import "./Footer.css";

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

function Footer() {
  return (
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
  );
}

export default Footer;
