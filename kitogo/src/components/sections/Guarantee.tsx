export default function Guarantee() {
  return (
    <section className="guarantee-section">
      <div className="guarantee-card reveal">
        <div className="guarantee-seal">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="circlePath" d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
            </defs>
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 6" />
            <text fill="white" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" letterSpacing="3">
              <textPath href="#circlePath" startOffset="0">90-DAY OUTCOME GUARANTEE · 90-DAY OUTCOME GUARANTEE · </textPath>
            </text>
            <g transform="translate(100,100)">
              <circle cx="0" cy="0" r="42" fill="white" />
              <text x="0" y="-2" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="32" fill="#0B5FFF">90</text>
              <text x="0" y="18" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill="#0A1F44" letterSpacing="1.5">DAYS</text>
            </g>
          </svg>
        </div>

        <div className="guarantee-content">
          <span className="eyebrow">Skin in the game</span>
          <h2>Don&apos;t hit your numbers? <span className="serif">We refund you.</span></h2>
          <p>If KITOGO doesn&apos;t reduce your average intake time by at least 20% within 90 days of go-live, we&apos;ll refund every dollar you paid us. No legal hoops. No &quot;but what we meant was.&quot; Real money back. We&apos;re that confident — and if we&apos;re wrong, we&apos;d rather know it.</p>
        </div>

        <a href="#" className="guarantee-cta">
          Read the guarantee terms
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
