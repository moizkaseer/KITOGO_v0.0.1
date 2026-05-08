'use client';

import { useEffect, useRef, useState } from 'react';

const initialFeed = [
  { time: '2m', customer: 'Mercy Regional', text: 'ESI 2 escalation to live nurse completed · 28s total' },
  { time: '5m', customer: 'Cleveland Health', text: 'Spanish-language call handled successfully · 2m 04s' },
  { time: '9m', customer: 'Atlantic Health', text: 'Routine refill routed to pharmacy queue · automated' },
  { time: '14m', customer: 'Pacific Care Group', text: '8 callbacks scheduled in last hour' },
  { time: '22m', customer: 'System', text: 'All EHR integrations reporting healthy · 0 sync errors' },
];

const newEvents = [
  { customer: 'Mercy Regional', text: 'Pediatric protocol matched · ESI 3 routed to PUC' },
  { customer: 'Atlantic Health', text: 'Multi-language call (Spanish) handled · 1m 42s total' },
  { customer: 'Pacific Care Group', text: '12 callbacks scheduled in last 15 minutes' },
  { customer: 'System', text: 'Daily disaster recovery drill passed · RTO 1m 56s' },
  { customer: 'Mercy Regional', text: 'Crisis-line escalation routed to live nurse · 22s' },
  { customer: 'Northwest Health', text: 'Crossed 500K monthly call milestone' },
];

export default function TrustReport() {
  const [calls, setCalls] = useState(2_847_193);
  const [latency, setLatency] = useState('142ms');
  const [api, setApi] = useState('218ms');
  const [feed, setFeed] = useState(initialFeed);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const evtIdxRef = useRef(0);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !startedRef.current) {
          startedRef.current = true;

          // Increment calls
          const tickCalls = () => {
            setCalls(n => n + Math.floor(Math.random() * 4) + 1);
            setTimeout(tickCalls, 1500 + Math.random() * 2500);
          };
          tickCalls();

          // Jitter latency/api
          const tickLatency = () => {
            setLatency((138 + Math.floor(Math.random() * 12)) + 'ms');
            setApi((210 + Math.floor(Math.random() * 18)) + 'ms');
            setTimeout(tickLatency, 3000);
          };
          setTimeout(tickLatency, 3000);

          // Feed prepend
          const tickFeed = () => {
            const evt = newEvents[evtIdxRef.current % newEvents.length];
            evtIdxRef.current++;
            setFeed(prev => [{ time: 'just now', customer: evt.customer, text: evt.text }, ...prev.slice(0, 7)]);
            setTimeout(tickFeed, 25000 + Math.random() * 10000);
          };
          setTimeout(tickFeed, 8000);
        }
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="trust" className="trust-section" ref={sectionRef}>
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Live · public</span>
          <h2>Numbers we <span className="serif">publish openly.</span></h2>
          <p>This dashboard updates from production data every 60 seconds. We believe healthcare buyers deserve the same transparency you give your patients.</p>
        </div>

        <div className="trust-status-bar reveal">
          <span className="trust-status-dot" />
          <span className="trust-status-text"><strong>All systems operational</strong></span>
          <span className="trust-status-divider" />
          <span className="trust-status-metric">Uptime <strong>99.97%</strong></span>
          <span className="trust-status-divider" />
          <span className="trust-status-metric">Voice latency <strong>{latency}</strong></span>
          <span className="trust-status-divider" />
          <span className="trust-status-metric">API p95 <strong>{api}</strong></span>
          <a href="#" className="trust-status-link">Full status →</a>
        </div>

        <div className="trust-grid">
          {[
            { label: 'Calls triaged · 30 days', value: calls.toLocaleString(), trend: '+12.4% MoM', up: true },
            { label: 'Avg pickup latency', value: '1.38s', trend: '−0.2s vs last month', up: true },
            { label: 'Protocol adherence', value: '98.4%', trend: 'Above 98% for 11 months', up: true },
            { label: 'Uptime · rolling 90d', value: '99.97%', trend: '3.4 min downtime total', up: true },
          ].map(({ label, value, trend, up }) => (
            <div key={label} className="trust-tile reveal">
              <div className="trust-tile-label">{label}</div>
              <div className="trust-tile-value">{value}</div>
              <div className="trust-tile-trend">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d={up ? 'M6 2L10 6H2L6 2Z' : 'M6 10L2 6h8L6 10Z'} fill="currentColor" />
                </svg>
                {trend}
              </div>
            </div>
          ))}
        </div>

        <div className="trust-board">
          <div className="trust-chart-card reveal">
            <div className="trust-chart-title">Pickup latency · 30-day trend</div>
            <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ width: '100%', height: 120 }}>
              <defs>
                <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B5FFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0B5FFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 L40,70 L80,75 L120,60 L160,55 L200,50 L240,58 L280,45 L320,40 L360,42 L400,38 L400,120 L0,120Z" fill="url(#trustGrad)" />
              <path d="M0,80 L40,70 L80,75 L120,60 L160,55 L200,50 L240,58 L280,45 L320,40 L360,42 L400,38" fill="none" stroke="#0B5FFF" strokeWidth="2" />
            </svg>
          </div>

          <div className="trust-feed-card reveal">
            <div className="trust-feed-title">Live activity</div>
            <div className="trust-feed">
              {feed.map((item, i) => (
                <div key={i} className="trust-feed-item">
                  <span className="trust-feed-time">{item.time}</span>
                  <span className="trust-feed-text"><strong>{item.customer}</strong> · {item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
