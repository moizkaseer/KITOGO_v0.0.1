export default function BentoFeatures() {
  return (
    <section id="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Platform</span>
          <h2>Built for clinical environments. <span className="serif">Not</span> chatbots.</h2>
          <p>
            Every component engineered for the realities of healthcare: HIPAA compliance,
            edge-case handling, and the trust your patients deserve.
          </p>
        </div>

        <div className="bento">
          <div className="bento-card bento-1 reveal">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 1v22M5 5l14 14M19 5L5 19M1 12h22" />
              </svg>
            </div>
            <h3>
              Voice that sounds{' '}
              <em style={{ fontFamily: 'var(--font-instrument-serif), serif', fontStyle: 'italic', color: '#7AABFF' }}>
                human.
              </em>{' '}
              Decisions that are clinical.
            </h3>
            <p style={{ marginTop: 16 }}>
              Natural-sounding speech with sub-200ms latency. The agent listens, adapts to
              interruptions, and handles accents — while applying medical-grade reasoning under the
              hood.
            </p>
            <div className="waveform">
              {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
            </div>
          </div>

          <div className="bento-card bento-2 reveal">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>HIPAA-grade by default</h3>
            <p>SOC 2 Type II, HITRUST, BAA included. End-to-end encryption.</p>
          </div>

          <div className="bento-card bento-3 reveal">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />
              </svg>
            </div>
            <h3>Live in 2 weeks</h3>
            <p>No rip-and-replace. Plugs into your existing phone and EHR systems.</p>
          </div>

          <div className="bento-card bento-4 reveal">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
              </svg>
            </div>
            <h3>Real-time analytics</h3>
            <p>Call volume, acuity distribution, and routing accuracy — live.</p>
          </div>

          <div className="bento-card bento-5 reveal">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3>Connects to your stack</h3>
            <p>Direct integrations with the systems your clinical teams already use.</p>
            <div className="integration-grid">
              {['Epic', 'Cerner', 'Athena', 'Allscripts'].map(s => (
                <div key={s} className="integration-pill">{s}</div>
              ))}
            </div>
          </div>

          <div className="bento-card bento-6 reveal">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h3>24/7 reliability</h3>
            <p>99.99% uptime SLA. Redundant infrastructure across 3 regions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
