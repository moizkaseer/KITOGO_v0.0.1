'use client';

import { useState } from 'react';

type NodeKey = 'phone' | 'web' | 'edge' | 'api' | 'core' | 'vault' | 'audit' | 'egress' | 'ehr' | 'phone-system' | 'dash' | 'warehouse';

const nodeDetails: Record<NodeKey, { title: string; desc: string; tags: string[] }> = {
  phone: { title: 'Patient phone', desc: 'Inbound PSTN and SIP calls from patients. Audio is encrypted in transit via SRTP before entering the KITOGO voice gateway.', tags: ['PSTN', 'SIP', 'SRTP'] },
  web: { title: 'Web / SMS', desc: 'HTTPS web chat and SMS channels. All sessions use TLS 1.3 with certificate pinning on mobile clients.', tags: ['HTTPS', 'TLS 1.3', 'SMS'] },
  edge: { title: 'Voice gateway', desc: 'Terminates inbound calls, applies SRTP/DTLS encryption, performs speaker diarization, and hands the audio stream to the triage core.', tags: ['SRTP', 'DTLS', 'Diarization'] },
  api: { title: 'API gateway', desc: 'All REST and webhook traffic enters here. WAF rules block injection attacks. OAuth 2.1 token validation before any request reaches the triage core.', tags: ['WAF', 'OAuth 2.1', 'Rate limiting'] },
  core: { title: 'Triage core', desc: 'The brain of KITOGO. ASR converts speech to text, NLU extracts clinical concepts, and the protocol engine applies your configured triage rules. PHI is tokenized — raw identifiers never leave this boundary unencrypted.', tags: ['ASR', 'NLU', 'ESI Protocol', 'Tokenized PHI'] },
  vault: { title: 'PHI vault', desc: 'Structured intake records, audio recordings, and transcripts. AES-256 at rest with customer-managed KMS keys (Enterprise). Configurable retention from 30 days to 7 years. Every read is logged.', tags: ['AES-256', 'CMK', 'Configurable retention'] },
  audit: { title: 'Audit log', desc: 'Every PHI access event, configuration change, and admin action is logged immutably. Retained 7 years by default. Streamable to your SIEM via webhook or S3 mirror.', tags: ['Immutable', '7-year retention', 'SIEM streaming'] },
  egress: { title: 'Egress router', desc: 'The only path data takes from KITOGO to your environment. Outbound writes are FHIR R4 or HL7 v2. Egress is allowlisted to your specific endpoints — nothing flows anywhere else.', tags: ['FHIR R4', 'HL7 v2', 'IP allowlisted'] },
  ehr: { title: 'Your EHR', desc: 'Your system of record. KITOGO writes structured intake notes, transcripts, and audio file references — never reads patient charts unless explicitly authorized for a specific use case.', tags: ['Write-mostly', 'BAA in place', 'You own the data'] },
  'phone-system': { title: 'Your phone system', desc: 'KITOGO connects to whatever you already use — RingCentral, Twilio, Cisco, Genesys, or in-house PBX. The forward arrangement is configured during week 1 of implementation.', tags: ['Vendor-agnostic', 'Forward arrangement'] },
  dash: { title: 'Staff dashboard', desc: 'The web app your team uses to monitor calls, review queues, configure protocols, and pull analytics. SAML SSO, SCIM provisioning, granular RBAC, MFA enforced for all admin roles.', tags: ['SAML SSO', 'SCIM', 'MFA', 'RBAC'] },
  warehouse: { title: 'Your warehouse (optional)', desc: 'Stream KITOGO event data into Snowflake, Databricks, or your data lake for custom analytics. Opt-in only — most customers run on our built-in analytics.', tags: ['Snowflake', 'Databricks', 'S3 mirror'] },
};

