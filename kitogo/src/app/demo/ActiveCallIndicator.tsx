'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface ActiveCall {
  call_id: string;
  from_number: string | null;
  to_number: string | null;
  started_at: number;
}

export default function ActiveCallIndicator() {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [tick, setTick] = useState(0);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

  // Subscribe to call_started events
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('call-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'call_events' },
        (payload) => {
          const event = payload.new;
          if (event.event_type === 'call_started') {
            const newCall: ActiveCall = {
              call_id: event.retell_call_id,
              from_number: event.payload?.from_number,
              to_number: event.payload?.to_number,
              started_at: Date.now(),
            };
            setActiveCalls((prev) => [...prev, newCall]);
          } else if (event.event_type === 'call_ended') {
            setActiveCalls((prev) =>
              prev.filter((call) => call.call_id !== event.retell_call_id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  // Tick every second to re-render elapsed times
  useEffect(() => {
    if (activeCalls.length === 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activeCalls.length]);

  const getElapsed = (startedAt: number) => {
    void tick;
    const s = Math.floor((Date.now() - startedAt) / 1000);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return 'Unknown';
    return phone.slice(-4).padStart(phone.length, '*');
  };

  if (activeCalls.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        padding: '16px 20px',
        zIndex: 1000,
        minWidth: '280px',
      }}
    >
      {activeCalls.map((call, index) => (
        <div key={call.call_id}>
          {index > 0 && <div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Pulsing indicator */}
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite',
              }}
            />

            {/* Call info */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>
                Call in Progress
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>
                {formatPhone(call.from_number)} → {formatPhone(call.to_number)}
              </p>
            </div>

            {/* Duration */}
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#10b981', fontFamily: 'monospace' }}>
                {getElapsed(call.started_at)}
              </p>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
