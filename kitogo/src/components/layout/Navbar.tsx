'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HeartPulseIcon } from '@/components/ui/icons';

export default function Navbar() {
  const [liveCount, setLiveCount] = useState(2847);
  const [isDark, setIsDark] = useState(false);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const tick = () => {
      setLiveCount(n => n + Math.floor(Math.random() * 3) + 1);
      setTimeout(tick, 2000 + Math.random() * 800);
    };
    const t = setTimeout(tick, 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const li = (e.currentTarget as HTMLElement).parentElement!;
    indicator.style.left = li.offsetLeft + 'px';
    indicator.style.width = li.offsetWidth + 'px';
    indicator.classList.add('visible');
  }

  function handleMouseLeave() {
    indicatorRef.current?.classList.remove('visible');
  }

  return (
    <header>
      <nav aria-label="Main navigation">
        <div className="nav-left">
          <Link href="/" className="nav-logo">
            <HeartPulseIcon size={16} color="var(--blue)" />
            KITOGO
          </Link>
          <div className="nav-live">
            <span className="nav-live-dot" />
            <span>{liveCount.toLocaleString()}</span> triaged today
          </div>
          <button
            className="theme-toggle"
            aria-pressed={isDark}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          />
        </div>
        <ul className="nav-menu" ref={menuRef} onMouseLeave={handleMouseLeave} role="menubar">
          <span className="nav-indicator" ref={indicatorRef} />
          {[
            { href: '/#how', label: 'How it works' },
            { href: '/#features', label: 'Platform' },
            { href: '/#pricing', label: 'Pricing' },
            { href: '/#security', label: 'Security' },
            { href: '/#cases', label: 'Customers' },
          ].map(({ href, label }) => (
            <li key={href} role="none">
              <a href={href} role="menuitem" onMouseEnter={handleMouseEnter}>
                {label}
              </a>
            </li>
          ))}
          <li role="none">
            <Link href="/demo" className="nav-cta" role="menuitem" onMouseEnter={handleMouseEnter}>
              Book demo
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
