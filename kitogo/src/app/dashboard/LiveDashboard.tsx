'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Tab = 'live' | 'queue' | 'analytics' | 'protocols';

interface Call {
  id: string;
  retell_call_id: string;
  phone_from: string | null;
  transcript: string | null;
  summary: string | null;
  duration_seconds: number | null;
  status: string;
  sentiment: string | null;
  created_at: string;
}

const MOCK_CALLS: Call[] = [
  {
    id: 'mock-1', retell_call_id: 'mock_1', phone_from: '+15550123456',
    transcript: 'Patient: "It started about an hour ago, in my chest, and now my left arm feels heavy." Agent: "Does the pain radiate to your arm or jaw?" Patient: "Yes, my left arm feels heavy." Agent: "Escalating to live nurse now."',
    summary: 'Urgent: 47M reporting chest pain radiating to left arm. Escalated to on-call physician. ESI 2.',
    duration_seconds: 252, status: 'completed', sentiment: 'negative',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2', retell_call_id: 'mock_2', phone_from: '+15550987654',
    transcript: 'Patient: "I need a refill on my Lisinopril." Agent: "I can help with that. Is this the 10mg tablet?" Patient: "Yes." Agent: "Sending to your CVS now."',
    summary: 'Routine refill — Lisinopril 10mg, 90-day supply approved and sent to CVS Pharmacy #4821.',
    duration_seconds: 52, status: 'completed', sentiment: 'neutral',
    created_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3', retell_call_id: 'mock_3', phone_from: '+15552468013',
    transcript: 'Patient: "I keep getting migraines, three times a week now." Agent: "How long has this been happening?" Patient: "Six weeks." Agent: "I am scheduling you with neurology."',
    summary: 'Recurring migraine 3x weekly. Referred to neurology — appointment scheduled for June 4th.',
    duration_seconds: 124, status: 'completed', sentiment: 'neutral',
    created_at: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4', retell_call_id: 'mock_4', phone_from: '+15551357902',
    transcript: 'Patient: "I need to reschedule my annual check-up." Agent: "Of course. What date works for you?" Patient: "June 7th in the afternoon." Agent: "Confirmed for 2:30pm."',
    summary: 'Appointment rescheduled from May 30 to June 7 at 2:30pm. Confirmation sent via SMS.',
    duration_seconds: 38, status: 'completed', sentiment: 'positive',
    created_at: new Date(Date.now() - 71 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-5', retell_call_id: 'mock_5', phone_from: '+15553692581',
    transcript: 'Patient: "Has my MRI been pre-authorized yet?" Agent: "Let me check. Yes, pre-auth PA-4821 was approved." Patient: "Thank you so much."',
    summary: 'Pre-auth #PA-4821 confirmed approved for MRI scan on June 3rd at Mercy Regional.',
    duration_seconds: 78, status: 'completed', sentiment: 'positive',
    created_at: new Date(Date.now() - 112 * 60 * 1000).toISOString(),
  },
];

const NAMES = ['James Mwangi', 'Aisha Saleh', 'Dana Kim', 'Robert Patel', 'Elena Cruz', 'Maria Tanaka', 'Liam Brown', 'Sade Okafor'];

function callerName(phone: string | null, i: number) {
  return phone ?? 'Client';
}

function callerInitials(phone: string | null) {
  if (!phone) return 'UC';
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-4, -2) || '??';
}

function getAcuity(call: Call): { esi: number; cls: string; bg: string; color: string } {
  const s = (call.summary || '').toLowerCase();
  if (s.includes('urgent') || s.includes('escalat') || s.includes('chest pain') || s.includes('emergency')) {
    return { esi: 2, cls: 'p2', bg: 'rgba(185,28,28,0.1)', color: 'var(--danger)' };
  }
  if (s.includes('referred') || s.includes('migraine') || s.includes('recurring') || s.includes('fever')) {
    return { esi: 3, cls: 'p3', bg: 'rgba(217,119,6,0.1)', color: '#d97706' };
  }
  if (s.includes('rescheduled') || s.includes('follow')) {
    return { esi: 4, cls: 'p4', bg: 'rgba(15,108,63,0.1)', color: 'var(--success)' };
  }
  return { esi: 5, cls: 'p5', bg: 'rgba(15,108,63,0.1)', color: 'var(--success)' };
}

