export type ResourceType = 'article' | 'whitepaper' | 'webinar';

export interface Resource {
  slug: string;
  type: ResourceType;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  featured?: boolean;
}

export const RESOURCES: Resource[] = [
  {
    slug: 'esi-triage-ai-accuracy',
    type: 'whitepaper',
    title: 'AI-Assisted ESI Triage: Clinical Accuracy in 240,000 Patient Encounters',
    excerpt: 'A prospective study across three health systems comparing KITOGO triage acuity assignments to retrospective nurse adjudication.',
    date: '2026-02-01',
    readTime: '18 min read',
    author: 'Elena Vasquez, RN · Clinical Research Team',
    tags: ['Clinical AI', 'ESI', 'Research'],
    featured: true,
  },
  {
    slug: 'reduce-call-center-load',
    type: 'article',
    title: 'How Mercy Regional Cut Call Center Volume by 42% in 6 Months',
    excerpt: 'A detailed operational breakdown of how one 400-bed system deployed KITOGO and freed their nurses to do clinical work.',
    date: '2026-01-20',
    readTime: '6 min read',
    author: 'KITOGO Editorial',
    tags: ['Case Study', 'Operations'],
  },
  {
    slug: 'hipaa-ai-checklist',
    type: 'whitepaper',
    title: 'The HIPAA AI Vendor Checklist: 17 Questions to Ask Before You Sign',
    excerpt: 'What your compliance and legal teams should evaluate when procuring any AI that handles PHI.',
    date: '2026-01-10',
    readTime: '12 min read',
    author: 'Marcus Kim · Head of Security',
    tags: ['Security', 'HIPAA', 'Compliance'],
  },
  {
    slug: 'state-of-triage-2026',
    type: 'webinar',
    title: 'State of AI Triage in 2026 — Webinar Recording',
    excerpt: 'Our clinical team walks through national triage data, where AI is failing, and what the research says about safe deployment.',
    date: '2025-11-15',
    readTime: '54 min',
    author: 'Sarah Okonkwo, MD',
    tags: ['Webinar', 'Thought Leadership'],
    featured: true,
  },
  {
    slug: 'epic-fhir-r4-integration',
    type: 'article',
    title: 'Epic FHIR R4 Integration: What Every CMIO Should Know',
    excerpt: 'A technical primer for clinical informatics leaders on FHIR R4 read/write scopes, consent flows, and real-world integration timelines.',
    date: '2025-10-30',
    readTime: '9 min read',
    author: 'Raj Patel · CTO',
    tags: ['Integrations', 'Epic', 'FHIR'],
  },
  {
    slug: 'nurse-burnout-automation',
    type: 'article',
    title: 'Automation Without Displacement: How to Introduce AI to Your Nursing Team',
    excerpt: 'A change management playbook for nurse leaders navigating AI adoption — from initial resistance to enthusiastic champions.',
    date: '2025-09-15',
    readTime: '7 min read',
    author: 'Elena Vasquez, RN',
    tags: ['Nursing', 'Change Management'],
  },
  {
    slug: 'roi-calculator-methodology',
    type: 'whitepaper',
    title: 'Behind the ROI Calculator: How We Model Labor Savings and Revenue Capture',
    excerpt: 'Full methodology disclosure for the KITOGO ROI model — assumptions, data sources, and the controls applied to prevent overstatement.',
    date: '2025-08-20',
    readTime: '15 min read',
    author: 'KITOGO Finance & Clinical Team',
    tags: ['ROI', 'Finance'],
  },
  {
    slug: 'multisite-deployment-playbook',
    type: 'webinar',
    title: 'Deploying AI Triage Across 8 Sites Simultaneously — Live Q&A',
    excerpt: "Atlantic Health's VP of Digital shares the playbook for a coordinated multi-site rollout, including stakeholder mapping and cutover strategy.",
    date: '2025-07-10',
    readTime: '47 min',
    author: 'Atlantic Health · KITOGO Panel',
    tags: ['Webinar', 'Enterprise', 'Deployment'],
  },
];
