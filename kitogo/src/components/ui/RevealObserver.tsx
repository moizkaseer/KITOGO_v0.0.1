'use client';

import { useEffect } from 'react';

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting)),
      { threshold: 0.12 }
    );
    const observe = () => document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    observe();
    // Re-observe after a tick to catch SSR-rendered elements
    const t = setTimeout(observe, 100);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return null;
}
