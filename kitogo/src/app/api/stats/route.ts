import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured');
  return createClient(url, key);
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '1', 10);
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Get call count and stats
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('duration_seconds, created_at')
      .gte('created_at', since.toISOString());

    if (callsError) {
      console.error('[Stats API] Error fetching calls:', callsError);
      return NextResponse.json({ error: callsError.message }, { status: 500 });
    }

    const totalCalls = calls?.length || 0;
    const totalDuration = calls?.reduce((sum, call) => sum + (call.duration_seconds || 0), 0) || 0;
    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;

    return NextResponse.json({
      period: {
        days,
        since: since.toISOString(),
      },
      stats: {
        totalCalls,
        totalDurationSeconds: totalDuration,
        averageDurationSeconds: avgDuration,
        averageDurationMinutes: Math.round((avgDuration / 60) * 10) / 10,
      },
    });
  } catch (error) {
    console.error('[Stats API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
