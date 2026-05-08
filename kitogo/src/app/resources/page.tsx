import type { Metadata } from 'next';
import { RESOURCES } from '@/data/resources';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ResourceFilters from './ResourceFilters';

export const metadata: Metadata = {
  title: 'Resources — Clinical AI Triage Research, Whitepapers & Webinars | KITOGO',
  description: 'Research, whitepapers, and operational playbooks from the KITOGO clinical team. Evidence-based content on AI triage, HIPAA compliance, and healthcare automation.',
  openGraph: {
    title: 'KITOGO Resources — Clinical AI Research & Insights',
    url: 'https://kitogo.health/resources',
  },
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="resources-hero">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Resources</span>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--ink)', marginBottom: 16 }}>
                The reading list for <span className="serif">clinical AI buyers.</span>
              </h1>
              <p style={{ fontSize: 'clamp(15px, 1.2vw, 18px)', color: 'var(--ink-2)', maxWidth: 600, lineHeight: 1.6 }}>
                Research from our clinical team, implementation playbooks from health systems, and the honest vendor questions you should be asking.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 0 80px', background: 'white' }}>
          <div className="container">
            <ResourceFilters resources={RESOURCES} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
