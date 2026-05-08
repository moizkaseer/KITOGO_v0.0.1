export interface PainPoint {
  title: string;
  body: string;
}

export interface Outcome {
  metric: string;
  lbl: string;
}

export interface CaseQuote {
  text: string;
  author: string;
  org: string;
}

export interface PersonaConfig {
  slug: string;
  label: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroStat: { num: string; lbl: string };
  painPoints: PainPoint[];
  outcomes: Outcome[];
  caseQuote: CaseQuote;
  faqOverrides: { q: string; a: string }[];
  ctaLabel: string;
}

export const PERSONAS: Record<string, PersonaConfig> = {
  'ed-directors': {
    slug: 'ed-directors',
    label: 'ED Directors',
    eyebrow: 'Built for Emergency Departments',
    headline: 'Triage every call before they reach your desk.',
    subheadline: 'KITOGO handles the intake burden across phone, web, and SMS — so your ED team triages patients, not phone queues.',
    heroStat: { num: '<60s', lbl: 'average intake time across 2.5M+ ED encounters' },
    painPoints: [
      { title: 'Call queues that never drain', body: 'Your triage nurses spend 40% of their shift on the phone. KITOGO answers immediately, gathers chief complaint, and applies ESI protocol — routing to the right resource before your staff picks up.' },
      { title: 'Midnight staffing gaps', body: 'After-hours calls default to on-call nurses or answerphones. KITOGO runs 24/7, handling routine triage and escalating red flags to a live human in under 30 seconds.' },
      { title: 'Compliance documentation gaps', body: 'Every KITOGO interaction produces a structured clinical summary that writes directly to your EHR — no verbal handoffs, no documentation debt.' },
    ],
    outcomes: [
      { metric: '42%', lbl: 'reduction in intake time' },
      { metric: '30s', lbl: 'red-flag escalation SLA' },
      { metric: '99.97%', lbl: 'uptime across all deployments' },
    ],
    caseQuote: {
      text: '"KITOGO cut our intake time in half. Staff finally focus on care, not calls."',
      author: 'Director of Operations',
      org: 'Mercy Regional Medical Center',
    },
    faqOverrides: [
      { q: 'How does the agent handle ESI scoring?', a: 'KITOGO applies ESI 5-level scoring out of the box. Your clinical team configures the protocol rules and can update them anytime through the admin console. The agent never makes final acuity decisions — it generates a structured recommendation for your clinicians.' },
    ],
    ctaLabel: 'See an ED demo',
  },
  'urgent-care': {
    slug: 'urgent-care',
    label: 'Urgent Care Networks',
    eyebrow: 'Built for Urgent Care',
    headline: 'Stop routing patients. Start treating them.',
    subheadline: 'KITOGO manages intake across every location in your network — so patients reach the right site, not just the nearest one.',
    heroStat: { num: '18×', lbl: 'increase in proactive engagement capacity' },
    painPoints: [
      { title: 'Multi-site call overflow', body: 'When one site gets slammed, calls get dropped or misrouted. KITOGO routes intelligently across your network — directing patients to the right location based on acuity and wait time.' },
      { title: 'Inconsistent intake quality', body: 'Triage quality varies by staff experience and shift fatigue. KITOGO applies the same protocol every time, with full audit logs.' },
      { title: 'After-hours patient leakage', body: "Patients who can't reach you after hours go to the ER — or leave. KITOGO handles 24/7 intake, routes appropriately, and schedules morning callbacks." },
    ],
    outcomes: [
      { metric: '35%', lbl: 'reduction in ER inappropriate visits' },
      { metric: '2 weeks', lbl: 'typical go-live time' },
      { metric: '$1.2M', lbl: 'first-year ROI for 5-site networks' },
    ],
    caseQuote: {
      text: '"What used to take a team of 12 now runs continuously. The agent never sleeps."',
      author: 'VP of Patient Experience',
      org: 'Pacific Care Group',
    },
    faqOverrides: [
      { q: 'Can KITOGO route across multiple locations?', a: 'Yes — KITOGO has native multi-site routing logic. It can route based on acuity, wait time, patient location, insurance, and site capability. Your ops team configures the rules; KITOGO applies them in real time.' },
    ],
    ctaLabel: 'Book a network demo',
  },
  'telehealth': {
    slug: 'telehealth',
    label: 'Telehealth Platforms',
    eyebrow: 'Built for Telehealth',
    headline: 'The intake experience your virtual patients deserve.',
    subheadline: 'KITOGO runs asynchronous and real-time intake across web and SMS — fully API-first, zero call-center infrastructure required.',
    heroStat: { num: '94%', lbl: 'patient satisfaction on AI-handled intakes' },
    painPoints: [
      { title: 'Async intake bottlenecks', body: 'Chat-based intake that requires human review creates latency. KITOGO handles async triage independently, flagging only the cases that need eyes.' },
      { title: 'High abandonment at intake', body: "Long intake forms lose patients before they convert. KITOGO's conversational flow has a 91% completion rate vs. 58% for form-based intake." },
      { title: 'Provider load mismatch', body: 'Without smart triage, low-acuity cases consume provider time meant for complex ones. KITOGO sorts and queues before the provider logs on.' },
    ],
    outcomes: [
      { metric: '91%', lbl: 'intake completion rate' },
      { metric: '58%', lbl: 'reduction in provider prep time' },
      { metric: 'FHIR R4', lbl: 'native integration — no middleware needed' },
    ],
    caseQuote: {
      text: '"We expected automation. We got transformation. Our completion rate jumped 33 points in a month."',
      author: 'Head of Product',
      org: 'Telehealth Platform (NDA)',
    },
    faqOverrides: [
      { q: 'Can KITOGO integrate with our existing telehealth stack?', a: 'Yes — KITOGO exposes a FHIR R4 API and webhooks that connect to your scheduling, EHR, and video visit systems. We also support direct integrations with major telehealth platforms. Most integrations are live in under a week.' },
    ],
    ctaLabel: 'See the API',
  },
  'multisite': {
    slug: 'multisite',
    label: 'Multi-Site Health Systems',
    eyebrow: 'Built for Health Systems',
    headline: 'One AI triage layer. Every site, every channel.',
    subheadline: 'KITOGO scales across unlimited sites and channels — with centralized governance, per-site protocol customization, and system-wide analytics.',
    heroStat: { num: '14', lbl: 'health system networks live in production today' },
    painPoints: [
      { title: 'Protocol consistency across sites', body: 'Different sites, different staff, different triage quality. KITOGO enforces the same clinical protocol system-wide, with per-site overrides where you need them.' },
      { title: 'Enterprise security requirements', body: 'Your CISO needs VPC deployment, SAML SSO, and HITRUST documentation. KITOGO Enterprise delivers all of it, with a dedicated security review and pen test on request.' },
      { title: 'Analytics that actually drive decisions', body: 'System-wide analytics with site-level drill-down, acuity trend tracking, and benchmarking against national averages — all in a dashboard your CMO will actually open.' },
    ],
    outcomes: [
      { metric: '8', lbl: 'sites deployed simultaneously at Atlantic Health' },
      { metric: 'VPC', lbl: 'private cloud deployment available' },
      { metric: 'HITRUST', lbl: 'CSF r2 validated across every deployment' },
    ],
    caseQuote: {
      text: '"We expected a tool. We got a clinical transformation partner. Our team morale changed within weeks."',
      author: 'CMIO',
      org: 'Atlantic Health System',
    },
    faqOverrides: [
      { q: 'Can we run KITOGO in our own VPC?', a: 'Yes — KITOGO Enterprise supports VPC, on-prem, and hybrid deployments. Data never leaves your environment. We work with your infrastructure team to scope the deployment model that fits your security posture.' },
    ],
    ctaLabel: 'Talk to enterprise sales',
  },
};
