'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Call {
  id: string;
  retell_call_id: string;
  phone_from: string | null;
  phone_to: string | null;
  transcript: string | null;
  summary: string | null;
  duration_seconds: number | null;
  status: string;
  created_at: string;
}

interface Stats {
  totalCalls: number;
  totalDurationSeconds: number;
  averageDurationSeconds: number;
  averageDurationMinutes: number;
}

export default function CallDashboard() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

  // Fetch initial calls and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch calls from API
        const callsRes = await fetch('/api/calls?limit=20');
        const callsData = await callsRes.json();
        setCalls(callsData.calls || []);

        // Fetch stats
        const statsRes = await fetch('/api/stats?days=1');
        const statsData = await statsRes.json();
        setStats(statsData.stats || null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('calls-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'calls' },
        (payload) => {
          const newCall = payload.new as Call;
          setCalls((prev) => [newCall, ...prev].slice(0, 20)); // Keep only latest 20
          // Refresh stats
          fetch('/api/stats?days=1')
            .then((res) => res.json())
            .then((data) => setStats(data.stats));
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return 'Unknown';
    return phone.slice(-4).padStart(phone.length, '*');
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '20px',
        color: '#991b1b'
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>⚠️ Supabase Not Configured</p>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
          Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.
        </p>
      </div>
    );
  }

  return (
    <div className="call-dashboard" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Stats Card */}
      {stats && (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>Today's Stats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Total Calls</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700 }}>{stats.totalCalls}</p>
            </div>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Avg Duration</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700 }}>
                {stats.averageDurationMinutes}m
              </p>
            </div>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Total Time</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700 }}>
                {Math.round(stats.totalDurationSeconds / 60)}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calls List */}
      <div>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600 }}>Calls</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading calls...</p>
        ) : calls.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: '#f9fafb',
              borderRadius: '8px',
              color: '#666',
            }}
          >
            <p style={{ margin: 0 }}>No calls yet. Waiting for incoming calls...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {calls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(selectedCall?.id === call.id ? null : call)}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedCall?.id === call.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                {/* Call Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selectedCall?.id === call.id ? '16px' : 0 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>
                      {formatPhone(call.phone_from)} → {formatPhone(call.phone_to)}
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                      {new Date(call.created_at).toLocaleTimeString()} · {formatDuration(call.duration_seconds)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#d1fae5',
                        color: '#065f46',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {call.status}
                    </span>
                  </div>
                </div>

                {/* Call Details (Expanded) */}
                {selectedCall?.id === call.id && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    {call.summary && (
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>
                          Summary
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{call.summary}</p>
                      </div>
                    )}

                    {call.transcript && (
                      <div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>
                          Transcript
                        </p>
                        <div
                          style={{
                            background: '#f3f4f6',
                            padding: '12px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            lineHeight: 1.6,
                            maxHeight: '200px',
                            overflow: 'auto',
                          }}
                        >
                          {call.transcript}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
