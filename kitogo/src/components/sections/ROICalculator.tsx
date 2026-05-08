'use client';

import { useState } from 'react';

function fmtNum(n: number) { return Math.round(n).toLocaleString(); }
function fmtMoney(n: number) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K';
  return '$' + Math.round(n).toLocaleString();
}

export default function ROICalculator() {
  const [calls, setCalls] = useState(800);
  const [time, setTime] = useState(6);
  const [cost, setCost] = useState(48);

  const annualCalls = calls * 365;
  const handledCalls = annualCalls * 0.72;
  const hoursSaved = (handledCalls * time) / 60;
  const savings = hoursSaved * cost;

  return (
    <section id="roi" className="roi-section">
      <div className="container">
        <div className="roi-grid">
          <div className="roi-copy reveal">
            <span className="eyebrow">The math, made obvious</span>
            <h2>See your <span className="serif">first-year ROI</span> in seconds.</h2>
            <p>
              Adjust the sliders to match your operation. We&apos;ll show you the labor hours
              recovered, calls deflected, and dollars saved — based on real KITOGO deployments.
            </p>
            <div className="roi-disclaimer">
              Estimates based on median outcomes across 14 healthcare networks. Your results will
              vary by case mix and integration depth.
            </div>
          </div>

          <div className="roi-calc reveal">
            {[
              {
                label: 'Daily call volume',
                id: 'roi-calls',
                min: 50, max: 5000, step: 50,
                value: calls, onChange: setCalls,
                display: calls.toLocaleString(),
                rangeLeft: '50', rangeRight: '5,000',
              },
              {
                label: 'Avg call handle time (min)',
                id: 'roi-time',
                min: 2, max: 15, step: 1,
                value: time, onChange: setTime,
                display: String(time),
                rangeLeft: '2', rangeRight: '15',
              },
              {
                label: 'Loaded staff cost ($/hr)',
                id: 'roi-cost',
                min: 20, max: 120, step: 2,
                value: cost, onChange: setCost,
                display: '$' + cost,
                rangeLeft: '$20', rangeRight: '$120',
              },
            ].map(({ label, id, min, max, step, value, onChange, display, rangeLeft, rangeRight }) => (
              <div key={id} className="roi-input">
                <div className="roi-input-row">
                  <label htmlFor={id}>{label}</label>
                  <output>{display}</output>
                </div>
                <input
                  type="range"
                  id={id}
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={e => onChange(Number(e.target.value))}
                />
                <div className="roi-range-labels"><span>{rangeLeft}</span><span>{rangeRight}</span></div>
              </div>
            ))}

            <div className="roi-divider" />

            <div className="roi-results">
              <div className="roi-result">
                <div className="roi-result-num">{fmtNum(hoursSaved)}</div>
                <div className="roi-result-label">staff hours recovered / year</div>
              </div>
              <div className="roi-result">
                <div className="roi-result-num">{fmtNum(handledCalls)}</div>
                <div className="roi-result-label">calls auto-handled / year</div>
              </div>
              <div className="roi-result big">
                <div className="roi-result-num">{fmtMoney(savings)}</div>
                <div className="roi-result-label">estimated annual savings</div>
              </div>
            </div>

            <button className="roi-cta">Get a custom ROI report →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
