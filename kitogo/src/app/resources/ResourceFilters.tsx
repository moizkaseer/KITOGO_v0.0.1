'use client';

import { useState } from 'react';
import type { Resource, ResourceType } from '@/data/resources';

const TYPE_LABELS: Record<ResourceType | 'all', string> = {
  all: 'All',
  article: 'Articles',
  whitepaper: 'Whitepapers',
  webinar: 'Webinars',
};

function ResourceCard({ r }: { r: Resource }) {
  const formattedDate = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <article className={`resource-card${r.featured ? ' featured' : ''}`}>
      <span className={`resource-type-badge ${r.type}`}>{r.type}</span>
      <h3>{r.title}</h3>
      <p>{r.excerpt}</p>
      <div className="resource-card-footer">
        <span>{r.author}</span>
        <span>{formattedDate} · {r.readTime}</span>
      </div>
    </article>
  );
}

export default function ResourceFilters({ resources }: { resources: Resource[] }) {
  const [active, setActive] = useState<ResourceType | 'all'>('all');

  const filtered = active === 'all' ? resources : resources.filter(r => r.type === active);

  return (
    <>
      <div className="resources-filter-bar">
        {(['all', 'article', 'whitepaper', 'webinar'] as const).map(t => (
          <button
            key={t}
            className={`filter-btn${active === t ? ' active' : ''}`}
            onClick={() => setActive(t)}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="resources-grid">
        {filtered.map(r => <ResourceCard key={r.slug} r={r} />)}
      </div>
    </>
  );
}
