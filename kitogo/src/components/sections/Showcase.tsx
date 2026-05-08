export default function Showcase() {
  return (
    <section style={{ padding: '96px 0' }}>
      <div className="showcase">
        <div className="showcase-grid">
          <div className="reveal">
            <span className="eyebrow">The problem</span>
            <h2>
              Front desks are <span className="serif">drowning</span> in routine calls.
            </h2>
            <p>
              The average healthcare front desk handles 200+ calls per day. 70% are routine triage,
              scheduling, or symptom questions. Staff burn out. Patients wait. Real emergencies get
              buried.
            </p>
          </div>
          <div className="stat-stack reveal">
            {[
              { label: 'Average wait time on hold', value: <>8<span className="accent">m</span> 42<span className="accent">s</span></> },
              { label: 'Calls abandoned daily', value: <>31<span className="accent">%</span></> },
              { label: 'Front desk staff turnover', value: <>47<span className="accent">%</span>/yr</> },
              { label: 'Misrouted urgent cases', value: <>1 in 14</> },
            ].map(({ label, value }) => (
              <div key={label} className="stat-row">
                <span className="stat-row-label">{label}</span>
                <span className="stat-row-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
