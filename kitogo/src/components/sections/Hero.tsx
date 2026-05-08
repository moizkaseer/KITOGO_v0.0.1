'use client';

import { useEffect, useRef, useState } from 'react';

type Scenario = 'emergency' | 'routine' | 'pediatric';

interface ScenarioConfig {
  acuity: string;
  acuityColor: string;
  acuityDelta: string;
  banner: string;
  bannerBg: string;
  messages: { who: 'agent' | 'patient'; text: string; delay: number }[];
}

const scenarios: Record<Scenario, ScenarioConfig> = {
  emergency: {
    acuity: 'ESI Level 2',
    acuityColor: 'var(--danger)',
    acuityDelta: '↑ Escalating to nurse',
    banner: 'Escalating to live nurse · ESI Level 2 · ETA 12 sec',
    bannerBg: 'linear-gradient(90deg, var(--danger) 0%, #dc2626 100%)',
    messages: [
      { who: 'agent', text: "Hi, this is the KITOGO assistant. What's going on today?", delay: 800 },
      { who: 'patient', text: "I've been having chest pain for about an hour. It's getting worse.", delay: 2400 },
      { who: 'agent', text: "Where exactly is the pain — center, left side, or somewhere else?", delay: 4000 },
      { who: 'patient', text: "Center, and it's spreading to my left arm.", delay: 5600 },
    ],
  },
  routine: {
    acuity: 'ESI Level 4',
    acuityColor: 'var(--success)',
    acuityDelta: 'Routing to clinic',
    banner: 'Booked appointment · Tomorrow 2:30 PM · Dr. Chen',
    bannerBg: 'linear-gradient(90deg, var(--success) 0%, #059669 100%)',
    messages: [
      { who: 'agent', text: 'Hi, what can I help you with today?', delay: 800 },
      { who: 'patient', text: 'I need to refill my blood pressure medication.', delay: 2400 },
      { who: 'agent', text: 'Got it. When did you last see Dr. Chen for this prescription?', delay: 4000 },
      { who: 'patient', text: "About six months ago. I'd like to schedule a follow-up.", delay: 5600 },
    ],
  },
  pediatric: {
    acuity: 'ESI Level 3',
    acuityColor: 'var(--warning)',
    acuityDelta: 'Urgent care recommended',
    banner: 'Urgent care · Available now · 7 min wait',
    bannerBg: 'linear-gradient(90deg, var(--warning) 0%, #d97706 100%)',
    messages: [
      { who: 'agent', text: "Hi, I'll help you get your child the right care. What's happening?", delay: 800 },
      { who: 'patient', text: "My 4-year-old has a fever of 102 and won't eat.", delay: 2400 },
      { who: 'agent', text: 'How long has the fever been at 102 or higher?', delay: 4000 },
      { who: 'patient', text: "About 8 hours. He's also pulling at his right ear.", delay: 5600 },
    ],
  },
};

interface Message {
  who: 'agent' | 'patient';
  text: string;
  id: number;
}

