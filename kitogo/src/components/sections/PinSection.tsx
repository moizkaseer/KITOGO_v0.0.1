'use client';

import { useEffect, useRef, useState } from 'react';

export default function PinSection() {
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function update() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      if (progress > 0.66) setStep(2);
      else if (progress > 0.33) setStep(1);
      else setStep(0);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <section className="pin-section" ref={sectionRef}>
      <div className="pin-track">
        <div className="pin-stage">
          <div className="pin-text-wrap">
            {[
              {
                num: 'i · First contact',
                h2: <>The phone <span className="serif">never</span> rings twice.</>,
                p: 'Patient reaches you by phone, web, or SMS. KITOGO answers in under a second — no hold queue, no menu tree. Conversation begins immediately.',
              },
              {
                num: 'ii · Clinical reasoning',
                h2: <>Symptoms in. <span className="serif">Triage</span> out.</>,
                p: 'The agent applies your configured protocol — ESI, Manchester, or custom. Red-flag symptoms escalate to a live nurse within 30 seconds, automatically.',
              },
              {
                num: 'iii · Structured handoff',
                h2: <>Your team gets <span className="serif">everything.</span></>,
                p: 'A clinical summary lands in your EHR. Chief complaint, history, vitals, acuity, and next step — all structured, all auditable, ready for human review.',
              },
            ].map((item, i) => (
              <div key={i} className={`pin-text${step === i ? ' active' : ''}`}>
                <div className="pin-step-num">{item.num}</div>
                <h2>{item.h2}</h2>
                <p>{item.p}</p>
              </div>
            ))}
          </div>

          <div className="pin-visual">
            {/* Frame 0 — phone */}
            <div className={`pin-frame${step === 0 ? ' active' : ''}`}>
              <div className="frame-phone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.63 19.79 19.79 0 0 1 1.06 4a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
            </div>

            {/* Frame 1 — protocol */}
            <div className={`pin-frame${step === 1 ? ' active' : ''}`}>
              <div className="frame-protocol">
                <div className="protocol-row"><span>Chief complaint</span><span className="check">✓ captured</span></div>
                <div className="protocol-row"><span>Symptom duration</span><span className="check">✓ 60 min</span></div>
                <div className="protocol-row"><span>Pain radiation</span><span className="check">✓ left arm</span></div>
                <div className="protocol-row"><span>Red flag detected</span><span className="alert">⚠ ESI Level 2</span></div>
              </div>
            </div>

            {/* Frame 2 — EHR */}
            <div className={`pin-frame${step === 2 ? ' active' : ''}`}>
              <div className="frame-ehr">
                <div className="frame-ehr-line"><span className="key">patient_id</span><span className="pipe"> = </span><span className="val">P-48291</span></div>
                <div className="frame-ehr-line"><span className="key">complaint</span><span className="pipe"> = </span><span className="val">&quot;Chest pain, 60min&quot;</span></div>
                <div className="frame-ehr-line"><span className="key">acuity</span><span className="pipe"> = </span><span className="val" style={{ color: 'var(--danger)' }}>ESI_2</span></div>
                <div className="frame-ehr-line"><span className="key">route</span><span className="pipe"> = </span><span className="val">ED_immediate</span></div>
                <div className="frame-ehr-line"><span className="key">summary_doc</span><span className="pipe"> = </span><span className="val">attached.pdf</span></div>
                <div className="frame-ehr-line"><span className="key">queue_position</span><span className="pipe"> = </span><span className="val">1</span></div>
              </div>
            </div>

            <div className="pin-progress">
              {[0, 1, 2].map(i => (
                <span key={i} className={`pin-dot${step === i ? ' active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
