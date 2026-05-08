export default function HowItWorks() {
  return (
    <section id="how" className="how-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three steps. <span className="serif">Sixty</span> seconds.</h2>
          <p>
            From the first ring to a structured handoff in your EHR — KITOGO automates what your
            team was never meant to do manually.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-line" />
          {[
            {
              num: 'i',
              title: 'Patient calls in. Agent answers instantly.',
              body: "No hold time. The agent greets the patient by name (if known), opens with empathetic context, and gathers chief complaint through natural conversation. Patients can interrupt; the agent adapts.",
              tags: ['Phone', 'Web chat', 'SMS', '12 languages'],
            },
            {
              num: 'ii',
              title: 'Clinical protocol. Real-time decision.',
              body: 'The agent applies your configured triage protocol — ESI 5-level, Manchester, or proprietary — and continuously evaluates severity. Red-flag symptoms escalate to a live nurse within 30 seconds, automatically.',
              tags: ['ESI 5-level', 'Manchester Triage', 'Custom protocols', 'Auto-escalation'],
            },
            {
              num: 'iii',
              title: 'Structured handoff. Prioritized queue.',
              body: 'Your team receives a clinical summary in their EHR — chief complaint, history, vitals, triage acuity, and recommended next step. Patient is queued. Routing is pre-decided. Decisions stay with humans.',
              tags: ['Epic', 'Cerner', 'Athena', 'Allscripts', '+ 15 more'],
            },
          ].map(({ num, title, body, tags }) => (
            <div key={num} className="timeline-step reveal">
              <div className="timeline-num">{num}</div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="timeline-tags">
                {tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
