function SectionHeader({ label, description, linkLabel = "MORE VIEW", href = "#" }) {
  return (
    <div className="cu-section-header">
      <div>
        <p className="cu-section-label">{label}</p>
        <p className="cu-section-desc">{description}</p>
      </div>
      <a className="cu-section-link" href={href}>
        {linkLabel}
      </a>
    </div>
  );
}

export default SectionHeader;

