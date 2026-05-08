import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PERSONAS } from '@/data/personas';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorks from '@/components/sections/HowItWorks';
import FinalCTA from '@/components/sections/FinalCTA';
import RevealObserver from '@/components/ui/RevealObserver';
import { AlertTriangleIcon } from '@/components/ui/icons';

export async function generateStaticParams() {
  return Object.keys(PERSONAS).map(slug => ({ persona: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ persona: string }> }): Promise<Metadata> {
  const { persona } = await params;
  const config = PERSONAS[persona];
  if (!config) return {};
  return {
    title: `KITOGO for ${config.label} — AI Patient Triage`,
    description: config.subheadline,
    openGraph: {
      title: `KITOGO for ${config.label}`,
      description: config.subheadline,
      url: `https://kitogo.health/for/${config.slug}`,
    },
  };
}

const SHARED_FAQS = [
  { q: 'How long does deployment take?', a: 'Most teams go live in 2 weeks. We integrate with your existing phone, EHR, and scheduling systems — no rip-and-replace, no downtime.' },
  { q: 'Is patient data secure?', a: 'Yes. KITOGO is HIPAA-compliant, SOC 2 Type II certified, and HITRUST accredited. All data is encrypted in transit and at rest. We sign BAAs with every customer.' },
];

export default async function PersonaPage({ params }: { params: Promise<{ persona: string }> }) {
  const { persona } = await params;
  const config = PERSONAS[persona];
  if (!config) notFound();

  const allFaqs = [...config.faqOverrides, ...SHARED_FAQS];

  return (
    <>
      <RevealObserver />
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="persona-hero">
          <div className="container">
            <span className="eyebrow">{config.eyebrow}</span>
            <div className="persona-hero-stat-pill">
              <span className="persona-hero-stat-num">{config.heroStat.num}</span>
              <span>{config.heroStat.lbl}</span>
            </div>
            <h1>{config.headline}</h1>
            <p>{config.subheadline}</p>
            <Link href="/demo" className="btn btn-primary">{config.ctaLabel}</Link>
            <Link href="/#pricing" className="btn btn-ghost" style={{ marginLeft: 12 }}>See pricing</Link>
          </div>
        </section>

        {/* Pain Points */}
        <section className="pain-points-section">
          <div className="container">
            <div className="section-head reveal" style={{ marginBottom: 40 }}>
              <span className="eyebrow">The problems we solve</span>
              <h2>What your team <span className="serif">deals with every day.</span></h2>
            </div>
            <div className="pain-points-grid">
              {config.painPoints.map(({ title, body }) => (
                <div key={title} className="pain-card reveal">
                  <div className="pain-card-icon">
                    <AlertTriangleIcon size={20} />
                  </div>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="outcomes-section">
          <div className="container">
            <div className="outcomes-strip">
              {config.outcomes.map(({ metric, lbl }) => (
                <div key={metric} className="outcome-chip">
                  <div className="num">{metric}</div>
                  <div className="lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="persona-quote-section">
          <div className="container">
            <div className="persona-quote-card reveal">
              <blockquote>{config.caseQuote.text}</blockquote>
              <div className="author">{config.caseQuote.author}</div>
              <div className="org">{config.caseQuote.org}</div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <HowItWorks />

        {/* FAQ */}
        <section className="persona-faq-section">
          <div className="container">
            <div className="section-head center reveal" style={{ marginBottom: 40 }}>
              <span className="eyebrow">Questions</span>
              <h2>Answers for <span className="serif">{config.label.toLowerCase()}.</span></h2>
            </div>
            <div className="faq-list" style={{ maxWidth: 720, margin: '0 auto' }}>
              {allFaqs.map(({ q, a }, i) => (
                <details key={q} className="faq" open={i === 0}>
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

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
