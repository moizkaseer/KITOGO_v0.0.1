'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Call {
  id: string;
  retell_call_id: string;
  phone_from: string | null;
  transcript: string | null;
  summary: string | null;
  duration_seconds: number | null;
  status: string;
  created_at: string;
}

const MOCK_CALLS: Call[] = [
  {
    id: '1',
    retell_call_id: 'mock_1',
    phone_from: '+1 (XXX) XXX-1234',
    transcript: 'Customer called to reschedule their appointment.',
    summary: 'Customer requested to move their Monday appointment to Wednesday.',
    duration_seconds: 45,
    status: 'completed',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    retell_call_id: 'mock_2',
    phone_from: '+1 (XXX) XXX-5678',
    transcript: 'Patient inquired about test results and medication refill.',
    summary: 'Patient received results (all normal) and prescription refill approved.',
    duration_seconds: 62,
    status: 'completed',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    retell_call_id: 'mock_3',
    phone_from: '+1 (XXX) XXX-9012',
    transcript: 'Customer called with urgent billing question.',
    summary: 'Billing dispute resolved — duplicate charge identified and refunded.',
    duration_seconds: 38,
    status: 'completed',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
];

export default function DemoDashboard() {
  const [calls, setCalls] = useState<Call[]>(MOCK_CALLS);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

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
          setCalls((prev) => [newCall, ...prev]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  const getStatusColor = (status: string) => {
    return status === 'completed' ? '#10b981' : '#ef4444';
  };

  const getStatusLabel = (summary: string | null) => {
    if (!summary) return 'Needs Follow-up';
    if (summary.toLowerCase().includes('resolved') || summary.toLowerCase().includes('approved')) {
      return 'Fine';
    }
    if (summary.toLowerCase().includes('urgent') || summary.toLowerCase().includes('issue')) {
      return 'Needs Follow-up';
    }
    return 'Fine';
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
        Call Dashboard
      </h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        {calls.map((call) => {
          const statusLabel = getStatusLabel(call.summary);
          const statusColor = statusLabel === 'Fine' ? '#10b981' : '#ef4444';

          return (
            <div
              key={call.id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 140px',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              {/* Caller Name */}
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: 500, textTransform: 'uppercase' }}>
                  Caller
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
                  {call.phone_from || 'Unknown'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
                  {formatTime(call.created_at)}
                </p>
              </div>

              {/* Response Summary */}
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', fontWeight: 500, textTransform: 'uppercase' }}>
                  Summary
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '15px', lineHeight: 1.5, color: '#1f2937' }}>
                  {call.summary || 'No summary generated'}
                </p>
              </div>

              {/* Status Badge */}
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: statusColor,
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {statusLabel}
                </div>
                <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#999' }}>
                  {call.duration_seconds ? `${call.duration_seconds}s` : 'N/A'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
