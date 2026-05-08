export interface TeamMember {
  init: string;
  name: string;
  role: string;
  bio: string;
}

export interface Advisor {
  name: string;
  org: string;
}

export interface StatItem {
  num: string;
  lbl: string;
}

export const TEAM: TeamMember[] = [
  { init: 'SO', name: 'Sarah Okonkwo, MD', role: 'Co-founder & CEO', bio: 'Former ED attending at UCSF. Stanford Med. Built and sold a clinical decision-support startup in 2021.' },
  { init: 'RP', name: 'Raj Patel', role: 'Co-founder & CTO', bio: 'Ex-Anthropic and Google Health. Led voice AI infrastructure at a Y Combinator healthcare unicorn.' },
  { init: 'EW', name: 'Elena Vasquez, RN', role: 'VP of Clinical Operations', bio: '15 years as a triage nurse and clinical informatics lead at Kaiser Permanente. Designs every protocol.' },
  { init: 'MK', name: 'Marcus Kim', role: 'Head of Security', bio: 'Former CISO at a top-10 health system. CISSP, HCISPP. Owns SOC 2 and HITRUST programs end-to-end.' },
];

export const ADVISORS: Advisor[] = [
  { name: 'Dr. Patricia Hayes, MD, MBA', org: 'Former Chief Medical Officer · Cleveland Clinic' },
  { name: 'Dr. James Rourke, MD, FACEP', org: 'ED Director · Mass General Brigham' },
  { name: 'Linda Chen, RN, PhD', org: 'Chief Nursing Informatics Officer · Sutter Health' },
  { name: 'Dr. David Okafor, MD', org: 'Pediatric Emergency Medicine · CHOP' },
];

export const COMPANY_STATS: StatItem[] = [
  { num: '2023', lbl: 'Founded in San Francisco' },
  { num: '$24M', lbl: 'Series A · Andreessen Horowitz' },
  { num: '42', lbl: 'Team members across clinical, eng & ops' },
  { num: '14', lbl: 'Healthcare networks live in production' },
];
