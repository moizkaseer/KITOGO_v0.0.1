import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DemoFlow from './DemoFlow';

export const metadata: Metadata = {
  title: 'Book a Demo — KITOGO Clinical AI Triage',
  description: "See KITOGO in action with a personalized 25-minute demo. We'll walk through live triage, your EHR integration, and ROI modeling for your specific context.",
  openGraph: {
    title: 'Book a KITOGO demo',
    url: 'https://kitogo.health/demo',
  },
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="demo-page">
        <div className="demo-flow-wrap">
          <div style={{ marginBottom: 32 }}>
            <span className="eyebrow">Book a demo</span>
            <p style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', marginTop: 8, lineHeight: 1.2 }}>
              25 minutes. Live agent. Your use case.
            </p>
          </div>
          <DemoFlow />
        </div>
      </main>
      <Footer />
    </>
  );
}
