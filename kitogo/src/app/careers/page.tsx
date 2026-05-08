import type { Metadata } from 'next';
import { JOBS, BENEFITS } from '@/data/careers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RevealObserver from '@/components/ui/RevealObserver';
import JobAccordion from './JobAccordion';

export const metadata: Metadata = {
  title: 'Careers at KITOGO — Join the Clinical AI Team',
  description: 'KITOGO is hiring engineers, clinicians, and operators to transform patient triage. See open roles and learn about our culture, benefits, and mission.',
  openGraph: {
    title: 'Careers at KITOGO — Build the future of clinical AI',
    url: 'https://kitogo.health/careers',
  },
};

const CULTURE = [
  { title: 'Clinical truth first', body: "Every product decision gets reviewed against clinical reality. If a nurse or physician says it doesn't work the way we think, we restart." },
  { title: 'Honest about limits', body: "We ship the same 'where we're not the right fit' honesty internally that we show customers. We don't oversell to each other." },
  { title: 'Default to ship', body: "We iterate fast, but never at the cost of clinical accuracy. The deployment gets delayed before the protocol does." },
  { title: 'Remote-native culture', body: "Most of the team is remote. We document decisions, ship async, and save synchronous time for things that actually need it." },
  { title: 'Operator respect', body: "The people who deploy and manage KITOGO are partners, not users. Our onboarding team has zero tolerance for implementation that leaves customers confused." },
  { title: 'Equity and urgency', body: "Healthcare access problems are equity problems. We move fast because the patients who need care fastest are often the ones least able to wait." },
];

export default function CareersPage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="careers-hero">
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span className="eyebrow">We&apos;re hiring</span>
            <h1>Build the AI that <span className="serif">clinicians trust.</span></h1>
            <p>We&apos;re a team of 42 across clinical, engineering, and operations. We&apos;re looking for people who care about doing this right — not just doing it fast.</p>
            <a href="#open-roles" className="btn btn-primary">See open roles</a>
          </div>
        </section>

        {/* Culture */}
        <section style={{ padding: '80px 0', background: 'white' }}>
          <div className="container">
            <div className="section-head center reveal" style={{ marginBottom: 48 }}>
              <span className="eyebrow">How we work</span>
              <h2>Culture isn&apos;t a perk list. <span className="serif">It&apos;s how we decide.</span></h2>
            </div>
            <div className="culture-grid">
              {CULTURE.map(({ title, body }) => (
                <div key={title} className="culture-card reveal">
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: '80px 0', background: 'var(--slate-50)' }}>
          <div className="container">
            <div className="section-head center reveal" style={{ marginBottom: 48 }}>
              <span className="eyebrow">Benefits</span>
              <h2>What we <span className="serif">actually offer.</span></h2>
            </div>
            <div className="benefits-grid">
              {BENEFITS.map(({ title, desc }) => (
                <div key={title} className="benefit-card reveal">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section id="open-roles" style={{ padding: '80px 0', background: 'white' }}>
          <div className="container">
            <div className="section-head reveal" style={{ marginBottom: 40 }}>
              <span className="eyebrow">Open roles</span>
              <h2>{JOBS.length} positions <span className="serif">open now.</span></h2>
            </div>
            <JobAccordion jobs={JOBS} />
            <div style={{ marginTop: 40, padding: '28px', background: 'var(--slate-50)', borderRadius: 16, border: '1px solid var(--slate-200)' }}>
              <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--ink)' }}>Don&apos;t see your role?</p>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16 }}>We hire for exceptional people even when we don&apos;t have a specific opening. Send us a note.</p>
              <a href="mailto:careers@kitogo.health" className="btn btn-ghost">Send a note →</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
