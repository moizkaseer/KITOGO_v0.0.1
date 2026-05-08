'use client';

import React, { useState } from 'react';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  role: string;
  orgName: string;
  orgSize: string;
  ehr: string;
  useCases: string[];
  selectedDate: string;
  selectedTime: string;
  name: string;
  email: string;
}

const ROLES = ['ED Director', 'Urgent Care Leader', 'Health System Executive', 'Telehealth Leader', 'IT / Clinical Informatics', 'Other'];
const ORG_SIZES = ['1–10 providers', '11–50 providers', '51–200 providers', '200+ providers'];
const EHRS = ['Epic', 'Cerner', 'athenahealth', 'Allscripts', 'eClinicalWorks', 'NextGen', 'MEDITECH', 'Other'];
const USE_CASES = ['Phone triage', 'Web intake', 'SMS follow-up', 'After-hours coverage', 'Multi-site routing', 'Analytics & reporting'];
const TIMES = ['9:00 AM PT', '11:00 AM PT', '2:00 PM PT', '4:00 PM PT'];

function buildCalendar() {
  const days: { date: string; label: number; disabled: boolean }[] = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() + 1);
  const startDow = start.getDay();
  for (let i = 0; i < startDow; i++) days.push({ date: '', label: 0, disabled: true });
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay();
    const iso = d.toISOString().split('T')[0];
    days.push({ date: iso, label: d.getDate(), disabled: dow === 0 || dow === 6 });
  }
  return days;
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="step-indicator" aria-label="Booking progress">
      {[1, 2, 3, 4].map((n, i) => (
        <React.Fragment key={n}>
          <div className={`step-dot${step === n ? ' active' : step > n ? ' complete' : ''}`} aria-current={step === n ? 'step' : undefined}>
            {step > n ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
            ) : n}
          </div>
          {i < 3 && <div className={`step-line${step > n ? ' complete' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DemoFlow() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>({
    role: '', orgName: '', orgSize: '', ehr: '',
    useCases: [], selectedDate: '', selectedTime: '',
    name: '', email: '',
  });

  const calDays = buildCalendar();
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setData(prev => ({ ...prev, [key]: val }));
  }
  function toggleUseCase(uc: string) {
    setData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(uc)
        ? prev.useCases.filter(x => x !== uc)
        : [...prev.useCases, uc],
    }));
  }

  const canAdvance1 = data.role && data.orgName.trim() && data.orgSize && data.ehr;
  const canAdvance2 = data.useCases.length > 0;
  const canAdvance3 = data.selectedDate && data.selectedTime && data.name.trim() && data.email.includes('@');

  const formattedDate = data.selectedDate
    ? new Date(data.selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  return (
    <div>
      <StepIndicator step={step} />

      {step === 1 && (
        <div className="demo-card">
          <h2>Tell us about your organization.</h2>
          <p className="lead">We&apos;ll tailor the demo to your specific context — no generic walk-throughs.</p>

          <div style={{ marginBottom: 20 }}>
            <div className="form-label">Your role</div>
            <div className="role-card-grid">
              {ROLES.map(r => (
                <button key={r} className={`role-card${data.role === r ? ' selected' : ''}`} onClick={() => set('role', r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="orgName">Organization name</label>
            <input id="orgName" className="form-input" placeholder="Mercy Regional Medical Center" value={data.orgName} onChange={e => set('orgName', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="orgSize">Org size</label>
              <select id="orgSize" className="form-select" value={data.orgSize} onChange={e => set('orgSize', e.target.value)}>
                <option value="">Select...</option>
                {ORG_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="ehr">Primary EHR</label>
              <select id="ehr" className="form-select" value={data.ehr} onChange={e => set('ehr', e.target.value)}>
                <option value="">Select...</option>
                {EHRS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="demo-nav">
            <span />
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!canAdvance1} aria-disabled={!canAdvance1}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="demo-card">
          <h2>What do you need to solve?</h2>
          <p className="lead">Select everything that applies — we&apos;ll focus the demo time accordingly.</p>

          <div className="use-case-grid">
            {USE_CASES.map(uc => (
              <button
                key={uc}
                className={`use-case-card${data.useCases.includes(uc) ? ' selected' : ''}`}
                onClick={() => toggleUseCase(uc)}
                aria-pressed={data.useCases.includes(uc)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  {data.useCases.includes(uc)
                    ? <path d="M5 12l5 5L20 7" />
                    : <rect x="3" y="3" width="18" height="18" rx="3" />}
                </svg>
                {uc}
              </button>
            ))}
          </div>

          <div className="demo-nav">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!canAdvance2} aria-disabled={!canAdvance2}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="demo-card">
          <h2>Pick a time that works.</h2>
          <p className="lead">All times are Pacific. 25 minutes.</p>

          <div className="calendar-header">
            {DOW.map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="calendar-grid">
            {calDays.map((d, i) => (
              <button
                key={i}
                className={`cal-day${d.disabled || !d.date ? ' disabled' : ''}${data.selectedDate === d.date ? ' selected' : ''}`}
                onClick={() => !d.disabled && d.date && set('selectedDate', d.date)}
                disabled={d.disabled || !d.date}
                aria-label={d.date ? `${d.date}${d.disabled ? ', unavailable' : ''}` : undefined}
              >
                {d.label || ''}
              </button>
            ))}
          </div>

          {data.selectedDate && (
            <>
              <div className="form-label" style={{ marginBottom: 8 }}>Available times — {formattedDate}</div>
              <div className="time-slots">
                {TIMES.map(t => (
                  <button key={t} className={`time-slot${data.selectedTime === t ? ' selected' : ''}`} onClick={() => set('selectedTime', t)}>
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="name">Your name</label>
              <input id="name" className="form-input" placeholder="Dr. Sarah Chen" value={data.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="email">Work email</label>
              <input id="email" type="email" className="form-input" placeholder="sarah.chen@mercy.org" value={data.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div className="demo-nav">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!canAdvance3} aria-disabled={!canAdvance3}>
              Confirm booking
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="demo-card" style={{ textAlign: 'center' }}>
          <div className="demo-confirm-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
          </div>
          <h2>You&apos;re confirmed.</h2>
          <p style={{ color: 'var(--ink-2)', marginBottom: 24, lineHeight: 1.6 }}>
            <strong>{data.name}</strong>, your demo is booked for{' '}
            <strong>{formattedDate} at {data.selectedTime}</strong>.
            Confirmation sent to <strong>{data.email}</strong>.
          </p>

          <div style={{ background: 'var(--slate-50)', borderRadius: 12, padding: '20px 24px', marginBottom: 28, textAlign: 'left', border: '1px solid var(--slate-200)' }}>
            <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--ink)' }}>What to expect</p>
            <ul style={{ paddingLeft: 20, color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.7 }}>
              <li>We&apos;ll review your use cases ({data.useCases.join(', ')})</li>
              <li>Live agent demo with your EHR ({data.ehr}) context</li>
              <li>ROI model for your org size</li>
              <li>Q&amp;A — no time-boxed slides</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" className="btn btn-ghost" style={{ fontSize: 13 }}>Add to Google Calendar</a>
            <a href="#" className="btn btn-ghost" style={{ fontSize: 13 }}>Add to Outlook</a>
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)' }}>
            Questions before the demo? Email us at{' '}
            <a href="mailto:demo@kitogo.health" style={{ color: 'var(--blue)' }}>demo@kitogo.health</a>
          </p>
        </div>
      )}
    </div>
  );
}
