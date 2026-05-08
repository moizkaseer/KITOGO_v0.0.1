import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="nav-logo">
            <span className="nav-logo-dot" />
            KITOGO
          </Link>
          <p>
            The clinical-grade AI agent for patient triage and intake. Built with healthcare
            teams, for healthcare teams.
          </p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <a href="/#features">Platform</a>
          <a href="/#integrations">Integrations</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#security">Security</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about">About</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/resources">Blog</Link>
          <Link href="/about#press">Press</Link>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <Link href="/resources">Research</Link>
          <a href="/#cases">Customers</a>
          <a href="/#faq">FAQ</a>
          <Link href="/demo">Book a demo</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 KITOGO Health, Inc. All rights reserved.</span>
        <div className="compliance-badges">
          <span className="compliance-badge">HIPAA</span>
          <span className="compliance-badge">SOC 2 Type II</span>
          <span className="compliance-badge">HITRUST</span>
        </div>
      </div>
    </footer>
  );
}
