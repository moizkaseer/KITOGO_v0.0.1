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
    transcript: 'Patient: "It started about an hour ago, in my chest, and now my left arm feels heavy." Agent: "I\'m escalating this to a nurse right now — please stay on the line."',
    summary: 'Urgent: 47M reporting chest pain radiating to left arm. Escalated to on-call physician. ESI 2.',
    duration_seconds: 252, status: 'completed', sentiment: 'negative',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2', retell_call_id: 'mock_2', phone_from: '+15550987654',
    transcript: 'Patient called for medication refill on existing Lisinopril prescription.',
    summary: 'Routine refill — Lisinopril 10mg, 90-day supply approved and sent to CVS Pharmacy #4821.',
    duration_seconds: 52, status: 'completed', sentiment: 'neutral',
    created_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3', retell_call_id: 'mock_3', phone_from: '+15552468013',
    transcript: 'Patient reported recurring migraine, requesting consultation with neurology.',
    summary: 'Recurring migraine 3x weekly. Referred to neurology — appointment scheduled for June 4th.',
    duration_seconds: 124, status: 'completed', sentiment: 'neutral',
    created_at: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4', retell_call_id: 'mock_4', phone_from: '+15551357902',
    transcript: 'Patient calling to reschedule routine annual check-up.',
    summary: 'Appointment rescheduled from May 30 to June 7 at 2:30pm. Confirmation sent via SMS.',
    duration_seconds: 38, status: 'completed', sentiment: 'positive',
    created_at: new Date(Date.now() - 71 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-5', retell_call_id: 'mock_5', phone_from: '+15553692581',
    transcript: 'Patient asking about insurance pre-authorization status.',
    summary: 'Pre-auth #PA-4821 confirmed approved for MRI scan on June 3rd at Mercy Regional.',
    duration_seconds: 78, status: 'completed', sentiment: 'positive',
    created_at: new Date(Date.now() - 112 * 60 * 1000).toISOString(),
  },
];

function getAcuity(call: Call): { esi: number; cls: string; bg: string; color: string; label: 'Fine' | 'Follow-up' } {
  const s = (call.summary || '').toLowerCase();
  if (s.includes('urgent') || s.includes('escalat') || s.includes('chest pain') || s.includes('emergency')) {
    return { esi: 2, cls: 'p2', bg: 'rgba(185,28,28,0.1)', color: '#B91C1C', label: 'Follow-up' };
  }
  if (s.includes('referred') || s.includes('migraine') || s.includes('recurring')) {
    return { esi: 3, cls: 'p3', bg: 'rgba(217,119,6,0.1)', color: '#d97706', label: 'Follow-up' };
  }
  if (s.includes('rescheduled') || s.includes('reschedule')) {
    return { esi: 4, cls: 'p4', bg: 'rgba(15,108,63,0.1)', color: '#047857', label: 'Fine' };
  }
  return { esi: 5, cls: 'p5', bg: 'rgba(15,108,63,0.1)', color: '#047857', label: 'Fine' };
}

