'use client';

import { useState } from 'react';

type Tab = 'live' | 'queue' | 'analytics' | 'protocols';

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [activeCall, setActiveCall] = useState(0);

  return (
    <section id="product" className="product-section">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">The dashboard your team lives in</span>
          <h2>One screen. <span className="serif">Total clarity.</span></h2>
          <p className="section-sub">Live calls, queue status, and analytics — all in real time. Click between tabs to explore.</p>
        </div>

        <div className="product-shell reveal">
          <div className="product-chrome">
            <div className="chrome-dots"><span /><span /><span /></div>
            <div className="chrome-url">app.kitogo.health / dashboard</div>
          </div>

          <div className="product-tabs">
            <button className={`ptab${activeTab === 'live' ? ' active' : ''}`} onClick={() => setActiveTab('live')}>
              <span className="ptab-pulse" />
              Live calls <span className="ptab-count">7</span>
            </button>
            {(['queue', 'analytics', 'protocols'] as Tab[]).map(t => (
              <button key={t} className={`ptab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="product-body">
            {/* LIVE TAB */}
            <div className={`ppanel${activeTab === 'live' ? ' active' : ''}`}>
              <div className="ppanel-grid">
                <div className="call-list">
                  {[
                    { init: 'JM', name: 'James Mwangi', detail: 'Chest pain · 4m 12s', esi: 2, bg: 'rgba(185,28,28,0.1)', color: 'var(--danger)' },
                    { init: 'AS', name: 'Aisha Saleh', detail: 'Migraine, recurring · 2m 04s', esi: 3, bg: 'rgba(217,119,6,0.1)', color: '#d97706' },
                    { init: 'DK', name: 'Dana Kim', detail: 'Routine follow-up · 1m 18s', esi: 4, bg: 'rgba(15,108,63,0.1)', color: 'var(--success)' },
                    { init: 'RP', name: 'Robert Patel', detail: 'Prescription refill · 0m 52s', esi: 5, bg: 'rgba(15,108,63,0.1)', color: 'var(--success)' },
                    { init: 'EC', name: 'Elena Cruz', detail: 'Persistent fever · 0m 31s', esi: 3, bg: 'rgba(217,119,6,0.1)', color: '#d97706' },
                  ].map((call, i) => (
                    <div
                      key={call.init}
                      className={`call-row${activeCall === i ? ' active' : ''}`}
                      onClick={() => setActiveCall(i)}
                    >
                      <div className="call-avatar" style={{ background: call.bg, color: call.color }}>{call.init}</div>
                      <div className="call-info">
                        <div className="call-name">{call.name}</div>
                        <div className="call-detail">{call.detail}</div>
                      </div>
                      <div className="acuity-pill" style={{ background: call.bg, color: call.color }}>ESI {call.esi}</div>
                    </div>
                  ))}
                </div>

                <div className="call-detail-pane">
                  <div className="cdp-header">
                    <div>
                      <div className="cdp-name">James Mwangi · 47M</div>
                      <div className="cdp-meta">Patient ID P-48291 · MRN linked · ED routing</div>
                    </div>
                    <div className="cdp-confidence">
                      <div className="cdp-conf-num">98.7%</div>
                      <div className="cdp-conf-label">confidence</div>
                    </div>
                  </div>
                  <div className="cdp-section">
                    <div className="cdp-section-title">Live transcript</div>
                    <div className="cdp-transcript">
                      <div className="trans-line"><b className="patient-tag">Patient</b> &quot;It started about an hour ago, in my chest…&quot;</div>
                      <div className="trans-line"><b className="agent-tag">Agent</b> &quot;Does the pain radiate to your arm or jaw?&quot;</div>
                      <div className="trans-line"><b className="patient-tag">Patient</b> &quot;Yes, my left arm feels heavy.&quot;</div>
                      <div className="trans-line agent-line"><b className="agent-tag">Agent</b> Escalating to live nurse…</div>
                    </div>
                  </div>
                  <div className="cdp-section">
                    <div className="cdp-section-title">Detected red flags</div>
                    <div className="redflag-list">
                      <span className="redflag">⚠ Chest pain &gt; 30min</span>
                      <span className="redflag">⚠ Radiation to arm</span>
                      <span className="redflag">⚠ Age 45+ male</span>
                    </div>
                  </div>
                  <div className="cdp-actions">
                    <button className="cdp-btn primary">Join call</button>
                    <button className="cdp-btn">Send to ED</button>
                    <button className="cdp-btn">View summary</button>
                  </div>
                </div>
              </div>
            </div>

            {/* QUEUE TAB */}
            <div className={`ppanel${activeTab === 'queue' ? ' active' : ''}`}>
              <div className="queue-stats">
                {[{ num: '14', label: 'In queue' }, { num: '2m 31s', label: 'Avg wait' }, { num: '38s', label: 'Avg routing' }, { num: '0', label: 'Abandoned' }].map(s => (
                  <div key={s.label} className="qstat"><div className="qstat-num">{s.num}</div><div className="qstat-label">{s.label}</div></div>
                ))}
              </div>
              <div className="queue-table">
                <div className="qrow qhead"><span>Position</span><span>Patient</span><span>Concern</span><span>Wait</span><span>Acuity</span></div>
                {[
                  { pos: 1, name: 'M. Tanaka', concern: 'Abdominal pain', wait: '0:42', esi: 2, cls: 'p2' },
                  { pos: 2, name: 'L. Brown', concern: 'Med refill', wait: '1:08', esi: 5, cls: 'p5' },
                  { pos: 3, name: 'S. Okafor', concern: 'Rash spreading', wait: '1:24', esi: 3, cls: 'p3' },
                  { pos: 4, name: 'K. Müller', concern: 'Pre-op questions', wait: '2:01', esi: 4, cls: 'p4' },
                  { pos: 5, name: 'P. Hassan', concern: 'Sore throat, fever', wait: '2:35', esi: 3, cls: 'p3' },
                ].map(r => (
                  <div key={r.pos} className="qrow">
                    <span>{r.pos}</span><span>{r.name}</span><span>{r.concern}</span><span>{r.wait}</span>
                    <span className={`qpill ${r.cls}`}>ESI {r.esi}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ANALYTICS TAB */}
            <div className={`ppanel${activeTab === 'analytics' ? ' active' : ''}`}>
              <div className="analytics-grid">
                <div className="achart-card big">
                  <div className="achart-title">Calls handled · last 24h</div>
                  <div className="achart-big">2,847</div>
                  <div className="achart-sub" style={{ color: 'var(--success)' }}>↑ 18% vs yesterday</div>
                  <svg className="achart-spark" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0066ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0,80 L 30,70 L 60,75 L 90,55 L 120,60 L 150,40 L 180,50 L 210,30 L 240,35 L 270,25 L 300,20 L 330,28 L 360,15 L 400,22 L 400,100 L 0,100 Z" fill="url(#sparkGrad)" />
                    <path d="M 0,80 L 30,70 L 60,75 L 90,55 L 120,60 L 150,40 L 180,50 L 210,30 L 240,35 L 270,25 L 300,20 L 330,28 L 360,15 L 400,22" fill="none" stroke="#0066ff" strokeWidth="2" />
                  </svg>
                </div>
                {[
                  { title: 'Avg handle time', num: '3:14', sub: '↓ 42% vs Q3', subColor: 'var(--success)' },
                  { title: 'Escalations to nurse', num: '11.3%', sub: 'within target band', subColor: undefined },
                  { title: 'Patient satisfaction', num: '4.8', sub: 'based on 1,284 surveys', subColor: undefined },
                  { title: 'EHR sync rate', num: '99.94%', sub: 'all systems healthy', subColor: 'var(--success)' },
                ].map(c => (
                  <div key={c.title} className="achart-card">
                    <div className="achart-title">{c.title}</div>
                    <div className="achart-num">{c.num}</div>
                    <div className="achart-sub" style={c.subColor ? { color: c.subColor } : undefined}>{c.sub}</div>
                  </div>
                ))}
                <div className="achart-card">
                  <div className="achart-title">Acuity distribution</div>
                  <div className="acuity-bar">
                    {[{ w: '4%', cls: 'p1' }, { w: '12%', cls: 'p2' }, { w: '28%', cls: 'p3' }, { w: '36%', cls: 'p4' }, { w: '20%', cls: 'p5' }].map(b => (
                      <div key={b.cls} className={`abar ${b.cls}`} style={{ width: b.w }} />
                    ))}
                  </div>
                  <div className="acuity-legend">
                    {[1, 2, 3, 4, 5].map(n => <span key={n}><i className={`dot p${n}`} />{n}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* PROTOCOLS TAB */}
            <div className={`ppanel${activeTab === 'protocols' ? ' active' : ''}`}>
              <div className="protocol-list">
                {[
                  { name: 'Emergency Severity Index (ESI)', desc: '5-level acuity for ED · v4 standard', stats: '14,820 calls routed · 98.2% adherence', active: true },
                  { name: 'Manchester Triage System', desc: 'Symptom flowcharts · UK/EU standard', stats: '3,421 calls routed · 97.6% adherence', active: true },
                  { name: 'Custom · Pediatric Urgent Care', desc: 'Built with Mercy Regional clinical team', stats: '892 calls routed · 99.1% adherence', active: true },
                  { name: 'Custom · Post-op Follow-up', desc: 'Draft · awaiting clinical sign-off', stats: 'Pilot ready · 23 test scenarios', active: false },
                ].map(p => (
                  <div key={p.name} className="proto-card">
                    <div className="proto-head">
                      <div>
                        <div className="proto-name">{p.name}</div>
                        <div className="proto-desc">{p.desc}</div>
                      </div>
                      <span className={`proto-status${p.active ? ' active' : ''}`}>{p.active ? '● Active' : '○ Draft'}</span>
                    </div>
                    <div className="proto-stats">
                      {p.stats.split(' · ').map((s, i, arr) => (
                        <span key={i}>{s}{i < arr.length - 1 ? <>&nbsp;·&nbsp;</> : null}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