export default function Hero() {
  const [activeScenario, setActiveScenario] = useState<Scenario>('emergency');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [callTime, setCallTime] = useState(42);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgId = useRef(0);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function runConvo(scenario: Scenario) {
    clearTimers();
    setMessages([]);
    setShowTyping(false);
    setBannerVisible(false);

    const s = scenarios[scenario];
    s.messages.forEach((msg, i) => {
      const t = setTimeout(() => {
        if (msg.who === 'agent' && i > 0) {
          setShowTyping(true);
          const t2 = setTimeout(() => {
            setShowTyping(false);
            setMessages(prev => [...prev, { ...msg, id: ++msgId.current }]);
          }, msg.delay + 600);
          timersRef.current.push(t2);
        } else {
          setMessages(prev => [...prev, { ...msg, id: ++msgId.current }]);
        }
      }, msg.delay);
      timersRef.current.push(t);
    });

    const bannerT = setTimeout(() => setBannerVisible(true), 7000);
    timersRef.current.push(bannerT);

    const loopT = setTimeout(() => runConvo(scenario), 14000);
    timersRef.current.push(loopT);
  }

  useEffect(() => {
    runConvo(activeScenario);
    return clearTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScenario]);

  // Call timer
  useEffect(() => {
    const t = setInterval(() => setCallTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  function formatTime(s: number) {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `00:${m}:${sec}`;
  }

  // Count-up stats
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-count]');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.count!);
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / 1600, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.floor(target * eased));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = String(target);
          };
          requestAnimationFrame(tick);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const s = scenarios[activeScenario];

  return (
    <section className="hero">
      <div className="hero-grid-bg" />
      <div className="hero-inner">
        <div>
          <div className="hero-pill">
            <span className="hero-pill-badge">New</span>
            <span>Now triaging 2.5M+ patient calls monthly</span>
          </div>
          <h1>
            <span className="word" style={{ animationDelay: '100ms' }}>Triage</span>{' '}
            <span className="word" style={{ animationDelay: '200ms' }}>every</span>{' '}
            <span className="word" style={{ animationDelay: '300ms' }}>patient</span>
            <br />
            <span className="word" style={{ animationDelay: '400ms' }}>in</span>{' '}
            <span className="word serif" style={{ animationDelay: '550ms' }}>under 60</span>{' '}
            <span className="word" style={{ animationDelay: '750ms' }}>seconds.</span>
          </h1>
          <p className="hero-sub">
            KITOGO&apos;s AI agent handles patient intake, symptom assessment, and routing across
            phone, web, and SMS — 24/7. Your staff gets a structured summary and a prioritized
            queue.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn btn-primary">Book a demo</a>
            <a href="#" className="btn btn-ghost">Watch 2-min video</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">
                <span data-count="42">0</span><span className="unit">%</span>
              </div>
              <div className="hero-stat-label">Faster intake time</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">
                <span data-count="60">0</span><span className="unit">%</span>
              </div>
              <div className="hero-stat-label">Fewer false alarms</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">
                <span data-count="38">0</span><span className="unit">s</span>
              </div>
              <div className="hero-stat-label">Average routing time</div>
            </div>
          </div>
        </div>

        {/* Live call panel */}
        <div className="hero-visual">
          <div className="float-card float-card-1">
            <div className="label">Triage acuity</div>
            <div className="value" style={{ color: s.acuityColor }}>{s.acuity}</div>
            <div className="delta">{s.acuityDelta}</div>
          </div>
          <div className="float-card float-card-2">
            <div className="label">Confidence</div>
            <div className="value">98.7%</div>
            <div className="delta">+0.3% vs baseline</div>
          </div>

          <div className="call-panel">
            <div className="scenario-tabs">
              {(['emergency', 'routine', 'pediatric'] as Scenario[]).map(sc => (
                <button
                  key={sc}
                  className={`scenario-tab${activeScenario === sc ? ' active' : ''}`}
                  onClick={() => setActiveScenario(sc)}
                >
                  {sc.charAt(0).toUpperCase() + sc.slice(1)}
                </button>
              ))}
            </div>
            <div className="call-header">
              <div className="call-status">
                <span className="pulse-dot" />
                Live call · Inbound
              </div>
              <div className="call-time">{formatTime(callTime)}</div>
            </div>

            <div className="conversation">
              {messages.map(msg => (
                <div key={msg.id} className={`msg msg-${msg.who}`}>
                  <div className="msg-meta">{msg.who === 'agent' ? 'KITOGO' : 'Patient'}</div>
                  {msg.text}
                </div>
              ))}
              {showTyping && (
                <div className="typing">
                  <span /><span /><span />
                </div>
              )}
            </div>

            <div
              className="triage-banner"
              style={{
                opacity: bannerVisible ? 1 : 0,
                background: s.bannerBg,
                transition: 'opacity 600ms',
              }}
            >
              <span className="triage-banner-pulse" />
              <span>{s.banner}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
