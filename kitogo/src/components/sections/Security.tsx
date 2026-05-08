export default function Security() {
  return (
    <section id="security" className="security-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Security &amp; compliance</span>
          <h2>Built for the <span className="serif">scrutiny</span> of healthcare.</h2>
          <p>KITOGO is engineered from the ground up around HIPAA, SOC 2, and the realities of clinical data. Your security and compliance teams will recognize the architecture.</p>
        </div>

        <div className="security-hero reveal">
          <div className="security-shield">
            <div className="security-shield-ring outer" />
            <div className="security-shield-ring" />
            <svg className="security-shield-svg" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" />
                  <stop offset="100%" stopColor="#052D7A" />
                </linearGradient>
                <linearGradient id="shieldGloss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M160 40 L260 80 L260 170 Q260 240 160 280 Q60 240 60 170 L60 80 Z" fill="url(#shieldGrad)" />
              <path d="M160 40 L260 80 L260 170 Q260 240 160 280 Q60 240 60 170 L60 80 Z" fill="url(#shieldGloss)" />
              <path d="M115 165 L150 198 L210 130" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="160" cy="160" r="86" stroke="white" strokeOpacity="0.15" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <div>
            <h3 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16, color: 'var(--ink)' }}>
              Certifications and frameworks we operate under.
            </h3>
            <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.6 }}>
              Every certification on this page is current, externally audited, and available for your review. We sign BAAs with every customer before any data flows.
            </p>

            <div className="security-grid">
              {[
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2 L20 6 V12 C20 17 16.5 21 12 22 C7.5 21 4 17 4 12 V6 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
                  title: 'HIPAA',
                  desc: 'Full administrative, physical, and technical safeguards. BAA included.',
                },
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                  title: 'SOC 2 Type II',
                  desc: 'Annually audited. Trust Services Criteria report available under NDA.',
                },
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
                  title: 'HITRUST CSF',
                  desc: 'r2 Validated assessment. Maps controls across HIPAA, NIST, ISO.',
                },
                {
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
                  title: 'GDPR / CCPA',
                  desc: 'Data residency in EU/US. Right-to-delete and DPA on request.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="security-cert">
                  <div className="security-cert-icon">{icon}</div>
                  <div><h4>{title}</h4><p>{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="security-pillars">
          {[
            {
              num: '01',
              title: 'Data protection',
              items: [
                'AES-256 encryption at rest, TLS 1.3 in transit',
                'Customer-managed encryption keys (Enterprise)',
                'Tokenization of PHI in non-clinical contexts',
                'Zero data used for model training without explicit opt-in',
                'Configurable data retention from 30 days to 7 years',
              ],
            },
            {
              num: '02',
              title: 'Access & identity',
              items: [
                'SAML 2.0 SSO with SCIM provisioning',
                'Multi-factor authentication enforced for all admin roles',
                'Role-based access control with audit-friendly granularity',
                'Session timeout policies configurable per organization',
                'IP allowlisting available for Enterprise deployments',
              ],
            },
            {
              num: '03',
              title: 'Infrastructure',
              items: [
                'HIPAA-eligible AWS regions (US-East, US-West, EU-West)',
                'Multi-region active-active for 99.99% availability',
                'Automated daily backups with 4-hour RPO',
                'Penetration tested annually by independent firm',
                'Disaster recovery tested monthly — RTO < 2 minutes',
              ],
            },
          ].map(({ num, title, items }) => (
            <div key={num} className="security-pillar reveal">
              <div className="security-pillar-num">{num}</div>
              <h4>{title}</h4>
              <ul>
                {items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
