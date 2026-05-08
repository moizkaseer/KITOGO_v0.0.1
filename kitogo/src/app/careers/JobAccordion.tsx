'use client';

import { useState } from 'react';
import type { Job } from '@/data/careers';

const DEPTS = ['All', 'Engineering', 'Clinical', 'Sales', 'Design', 'Customer Success'];

export default function JobAccordion({ jobs }: { jobs: Job[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeDept, setActiveDept] = useState('All');

  const filtered = activeDept === 'All' ? jobs : jobs.filter(j => j.department === activeDept);

  return (
    <>
      <div className="dept-filter-bar">
        {DEPTS.map(d => (
          <button
            key={d}
            className={`filter-btn${activeDept === d ? ' active' : ''}`}
            onClick={() => setActiveDept(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div>
        {filtered.map(job => {
          const isOpen = openId === job.id;
          return (
            <div key={job.id} className="job-listing">
              <div
                className="job-listing-header"
                onClick={() => setOpenId(isOpen ? null : job.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setOpenId(isOpen ? null : job.id)}
                aria-expanded={isOpen}
              >
                <div>
                  <div className="job-listing-title">{job.title}</div>
                  <div className="job-listing-meta">
                    <span className="job-listing-tag">{job.department}</span>
                    <span className="job-listing-tag">{job.location}</span>
                    <span className="job-listing-tag">{job.remote}</span>
                    <span className="job-listing-tag">{job.type}</span>
                  </div>
                </div>
                <svg
                  className={`job-listing-chevron${isOpen ? ' open' : ''}`}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {isOpen && (
                <div className="job-listing-body">
                  <p>{job.description}</p>
                  <ul>
                    {job.requirements.map(r => <li key={r}>{r}</li>)}
                  </ul>
                  <a
                    href={`mailto:careers@kitogo.health?subject=Application: ${encodeURIComponent(job.title)}`}
                    className="btn btn-primary"
                    style={{ fontSize: 14, padding: '12px 20px' }}
                  >
                    Apply for this role
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
