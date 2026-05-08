'use client';

import { useState } from 'react';

const CheckIcon = ({ stroke = 'currentColor' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const plans = [
  {
    tier: 'Starter',
    name: 'For growing practices',
    monthly: 1500,
    annual: 1200,
    desc: 'Up to 2,500 calls/month. Perfect for single-site practices and growing clinics.',
    cta: 'Start free trial',
    featured: false,
    features: [
      { text: 'Voice + SMS triage agent', included: true },
      { text: 'ESI 5-level protocol library', included: true },
      { text: '1 EHR integration (Epic, Cerner, athenahealth)', included: true },
      { text: 'Standard analytics dashboard', included: true },
      { text: 'HIPAA-compliant infrastructure + BAA', included: true },
      { text: 'Email + chat support', included: true },
      { text: 'Custom triage protocols', included: false },
    ],
  },
  {
    tier: 'Growth',
    name: 'For health systems',
    monthly: 4800,
    annual: 3840,
    desc: 'Up to 15,000 calls/month. The sweet spot for multi-site networks and ambulatory groups.',
    cta: 'Book a demo',
    featured: true,
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Up to 5 EHR/PMS integrations', included: true },
      { text: 'Custom triage protocol authoring', included: true },
      { text: 'Multi-site analytics + benchmarking', included: true },
      { text: 'SSO + advanced role permissions', included: true },
      { text: 'Dedicated implementation manager', included: true },
      { text: '99.95% SLA + priority support', included: true },
    ],
  },
  {
    tier: 'Enterprise',
    name: 'For large networks',
    monthly: null,
    annual: null,
    desc: 'Unlimited volume, on-prem or VPC deployment, dedicated infrastructure. Built around your security posture.',
    cta: 'Talk to sales',
    featured: false,
    features: [
      { text: 'Everything in Growth', included: true },
      { text: 'Unlimited EHR/PMS integrations', included: true },
      { text: 'VPC, on-prem, or hybrid deployment', included: true },
      { text: 'Data residency controls', included: true },
      { text: 'Custom security review + pen test', included: true },
      { text: 'Dedicated CSM + clinical advisor', included: true },
      { text: 'White-label patient experience', included: true },
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Plans &amp; pricing</span>
          <h2>Pricing that <span className="serif">scales with you.</span></h2>
          <p>Simple, transparent, and built around the volume you actually handle. No per-seat fees. No hidden integration costs.</p>
          <div className="pricing-toggle" role="tablist">
            <button className={!annual ? 'active' : ''} onClick={() => setAnnual(false)}>Monthly</button>
            <button className={annual ? 'active' : ''} onClick={() => setAnnual(true)}>
              Annual <span style={{ opacity: 0.7 }}>−20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.tier} className={`pricing-card reveal${plan.featured ? ' featured' : ''}`}>
              <div className="pricing-tier">{plan.tier}</div>
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                {plan.monthly ? (
                  <>
                    <span className="currency">$</span>
                    <span className="amount">
                      {(annual ? plan.annual! : plan.monthly).toLocaleString()}
                    </span>
                    <span className="period">/ month</span>
                  </>
                ) : (
                  <span className="amount" style={{ fontSize: 36 }}>Custom</span>
                )}
              </div>
              <p className="pricing-desc">{plan.desc}</p>
              <a href="#" className="pricing-cta">{plan.cta}</a>
              <ul className="pricing-features">
                {plan.features.map(f => (
                  <li key={f.text} className={f.included ? '' : 'muted'}>
                    {f.included
                      ? <CheckIcon stroke={plan.featured ? '#93C5FD' : 'currentColor'} />
                      : <XIcon />}
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pricing-footer reveal">
          <strong>All plans include:</strong> HIPAA compliance, BAA, SOC 2 Type II, end-to-end
          encryption, 24/7 system monitoring, and a 30-day money-back guarantee. Prices shown in
          USD. Volume above plan limits billed at $0.42/call.
        </div>
      </div>
    </section>
  );
}
