const networks = [
  'Mercy Regional',
  'Cleveland Health',
  'Pacific Care Group',
  'Northshore Medical',
  'Summit Urgent Care',
  'Atlantic Health',
  'Vista Clinics',
  'Riverside Medical',
];

export default function MarqueeSection() {
  return (
    <section className="marquee-section">
      <div className="marquee-label">Trusted across 230+ healthcare networks</div>
      <div className="marquee">
        {[...networks, ...networks].map((name, i) => (
          <div key={i} className="marquee-item">{name}</div>
        ))}
      </div>
    </section>
  );
}
