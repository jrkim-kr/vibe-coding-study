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

export default FooterColumn;