export default function Architecture() {
  const [detail, setDetail] = useState<{ title: string; desc: string; tags: string[] } | null>(null);

  function handleNode(key: NodeKey) {
    setDetail(nodeDetails[key]);
  }

  return (
    <section id="architecture" className="arch-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">For your CTO and CISO</span>
          <h2>How <span className="serif">data flows</span> — and where it doesn&apos;t.</h2>
          <p>Click any node to see what runs there, what data crosses each boundary, and the controls in place. The full architecture review is available under NDA.</p>
        </div>

        <div className="arch-canvas reveal">
          <div className="arch-svg-wrap">
            <svg className="arch-svg" viewBox="0 0 1100 480" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
              <defs>
                <linearGradient id="archBlue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" />
                  <stop offset="100%" stopColor="#052D7A" />
                </linearGradient>
                <marker id="archArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
                </marker>
              </defs>

              {/* Trust boundaries */}
              <rect x="20" y="20" width="220" height="440" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
              <text x="40" y="48" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2" fill="#64748B">PATIENT EDGE</text>

              <rect x="270" y="20" width="540" height="440" rx="16" fill="#F4F8FF" stroke="#E8F1FF" strokeWidth="1" strokeDasharray="4 4" />
              <text x="290" y="48" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2" fill="#0B5FFF">KITOGO VPC · HIPAA-ELIGIBLE AWS · SOC 2</text>

              <rect x="840" y="20" width="240" height="440" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
              <text x="860" y="48" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2" fill="#64748B">YOUR ENVIRONMENT</text>

              {/* Patient nodes */}
              <g className="arch-node" onClick={() => handleNode('phone')}><rect x="50" y="100" width="160" height="56" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" /><text x="130" y="125" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Patient phone</text><text x="130" y="142" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#64748B">PSTN / SIP</text></g>
              <g className="arch-node" onClick={() => handleNode('web')}><rect x="50" y="180" width="160" height="56" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" /><text x="130" y="205" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Web / SMS</text><text x="130" y="222" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#64748B">HTTPS · TLS 1.3</text></g>

              {/* KITOGO nodes */}
              <g className="arch-node" onClick={() => handleNode('edge')}><rect x="300" y="100" width="160" height="56" rx="10" fill="white" stroke="#0B5FFF" strokeWidth="1.5" /><text x="380" y="125" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Voice gateway</text><text x="380" y="142" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#0B5FFF">SRTP · DTLS</text></g>
              <g className="arch-node" onClick={() => handleNode('api')}><rect x="300" y="180" width="160" height="56" rx="10" fill="white" stroke="#0B5FFF" strokeWidth="1.5" /><text x="380" y="205" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">API gateway</text><text x="380" y="222" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#0B5FFF">WAF · OAuth 2.1</text></g>
              <g className="arch-node" onClick={() => handleNode('core')}><rect x="500" y="140" width="160" height="76" rx="10" fill="url(#archBlue)" stroke="#052D7A" strokeWidth="1" /><text x="580" y="170" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="white">Triage core</text><text x="580" y="188" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#93C5FD">ASR · NLU · Protocol</text><text x="580" y="204" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#93C5FD">Tokenized PHI</text></g>
              <g className="arch-node" onClick={() => handleNode('vault')}><rect x="500" y="280" width="160" height="56" rx="10" fill="white" stroke="#0B5FFF" strokeWidth="1.5" /><text x="580" y="305" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">PHI vault</text><text x="580" y="322" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#0B5FFF">AES-256 · KMS</text></g>
              <g className="arch-node" onClick={() => handleNode('audit')}><rect x="500" y="360" width="160" height="56" rx="10" fill="white" stroke="#0B5FFF" strokeWidth="1.5" /><text x="580" y="385" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Audit log</text><text x="580" y="402" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#0B5FFF">7-yr retention</text></g>
              <g className="arch-node" onClick={() => handleNode('egress')}><rect x="700" y="180" width="100" height="76" rx="10" fill="white" stroke="#0B5FFF" strokeWidth="1.5" /><text x="750" y="210" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#0A1F44">Egress</text><text x="750" y="226" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="500" fill="#0A1F44">router</text><text x="750" y="244" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#0B5FFF">FHIR · HL7</text></g>

              {/* Customer nodes */}
              <g className="arch-node" onClick={() => handleNode('ehr')}><rect x="870" y="100" width="180" height="56" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" /><text x="960" y="125" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Your EHR</text><text x="960" y="142" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#64748B">Epic / Cerner / Athena</text></g>
              <g className="arch-node" onClick={() => handleNode('phone-system')}><rect x="870" y="180" width="180" height="56" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" /><text x="960" y="205" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Your phone system</text><text x="960" y="222" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#64748B">RingCentral / Twilio</text></g>
              <g className="arch-node" onClick={() => handleNode('dash')}><rect x="870" y="260" width="180" height="56" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" /><text x="960" y="285" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Staff dashboard</text><text x="960" y="302" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#64748B">SSO · MFA · RBAC</text></g>
              <g className="arch-node" onClick={() => handleNode('warehouse')}><rect x="870" y="340" width="180" height="56" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" /><text x="960" y="365" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#0A1F44">Your warehouse</text><text x="960" y="382" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#64748B">Snowflake / Databricks</text></g>

              {/* Flow lines */}
              <g stroke="#94A3B8" strokeWidth="1.5" fill="none">
                <path d="M 210 128 L 300 128" markerEnd="url(#archArrow)" />
                <path d="M 210 208 L 300 208" markerEnd="url(#archArrow)" />
                <path d="M 460 128 Q 480 130, 500 160" markerEnd="url(#archArrow)" />
                <path d="M 460 208 L 500 178" markerEnd="url(#archArrow)" />
                <path d="M 580 216 L 580 280" markerEnd="url(#archArrow)" />
                <path d="M 580 336 L 580 360" markerEnd="url(#archArrow)" />
                <path d="M 660 178 L 700 200" markerEnd="url(#archArrow)" />
                <path d="M 800 200 L 870 128" markerEnd="url(#archArrow)" />
                <path d="M 800 218 L 870 208" markerEnd="url(#archArrow)" />
                <path d="M 800 236 L 870 288" markerEnd="url(#archArrow)" />
                <path d="M 800 248 L 870 368" markerEnd="url(#archArrow)" />
              </g>
            </svg>
          </div>

          <div className="arch-legend">
            <div className="arch-legend-item"><span className="arch-legend-dot" style={{ background: '#0B5FFF' }} />KITOGO-managed (in our VPC)</div>
            <div className="arch-legend-item"><span className="arch-legend-dot" style={{ background: 'white', border: '1px solid #E2E8F0' }} />Customer-managed</div>
            <div className="arch-legend-item"><span className="arch-legend-dot" style={{ background: '#94A3B8' }} />Encrypted data flow</div>
          </div>

          <div className="arch-detail-panel">
            {detail ? (
              <>
                <h4>{detail.title}</h4>
                <p>{detail.desc}</p>
                <div className="arch-detail-tags">
                  {detail.tags.map(t => <span key={t} className="arch-detail-tag">{t}</span>)}
                </div>
              </>
            ) : (
              <>
                <h4>Click any node above to inspect it</h4>
                <p>Each box represents a discrete service with its own access controls, audit logging, and trust boundary. Data crossing any dashed line is encrypted, authenticated, and logged.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
