import { TEAM, ADVISORS, COMPANY_STATS } from '@/data/team';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">About KITOGO</span>
          <h2>Built by clinicians, <span className="serif">for clinicians.</span></h2>
        </div>

        <div className="about-grid">
          <div className="reveal">
            <p className="about-mission">
              We started KITOGO after watching a triage nurse work an 11-hour shift without a break. Calls stacked up. Acute cases got buried. Routine questions ate the bandwidth that should have gone to{' '}
              <span className="serif">the patients who needed it most.</span>
            </p>
            <p className="about-mission" style={{ marginTop: 24, fontSize: 'clamp(15px, 1.2vw, 17px)', color: 'var(--ink-2)' }}>
              We built the system we wished she&apos;d had — clinical-grade, protocol-faithful, and never tired. Today we serve 14 healthcare networks and counting.
            </p>
          </div>
          <div className="about-stats reveal">
            {COMPANY_STATS.map(({ num, lbl }) => (
              <div key={num} className="about-stat">
                <div className="num">{num}</div>
                <div className="lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-head reveal" style={{ marginBottom: 32 }}>
          <span className="eyebrow">The team</span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>People who&apos;ve <span className="serif">been on the call.</span></h2>
        </div>

        <div className="team-grid">
          {TEAM.map(({ init, name, role, bio }) => (
            <div key={init} className="team-card reveal">
              <div className="team-avatar">{init}</div>
              <h4>{name}</h4>
              <div className="role">{role}</div>
              <p className="bio">{bio}</p>
            </div>
          ))}
        </div>

        <div className="advisors-band reveal">
          <h4>Clinical Advisory Board</h4>
          <div className="advisors-list">
            {ADVISORS.map(({ name, org }) => (
              <div key={name} className="advisor-item">
                <strong>{name}</strong>
                <span>{org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
