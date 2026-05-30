import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured');
  return createClient(url, key);
}
type SB = ReturnType<typeof getSupabase>;

interface RetellCallObject {
  call_id: string;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: string;
    custom_analysis_data?: {
      feeling_status?: string;
      urgent_need?: boolean;
      concern_summary?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

interface RetellEvent {
  event: string;
  call_id?: string;
  call?: RetellCallObject;
  from_number?: string;
  to_number?: string;
  duration_ms?: number;
  transcript?: string;
  call_analysis?: RetellCallObject['call_analysis'];
  [key: string]: any;
}

async function saveEventLog(supabase: SB, event: RetellEvent) {
  try {
    await supabase.from('call_events').insert({
      retell_call_id: event.call_id,
      event_type: event.event,
      payload: event,
    });
  } catch (error) {
    console.error('[Retell Webhook] Failed to log event:', error);
    // Don't block main flow on logging failure
  }
}

// Build the row we persist to the `calls` table from a (normalized) event.
function buildCallData(event: RetellEvent) {
  const analysis = event.call_analysis;
  return {
    retell_call_id: event.call_id,
    phone_from: event.from_number || null,
    phone_to: event.to_number || null,
    transcript: event.transcript || null,
    duration_seconds: event.duration_ms ? Math.round(event.duration_ms / 1000) : null,
    status: 'completed',
    // Retell ships a ready-made summary + sentiment in call_analysis — no LLM call needed.
    // We fold feeling_status into sentiment so the dashboard can rate wellbeing without
    // requiring extra columns in the `calls` table.
    summary: analysis?.call_summary || null,
    sentiment:
      analysis?.user_sentiment
        ? analysis.custom_analysis_data?.feeling_status
          ? `${analysis.user_sentiment} · ${analysis.custom_analysis_data.feeling_status}`
          : analysis.user_sentiment
        : null,
  };
}

async function upsertCall(supabase: SB, event: RetellEvent) {
  const callData = buildCallData(event);

  // Only write columns that are non-null so a later call_ended (no analysis)
  // doesn't wipe a summary saved by an earlier call_analyzed, and vice-versa.
  const { data: existing } = await supabase
    .from('calls')
    .select('id')
    .eq('retell_call_id', event.call_id)
    .maybeSingle();

  if (existing) {
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(callData)) {
      if (v !== null && v !== undefined) patch[k] = v;
    }
    const { error } = await supabase.from('calls').update(patch).eq('retell_call_id', event.call_id);
    if (error) throw error;
    console.log('[Retell Webhook] ✓ Call updated:', event.call_id, { hasSummary: !!callData.summary });
  } else {
    const { error } = await supabase.from('calls').insert(callData);
    if (error) throw error;
    console.log('[Retell Webhook] ✓ Call inserted:', event.call_id, { hasSummary: !!callData.summary });
  }
}

export async function POST(req: Request) {
  let event: RetellEvent;

  try {
    event = await req.json();
  } catch (error) {
    console.error('[Retell Webhook] Invalid JSON:', error);
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Normalize: Retell nests call fields inside a `call` object
  if (event.call) {
    event.call_id = event.call_id ?? event.call.call_id;
    event.from_number = event.from_number ?? event.call.from_number;
    event.to_number = event.to_number ?? event.call.to_number;
    event.duration_ms = event.duration_ms ?? event.call.duration_ms;
    event.transcript = event.transcript ?? event.call.transcript;
    event.call_analysis = event.call_analysis ?? event.call.call_analysis;
  }

  if (!event.call_id || !event.event) {
    console.error('[Retell Webhook] Missing required fields:', { call_id: event.call_id, event: event.event });
    return NextResponse.json({ ok: false, error: 'Missing call_id or event type' }, { status: 400 });
  }

  console.log(`[Retell Webhook] Received: ${event.event} (${event.call_id})`);

  let supabase: SB;
  try {
    supabase = getSupabase();
  } catch (error) {
    console.error('[Retell Webhook] Supabase init failed:', error);
    return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 });
  }

  await saveEventLog(supabase, event);

  try {
    switch (event.event) {
      case 'call_started':
        console.log('[Retell Webhook] Call started:', event.call_id);
        break;

      case 'call_ended':
      case 'call_analyzed':
        // call_ended gives us the transcript; call_analyzed adds the summary + sentiment.
        // upsertCall merges both so whichever arrives second fills in the gaps.
        await upsertCall(supabase, event);
        break;

      default:
        console.log('[Retell Webhook] Unknown event type:', event.event);
    }

    return NextResponse.json({ ok: true, call_id: event.call_id });
  } catch (error) {
    console.error('[Retell Webhook] Processing error:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const healthy = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return NextResponse.json({
    status: healthy ? 'healthy' : 'missing-credentials',
    supabaseConfigured: healthy,
  });
}
