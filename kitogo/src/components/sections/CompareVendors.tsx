type CellData = { yes?: boolean; no?: boolean; partial?: boolean; text: string };
type Row = { cap: string; sub: string; kitogo: CellData; ivr: CellData; ai: CellData; bpo: CellData };

const rows: Row[] = [
  {
    cap: 'Clinical-grade triage protocol',
    sub: 'ESI 5-level, Manchester, custom rule authoring',
    kitogo: { yes: true, text: 'Native, configurable' },
    ivr: { no: true, text: 'None' },
    ai: { no: true, text: 'Not clinically validated' },
    bpo: { partial: true, text: 'Human-dependent, inconsistent' },
  },
  {
    cap: 'Average pickup time',
    sub: 'From first ring to first response',
    kitogo: { text: 'Under 2 seconds' },
    ivr: { text: 'Instant (but menu)' },
    ai: { text: '3–8 seconds' },
    bpo: { text: '2–14 minutes' },
  },
  {
    cap: 'HIPAA + SOC 2 Type II + BAA',
    sub: 'All three, externally audited',
    kitogo: { yes: true, text: 'All three' },
    ivr: { partial: true, text: 'HIPAA-only typically' },
    ai: { no: true, text: 'Rare; varies by vendor' },
    bpo: { yes: true, text: 'Yes (most)' },
  },
  {
    cap: 'Direct EHR write-back',
    sub: 'Structured note pushed to Epic, Cerner, etc.',
    kitogo: { yes: true, text: '42+ direct integrations' },
    ivr: { no: true, text: 'Manual entry required' },
    ai: { no: true, text: 'Not designed for it' },
    bpo: { partial: true, text: 'Manual; lag & transcription errors' },
  },
  {
    cap: '24/7 availability',
    sub: 'Including holidays and weekends',
    kitogo: { yes: true, text: 'Always on' },
    ivr: { yes: true, text: 'Always on (limited)' },
    ai: { yes: true, text: 'Always on' },
    bpo: { partial: true, text: 'Premium for after-hours' },
  },
  {
    cap: 'Setup time',
    sub: 'Contract signed → in production',
    kitogo: { text: '2 weeks' },
    ivr: { text: '2–4 weeks' },
    ai: { text: '1–2 weeks' },
    bpo: { text: '4–8 weeks' },
  },
  {
    cap: 'Monthly cost (mid-volume)',
    sub: 'Roughly 5,000 calls/month',
    kitogo: { text: '~$2,400' },
    ivr: { text: '$800–1,500' },
    ai: { text: '$400–1,200' },
    bpo: { text: '$8,000–18,000' },
  },
  {
    cap: 'Patient experience score',
    sub: 'Median NPS, customer-reported',
    kitogo: { text: '+62' },
    ivr: { text: '−18' },
    ai: { text: '+12' },
    bpo: { text: '+24' },
  },
];

function Cell({ data }: { data: CellData }) {
  return (
    <td className="matrix-cell">
      {(data.yes || data.no || data.partial) ? (
        <span className="matrix-cell-flex">
          <span className={`matrix-check${data.yes ? ' yes' : data.no ? ' no' : ' partial'}`}>
            {data.yes ? '✓' : data.no ? '×' : '~'}
          </span>
          {data.text}
        </span>
      ) : data.text}
    </td>
  );
}

export default function CompareVendors() {
  return (
    <section id="compare-vendors" className="matrix-section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">An honest comparison</span>
          <h2>How KITOGO stacks up against <span className="serif">what you&apos;re using now.</span></h2>
          <p>We&apos;ve scoped this against the three things healthcare ops teams actually evaluate us next to. We&apos;ll be straightforward about where we&apos;re stronger — and where another tool might fit better.</p>
        </div>

        <div className="matrix-table-wrap reveal">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th className="kitogo-col">KITOGO</th>
                <th>Legacy IVR</th>
                <th>Generic AI Assistant</th>
                <th>Call Center BPO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.cap}>
                  <td className="matrix-row-label">
                    {row.cap}
                    <span className="sub">{row.sub}</span>
                  </td>
                  <td className="matrix-cell kitogo">
                    {(row.kitogo.yes || row.kitogo.no || row.kitogo.partial) ? (
                      <span className="matrix-cell-flex">
                        <span className={`matrix-check${row.kitogo.yes ? ' yes' : row.kitogo.no ? ' no' : ' partial'}`}>
                          {row.kitogo.yes ? '✓' : row.kitogo.no ? '×' : '~'}
                        </span>
                        {row.kitogo.text}
                      </span>
                    ) : row.kitogo.text}
                  </td>
                  <Cell data={row.ivr} />
                  <Cell data={row.ai} />
                  <Cell data={row.bpo} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
