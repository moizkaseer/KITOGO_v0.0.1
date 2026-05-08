'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: 'STEP 01 / 04',
    title: <>The phone <span className="serif">rings.</span></>,
    body: 'Patient dials your existing number. KITOGO answers in under 2 seconds — no menu trees, no "press 1 for…", no hold music. A calm, natural voice greets them by their name if we recognize the caller ID.',
  },
  {
    num: 'STEP 02 / 04',
    title: <>Symptoms are <span className="serif">structured.</span></>,
    body: 'The agent runs your configured triage protocol — ESI, Manchester, or custom. It listens for clinical red flags in real time and surfaces them as they appear. Every utterance is captured, structured, and time-stamped.',
  },
  {
    num: 'STEP 03 / 04',
    title: <>Routing happens <span className="serif">automatically.</span></>,
    body: 'Based on acuity, location, time of day, and provider availability, KITOGO routes to the right destination — urgent care, scheduled visit, nurse callback, or live escalation. The patient gets confirmation by SMS before the call ends.',
  },
  {
    num: 'STEP 04 / 04',
    title: <>Pushed to <span className="serif">your EHR.</span></>,
    body: 'Structured intake, transcript, audio recording, and ESI-mapped chief complaint write back to Epic, Cerner, or your system of record before the patient hangs up. Your clinical team sees a complete chart on arrival.',
  },
];

export default function Walkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      const el = pinRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      setActiveStep(Math.min(3, Math.floor(progress * 4)));
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <section id="walkthrough" className="walkthrough-section">
      <div className="walkthrough-intro">
        <span className="eyebrow">Sixty seconds, four steps</span>
        <h2>What happens between the <span className="serif">first ring</span> and the EHR write-back.</h2>
        <p>Scroll to walk through the full lifecycle of a single triage call — exactly what your patients experience, and exactly what shows up in your system.</p>
      </div>

      <div className="walkthrough-pin" ref={pinRef}>
        <div className="walkthrough-sticky">
          <div className="walkthrough-text-stack">
            {steps.map((s, i) => (
              <div key={i} className={`walkthrough-step${activeStep === i ? ' active' : ''}`}>
                <span className="walkthrough-step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="walkthrough-progress">
                  {steps.map((_, j) => (
                    <div key={j} className={`walkthrough-dot${activeStep === j ? ' active' : ''}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="walkthrough-visual">
            <div className="walkthrough-frame">
              {/* Scene 0 — Phone ring */}
              <div className={`walkthrough-scene${activeStep === 0 ? ' active' : ''}`}>
                <div className="scene-phone">
                  <div className="scene-phone-orb">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.71 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.71A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="scene-phone-meta">
                    <strong>+1 (415) 555-0142</strong>
                    Incoming · Maria Santos · returning patient
                  </div>
                  <div className="scene-phone-stats">
                    <div><strong>1.4s</strong>Pickup</div>
                    <div><strong>0</strong>Hold</div>
                    <div><strong>EN</strong>Language</div>
                  </div>
                </div>
              </div>

              {/* Scene 1 — Live transcript */}
              <div className={`walkthrough-scene${activeStep === 1 ? ' active' : ''}`}>
                <div className="scene-transcript">
                  <div className="scene-transcript-head">
                    <span className="scene-transcript-dot" />
                    <span>LIVE · 00:34</span>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)' }}>Confidence 94%</span>
                  </div>
                  {[
                    { who: 'bot', label: 'Agent', text: "Hi Maria, this is the KITOGO assistant. What's going on today?" },
                    { who: 'pat', label: 'Patient', text: 'My son has had a fever for 8 hours, around 102, and he\'s pulling at his right ear.' },
                    { who: 'bot', label: 'Agent', text: "How old is he, and is he eating or drinking?" },
                    { who: 'pat', label: 'Patient', text: "He's four. He won't eat, he had some water this morning." },
                  ].map((line, i) => (
                    <div key={i} className="scene-transcript-line">
                      <span className={`who ${line.who}`}>{line.label}</span>
                      <span className="text">{line.text}</span>
                    </div>
                  ))}
                  <div className="scene-transcript-flag">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2 L22 22 L2 22 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    <span><strong>Protocol flag:</strong> possible otitis media + dehydration risk · ESI Level 3</span>
                  </div>
                </div>
              </div>

              {/* Scene 2 — Routing */}
              <div className={`walkthrough-scene${activeStep === 2 ? ' active' : ''}`}>
                <div className="scene-routing">
                  <div className="scene-routing-head">EVALUATING ROUTING OPTIONS</div>
                  {[
                    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>, iconStyle: { background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }, name: 'Emergency Department', meta: 'Not indicated · ESI 3 doesn\'t meet ED criteria', active: false },
                    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12 L21 12 M12 3 L12 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>, iconStyle: { background: 'rgba(11,95,255,0.2)', color: '#60A5FA' }, name: 'Pediatric Urgent Care · Mission Bay', meta: '7 min wait · 1.2 mi away · accepts insurance · open until 22:00', active: true },
                    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /></svg>, iconStyle: { background: 'rgba(180,83,9,0.15)', color: '#fcd34d' }, name: 'Nurse callback', meta: 'Backup · Next slot 14 minutes', active: false },
                  ].map(({ icon, iconStyle, name, meta, active }) => (
                    <div key={name} className={`scene-routing-card${active ? ' active' : ''}`}>
                      <div className="scene-routing-icon" style={iconStyle}>{icon}</div>
                      <div><div className="name">{name}</div><div className="meta">{meta}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scene 3 — EHR push */}
              <div className={`walkthrough-scene${activeStep === 3 ? ' active' : ''}`}>
                <div className="scene-ehr">
                  <div className="scene-transcript-head" style={{ marginBottom: 4 }}>
                    <span className="scene-transcript-dot" style={{ background: '#10b981' }} />
                    <span>WRITING TO EPIC · 00:00:42</span>
                  </div>
                  {[
                    { lbl: 'PATIENT_MRN', val: 'EPIC-04829-C' },
                    { lbl: 'CHIEF_COMPLAINT', val: 'Pediatric fever, ear pain' },
                    { lbl: 'ESI_LEVEL', val: '3 — Urgent' },
                    { lbl: 'ROUTING', val: 'PUC Mission Bay · 14:22' },
                    { lbl: 'TRANSCRIPT', val: 'attached.json (4.2 KB)' },
                    { lbl: 'AUDIO', val: 'recording.wav (2m 14s)' },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} className="scene-ehr-row">
                      <span className="lbl">{lbl}</span><span className="val">{val}</span>
                    </div>
                  ))}
                  <div className="scene-ehr-status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span><strong>Synced.</strong> Provider sees full chart on patient arrival.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
