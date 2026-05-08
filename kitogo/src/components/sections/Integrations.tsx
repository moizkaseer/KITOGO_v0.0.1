'use client';

import { useState } from 'react';

type Cat = 'all' | 'ehr' | 'phone' | 'schedule' | 'identity' | 'data';

const integrations = [
  { mark: 'E', name: 'Epic', cat: 'ehr', label: 'EHR', bg: '#7B2CBF' },
  { mark: 'C', name: 'Cerner', cat: 'ehr', label: 'EHR', bg: '#0066CC' },
  { mark: 'a', name: 'athenahealth', cat: 'ehr', label: 'EHR', bg: '#7B0F2B' },
  { mark: 'A', name: 'Allscripts', cat: 'ehr', label: 'EHR', bg: '#00838F' },
  { mark: 'e', name: 'eClinicalWorks', cat: 'ehr', label: 'EHR', bg: '#FF6B35' },
  { mark: 'N', name: 'NextGen', cat: 'ehr', label: 'EHR', bg: '#1E40AF' },
  { mark: 'M', name: 'MEDITECH', cat: 'ehr', label: 'EHR', bg: '#0F766E' },
  { mark: 'G', name: 'Greenway', cat: 'ehr', label: 'EHR', bg: '#B91C1C' },
  { mark: 'T', name: 'Twilio', cat: 'phone', label: 'Voice', bg: '#F22F46' },
  { mark: 'R', name: 'RingCentral', cat: 'phone', label: 'Voice', bg: '#FF6900' },
  { mark: 'N', name: 'Nextiva', cat: 'phone', label: 'Voice', bg: '#06A189' },
  { mark: 'G', name: 'Genesys', cat: 'phone', label: 'Contact center', bg: '#5DADE2' },
  { mark: 'A', name: 'Acuity', cat: 'schedule', label: 'Scheduling', bg: '#0061FF' },
  { mark: 'C', name: 'Calendly', cat: 'schedule', label: 'Scheduling', bg: '#1A73E8' },
  { mark: 'Q', name: 'Qgenda', cat: 'schedule', label: 'Scheduling', bg: '#5C2D91' },
  { mark: 'M', name: 'MS Bookings', cat: 'schedule', label: 'Scheduling', bg: '#0078D4' },
  { mark: 'O', name: 'Okta', cat: 'identity', label: 'SSO / SCIM', bg: '#000000' },
  { mark: 'A', name: 'Azure AD', cat: 'identity', label: 'SSO / SCIM', bg: '#0078D4' },
  { mark: 'D', name: 'Duo', cat: 'identity', label: 'MFA', bg: '#326CE5' },
  { mark: 'P', name: 'Ping Identity', cat: 'identity', label: 'SSO', bg: '#5B5FC7' },
  { mark: 'S', name: 'Snowflake', cat: 'data', label: 'Warehouse', bg: '#FF4F00' },
  { mark: 'D', name: 'Databricks', cat: 'data', label: 'Warehouse', bg: '#FF3621' },
  { mark: 'F', name: 'FHIR API', cat: 'data', label: 'Standard', bg: '#1E1E1E' },
  { mark: 'H', name: 'HL7 v2', cat: 'data', label: 'Standard', bg: '#0EA5E9' },
];

const tabs: { label: string; value: Cat }[] = [
  { label: 'All', value: 'all' },
  { label: 'EHR / EMR', value: 'ehr' },
  { label: 'Telephony', value: 'phone' },
  { label: 'Scheduling', value: 'schedule' },
  { label: 'Identity', value: 'identity' },
  { label: 'Data', value: 'data' },
];

export default function Integrations() {
  const [activeTab, setActiveTab] = useState<Cat>('all');

  const visible = activeTab === 'all'
    ? integrations
    : integrations.filter(i => i.cat === activeTab);

  return (
    <section id="integrations" className="integrations-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Integrations</span>
          <h2>Plays nicely with <span className="serif">everything</span> you already run.</h2>
          <p>
            Direct integrations with the EHRs, scheduling tools, telephony platforms, and identity
            providers your clinical and IT teams depend on. Two-week setup, no rip-and-replace.
          </p>
        </div>

        <div className="integrations-tabs reveal">
          {tabs.map(t => (
            <button
              key={t.value}
              className={`integrations-tab${activeTab === t.value ? ' active' : ''}`}
              onClick={() => setActiveTab(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="integrations-cloud reveal">
          {visible.map(int => (
            <div key={int.name + int.cat} className="integration-card">
              <div className="logo-mark" style={{ background: int.bg }}>{int.mark}</div>
              <div className="logo-name">{int.name}</div>
              <div className="logo-cat">{int.label}</div>
            </div>
          ))}
        </div>

        <div className="integration-meta reveal">
          {[
            { num: '42+', lbl: 'Direct integrations' },
            { num: '2 wks', lbl: 'Average setup time' },
            { num: 'FHIR R4', lbl: 'Native standard support' },
            { num: 'REST + Webhook', lbl: 'Custom systems' },
          ].map(({ num, lbl }) => (
            <div key={lbl} className="integration-meta-item">
              <div className="num">{num}</div>
              <div className="lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
