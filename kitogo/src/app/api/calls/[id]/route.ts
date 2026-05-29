import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured');
  return createClient(url, key);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;

    const { data: call, error: callError } = await supabase
      .from('calls')
      .select('*')
      .eq('id', id)
      .single();

    if (callError) {
      if (callError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Call not found' }, { status: 404 });
      }
      console.error('[Call Details API] Database error:', callError);
      return NextResponse.json({ error: callError.message }, { status: 500 });
    }

    // Fetch related events
    const { data: events, error: eventsError } = await supabase
      .from('call_events')
      .select('*')
      .eq('retell_call_id', call.retell_call_id)
      .order('received_at', { ascending: true });

    if (eventsError) {
      console.error('[Call Details API] Failed to fetch events:', eventsError);
      // Don't fail the whole request if events fetch fails
    }

    return NextResponse.json({
      call,
      events: events || [],
    });
  } catch (error) {
    console.error('[Call Details API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
