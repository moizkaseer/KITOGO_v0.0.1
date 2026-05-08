import type { Metadata } from 'next';
import Link from 'next/link';
import { TEAM, ADVISORS, COMPANY_STATS } from '@/data/team';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RevealObserver from '@/components/ui/RevealObserver';

export const metadata: Metadata = {
  title: 'About KITOGO — Built by Clinicians, for Clinicians',
  description: "Meet the clinical AI team behind KITOGO — former ED physicians, triage nurses, and engineers who've worked inside the healthcare system they're transforming.",
  openGraph: {
    title: 'About KITOGO — Our team and mission',
    description: "The people building clinical-grade AI for patient triage. Founded in 2023, backed by Andreessen Horowitz.",
    url: 'https://kitogo.health/about',
  },
};

const PRESS = [
  { publication: 'STAT News', quote: '"KITOGO is proving that clinical AI can be both rigorous and deployable — a rare combination in healthcare."', date: 'February 2026' },
  { publication: 'Modern Healthcare', quote: '"The triage startup that actually works: how KITOGO earned the trust of 14 health systems in two years."', date: 'January 2026' },
  { publication: 'Healthcare IT News', quote: '"ESI-aligned, protocol-faithful, and HIPAA-native from day one. KITOGO is setting the bar for clinical voice AI."', date: 'November 2025' },
];

export default function AboutPage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="about-page-hero">
          <span className="eyebrow">About KITOGO</span>
          <h1>Built by clinicians,<br /><span className="serif">for clinicians.</span></h1>
          <p>
            We started KITOGO after watching a triage nurse work an 11-hour shift without a break.
            Calls stacked up. Acute cases got buried. Routine questions ate the bandwidth that should
            have gone to the patients who needed it most. We built the system we wished she&apos;d had.
          </p>
        </section>

        {/* Mission & Stats */}
        <section style={{ padding: '80px 0', background: 'white' }}>
          <div className="container">
            <div className="about-grid">
              <div className="reveal">
                <p className="about-mission">
                  Healthcare has a paradox: the patients who need attention most often wait longest,
                  while clinical staff spend their time on calls that don&apos;t need clinical judgment.
                  KITOGO doesn&apos;t try to replace clinicians — it removes the work that was never
                  supposed to be theirs in the first place.
                </p>
                <p className="about-mission" style={{ marginTop: 20, fontSize: 16, color: 'var(--ink-2)' }}>
                  Every protocol we ship is designed with nurses. Every escalation path is reviewed
                  by emergency physicians. And every line of code is audited to the standard your
                  security team expects.
                </p>
                <Link href="/demo" className="btn btn-primary" style={{ marginTop: 32, display: 'inline-block' }}>
                  Book a demo
                </Link>
              </div>
              <div className="about-stats reveal">
                {COMPANY_STATS.map(({ num, lbl }) => (
                  <div key={num} className="about-stat">
                    <div className="num">{num}</div>
                    <div className="lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ padding: '80px 0', background: 'var(--slate-50)' }}>
          <div className="container">
            <div className="section-head center reveal" style={{ marginBottom: 48 }}>
              <span className="eyebrow">The team</span>
              <h2>People who&apos;ve <span className="serif">been on the call.</span></h2>
              <p>We&apos;ve all worked inside healthcare — as clinicians, as engineers, as operators. We know what breaks and why.</p>
            </div>
            <div className="team-grid">
              {TEAM.map(({ init, name, role, bio }) => (
                <div key={init} className="team-card reveal">
                  <div className="team-avatar">{init}</div>
                  <h4>{name}</h4>
                  <div className="role">{role}</div>
                  <p className="bio">{bio}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/careers" className="btn btn-ghost">See open roles →</Link>
            </div>
          </div>
        </section>

        {/* Advisory Board */}
        <section style={{ padding: '80px 0', background: 'white' }}>
          <div className="container">
            <div className="section-head center reveal" style={{ marginBottom: 40 }}>
              <span className="eyebrow">Clinical advisory board</span>
              <h2>The people who <span className="serif">keep us honest.</span></h2>
              <p>Our clinical advisors review every protocol update, escalation path, and acuity-mapping decision before it ships to production.</p>
            </div>
            <div className="advisors-band reveal" style={{ marginTop: 0 }}>
              <div className="advisors-list">
                {ADVISORS.map(({ name, org }) => (
                  <div key={name} className="advisor-item">
                    <strong>{name}</strong>
                    <span>{org}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Press */}
        <section className="press-section">
          <div className="container">
            <div className="section-head center reveal" style={{ marginBottom: 40 }}>
              <span className="eyebrow">Press</span>
              <h2>What they&apos;re <span className="serif">saying.</span></h2>
            </div>
            <div className="press-grid">
              {PRESS.map(({ publication, quote, date }) => (
                <div key={publication} className="press-card reveal">
                  <div className="publication">{publication}</div>
                  <blockquote>{quote}</blockquote>
                  <div className="press-date">{date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
