export default function CaseDeep() {
  return (
    <section id="case-deep" className="case-deep-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Featured customer story</span>
          <h2>Mercy Regional cut intake time <span className="serif">in half.</span></h2>
          <p>Inside a 6-month pilot at a 12-clinic ambulatory network — what changed, what didn&apos;t, and what the data showed.</p>
        </div>

        <div className="case-deep reveal">
          <div className="case-deep-header">
            <div className="case-deep-meta">
              <span><strong>Mercy Regional Health</strong></span>
              <span>·</span>
              <span>12 clinics, 340 providers</span>
              <span>·</span>
              <span>14,200 encounters analyzed</span>
              <span>·</span>
              <span>Mar–Aug 2026</span>
            </div>
            <h3 className="case-deep-title">&quot;We stopped losing the patients we were trying to serve. That&apos;s the headline.&quot;</h3>
          </div>

          <div className="case-deep-body">
            <div className="case-deep-sidebar">
              {[
                { num: '42%', lbl: 'Reduction in average intake time (8m 12s → 4m 44s)' },
                { num: '3.1×', lbl: 'Increase in calls answered within 60 seconds' },
                { num: '−61%', lbl: 'Drop in call abandonment rate (from 31% to 12%)' },
                { num: '$890K', lbl: 'Net annualized savings, year-one (labor + recovered revenue)' },
              ].map(({ num, lbl }) => (
                <div key={num} className="case-deep-stat">
                  <div className="num">{num}</div>
                  <div className="lbl">{lbl}</div>
                </div>
              ))}
            </div>

            <div className="case-deep-content">
              <h3>The challenge</h3>
              <p>Mercy Regional&apos;s call volume had grown 38% over two years while front-desk headcount stayed flat. Average hold time crept past 8 minutes. 31% of inbound calls were abandoned before pickup. Worse, the team&apos;s own audit found that roughly 1 in 14 urgent cases were being misrouted to non-urgent queues — usually because intake notes were rushed or inconsistent.</p>
              <p>Leadership had already evaluated three IVR vendors and one call-center outsourcer. None solved the underlying issue: routine triage was eating the bandwidth that should have gone to acute cases.</p>

              <h3>The deployment</h3>
              <div className="case-deep-timeline">
                {[
                  { week: 'Week 1', text: 'Integration kickoff with Epic. BAA signed, security review completed in parallel.' },
                  { week: 'Week 2', text: "Triage protocol configured against Mercy's existing ESI 5-level decision tree." },
                  { week: 'Week 3', text: 'Soft launch on 2 pilot clinics. Shadow mode — KITOGO runs alongside human triage for calibration.' },
                  { week: 'Week 6', text: 'Full production at all 12 clinics. Average response time hit sub-3-second target.' },
                  { week: 'Month 6', text: '14,200 encounters analyzed. Results presented to board: green-light for permanent rollout.' },
                ].map(({ week, text }) => (
                  <div key={week} className="case-deep-event">
                    <div className="week">{week}</div>
                    <p>{text}</p>
                  </div>
                ))}
              </div>

              <h3>What surprised them</h3>
              <p>The team expected operational savings. What they didn&apos;t expect was a measurable lift in patient satisfaction scores — NPS climbed 18 points across the pilot. The most-cited reason in the open-ended survey responses: &quot;Someone picked up immediately, and they actually listened.&quot;</p>

              <div className="case-deep-quote">
                <div className="case-deep-quote-text">&quot;Honestly, I was the skeptic. I thought we&apos;d lose the human touch. Six months in, our staff have more time to give that human touch where it actually matters — to people in the room, in front of them. The AI does the parts they always hated anyway.&quot;</div>
                <div className="case-deep-quote-author">
                  <div className="case-deep-quote-avatar">DM</div>
                  <div>
                    <strong>Diana Mendoza, RN, MSN</strong>
                    <span>Director of Patient Operations · Mercy Regional Health</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
