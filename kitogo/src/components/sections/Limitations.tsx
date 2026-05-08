export default function Limitations() {
  const cards = [
    {
      num: '01',
      title: "It can't replace a clinician's judgment.",
      question: '"Should we let KITOGO make final routing decisions without review?"',
      answer: "No. KITOGO surfaces a structured chief complaint and a protocol-based recommendation. The clinical team is always the decision-maker on edge cases — and on the messy 4 AM calls where someone says everything and nothing at once. The agent is a force-multiplier for your team, not a replacement for clinical reasoning.",
      mitigation: "Configurable confidence thresholds. Anything below your floor routes to a live nurse. Quarterly clinical-quality reviews are part of every Growth and Enterprise contract.",
    },
    {
      num: '02',
      title: "It's not a behavioral health crisis line.",
      question: '"Can we route mental health emergencies through KITOGO?"',
      answer: "For active mental health crises — suicidal ideation, acute psychiatric emergencies, child safety concerns — KITOGO recognizes the trigger keywords and transfers immediately to a human or to your crisis-line partner. We have crisis-detection sensitivity, but we are not a replacement for a 988-grade behavioral health response.",
      mitigation: "Built-in crisis-detection escalation. Direct routing to 988, your in-house crisis team, or a partner crisis line — whichever you configure. Audited monthly.",
    },
    {
      num: '03',
      title: "It struggles with extreme accents and noise.",
      question: '"What about callers our nurses sometimes have trouble understanding?"',
      answer: "Our speech recognition is strong across major English and Spanish dialects, but it's not infallible. Heavy regional accents, background noise, low-bandwidth cellular calls, or speakerphone use can degrade transcription quality. We won't pretend otherwise.",
      mitigation: "Real-time confidence scoring. When recognition confidence drops, the agent asks clarifying questions, slows down, or escalates to a human within 60 seconds. Quality varies by dialect — share your patient demographics and we'll show you our specific numbers.",
    },
    {
      num: '04',
      title: "It's overkill for low-volume practices.",
      question: '"We\'re a single clinic with 80 calls a day. Should we use KITOGO?"',
      answer: "Probably not — at least not yet. Below ~2,500 monthly calls, the implementation overhead and per-month cost don't pay back fast enough. Our Starter plan is designed for that low end, but honestly a basic IVR or a part-time virtual receptionist may serve you better. We'll tell you that on the demo call.",
      mitigation: "If we're not the right fit for your volume, we'll say so on the demo. We track our own win-rate by org size and won't sell into a segment where outcomes don't justify the cost.",
    },
    {
      num: '05',
      title: "It can't fix a broken intake protocol.",
      question: '"If our current protocol is inconsistent, will the AI fix that?"',
      answer: "No — and this catches teams off-guard. KITOGO faithfully executes the protocol you give it. If your existing triage logic has gaps, the agent will follow those gaps consistently across thousands of calls. The AI amplifies the protocol, for better or worse.",
      mitigation: "Implementation always includes a protocol review with our clinical team. We surface gaps, edge cases, and decision points that need explicit handling — before we go live.",
    },
    {
      num: '06',
      title: "Less than 100% of patients want to talk to AI.",
      question: '"What about patients who refuse to speak to a bot?"',
      answer: "In production, around 6% of callers explicitly request a human at some point. That's a real number we measure and publish. Some of those callers are right to want a person — older patients with hearing concerns, people in distress, complex multi-system issues. Forcing them through automation hurts them and you.",
      mitigation: '"Talk to a person" is always one phrase away — no menu hunting required. Average human-handoff time is under 30 seconds. Caller-preference flags persist on the patient record so they\'re not asked again.',
    },
  ];

  return (
    <section id="limitations" className="limits-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Where we&apos;re honest</span>
          <h2>Things KITOGO <span className="serif">isn&apos;t built for.</span></h2>
          <p>Most vendor websites bury their limitations or pretend they don&apos;t exist. We&apos;ve made a different choice: tell you up front. If we&apos;re not the right fit for what you need, we&apos;d rather you find out now than after the contract.</p>
        </div>

        <div className="limits-intro-card reveal">
          <h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            A note before you read this section
          </h4>
          <p>KITOGO is a triage and intake assistant — it gathers structured information and applies the protocol you configure. <strong>It is not a clinical decision-making system, and it does not diagnose, treat, prescribe, or replace clinical judgment.</strong> Acuity assignment and routing recommendations are always reviewable by your clinical team, and red-flag escalations always go to a live human.</p>
        </div>

        <div className="limits-grid">
          {cards.map(({ num, title, question, answer, mitigation }) => (
            <div key={num} className="limits-card reveal">
              <div className="limits-card-head">
                <span className="limits-card-num">{num}</span>
                <h4>{title}</h4>
              </div>
              <p className="limits-card-question">{question}</p>
              <p className="limits-card-answer">{answer}</p>
              <div className="limits-mitigation">
                <div className="limits-mitigation-label">How we handle this</div>
                <p>{mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
