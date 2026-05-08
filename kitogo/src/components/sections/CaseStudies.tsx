export default function CaseStudies() {
  return (
    <section id="cases" className="case-section">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Proof, not promises</span>
          <h2>Outcomes that <span className="serif">defend themselves.</span></h2>
        </div>

        <div className="case-grid">
          {[
            {
              metric: <><span data-count="42">0</span><span style={{ fontSize: '0.5em' }}>%</span></>,
              label: 'Reduction in average intake time — 6-month pilot, 14,000 encounters',
              quote: '"KITOGO cut our intake time in half. Patients are routed faster, and our staff finally get to focus on care."',
              author: 'Mercy Regional · Director of Operations',
            },
            {
              metric: <>$<span data-count="1.2">0</span><span style={{ fontSize: '0.5em' }}>M</span></>,
              label: 'First-year ROI — 500-bed health system, labor savings + revenue capture',
              quote: '"We expected automation. We got transformation. Our team morale changed within weeks."',
              author: 'Atlantic Health · CMIO',
            },
            {
              metric: <><span data-count="18">0</span>×</>,
              label: 'Increase in proactive engagement capacity — Pacific Care Group, Q1–Q3',
              quote: '"What used to take a team of 12 now runs continuously. The agent never sleeps and never has a bad day."',
              author: 'Pacific Care Group · VP of Patient Experience',
            },
          ].map(({ metric, label, quote, author }) => (
            <div key={author} className="case-card reveal">
              <div className="case-metric">{metric}</div>
              <div className="case-label">{label}</div>
              <div className="case-quote">{quote}</div>
              <div className="case-author">{author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
