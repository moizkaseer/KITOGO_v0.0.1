'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import LiveDashboard from './LiveDashboard';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export default function DashboardPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = getSupabase();

    // Check if there's already an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthed(true);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password');
      setPassword('');
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
  };

  if (!mounted || loading) return null;

  if (!isAuthed) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1F44 0%, #0B5FFF 100%)',
        fontFamily: 'var(--font-inter, Inter, -apple-system, sans-serif)',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 20px 60px rgba(10,31,68,0.3)',
        }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{
              width: 44, height: 44,
              background: '#0A1F44', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <div style={{ width: 8, height: 8, background: '#0B5FFF', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(11,95,255,0.3)' }} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0A1F44', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              KITOGO Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
              Team access only
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 150ms',
                width: '100%',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#0B5FFF'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 150ms',
                width: '100%',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#0B5FFF'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />

            {error && (
              <p style={{ fontSize: '12px', color: '#B91C1C', margin: 0, fontWeight: 500 }}>
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 16px',
                background: loading ? '#cbd5e1' : '#0A1F44',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
                transition: 'background 200ms',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#0B5FFF')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#0A1F44')}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '20px 0 0', textAlign: 'center' }}>
            <a href="/" style={{ color: '#0B5FFF', textDecoration: 'none', fontWeight: 500 }}>← Back to site</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LiveDashboard onLogout={handleLogout} />
    </>
  );
}