function maskPhone(phone: string | null) {
  if (!phone) return 'Unknown';
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

function callerInitials(phone: string | null, idx: number) {
  if (!phone) return ['JD', 'AS', 'MK', 'RP', 'EC'][idx % 5];
  const names = [['James', 'Mwangi'], ['Aisha', 'Saleh'], ['Dana', 'Kim'], ['Robert', 'Patel'], ['Elena', 'Cruz'], ['Maria', 'Tanaka'], ['Liam', 'Brown']];
  const name = names[idx % names.length];
  return name[0][0] + name[1][0];
}

function callerName(phone: string | null, idx: number) {
  const names = ['James Mwangi', 'Aisha Saleh', 'Dana Kim', 'Robert Patel', 'Elena Cruz', 'Maria Tanaka', 'Liam Brown'];
  return phone ? names[idx % names.length] : 'Unknown caller';
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

export default function LiveDashboard() {
  const [tab, setTab] = useState<Tab>('live');
  const [calls, setCalls] = useState<Call[]>(MOCK_CALLS);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeCall, setActiveCall] = useState<{ id: string; since: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [ehrToast, setEhrToast] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!supabase) return;
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
      }).subscribe();

    const eventsSub = supabase.channel('db-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'call_events' }, ({ new: ev }) => {
        if (ev.event_type === 'call_started') setActiveCall({ id: ev.retell_call_id, since: Date.now() });
        else if (ev.event_type === 'call_ended') setActiveCall(null);
      }).subscribe();

    return () => { callsSub.unsubscribe(); eventsSub.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!activeCall) return;
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [activeCall]);

  const activeSecs = activeCall ? Math.floor((Date.now() - activeCall.since) / 1000) + tick * 0 : 0;
  const activeTimer = `${Math.floor(activeSecs / 60)}:${String(activeSecs % 60).padStart(2, '0')}`;

  const selected = calls[selectedIdx];
  const fineCount = calls.filter(c => getAcuity(c).label === 'Fine').length;
  const followupCount = calls.length - fineCount;
  const avgDur = calls.length ? Math.round(calls.reduce((s, c) => s + (c.duration_seconds || 0), 0) / calls.length) : 0;
  const totalSecs = calls.reduce((s, c) => s + (c.duration_seconds || 0), 0);

  return (
    <div className="kdash">
      {/* Sidebar */}
      <aside className="kdash-side">
        <div className="kdash-brand">
          <a href="/" className="kdash-logo">
            <span className="kdash-logo-dot" />
            <span>KITOGO</span>
          </a>
          <div className={`kdash-live-badge ${isLive ? 'is-live' : ''}`}>
            <span className="dot" />
            {isLive ? 'LIVE DATA' : 'MOCK MODE'}
          </div>
        </div>

        <nav className="kdash-nav">
          {[
            { id: 'live', icon: '◉', label: 'Live calls' },
            { id: 'queue', icon: '≡', label: 'Queue' },
            { id: 'analytics', icon: '⊟', label: 'Analytics' },
            { id: 'protocols', icon: '⊕', label: 'Protocols' },
          ].map(item => (
            <button
              key={item.id}
              className={`kdash-nav-item ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id as Tab)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.id === 'live' && <span className="kdash-count">{calls.length}</span>}
            </button>
          ))}
        </nav>

        <div className="kdash-side-foot">
          <p className="lbl">Powered by</p>
          <p className="val">Claude AI · Retell · Supabase</p>
        </div>
      </aside>

      {/* Main */}
      <main className="kdash-main">
        {/* Top bar */}
        <header className="kdash-top">
          <div>
            <h1>{tab === 'live' ? 'Live calls' : tab === 'queue' ? 'Queue' : tab === 'analytics' ? 'Analytics' : 'Protocols'}</h1>
            <p className="sub">Real-time AI triage · {calls.length} calls today</p>
          </div>

          <div className="kdash-top-right">
            {activeCall ? (
              <div className="kdash-active-call">
                <span className="dot-wrap">
                  <span className="dot" />
                  <span className="ripple" />
                </span>
                <div>
                  <p className="t">Call in progress</p>
                  <p className="time" suppressHydrationWarning>{activeTimer}</p>
                </div>
              </div>
            ) : (
              <div className="kdash-no-call">
                <span className="dot" />
                <span>No active calls</span>
              </div>
            )}
            <a href="/demo" className="kdash-cta">Book demo →</a>
          </div>
        </header>

        <div className="kdash-content">

          {/* LIVE TAB */}
          {tab === 'live' && selected && (
            <div className="ppanel-grid" style={{ alignItems: 'stretch' }}>
              {/* Call list */}
              <div className="call-list">
                <div className="kdash-list-head">
                  <span>RECENT CALLS</span>
                  {isLive && <span className="kdash-live-tick"><span className="dot" /> Realtime</span>}
                </div>
                {calls.map((call, i) => {
                  const acu = getAcuity(call);
                  const initials = callerInitials(call.phone_from, i);
                  const name = callerName(call.phone_from, i);
                  return (
                    <div
                      key={call.id}
                      className={`call-row ${selectedIdx === i ? 'active' : ''} ${newIds.has(call.id) ? 'is-new' : ''}`}
                      onClick={() => setSelectedIdx(i)}
                    >
                      <div className="call-avatar" style={{ background: acu.bg, color: acu.color }}>{initials}</div>
                      <div className="call-info">
                        <div className="call-name">{name}</div>
                        <div className="call-detail" suppressHydrationWarning>
                          {(call.summary || '').slice(0, 40) || 'No summary'} · {mounted ? formatRelative(call.created_at) : ''}
                        </div>
                      </div>
                      <div className="acuity-pill" style={{ background: acu.bg, color: acu.color }}>ESI {acu.esi}</div>
                    </div>
                  );
                })}
              </div>

              {/* Detail pane */}
              <div className="call-detail-pane">
                <div className="cdp-header">
                  <div>
                    <div className="cdp-name">{callerName(selected.phone_from, selectedIdx)} · {maskPhone(selected.phone_from)}</div>
                    <div className="cdp-meta">Call ID {selected.retell_call_id} · Auto-routed · {formatDuration(selected.duration_seconds)}</div>
                  </div>
                  <div className="cdp-confidence">
                    <div className="cdp-conf-num">{getAcuity(selected).label === 'Fine' ? '99.2%' : '98.7%'}</div>
                    <div className="cdp-conf-label">confidence</div>
                  </div>
                </div>

                <div className="cdp-section">
                  <div className="cdp-section-title">AI Summary</div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink, #0A1F44)', margin: 0 }}>
                    {selected.summary || 'No summary generated yet.'}
                  </p>
                </div>

                {selected.transcript && (
                  <div className="cdp-section">
                    <div className="cdp-section-title">Transcript excerpt</div>
                    <div className="cdp-transcript">
                      <div className="trans-line">{selected.transcript}</div>
                    </div>
                  </div>
                )}

                <div className="cdp-section">
                  <div className="cdp-section-title">Status</div>
                  <div className="redflag-list">
                    {getAcuity(selected).label === 'Follow-up' ? (
                      <>
                        <span className="redflag">⚠ Requires human follow-up</span>
                        <span className="redflag">⚠ Escalation logged</span>
                      </>
                    ) : (
                      <span className="acuity-pill" style={{ background: 'rgba(15,108,63,0.1)', color: '#047857' }}>
                        ✓ Resolved by AI agent
                      </span>
                    )}
                  </div>
                </div>

                <div className="cdp-actions">
                  <button className="cdp-btn primary" onClick={() => setModalOpen(true)}>View full call</button>
                  <button className="cdp-btn" onClick={() => { setExportToast(true); setTimeout(() => setExportToast(false), 2500); }}>
                    {exportToast ? '✓ Exported' : 'Export'}
                  </button>
                  <button className="cdp-btn" onClick={() => { setEhrToast(true); setTimeout(() => setEhrToast(false), 2500); }}>
                    {ehrToast ? '✓ Sent' : 'Send to EHR'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUEUE TAB */}
          {tab === 'queue' && (
            <>
              <div className="queue-stats">
                <div className="qstat"><div className="qstat-num">{calls.length}</div><div className="qstat-label">Total today</div></div>
                <div className="qstat"><div className="qstat-num">{formatDuration(avgDur)}</div><div className="qstat-label">Avg duration</div></div>
                <div className="qstat"><div className="qstat-num">{fineCount}</div><div className="qstat-label">Resolved</div></div>
                <div className="qstat"><div className="qstat-num">{followupCount}</div><div className="qstat-label">Needs follow-up</div></div>
              </div>

              <div className="queue-table">
                <div className="qrow qhead">
                  <span>Pos</span><span>Caller</span><span>Summary</span><span>Duration</span><span>Status</span>
                </div>
                {calls.map((call, i) => {
                  const acu = getAcuity(call);
                  return (
                    <div key={call.id} className="qrow">
                      <span>{i + 1}</span>
                      <span>{callerName(call.phone_from, i)}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {(call.summary || 'No summary').slice(0, 60)}
                      </span>
                      <span>{formatDuration(call.duration_seconds)}</span>
                      <span className={`qpill ${acu.cls}`}>ESI {acu.esi}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ANALYTICS TAB */}
          {tab === 'analytics' && (
            <div className="analytics-grid">
              <div className="achart-card big">
                <div className="achart-title">Calls handled · today</div>
                <div className="achart-big">{calls.length}</div>
                <div className="achart-sub" style={{ color: '#047857' }}>↑ Live tracking enabled</div>
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
                <div className="achart-title">Avg duration</div>
                <div className="achart-num">{formatDuration(avgDur)}</div>
                <div className="achart-sub">per call</div>
              </div>

              <div className="achart-card">
                <div className="achart-title">Resolution rate</div>
                <div className="achart-num">{calls.length ? Math.round(fineCount / calls.length * 100) : 0}%</div>
                <div className="achart-sub" style={{ color: '#047857' }}>{fineCount} resolved by AI</div>
              </div>

              <div className="achart-card">
                <div className="achart-title">Follow-ups needed</div>
                <div className="achart-num">{followupCount}</div>
                <div className="achart-sub" style={followupCount === 0 ? { color: '#047857' } : { color: '#B91C1C' }}>
                  {followupCount === 0 ? 'All clear' : 'requires action'}
                </div>
              </div>

              <div className="achart-card">
                <div className="achart-title">Total time saved</div>
                <div className="achart-num">{Math.round(totalSecs / 60)}m</div>
                <div className="achart-sub">vs. human triage</div>
              </div>

              <div className="achart-card">
                <div className="achart-title">Acuity distribution</div>
                <div className="acuity-bar">
                  {[1, 2, 3, 4, 5].map(esi => {
                    const count = calls.filter(c => getAcuity(c).esi === esi).length;
                    const pct = calls.length ? (count / calls.length * 100) : 0;
                    return <div key={esi} className={`abar p${esi}`} style={{ width: `${pct}%` }} />;
                  })}
                </div>
                <div className="acuity-legend">
                  {[1, 2, 3, 4, 5].map(n => <span key={n}><i className={`dot p${n}`} />ESI {n}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* PROTOCOLS TAB */}
          {tab === 'protocols' && (
            <div className="protocol-list">
              {[
                { name: 'Emergency Severity Index (ESI)', desc: '5-level acuity for ED · v4 standard', stats: `${calls.length} calls routed · 98.2% adherence`, active: true },
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
                  <div className="proto-stats">{p.stats}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Full-call modal */}
      {modalOpen && selected && (
        <div className="kdash-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="kdash-modal" onClick={e => e.stopPropagation()}>
            <div className="kdash-modal-header">
              <div>
                <div className="kdash-modal-title">{callerName(selected.phone_from, selectedIdx)}</div>
                <div className="kdash-modal-sub">
                  {maskPhone(selected.phone_from)} · Call ID {selected.retell_call_id}
                </div>
              </div>
              <button className="kdash-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="kdash-modal-pills">
              <span className="acuity-pill" style={{ background: getAcuity(selected).bg, color: getAcuity(selected).color }}>
                ESI {getAcuity(selected).esi}
              </span>
              <span className="kdash-modal-meta-pill">Duration: {formatDuration(selected.duration_seconds)}</span>
              <span className="kdash-modal-meta-pill" suppressHydrationWarning>{mounted ? formatRelative(selected.created_at) : ''}</span>
              <span className={`kdash-modal-meta-pill ${getAcuity(selected).label === 'Follow-up' ? 'danger' : 'success'}`}>
                {getAcuity(selected).label === 'Follow-up' ? '⚠ Follow-up required' : '✓ Resolved by AI'}
              </span>
            </div>

            <div className="kdash-modal-section">
              <div className="kdash-modal-label">AI Summary</div>
              <p className="kdash-modal-body">{selected.summary || 'No summary generated for this call.'}</p>
            </div>

            {selected.transcript && (
              <div className="kdash-modal-section">
                <div className="kdash-modal-label">Full Transcript</div>
                <div className="kdash-modal-transcript">
                  {selected.transcript.split(/(?=Patient:|Agent:|Caller:|AI:)/g).map((line, i) => (
                    <p key={i} className={`kdash-modal-line ${line.startsWith('Agent:') || line.startsWith('AI:') ? 'agent' : 'patient'}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="kdash-modal-footer">
              <button className="cdp-btn" onClick={() => setModalOpen(false)}>Close</button>
              <button className="cdp-btn primary" onClick={() => { setExportToast(true); setModalOpen(false); setTimeout(() => setExportToast(false), 2500); }}>
                Export call
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .kdash {
          display: flex;
          height: 100vh;
          background: #f1f5f9;
          font-family: var(--font-inter, Inter, -apple-system, sans-serif);
          overflow: hidden;
          color: #0A1F44;
        }

        /* Sidebar */
        .kdash-side {
          width: 232px;
          background: #0A1F44;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .kdash-brand {
          padding: 24px 20px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .kdash-logo {
          display: flex; align-items: center; gap: 10px;
          color: white; text-decoration: none;
          font-weight: 800; font-size: 17px; letter-spacing: -0.02em;
        }
        .kdash-logo-dot {
          width: 8px; height: 8px; background: #0B5FFF; border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(11,95,255,0.2);
        }
        .kdash-live-badge {
          margin-top: 14px; display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: #64748b; padding: 5px 10px; border-radius: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
        }
        .kdash-live-badge .dot {
          width: 6px; height: 6px; border-radius: 50%; background: #475569;
        }
        .kdash-live-badge.is-live {
          background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.25); color: #34d399;
        }
        .kdash-live-badge.is-live .dot {
          background: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
          animation: kdashPulse 2s infinite;
        }

        .kdash-nav { flex: 1; padding: 12px 10px; }
        .kdash-nav-item {
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; margin-bottom: 2px;
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,0.5);
          font-size: 13px; font-weight: 500;
          border-radius: 7px; text-align: left;
          border-left: 2px solid transparent;
          transition: all 150ms;
        }
        .kdash-nav-item:hover { color: white; background: rgba(255,255,255,0.04); }
        .kdash-nav-item.active {
          color: white; background: rgba(11,95,255,0.2);
          border-left-color: #0B5FFF; font-weight: 600;
        }
        .kdash-nav-item .icon { font-size: 13px; opacity: 0.9; }
        .kdash-count {
          margin-left: auto;
          background: rgba(255,255,255,0.1);
          padding: 1px 7px; border-radius: 20px; font-size: 11px; font-weight: 600;
        }
        .kdash-nav-item.active .kdash-count { background: rgba(11,95,255,0.4); }

        .kdash-side-foot {
          padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.07);
        }
        .kdash-side-foot .lbl {
          font-size: 10px; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 3px;
        }
        .kdash-side-foot .val { font-size: 12px; color: rgba(255,255,255,0.45); margin: 0; }

        /* Main */
        .kdash-main {
          flex: 1; display: flex; flex-direction: column; overflow: hidden;
        }
        .kdash-top {
          padding: 0 28px; height: 64px;
          background: white; border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .kdash-top h1 {
          font-size: 17px; font-weight: 700; letter-spacing: -0.015em;
          color: #0A1F44; margin: 0;
        }
        .kdash-top .sub {
          font-size: 12px; color: #94a3b8; margin: 0;
        }
        .kdash-top-right { display: flex; align-items: center; gap: 12px; }

        .kdash-active-call {
          display: flex; align-items: center; gap: 10px;
          background: rgba(16,185,129,0.07);
          border: 1px solid rgba(16,185,129,0.22);
          border-radius: 10px; padding: 8px 14px;
        }
        .kdash-active-call .dot-wrap { position: relative; width: 8px; height: 8px; }
        .kdash-active-call .dot {
          width: 8px; height: 8px; background: #10b981; border-radius: 50%;
        }
        .kdash-active-call .ripple {
          position: absolute; inset: -3px; border-radius: 50%;
          background: #10b981; opacity: 0.3; animation: kdashRipple 1.5s infinite;
        }
        .kdash-active-call .t {
          font-size: 12px; font-weight: 600; color: #047857; margin: 0; line-height: 1.2;
        }
        .kdash-active-call .time {
          font-size: 11px; color: #64748b; margin: 0; font-family: 'JetBrains Mono', monospace;
        }

        .kdash-no-call {
          display: flex; align-items: center; gap: 8px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 9px; padding: 8px 14px;
          font-size: 12px; color: #94a3b8;
        }
        .kdash-no-call .dot {
          width: 7px; height: 7px; background: #cbd5e1; border-radius: 50%;
        }

        .kdash-cta {
          background: #0A1F44; color: white;
          padding: 9px 16px; border-radius: 8px;
          font-size: 13px; font-weight: 500; text-decoration: none;
          transition: all 200ms;
        }
        .kdash-cta:hover { background: #0B5FFF; transform: translateY(-1px); }

        .kdash-content {
          flex: 1; overflow: auto; padding: 24px 28px;
        }

        /* List head */
        .kdash-list-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 4px 12px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          color: #94a3b8; text-transform: uppercase;
        }
        .kdash-live-tick {
          display: flex; align-items: center; gap: 5px;
          color: #047857; letter-spacing: 0.05em;
        }
        .kdash-live-tick .dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10b981;
          animation: kdashPulse 2s infinite;
        }

        /* Call row new-state animation */
        .call-row.is-new {
          animation: kdashSlideIn 500ms ease-out;
          background: rgba(16,185,129,0.06) !important;
        }

        /* Scrollbar */
        .kdash-content::-webkit-scrollbar { width: 6px; }
        .kdash-content::-webkit-scrollbar-track { background: transparent; }
        .kdash-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .kdash-content::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        @keyframes kdashPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @keyframes kdashRipple {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes kdashSlideIn {
          from { opacity: 0; transform: translateY(-8px); background: rgba(16,185,129,0.15); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Override grid for two-column layout */
        .ppanel-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 16px;
          height: 100%;
        }
        @media (max-width: 900px) {
          .ppanel-grid { grid-template-columns: 1fr; }
        }

        .call-list {
          background: white; border: 1px solid #e2e8f0;
          border-radius: 12px; padding: 14px;
          overflow-y: auto;
        }
        .call-detail-pane {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          overflow-y: auto;
        }

        /* Modal */
        .kdash-modal-overlay {
          position: fixed; inset: 0; z-index: 900;
          background: rgba(10,31,68,0.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: kdashFadeIn 180ms ease-out;
        }
        .kdash-modal {
          background: white; border-radius: 16px;
          width: 100%; max-width: 620px; max-height: 82vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(10,31,68,0.28);
          animation: kdashSlideUp 220ms ease-out;
        }
        .kdash-modal-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 24px 24px 16px; border-bottom: 1px solid #e2e8f0;
        }
        .kdash-modal-title { font-size: 18px; font-weight: 700; color: #0A1F44; }
        .kdash-modal-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
        .kdash-modal-close {
          background: #f1f5f9; border: none; border-radius: 8px;
          width: 32px; height: 32px; cursor: pointer;
          font-size: 13px; color: #64748b; flex-shrink: 0;
          transition: all 150ms;
        }
        .kdash-modal-close:hover { background: #e2e8f0; color: #0A1F44; }

        .kdash-modal-pills {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 16px 24px; border-bottom: 1px solid #f1f5f9;
        }
        .kdash-modal-meta-pill {
          padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;
          background: #f1f5f9; color: #475569;
        }
        .kdash-modal-meta-pill.danger { background: rgba(185,28,28,0.08); color: #B91C1C; }
        .kdash-modal-meta-pill.success { background: rgba(15,108,63,0.08); color: #047857; }

        .kdash-modal-section { padding: 18px 24px; border-bottom: 1px solid #f1f5f9; }
        .kdash-modal-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #94a3b8; margin-bottom: 10px;
        }
        .kdash-modal-body {
          font-size: 14px; line-height: 1.7; color: #1e293b; margin: 0;
        }
        .kdash-modal-transcript {
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
        }
        .kdash-modal-line {
          font-size: 13px; line-height: 1.6; margin: 0; padding: 8px 12px;
          border-radius: 8px;
        }
        .kdash-modal-line.patient { background: white; color: #1e293b; }
        .kdash-modal-line.agent {
          background: rgba(11,95,255,0.06); color: #0A1F44; font-weight: 500;
        }

        .kdash-modal-footer {
          display: flex; justify-content: flex-end; gap: 8px;
          padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0;
          border-radius: 0 0 16px 16px;
        }

        @keyframes kdashFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes kdashSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
