export default function Compare() {
  return (
    <section id="compare" className="compare-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">A typical Tuesday morning</span>
          <h2>Same patient. <span className="serif">Two very different</span> outcomes.</h2>
          <p>
            Here&apos;s what happens when a worried parent calls about their feverish toddler — at 9:14 AM
            on a busy Tuesday — through your current process versus through KITOGO.
          </p>
        </div>

        <div className="compare-grid">
          {/* Without KITOGO */}
          <div className="compare-card bad reveal">
            <span className="compare-label">Without KITOGO</span>
            <h3>Hold music, missed cues, frustrated staff.</h3>
            <div className="compare-stream">
              {[
                { time: '9:14', icon: '📞', text: <><strong>Parent calls.</strong> Routed to general queue. <strong>14 callers ahead.</strong></> },
                { time: '9:22', icon: '⏱️', text: <>8-minute hold. Toddler crying in background. Parent considers ER.</> },
                { time: '9:23', icon: '📝', text: <>Receptionist takes notes by hand. Asks symptoms three times.</> },
                { time: '9:31', icon: '⚠️', text: <>Routed to nurse line. <strong>Ear-pulling never flagged</strong> — possible otitis missed.</> },
                { time: '9:48', icon: '📅', text: <>Appointment booked for tomorrow. Parent goes to urgent care anyway.</> },
              ].map(({ time, icon, text }) => (
                <div key={time + icon} className="compare-event">
                  <span className="compare-time">{time}</span>
                  <span className="compare-icon">{icon}</span>
                  <span className="compare-text">{text}</span>
                </div>
              ))}
            </div>
            <div className="compare-summary">
              <div className="compare-summary-item"><span className="num">34<span style={{ fontSize: '0.6em' }}>m</span></span><span className="lbl">Total time</span></div>
              <div className="compare-summary-item"><span className="num">3</span><span className="lbl">Hand-offs</span></div>
              <div className="compare-summary-item"><span className="num">$418</span><span className="lbl">Avoidable cost</span></div>
            </div>
          </div>

          {/* With KITOGO */}
          <div className="compare-card good reveal">
            <span className="compare-label">With KITOGO</span>
            <h3>Picked up instantly. Triaged. Routed correctly.</h3>
            <div className="compare-stream">
              {[
                { time: '9:14', icon: '⚡', text: <>KITOGO answers in <strong>under 2 seconds.</strong> Warm, calm voice.</> },
                { time: '9:14', icon: '🩺', text: <>Structured intake: age 4, fever 102, won&apos;t eat, pulling at right ear.</> },
                { time: '9:15', icon: '🧠', text: <>Protocol flags <strong>possible otitis media.</strong> ESI Level 3 assigned.</> },
                { time: '9:16', icon: '📍', text: <>Routed to urgent care, 7-min wait. Structured note pushed to EHR.</> },
                { time: '9:17', icon: '✅', text: <>SMS confirmation with directions. Provider sees full chart on arrival.</> },
              ].map(({ time, icon, text }, i) => (
                <div key={i} className="compare-event">
                  <span className="compare-time">{time}</span>
                  <span className="compare-icon">{icon}</span>
                  <span className="compare-text">{text}</span>
                </div>
              ))}
            </div>
            <div className="compare-summary">
              <div className="compare-summary-item"><span className="num">3<span style={{ fontSize: '0.6em' }}>m</span></span><span className="lbl">Total time</span></div>
              <div className="compare-summary-item"><span className="num">0</span><span className="lbl">Hand-offs</span></div>
              <div className="compare-summary-item"><span className="num">$92</span><span className="lbl">Total cost</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
