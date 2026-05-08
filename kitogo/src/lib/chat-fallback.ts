interface Intent {
  match?: RegExp;
  reply: string;
  followUps?: string[];
}

const intents: Record<string, Intent> = {
  pricing: {
    match: /pric|cost|plan|tier|how much/i,
    reply: "Plans start at $1,500/mo for Starter (up to 2,500 calls/mo). Growth is $4,800/mo for multi-site networks. Enterprise is custom — based on volume and deployment needs. Want me to walk you through which one fits?",
    followUps: ['Tell me about Growth', 'How is Enterprise different?', 'Do you offer a free trial?'],
  },
  demo: {
    match: /demo|try it|book|schedule/i,
    reply: "Of course — most demos take 25 minutes. We'll show you the live agent in action with your specific use case in mind. You can grab a slot at kitogo.health/demo, or I can take your email and have someone reach out today.",
    followUps: ['What do I need to prepare?', 'Can I see the dashboard?', 'How long is implementation?'],
  },
  security: {
    match: /hipaa|secur|compli|soc 2|hitrust|baa|encrypt|privacy/i,
    reply: "Yes — we're HIPAA-compliant, SOC 2 Type II audited, and HITRUST CSF r2 validated. We sign BAAs with every customer. Data is AES-256 encrypted at rest, TLS 1.3 in transit, and we never use customer PHI for model training.",
    followUps: ['Send the security one-pager', 'Where is data stored?', 'Can I see the audit reports?'],
  },
  integration: {
    match: /epic|cerner|athena|integrat|ehr|emr|fhir|hl7/i,
    reply: "We integrate directly with Epic, Cerner, athenahealth, Allscripts, eClinicalWorks, NextGen, MEDITECH, and 35+ others — plus FHIR R4 and HL7 v2 for anything custom. Most setups take 2 weeks end-to-end.",
    followUps: ['We use Epic', 'We use Cerner', 'Tell me about FHIR support'],
  },
  triage: {
    match: /triage|esi|protocol|symptom|diagnos|emergency|escalat/i,
    reply: "KITOGO uses ESI 5-level and Manchester Triage System out of the box, and your clinical team can fully customize protocols. The agent never makes clinical decisions — it gathers a structured chief complaint and applies your rules. Red flags escalate to a live nurse within 30 seconds.",
    followUps: ['How do red flags work?', 'Can we customize protocols?', 'What about pediatric cases?'],
  },
  time: {
    match: /how long|implement|setup|deploy|live|onboarding/i,
    reply: "Most teams go live in 2 weeks. Week 1: integration kickoff, BAA, security review. Week 2: protocol configuration, soft launch in shadow mode. By week 3, you're in full production.",
    followUps: ['What does shadow mode mean?', 'Who from our side is needed?', 'Can we go faster?'],
  },
  default: {
    reply: "Great question — let me get a real human on this with you. In the meantime, you can also book a 25-minute live demo at kitogo.health/demo, or I can connect you with our team. What works better?",
    followUps: ['Book a demo', 'Have someone email me', 'Tell me about pricing'],
  },
};

export function findIntent(text: string) {
  for (const intent of Object.values(intents)) {
    if (intent.match?.test(text)) return intent;
  }
  return intents.default;
}
