export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  remote: 'Remote' | 'Hybrid' | 'On-site';
  posted: string;
  description: string;
  requirements: string[];
}

export interface Benefit {
  icon: 'health' | 'equity' | 'remote' | 'growth' | 'parental' | 'mission';
  title: string;
  desc: string;
}

export const JOBS: Job[] = [
  {
    id: 'sr-ml-engineer',
    title: 'Senior ML Engineer — Clinical NLP',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: 'Hybrid',
    posted: '2026-04-28',
    description: 'Lead the development of our clinical NLP models, including symptom extraction, intent classification, and acuity scoring at scale.',
    requirements: [
      '5+ years ML/NLP engineering',
      'Experience with healthcare data (clinical notes, HL7, FHIR)',
      'PyTorch or JAX proficiency',
      'Prior work with LLM fine-tuning or RLHF',
    ],
  },
  {
    id: 'clinical-informatics',
    title: 'Clinical Informatics Specialist',
    department: 'Clinical',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    posted: '2026-04-20',
    description: "Bridge clinical knowledge and AI product development. You'll configure triage protocols, QA model outputs against clinical standards, and be the voice of the clinician in sprint reviews.",
    requirements: [
      'RN, PA, or MD credential',
      'Emergency or urgent care background preferred',
      'Experience with clinical informatics or EHR build',
      'Comfortable in technical product discussions',
    ],
  },
  {
    id: 'enterprise-ae',
    title: 'Enterprise Account Executive',
    department: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    posted: '2026-04-15',
    description: 'Own the full sales cycle for health system and IDN accounts. You know how to navigate multi-stakeholder enterprise healthcare deals and can speak credibly to CMOs, CIOs, and CFOs.',
    requirements: [
      '5+ years enterprise SaaS sales, healthcare preferred',
      'Track record of $500K+ ARR deals',
      'Familiarity with health system procurement cycles',
      'Experience with complex EHR/clinical workflow sales a plus',
    ],
  },
  {
    id: 'product-designer',
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: 'Hybrid',
    posted: '2026-04-10',
    description: 'Design the admin console, analytics dashboard, and protocol builder that clinical and ops teams live in every day. Healthcare UX experience is a strong plus.',
    requirements: [
      '4+ years product design for SaaS',
      'Expert in Figma',
      'Experience with data-dense dashboard design',
      'Healthcare or clinical settings experience preferred',
    ],
  },
  {
    id: 'implementation-manager',
    title: 'Implementation Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    remote: 'Remote',
    posted: '2026-03-30',
    description: "Own the deployment experience for new customers — from kickoff through go-live. You'll coordinate across clinical, IT, and ops stakeholders at health systems to deliver 2-week go-lives.",
    requirements: [
      '3+ years in healthcare IT implementation or project management',
      'Experience with EHR implementations (Epic, Cerner preferred)',
      'PMP or equivalent project management experience',
      'Strong stakeholder communication skills',
    ],
  },
];

export const BENEFITS: Benefit[] = [
  { icon: 'health', title: 'Premium healthcare', desc: 'Medical, dental, and vision — 100% covered for you, 75% for dependents.' },
  { icon: 'equity', title: 'Meaningful equity', desc: "Competitive options package with a 4-year vest. You're building this, you should own it." },
  { icon: 'remote', title: 'Flexible remote', desc: "Most roles are remote or hybrid. We have offices in SF; we don't require you to use them." },
  { icon: 'growth', title: 'Learning budget', desc: '$3,000/year for conferences, courses, and certifications. Clinical team has dedicated CME budget.' },
  { icon: 'parental', title: 'Parental leave', desc: '16 weeks fully paid for any parent — birth, adoption, or foster placement.' },
  { icon: 'mission', title: 'Mission that matters', desc: 'Every line of code and every conversation you join helps someone get the right care faster.' },
];