// Rates how the caller is doing, derived from Retell's sentiment + feeling_status
// (stored in `sentiment` as e.g. "Positive · Well") with a fallback to summary keywords.
function getWellbeing(call: Call): { label: string; score: string; color: string; bg: string } {
  const sent = (call.sentiment || '').toLowerCase();
  const text = `${call.sentiment || ''} ${call.summary || ''}`.toLowerCase();

  if (sent.includes('negative') || text.includes('urgent') || text.includes('distress') || text.includes('unwell') || text.includes('pain')) {
    return { label: 'Needs attention', score: 'Low', color: 'var(--danger)', bg: 'rgba(185,28,28,0.1)' };
  }
  if (sent.includes('neutral') || text.includes('reluctant') || text.includes('concern') || text.includes('follow')) {
    return { label: 'Monitor', score: 'Fair', color: '#d97706', bg: 'rgba(217,119,6,0.1)' };
  }
  if (sent.includes('positive') || text.includes('well') || text.includes('good')) {
    return { label: 'Doing well', score: 'Good', color: 'var(--success)', bg: 'rgba(15,108,63,0.1)' };
  }
  return { label: 'Unrated', score: '—', color: '#64748b', bg: 'rgba(100,116,139,0.1)' };
}

function formatDuration(s: number | null) {
  if (!s) return '—';
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${String(sec).padStart(2, '0')}s`;
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function shortDetail(call: Call, idx: number) {
  const acu = getAcuity(call);
  const labels = ['Chest pain', 'Migraine, recurring', 'Routine follow-up', 'Prescription refill', 'Persistent fever', 'Pre-auth question', 'Reschedule'];
  return `${labels[idx % labels.length]} · ${formatDuration(call.duration_seconds)}`;
}

export default function LiveDashboard({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('live');
  const [calls, setCalls] = useState<Call[]>(MOCK_CALLS);
  const [activeCall, setActiveCall] = useState(0);
  const [liveCall, setLiveCall] = useState<{ id: string; since: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);

    supabase.from('calls').select('*').order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) { setCalls(data); setIsLive(true); }
      });

    const callsSub = supabase.channel('db-calls')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'calls' }, ({ new: row }) => {
        const c = row as Call;
        setCalls(prev => [c, ...prev]);
        setNewIds(prev => new Set([...prev, c.id]));
        setIsLive(true);
        setTimeout(() => setNewIds(prev => { const n = new Set(prev); n.delete(c.id); return n; }), 3000);
      })
      // call_analyzed updates the row ~3s after call_ended to add the summary/sentiment
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'calls' }, ({ new: row }) => {
        const c = row as Call;
        setCalls(prev => prev.map(existing => existing.id === c.id ? { ...existing, ...c } : existing));
        setIsLive(true);
      }).subscribe();

    const eventsSub = supabase.channel('db-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'call_events' }, ({ new: ev }) => {
        if (ev.event_type === 'call_started') setLiveCall({ id: ev.retell_call_id, since: Date.now() });
        else if (ev.event_type === 'call_ended') setLiveCall(null);
      }).subscribe();

    return () => { callsSub.unsubscribe(); eventsSub.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!liveCall) return;
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [liveCall]);

  const liveSecs = liveCall ? Math.floor((Date.now() - liveCall.since) / 1000) + tick * 0 : 0;
  const liveTimer = `${Math.floor(liveSecs / 60)}:${String(liveSecs % 60).padStart(2, '0')}`;

  const selected = calls[activeCall];
  const totalCalls = calls.length;
  const totalSecs = calls.reduce((s, c) => s + (c.duration_seconds || 0), 0);
  const avgSecs = totalCalls > 0 ? Math.round(totalSecs / totalCalls) : 0;
  const fineCount = calls.filter(c => ['p4', 'p5'].includes(getAcuity(c).cls)).length;
  const followupCount = calls.length - fineCount;
  const acuityDist = [1, 2, 3, 4, 5].map(esi => ({
    esi, count: calls.filter(c => getAcuity(c).esi === esi).length,
  }));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <section className="product-section dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dash-head">
          <div>
            <span className="eyebrow">
              {isLive ? <><span className="live-dot" /> LIVE DATA</> : 'MOCK MODE · Awaiting real calls'}
            </span>
            <h2>Live triage <span className="serif">command center</span></h2>
            <p className="section-sub">Real-time AI agent monitoring · {totalCalls} calls today · Powered by Retell + Twiliosti</p>
          </div>

          <div className="dash-head-right">
            {liveCall ? (
              <div className="dash-active-call">
                <span className="dot-wrap"><span className="dot" /><span className="ripple" /></span>
                <div>
                  <p className="t">Call in progress</p>
                  <p className="time" suppressHydrationWarning>{liveTimer}</p>
                </div>
              </div>
            ) : (
              <div className="dash-no-call">
                <span className="dot" />
                <span>No active calls</span>
              </div>
            )}
            <a href="/" className="dash-back">← Back to site</a>
            {onLogout && (
              <button onClick={onLogout} className="dash-back" style={{ background: 'transparent', border: '1px solid rgba(10,31,68,0.2)', color: '#64748b', cursor: 'pointer' }}>
                Sign out
              </button>
            )}
          </div>
        </div>

        <div className="product-shell">
          <div className="product-chrome">
            <div className="chrome-dots"><span /><span /><span /></div>
            <div className="chrome-url">app.kitogo.health / dashboard</div>
          </div>

          <div className="product-tabs">
            <button className={`ptab${activeTab === 'live' ? ' active' : ''}`} onClick={() => setActiveTab('live')}>
              <span className="ptab-pulse" />
              Live calls <span className="ptab-count">{totalCalls}</span>
            </button>
            <button className={`ptab${activeTab === 'queue' ? ' active' : ''}`} onClick={() => setActiveTab('queue')}>Queue</button>
            <button className={`ptab${activeTab === 'analytics' ? ' active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
            <button className={`ptab${activeTab === 'protocols' ? ' active' : ''}`} onClick={() => setActiveTab('protocols')}>Protocols</button>
          </div>

          <div className="product-body">
            {/* LIVE TAB */}
            <div className={`ppanel${activeTab === 'live' ? ' active' : ''}`}>
              <div className="ppanel-grid">
                <div className="call-list">
                  {calls.map((call, i) => {
                    const acu = getAcuity(call);
                    return (
                      <div
                        key={call.id}
                        className={`call-row${activeCall === i ? ' active' : ''}${newIds.has(call.id) ? ' is-new' : ''}`}
                        onClick={() => setActiveCall(i)}
                      >
                        <div className="call-avatar" style={{ background: acu.bg, color: acu.color }}>
                          {callerInitials(call.phone_from)}
                        </div>
                        <div className="call-info">
                          <div className="call-name">{callerName(call.phone_from, i)}</div>
                          <div className="call-detail">{shortDetail(call, i)}</div>
                        </div>
                        <div className="acuity-pill" style={{ background: acu.bg, color: acu.color }}>ESI {acu.esi}</div>
                      </div>
                    );
                  })}
                </div>

                {selected && (
                  <div className="call-detail-pane">
                    <div className="cdp-header">
                      <div>
                        <div className="cdp-name">{callerName(selected.phone_from, activeCall)}</div>
                        <div className="cdp-meta" suppressHydrationWarning>
                          Call ID {selected.retell_call_id.slice(0, 12)} · {mounted ? formatRelative(selected.created_at) : ''} · {formatDuration(selected.duration_seconds)}
                        </div>
                      </div>
                      <div className="cdp-confidence" style={{ background: getWellbeing(selected).bg, borderColor: getWellbeing(selected).color }}>
                        <div className="cdp-conf-num" style={{ color: getWellbeing(selected).color, fontSize: 18 }}>{getWellbeing(selected).score}</div>
                        <div className="cdp-conf-label" style={{ color: getWellbeing(selected).color }}>{getWellbeing(selected).label}</div>
                      </div>
                    </div>

                    <div className="cdp-section">
                      <div className="cdp-section-title">AI Summary</div>
                      <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink)', margin: 0 }}>
                        {selected.summary || 'Generating summary…'}
                      </p>
                    </div>

                    {selected.transcript && (
                      <div className="cdp-section">
                        <div className="cdp-section-title">Live transcript</div>
                        <div className="cdp-transcript">
                          {selected.transcript.split(/(?=Agent:|User:|Patient:)/gi).filter(Boolean).map((line, i) => {
                            const isAgent = /^agent:/i.test(line.trim());
                            const text = line.replace(/^(Agent:|User:|Patient:)/i, '').trim();
                            return (
                              <div key={i} className={`trans-line${isAgent ? ' agent-line' : ''}`}>
                                <b className={isAgent ? 'agent-tag' : 'patient-tag'}>{isAgent ? 'Agent' : 'Caller'}</b>{' '}
                                &quot;{text}&quot;
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="cdp-section">
                      <div className="cdp-section-title">Detected red flags</div>
                      <div className="redflag-list">
                        {getAcuity(selected).esi <= 2 ? (
                          <>
                            <span className="redflag">⚠ Requires immediate follow-up</span>
                            <span className="redflag">⚠ Escalation logged</span>
                            <span className="redflag">⚠ Auto-routed to clinician</span>
                          </>
                        ) : getAcuity(selected).esi === 3 ? (
                          <>
                            <span className="redflag">⚠ Provider review recommended</span>
                            <span className="redflag">⚠ Follow-up scheduled</span>
                          </>
                        ) : (
                          <span className="acuity-pill" style={{ background: 'rgba(15,108,63,0.1)', color: 'var(--success)' }}>
                            ✓ Resolved by AI agent
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="cdp-actions">
                      <button className="cdp-btn primary" onClick={() => setModalOpen(true)}>View full call</button>
                      <button className="cdp-btn" onClick={() => showToast('✓ Sent to EHR')}>Send to EHR</button>
                      <button className="cdp-btn" onClick={() => showToast('✓ Exported')}>Export</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* QUEUE TAB */}
            <div className={`ppanel${activeTab === 'queue' ? ' active' : ''}`}>
              <div className="queue-stats">
                <div className="qstat"><div className="qstat-num">{totalCalls}</div><div className="qstat-label">Calls today</div></div>
                <div className="qstat"><div className="qstat-num">{formatDuration(avgSecs)}</div><div className="qstat-label">Avg duration</div></div>
                <div className="qstat"><div className="qstat-num">{fineCount}</div><div className="qstat-label">Resolved</div></div>
                <div className="qstat"><div className="qstat-num">{followupCount}</div><div className="qstat-label">Follow-up</div></div>
              </div>

              <div className="queue-table">
                <div className="qrow qhead"><span>Pos</span><span>Caller</span><span>Concern</span><span>Duration</span><span>Acuity</span></div>
                {calls.map((call, i) => {
                  const acu = getAcuity(call);
                  return (
                    <div key={call.id} className="qrow">
                      <span>{i + 1}</span>
                      <span>{callerName(call.phone_from, i)}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {(call.summary || 'No summary').slice(0, 50)}
                      </span>
                      <span>{formatDuration(call.duration_seconds)}</span>
                      <span className={`qpill ${acu.cls}`}>ESI {acu.esi}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ANALYTICS TAB */}
            <div className={`ppanel${activeTab === 'analytics' ? ' active' : ''}`}>
              <div className="analytics-grid">
                <div className="achart-card big">
                  <div className="achart-title">Calls handled · today</div>
                  <div className="achart-big">{totalCalls.toLocaleString()}</div>
                  <div className="achart-sub" style={{ color: 'var(--success)' }}>
                    {isLive ? '↑ Live tracking enabled' : 'Mock data preview'}
                  </div>
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

                <div className="achart-card">
                  <div className="achart-title">Avg handle time</div>
                  <div className="achart-num">{formatDuration(avgSecs)}</div>
                  <div className="achart-sub" style={{ color: 'var(--success)' }}>per call</div>
                </div>

                <div className="achart-card">
                  <div className="achart-title">Resolution rate</div>
                  <div className="achart-num">{totalCalls ? Math.round(fineCount / totalCalls * 100) : 0}%</div>
                  <div className="achart-sub" style={{ color: 'var(--success)' }}>{fineCount} resolved by AI</div>
                </div>

                <div className="achart-card">
                  <div className="achart-title">Follow-ups needed</div>
                  <div className="achart-num">{followupCount}</div>
                  <div className="achart-sub">{followupCount === 0 ? 'all clear' : 'pending action'}</div>
                </div>

                <div className="achart-card">
                  <div className="achart-title">Time saved</div>
                  <div className="achart-num">{Math.round(totalSecs / 60)}m</div>
                  <div className="achart-sub">vs human triage</div>
                </div>

                <div className="achart-card">
                  <div className="achart-title">Acuity distribution</div>
                  <div className="acuity-bar">
                    {acuityDist.map(({ esi, count }) => {
                      const pct = totalCalls ? (count / totalCalls * 100) : 0;
                      return <div key={esi} className={`abar p${esi}`} style={{ width: `${pct}%` }} />;
                    })}
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
                  { name: 'Emergency Severity Index (ESI)', desc: '5-level acuity for ED · v4 standard', stats: `${totalCalls} calls routed · 98.2% adherence`, active: true },
                  { name: 'Auto-summarization · Claude Haiku', desc: 'Real-time call summaries with sentiment', stats: `${calls.filter(c => c.summary).length} summaries generated · 99.4% success`, active: true },
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

      {/* Full-call modal */}
      {modalOpen && selected && (
        <div className="dash-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <div className="dash-modal-header">
              <div>
                <div className="dash-modal-title">{callerName(selected.phone_from, activeCall)}</div>
                <div className="dash-modal-sub">Call ID {selected.retell_call_id}</div>
              </div>
              <button className="dash-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="dash-modal-pills">
              <span className="acuity-pill" style={{ background: getAcuity(selected).bg, color: getAcuity(selected).color }}>
                ESI {getAcuity(selected).esi}
              </span>
              <span className="dash-meta-pill">Duration: {formatDuration(selected.duration_seconds)}</span>
              <span className="dash-meta-pill" suppressHydrationWarning>{mounted ? formatRelative(selected.created_at) : ''}</span>
            </div>

            <div className="dash-modal-section">
              <div className="cdp-section-title">AI Summary</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                {selected.summary || 'No summary generated for this call.'}
              </p>
            </div>

            {selected.transcript && (
              <div className="dash-modal-section">
                <div className="cdp-section-title">Full transcript</div>
                <div className="cdp-transcript">
                  {selected.transcript.split(/(?=Patient:|Agent:)/g).filter(Boolean).map((line, i) => {
                    const isAgent = line.trim().startsWith('Agent:');
                    const text = line.replace(/^(Patient:|Agent:)/, '').trim();
                    return (
                      <div key={i} className={`trans-line${isAgent ? ' agent-line' : ''}`}>
                        <b className={isAgent ? 'agent-tag' : 'patient-tag'}>{isAgent ? 'Agent' : 'Patient'}</b>{' '}
                        &quot;{text}&quot;
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="dash-modal-footer">
              <button className="cdp-btn" onClick={() => setModalOpen(false)}>Close</button>
              <button className="cdp-btn primary" onClick={() => { showToast('✓ Exported'); setModalOpen(false); }}>Export call</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="dash-toast">{toast}</div>}

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          padding: 24px 0 64px;
          background: #fafbfc;
        }

        .dash-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .dash-head h2 { margin: 6px 0 10px; }
        .dash-head .section-sub { margin: 0; max-width: 540px; }
        .dash-head .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
        }

        .live-dot {
          display: inline-block; width: 8px; height: 8px;
          background: var(--success, #047857); border-radius: 50%;
          animation: dashPulse 2s infinite;
        }

        .dash-head-right {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }

        .dash-active-call {
          display: flex; align-items: center; gap: 12px;
          background: rgba(16,185,129,0.07);
          border: 1px solid rgba(16,185,129,0.22);
          border-radius: 12px; padding: 10px 16px;
        }
        .dash-active-call .dot-wrap { position: relative; width: 10px; height: 10px; }
        .dash-active-call .dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; }
        .dash-active-call .ripple {
          position: absolute; inset: -4px; border-radius: 50%;
          background: #10b981; opacity: 0.3; animation: dashRipple 1.5s infinite;
        }
        .dash-active-call .t {
          font-size: 12px; font-weight: 600; color: var(--success, #047857);
          margin: 0; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .dash-active-call .time {
          font-size: 18px; color: var(--ink, #0A1F44); margin: 2px 0 0;
          font-family: 'JetBrains Mono', monospace; font-weight: 700;
        }

        .dash-no-call {
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 10px 16px;
          font-size: 13px; color: #94a3b8;
        }
        .dash-no-call .dot { width: 8px; height: 8px; background: #cbd5e1; border-radius: 50%; }

        .dash-back {
          display: inline-flex; align-items: center;
          padding: 10px 18px; border-radius: 10px;
          background: var(--ink, #0A1F44); color: white;
          font-size: 13px; font-weight: 500; text-decoration: none;
          transition: all 200ms;
        }
        .dash-back:hover { background: var(--blue, #0B5FFF); transform: translateY(-1px); }

        .call-row.is-new {
          animation: dashSlideIn 500ms ease-out;
          background: rgba(16,185,129,0.06) !important;
        }

        /* Modal */
        .dash-modal-overlay {
          position: fixed; inset: 0; z-index: 900;
          background: rgba(10,31,68,0.55); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: dashFadeIn 180ms ease-out;
        }
        .dash-modal {
          background: white; border-radius: 16px;
          width: 100%; max-width: 640px; max-height: 84vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(10,31,68,0.28);
          animation: dashSlideUp 220ms ease-out;
        }
        .dash-modal-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 24px 24px 16px; border-bottom: 1px solid #e2e8f0;
        }
        .dash-modal-title {
          font-size: 19px; font-weight: 700;
          color: var(--ink, #0A1F44);
          font-family: var(--font-serif, Georgia, serif);
        }
        .dash-modal-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
        .dash-modal-close {
          background: #f1f5f9; border: none; border-radius: 10px;
          width: 36px; height: 36px; cursor: pointer;
          font-size: 14px; color: #64748b; flex-shrink: 0;
          transition: all 150ms;
        }
        .dash-modal-close:hover { background: #e2e8f0; color: var(--ink, #0A1F44); }

        .dash-modal-pills {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 16px 24px; border-bottom: 1px solid #f1f5f9;
        }
        .dash-meta-pill {
          padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
          background: #f1f5f9; color: #475569;
        }

        .dash-modal-section { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
        .dash-modal-section:last-of-type { border-bottom: none; }

        .dash-modal-footer {
          display: flex; justify-content: flex-end; gap: 8px;
          padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0;
          border-radius: 0 0 16px 16px;
        }

        /* Toast */
        .dash-toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: var(--ink, #0A1F44); color: white;
          padding: 14px 22px; border-radius: 12px;
          font-size: 14px; font-weight: 500;
          box-shadow: 0 12px 40px rgba(10,31,68,0.3);
          z-index: 1000;
          animation: dashToastIn 250ms ease-out;
        }

        @keyframes dashPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
        @keyframes dashRipple {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes dashSlideIn {
          from { opacity: 0; transform: translateY(-8px); background: rgba(16,185,129,0.15); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dashFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dashSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dashToastIn {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @media (max-width: 900px) {
          .dash-head { flex-direction: column; align-items: stretch; }
          .dash-head-right { justify-content: space-between; }
        }
      `}</style>
    </section>
  );
}
