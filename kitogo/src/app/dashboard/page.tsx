'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import LiveDashboard from './LiveDashboard';

export default function DashboardPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Check if already authed in this session
    const authed = sessionStorage.getItem('dashboard-authed') === 'true';
    if (authed) {
      setIsAuthed(true);
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setError('Server not configured');
        setLoading(false);
        return;
      }

      const supabase = createClient(url, key);

      // Fetch dashboard password from config table
      const { data, error: dbError } = await supabase
        .from('config')
        .select('value')
        .eq('key', 'dashboard_password')
        .single();

      if (dbError) {
        console.error('Error fetching password:', dbError);
        setError('Server error');
        setLoading(false);
        return;
      }

      const correctPassword = data?.value;

      if (password === correctPassword) {
        sessionStorage.setItem('dashboard-authed', 'true');
        setIsAuthed(true);
        setPassword('');
      } else {
        setError('Incorrect password');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

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
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0A1F44',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}>
              KITOGO Dashboard
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#94a3b8',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500,
            }}>
              Team Access Only
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                marginBottom: error ? '8px' : '16px',
                boxSizing: 'border-box',
                transition: 'all 200ms',
                outline: 'none',
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => !loading && (e.target.style.borderColor = '#0B5FFF')}
              onBlur={(e) => !loading && (e.target.style.borderColor = '#e2e8f0')}
            />
            {error && (
              <p style={{
                fontSize: '12px',
                color: '#B91C1C',
                margin: '0 0 16px',
                fontWeight: 500,
              }}>
                ⚠ {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: loading ? '#cbd5e1' : '#0A1F44',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 200ms',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#0B5FFF')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#0A1F44')}
            >
              {loading ? 'Unlocking…' : 'Unlock Dashboard'}
            </button>
          </form>

          <p style={{
            fontSize: '12px',
            color: '#cbd5e1',
            margin: '20px 0 0',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            For demo access only.<br />
            <a href="/" style={{ color: '#0B5FFF', textDecoration: 'none', fontWeight: 500 }}>← Back to site</a>
          </p>
        </div>
      </div>
    );
  }

  return <LiveDashboard />;
}
