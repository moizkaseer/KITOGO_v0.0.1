const faqs = [
  {
    q: 'Does the agent diagnose patients?',
    a: 'No. KITOGO gathers a structured chief complaint and applies the triage protocol you configure — it never makes clinical decisions. Acuity assignment, routing, and care delivery remain entirely with your clinical team.',
    open: true,
  },
  {
    q: 'How long does deployment take?',
    a: 'Most teams go live in 2 weeks. We integrate with your existing phone, EHR, and scheduling systems — no rip-and-replace, no downtime. Our deployment team handles configuration, testing, and staff training.',
  },
  {
    q: 'What happens with emergency cases?',
    a: 'The agent detects red-flag symptoms (chest pain, difficulty breathing, altered mental status) and escalates to a live human within 30 seconds, automatically. Your team always handles emergencies — the agent only triages and routes.',
  },
  {
    q: 'Is patient data secure?',
    a: "Yes. KITOGO is HIPAA-compliant, SOC 2 Type II certified, and HITRUST accredited. All data is encrypted in transit and at rest. We sign BAAs with every customer and maintain full audit logs of all interactions.",
  },
  {
    q: 'Which EHR systems do you support?',
    a: 'Epic, Cerner, athenahealth, Allscripts, eClinicalWorks, NextGen, and 15+ others via direct integration. We also support custom APIs for niche or proprietary systems. Your implementation team will scope this in week one.',
  },
  {
    q: 'Can we customize the triage protocol?',
    a: 'Absolutely. KITOGO ships with ESI 5-level and Manchester Triage System out of the box. Your clinical team can configure custom decision rules, escalation pathways, and routing logic — and update them anytime through our admin console.',
  },
];

export default function FAQ() {
  return (
    <section id="faq">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Common questions</span>
          <h2>Everything <span className="serif">you need</span> to know.</h2>
        </div>

        <div className="faq-list">
          {faqs.map(({ q, a, open }) => (
            <details key={q} className="faq" open={open}>
              <summary>
                <span>{q}</span>
                <span className="faq-icon">+</span>
              </summary>
              <div className="faq-body">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
